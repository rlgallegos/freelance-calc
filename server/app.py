from flask import Flask, request, make_response, session
from flask_restful import Api, Resource
from config import bcrypt, app
# from flask_cors import CORS

# # Plaid Imports
# from plaid.model.link_token_create_request import LinkTokenCreateRequest
# from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
# from plaid.model.products import Products
# from plaid.model.country_code import CountryCode

from models import db, User, Income, Category, Expense

# CORS(app)

api = Api(app)

app.secret_key = 'bobbyisthebest'

class Users(Resource):
    def get(self):
        users = User.query.all()
        user_list = [user.to_dict(only=('username', 'token')) for user in users]
        return make_response(user_list, 200)


class UserByID(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            make_response({"Error": "User not found"}, 404)

        # Here will go all logic to validate password and username

        user_dict = user.to_dict(only=('username', 'password', 'token'))
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
        user_dict = user.to_dict(only=('username', 'password', 'token'))
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
        # Here will go all of the logic to encrypt the password
        new_user = User(
            username = data['username'],
            password_hash = data['password'],
        )
        print(new_user.to_dict(only=('username', 'token')))
        print(new_user)
        try:
            db.session.add(new_user)
            db.session.commit()
        except:
            make_response({"Error": "Resource not created"}, 422)
        session['user_id'] = new_user.id
        new_user_dict = new_user.to_dict(only=('id', 'username', 'token'))
        return make_response(new_user_dict, 201)

class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict(), 200
        else:
            print('successfully registered none value for user')
            return {'error': 'Unauthorized'}, 401

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.username == data['username']).first()
        if not user or not user.authenticate(data['password']):
            return {'error': 'Unauthorized'}, 401
        session['user_id'] = user.id
        return make_response(user.to_dict(), 200)

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204

api.add_resource(Logout, '/logout')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Signup, '/signup')
api.add_resource(Users, '/users')
api.add_resource(UserByID, '/users/<int:id>')

# @app.route("/create_link_token", methods=['POST'])
# def create_link_token():
#     # Get the client_user_id by searching for the current user
#     user = User.find(...)
#     client_user_id = user.id
#     # Create a link_token for the given user
#     request = LinkTokenCreateRequest(
#             products=[Products("auth")],
#             client_name="Plaid Test App",
#             country_codes=[CountryCode('US')],
#             redirect_uri='https://domainname.com/oauth-page.html',
#             language='en',
#             webhook='https://webhook.example.com',
#             user=LinkTokenCreateRequestUser(
#                 client_user_id=client_user_id
#             )
#         )
#     response = client.link_token_create(request)
#     # Send the data to the client
#     return jsonify(response.to_dict())

# access_token = 'access-sandbox-694ba0cc-a57a-4572-b077-2e719a93f54e'
# item_id = 'R5GeqM1NwaHwPA8yrvx8hqWAkGNPkbSRZvggX'

# @app.route('/exchange_public_token', methods=['POST'])
# def exchange_public_token():
#     global access_token
#     public_token = request.form['public_token']
#     request = ItemPublicTokenExchangeRequest(
#       public_token=public_token
#     )
#     response = client.item_public_token_exchange(request)
#     # These values should be saved to a persistent database and
#     # associated with the currently signed-in user
#     access_token = response['access_token']
#     item_id = response['item_id']
#     return jsonify({'public_token_exchange': 'complete'})

# @app.route('/transactions', methods=['GET'])
# def get_accounts():
#   try:
#       request = AccountsGetRequest(
#           access_token=access_token
#       )
#       accounts_response = client.accounts_get(request)
#   except plaid.ApiException as e:
#       response = json.loads(e.body)
#       return jsonify({'error': {'status_code': e.status, 'display_message':
#                       response['error_message'], 'error_code': response['error_code'], 'error_type': response['error_type']}})
#   return jsonify(accounts_response.to_dict())















if __name__ == '__main__':
    app.run(port=5555, debug=True)