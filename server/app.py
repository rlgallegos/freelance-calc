from flask import Flask, request, make_response, session, jsonify
from flask_restful import Api, Resource
from config import bcrypt, app
# from flask_cors import CORS
import requests

from models import db, User, Income, Category, Expense
from plaid_helpers import update_expenses, update_income, client, get_payroll


# Plaid Imports
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.user_create_request import UserCreateRequest
from plaid.model.link_token_create_request_income_verification import LinkTokenCreateRequestIncomeVerification
from plaid.model.income_verification_source_type import IncomeVerificationSourceType
from plaid.model.link_token_create_request_income_verification_bank_income import LinkTokenCreateRequestIncomeVerificationBankIncome

from plaid.model.accounts_get_request import AccountsGetRequest

from dotenv import load_dotenv
import os
import json

# CORS(app)

api = Api(app)
load_dotenv()

app.secret_key = os.environ.get('FLASK_APP_SECRET_KEY')

class Users(Resource):
    def get(self):
        users = User.query.all()
        user_list = [user.to_dict() for user in users]
        return make_response(user_list, 200)


class UserByID(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            make_response({"Error": "User not found"}, 404)

        user_dict = user.to_dict()
        return make_response(user_dict, 200)

    def post(self, id):
        pass

    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            make_response({"Error": "User not found"}, 404)
        data = request.get_json()

        for attr in data:
            setattr(user.income[0], attr, data[attr])
        try:
            db.session.add(user)
            db.session.commit()
        except:
            make_response({"Error": "Resource not created"}, 422)
        print('successfully set in database')
        user_dict = user.to_dict()
        return make_response(user_dict, 200)


    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            make_response({"Error": "User not found"}, 404)
        try:
            db.session.delete(user)
            db.session.commit()
        except:
            return make_response({"Error": "Resource not deleted"}, 422)
        return make_response({}, 200)

class IncomeByID(Resource):
    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        income = Income.query.filter(Income.id == user.income[0].id).first()
        wage = request.get_json()['hourly_wage']
        setattr(income, "hourly_wage", wage)
        try:
            db.session.add(income)
            db.session.commit()
        except:
            return {"error": "resource not added"}
        income_dict = income.to_dict()
        return income_dict, 200




# Authentication Routes
class Signup(Resource):
    def post(self):
        data = request.get_json()

        # Create new user
        new_user = User(
            username = data['username'],
            password_hash = data['password'],
            user_token = None,
            access_token = None
        )
        try:
            db.session.add(new_user)
            db.session.commit()
        except:
            make_response({"Error": "User instance not created"}, 422)

        # Associate new default income
        new_income = Income(
            user_id = new_user.id,
            monthly_total_income = 0,
            hourly_wage = 8
        )
        try:
            db.session.add(new_income)
            db.session.commit()
        except:
            make_response({"Error": "Income instance not created"}, 422)

        # Associate new default expenses
        new_expenses = []
        for i in range(6):
            new_expense = Expense(
                amount = 0,
                user_id = new_user.id,
                category_id = (i + 1)
            )
            new_expenses.append(new_expense)
        try:
            db.session.add_all(new_expenses)
            db.session.commit()
        except:
            make_response({"Error": "Income instance not created"}, 422)

        session['user_id'] = new_user.id
        new_user_dict = new_user.to_dict(only=('id', 'username'))
        return make_response(new_user_dict, 201)

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict(rules=('-access_token', '-plaid_id', '-user_token')), 200
        else:
            return {'error': 'Unauthorized'}, 401

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.username == data['username']).first()
        if user.authenticate(data['password']):
            session['user_id'] = user.id
            return user.to_dict(), 200    
        else:
            return {'error': 'Unauthorized'}, 401

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204


class UpdateExpenses(Resource):
    def post(self):
        username = request.get_json()
        print(username)
        user = User.query.filter(User.username == username).first()
        print(user.to_dict())
        # user = User.query.filter(User.id == session['user_id']).first()
        # Clear previous expenses
        Expense.query.filter(Expense.user_id == user.id).delete()
        db.session.commit()

        update_object = update_expenses(user.access_token)

        expense_list = []
        for key, value in update_object.items():
            new_exp = Expense(
                user_id = user.id,
                category_id = key,
                amount = value
            )
            expense_list.append(new_exp)
        db.session.add_all(expense_list)
        db.session.commit()
        return
    
class UpdateIncome(Resource):
    def patch(self):
        username = request.get_json()['username']
     
        user = User.query.filter(User.username == username).first()

        if user.user_token and user.access_token:
            print('entering update_income function')
            res = update_income(user.user_token)
            print(res)
            if not res:
                return make_response({'success': 'No income source located'})
            income = Income.query.filter(Income.user_id == user.id).first()
            setattr(income, 'monthly_total_income', res['income'])
            db.session.add(income)
            db.session.commit()
            
            user.bank_name = res['bank']
            user.account_name = res['account']
            db.session.add(user)
            db.session.commit()

            return make_response({'success': 'Income successfully updated'}, 200)
        else:
            return make_response({'error': 'Initialize Plaid account and link bank account first please.'}, 422)




