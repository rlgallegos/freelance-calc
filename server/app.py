from flask import Flask, request, make_response, session
from flask_restful import Api, Resource
from config import bcrypt, app
# from flask_cors import CORS

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
        if not user:
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




















if __name__ == '__main__':
    app.run(port=5555, debug=True)