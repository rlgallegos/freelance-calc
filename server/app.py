from flask import Flask, request, make_response, session, jsonify
from flask_restful import Api, Resource
from config import bcrypt, app
# from flask_cors import CORS

from models import db, User, Income, Category, Expense
from plaid_helpers import update_expenses, update_income, client


# Plaid Imports
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest

# CORS(app)

api = Api(app)

app.secret_key = 'bobbyisthebest'

# @app.before_request
#     def check_login:
#         if not session['user_id'] and request.endpoint != 'signup':
#             return {'error', 'Unauthorized'}, 401

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

        # Here will go all logic to validate password and username

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
            setattr(user, attr, data[attr])
        try:
            db.session.add(user)
            db.session.commit()
        except:
            make_response({"Error": "Resource not created"}, 422)
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


# Authentication Routes
class Signup(Resource):
    def post(self):
        data = request.get_json()

        # Create new user
        new_user = User(
            username = data['username'],
            password_hash = data['password'],
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
            return user.to_dict(), 200
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
    def get(self):
        user = User.query.filter(User.id == session['user_id']).first()
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
        total_income = update_income("user-sandbox-7684898b-97aa-4e5f-91e9-82680cb20b0d")
        income = Income.query.filter(Income.user_id == session['user_id']).first()
        setattr(income, 'monthly_total_income', total_income)
        db.session.add(income)
        db.session.commit()
        return




# Add Resources
api.add_resource(UpdateIncome, '/update_income')
api.add_resource(UpdateExpenses, '/update_expenses', endpoint='update_expenses')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByID, '/users/<int:id>', endpoint='users_by_id')




# Plaid Token Routing



# Route 1: Creating the Link token

@app.route("/create_link_token", methods=['POST'])
def create_link_token():
    # Get the client_user_id by searching for the current user
    user = User.query.filter(User.id == session['user_id']).first()
    client_user_id = str(user.id)

    # Create a link_token for the given user
    request = LinkTokenCreateRequest(
            products=[Products("auth")],
            client_name="Freelance Calculator",
            country_codes=[CountryCode('US')],
            language='en',
            webhook='https://webhook.example.com',
            user=LinkTokenCreateRequestUser(
                client_user_id="643d947ffcfd210012e71a2f"
            )
        )

    response = client.link_token_create(request)
    res = make_response(response.to_dict())

    res.set_cookie('Secure', 'same-site-cookie', samesite='None');

    return res



@app.route('/exchange_public_token', methods=['POST'])
def exchange_public_token():
    global access_token
    public_token = request.get_json()
    # public_token = request.form['public_token']
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



@app.route('/transactions', methods=['GET'])
def get_accounts():
  try:
      request = AccountsGetRequest(
          access_token=access_token
      )
      accounts_response = client.accounts_get(request)
  except plaid.ApiException as e:
      response = json.loads(e.body)
      return jsonify({'error': {'status_code': e.status, 'display_message':
                      response['error_message'], 'error_code': response['error_code'], 'error_type': response['error_type']}})
  return jsonify(accounts_response.to_dict())















if __name__ == '__main__':
    app.run(port=5555, debug=True)