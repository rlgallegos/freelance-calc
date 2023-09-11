from app import app
from models import db, User, Income, Category, Expense

with app.app_context():
    print('Deleting all records...')

    User.query.delete()
    Income.query.delete()
    Expense.query.delete()
    
    # Category.query.delete()
    
    db.session.commit()