# Add Resources
api.add_resource(IncomeByID, '/income/<int:id>')
api.add_resource(UpdateIncome, '/update_income')
api.add_resource(UpdateExpenses, '/update_expenses', endpoint='update_expenses')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByID, '/users/<int:id>', endpoint='users_by_id')




# Plaid Token Routing



# This is the Plaid Route that saves the plaid_id

@app.route("/create_link_token", methods=['POST'])
def create_link_token():
    # Get the client_user_id by searching for the current user
    user = User.query.filter(User.id == session['user_id']).first()
    unique_id = user.id + 105656
    client_user_id = str(unique_id)
    user.plaid_id = client_user_id
    db.session.add(user)
    db.session.commit()



    request = LinkTokenCreateRequest(
            products=[Products("auth"), Products('transactions'), Products('income_verification')],
            user_token=user.user_token,
            income_verification=LinkTokenCreateRequestIncomeVerification(
                income_source_types=[IncomeVerificationSourceType('bank')],
                bank_income=LinkTokenCreateRequestIncomeVerificationBankIncome(
                    days_requested=180
                ),
            ),
            client_name="Freelance Calculator",
            country_codes=[CountryCode('US')],
            language='en',
            webhook='https://webhook.example.com',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(user.plaid_id)
            )
        )

    response = client.link_token_create(request)
    res = make_response(response.to_dict())

    res.set_cookie('Secure', 'same-site-cookie', samesite='None');

    return res


# This is the Plaid Route that saves an access token 

@app.route('/exchange_public_token', methods=['POST'])
def exchange_public_token():
    global access_token
    public_token = request.get_json()
    new_request = ItemPublicTokenExchangeRequest(
      public_token=public_token
    )
    response = client.item_public_token_exchange(new_request)

    # These values should be saved to a persistent database and
    # associated with the currently signed-in user
    access_token = response['access_token']
    item_id = response['item_id']

    # In other words, this is where we update the database

    user = User.query.filter(User.id == session['user_id']).first()
    user.access_token = access_token
    db.session.add(user)
    db.session.commit()
    return jsonify({'public_token_exchange': 'complete'})


# This is the Plaid Route that saves the user token

@app.route('/user_token', methods=['POST'])
def get_user_token():
    user = User.query.filter(User.id == session['user_id']).first()
    if user.user_token:
        return make_response({'error': 'Plaid Account already initialized'}, 422)

    unique_id = (user.id + 2040)
    client_user_id = str(unique_id)

    request = UserCreateRequest(
        client_user_id=str(user.id),
        client_id=os.environ.get('CLIENT_ID'),
        secret=os.environ.get('PLAID_SECRET_KEY'),
    )
    response = client.user_create(request)

    user_token = response['user_token']
    user.user_token = user_token
    db.session.add(user)
    db.session.commit()

    res = make_response(response.to_dict())
    res.set_cookie('Secure', 'same-site-cookie', samesite='None')
    return res



@app.route('/transactions', methods=['GET'])
def get_accounts():
    user = User.query.filter(User.id == session['user_id']).first()
    print(user.access_token)
    try:
        request = AccountsGetRequest(
            access_token=str(user.access_token)
        )
        print(request)
        accounts_response = client.accounts_get(request)
        print(accounts_response)
    except:
        return make_response({'error': 'failed'}, 422)
#   except plaid.ApiException as e:
#       response = json.loads(e.body)
#       return jsonify({'error': {'status_code': e.status, 'display_message':
#                       response['error_message'], 'error_code': response['error_code'], 'error_type': response['error_type']}})
    return jsonify(accounts_response.to_dict())


@app.route('/payroll', methods=['GET'])
def get_payroll_from_plaid():
    user = User.query.filter(User.id == session['user_id']).first()
    print(user.user_token)
    data = get_payroll(user.user_token)
    print(data)



    # request = {
    # "client_id": os.environ.get('CLIENT_ID'),
    # "secret": os.environ.get('PLAID_SECRET_KEY'),
    # "user_token": user.user_token
    # }
    # url = 'https://sandbox.plaid.com/credit/payroll_income/get'

    # response = requests.post(url, json=request)


    return
    # income_request_body = {
    #     "client_id": os.environ.get('CLIENT_ID'),
    #     "secret": os.environ.get('PLAID_SECRET_KEY'),
    #     "u_token": u_token
    # }




# @app.route('/income_token', methods=['POST', 'GET'])
# def get_income_token():
#     user = User.query.filter(User.id == session['user_id']).first()
    
#     request = {
#     "client_id": os.environ.get('CLIENT_ID'),
#     "secret": os.environ.get('PLAID_SECRET_KEY'),
#     "user_token": user.user_token,
#     "webhook": "https://www.genericwebhookurl.com/webhook",
#     "institution_id": "ins_20",
#     "initial_products": ["income_verification"],
#     "options": {
#         # "webhook": "https://www.genericwebhookurl.com/webhook",
#         "income_verification": {
#         "income_source_types": ["bank"],
#         "bank_income": {
#             "days_requested": 180
#             }
#         }
#     }
#     }
#     print(client.__dict__)
#     response = client.income_verification_create(request)
#     res = make_response(response.to_dict())

#     res.set_cookie('Secure', 'same-site-cookie', samesite='None')
#     return res













if __name__ == '__main__':
    app.run(port=5555, debug=True)