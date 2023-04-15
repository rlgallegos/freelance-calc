from flask import Flask, request, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource
# from flask_cors import CORS

from models import db, User, Income, Category, Expense

app = Flask(__name__)
# CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///freelance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

class Users(Resource):
    def get(self):
        users = User.query.all()
        user_list = [user.to_dict(only=('username', 'password', 'token')) for user in users]
        return make_response(user_list, 200)

    def post(self):
        data = request.get_json()
        # Here will go all of the logic to encrypt the password
        new_user = User(
            username = data['username'],
            password = data['password'],
            token = data['token']
        )
        print(new_user.to_dict(only=('username', 'password', 'token')))
        try:
            db.session.add(new_user)
            db.session.commit()
        except:
            make_response({"Error": "Resource not created"}, 422)
        new_user_dict = new_user.to_dict(only=('username', 'password', 'token'))
        return make_response(new_user_dict, 201)

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
        

api.add_resource(Users, '/users')
api.add_resource(UserByID, '/users/<int:id>')




















if __name__ == '__main__':
    app.run(port=5555, debug=True)