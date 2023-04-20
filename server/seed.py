#!/usr/bin/env python3
from random import randint, choice
from faker import Faker
from app import app
from models import db, User, Income, Category, Expense

with app.app_context():
    print('Deleting all records...')

    User.query.delete()
    Income.query.delete()
    Category.query.delete()
    Expense.query.delete()
    db.session.commit()


    fake = Faker()

    print('Creating users...')
    # users = [User( name=fake.name() ) for i in range(25)]
    users = []
    for i in range (25):
        user = User(
            username = fake.name(),
            password_hash = fake.word(),
            token = fake.isbn10()
        )
        users.append(user)

    # bobby = User(
    #     username = 'bobby',
    #     password_hash = 'password'
    #     token = fake.isbn10()
    # )
    # users.append(bobby)
    db.session.add_all(users)
    db.session.commit()

    print('Creating income...')
    incomes = []
    for i in range(25):
        income = Income(
            hourly_wage = randint(15, 85),
            annual_total_income = randint(65000, 250000),
            user = users[i]
        )
        incomes.append(income)
    db.session.add_all(incomes)
    db.session.commit()


    print('Creating categories...')
    category_options = ['Food and Beverage', 'Rent', 'Utilities', 'Insurance', 'Billpay', 'Taxes']

    categories = []
    for option in category_options:
        category = Category(
            name = option
        )
        categories.append(category)
    db.session.add_all(categories)
    db.session.commit()

    print('Creating expenses...')
    expenses = []
    for i in range(1000):
        expense = Expense(
            amount = randint(25, 1500),
            user = choice(users),
            category = choice(categories)
        )
        expenses.append(expense)        
    db.session.add_all(expenses)
    db.session.commit()

    # Setting up actual data to work with

    bobby = User(
        username = 'bobby',
        password_hash = 'password',
        token = fake.isbn10()
    )
    db.session.add(bobby)
    db.session.commit()

    bobby_incomes = []
    for i in range(2):
        income = Income(
            hourly_wage = randint(15, 85),
            annual_total_income = randint(35000, 100000),
            user = bobby
        )
        bobby_incomes.append(income)
    db.session.add_all(bobby_incomes)
    db.session.commit()


    bobby_expenses = []
    for i in range(7):
        expense = Expense(
            amount = randint(25, 1500),
            user = bobby,
            category = choice(categories)
        )
        bobby_expenses.append(expense)
    db.session.add_all(bobby_expenses)
    db.session.commit()