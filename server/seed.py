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
            access_token = fake.isbn10()
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
            monthly_total_income = randint(65000, 250000),
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
    print('setting up specific user')
    bobby123 = User(
        username = 'bobby123',
        password_hash = 'password',
        access_token = fake.isbn10()
    )
    db.session.add(bobby123)
    db.session.commit()

    min123 = User(
        username = 'min123',
        password_hash = 'password',
        access_token = fake.isbn10()
    )
    db.session.add(min123)
    db.session.commit()
    print('bobbys income')
    income1 = Income(
        hourly_wage = 25,
        monthly_total_income = 6000,
        user = bobby123
    )
    income2 = Income(
        hourly_wage = 25,
        monthly_total_income = 6000,
        user = bobby123
    )
    db.session.add_all([income1, income2])
    db.session.commit()
    print ('mins income')

    income3 = Income(
        hourly_wage = 15,
        monthly_total_income = 600,
        user = min123
    )
    income4 = Income(
        hourly_wage = 15,
        monthly_total_income = 600,
        user = min123
    )
    db.session.add_all([income3, income4])
    db.session.commit()


    # bobby_incomes = []
    # for i in range(2):
    #     income = Income(
    #         hourly_wage = randint(15, 85),
    #         monthly_total_income = randint(35000, 100000),
    #         user = bobby
    #     )
    #     bobby_incomes.append(income)
    # db.session.add_all(bobby_incomes)
    # db.session.commit()

    print('creating bobby expenses')
    # category_options = ['Food and Beverage', 'Rent', 'Utilities', 'Insurance', 'Billpay', 'Taxes']
    cat_amounts = [500, 1200, 100, 50, 15, 33]
    bobby_expenses = []
    for i in range(6):
        expense = Expense(
            amount = cat_amounts[i],
            user = bobby123,
            category = categories[i]
        )
        bobby_expenses.append(expense)
    db.session.add_all(bobby_expenses)
    db.session.commit()

    print('creating min expenses')
    cat_amounts2 = [600, 2400, 200, 20, 100, 5]
    min_expenses = []
    for i in range(6):
        expense = Expense(
            amount = cat_amounts2[i],
            user = min123,
            category = categories[i]
        )
        min_expenses.append(expense)
    db.session.add_all(min_expenses)
    db.session.commit()


    # bobby_expenses = []
    # for i in range(7):
    #     expense = Expense(
    #         amount = randint(25, 1500),
    #         user = bobby,
    #         category = choice(categories)
    #     )
    #     bobby_expenses.append(expense)
    # db.session.add_all(bobby_expenses)
    # db.session.commit()