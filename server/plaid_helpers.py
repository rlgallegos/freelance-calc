import requests
import plaid
from plaid.api import plaid_api
from plaid.model.credit_bank_income_get_request import CreditBankIncomeGetRequest
from plaid.model.credit_bank_income_get_request_options import CreditBankIncomeGetRequestOptions

# Expenses Logic

# Token Logic

#Change this to switch to development
PLAID_ENV = 'sandbox'

# host = plaid.Environment.Sandbox

if PLAID_ENV == 'sandbox':
    host = plaid.Environment.Sandbox

if PLAID_ENV == 'development':
    host = plaid.Environment.Development

configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': "643d947ffcfd210012e71a2f",
        'secret': "8dae0930715056a722a284658a5748",
        'plaidVersion': '2020-09-14'
    }
)


api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# request_body = {
#   "client_id": "643d947ffcfd210012e71a2f",
#   "secret": "8dae0930715056a722a284658a5748",
#   "access_token": "access-sandbox-453207de-d94f-448f-bb31-87754eb6d213",
#   "start_date": "2023-03-18",
#   "end_date": "2023-04-17"
# }

# url = 'https://sandbox.plaid.com/transactions/get'
# response = requests.post(url, json=request_body)
# response_json = response.json()


def update_expenses(access_token):
    def total_creator(category):
        new_list = [ transaction['amount'] for transaction in response_json['transactions'] if category in transaction['category'] ]
        return sum(new_list)

    request_body = {
    "client_id": "643d947ffcfd210012e71a2f",
    "secret": "8dae0930715056a722a284658a5748",
    "access_token": access_token,
    "start_date": "2023-03-18",
    "end_date": "2023-04-17"
    }

    url = 'https://sandbox.plaid.com/transactions/get'
    response = requests.post(url, json=request_body)
    print('-------------------------')
    print(response)
    print(response.json())
    print('-------------------------')
    response_json = response.json()
    

    fb_list = [ transaction['amount'] for transaction in response_json['transactions'] if 'Food and Beverage' in transaction['category'] or 'Food and Drink' in transaction['category']]
    total_fb = sum(fb_list)

    object_total_list = {
        "1": total_fb,
        "2": total_creator('Rent'),
        "3": total_creator('Utilities'),
        "4": total_creator('Insurance'),
        "5": total_creator('Billpay'),
        "6": total_creator("Taxes")
    }
    return object_total_list


# Income Logic


# income_request_body = {
#     "client_id": "643d947ffcfd210012e71a2f",
#     "secret": "8dae0930715056a722a284658a5748",
#     "user_token": "user-sandbox-7684898b-97aa-4e5f-91e9-82680cb20b0d"
# }



def update_income(user_token):
    income_url = "https://sandbox.plaid.com/credit/bank_income/get"
    print(user_token)

    # income_request_body = {
    #     "client_id": "643d947ffcfd210012e71a2f",
    #     "secret": "8dae0930715056a722a284658a5748",
    #     "user_token": user_token
    # }

    # sandbox.plaid.com


    request = CreditBankIncomeGetRequest(
    user_token='user-sandbox-7684898b-97aa-4e5f-91e9-82680cb20b0d',
    options=CreditBankIncomeGetRequestOptions(
        count=1
    )
    )
    response = client.credit_bank_income_get(request);
    print(response)


    # income_response = requests.post(income_url, json=income_request_body)

    total_income = response['bank_income'][0]['bank_income_summary']['historical_summary'][0]['total_amount']
    print(total_income)
    return total_income





# products = []
# for product in PLAID_PRODUCTS:
#     products.append(Products(product))
