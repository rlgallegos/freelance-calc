from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from config import bcrypt, db, app


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)
    access_token = db.Column(db.String)

    serialize_rules = ('-income.user', '-expenses.user', '-token', '-_password_hash')

    expenses = db.relationship('Expense', back_populates='user')
    income = db.relationship('Income', back_populates='user')


    # Authentication / Authorization Logic
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Income(db.Model, SerializerMixin):
    __tablename__ = 'incomes'

    id = db.Column(db.Integer, primary_key=True)
    hourly_wage = db.Column(db.Float)
    monthly_total_income = db.Column(db.Integer, default=0)

    serialize_rules = ('-user', '-id', '-user_id')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='income')

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    serialize_rules = ('-expenses', '-id')

    expenses = db.relationship('Expense', back_populates='category')

class Expense(db.Model, SerializerMixin):
    __tablename__ = 'expenses'

    serialize_rules = ('-id', '-user', '-category_id', '-user_id', 'category_name', '-category')

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='expenses')

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category = db.relationship('Category', back_populates='expenses')

    category_name = association_proxy('category', 'name')