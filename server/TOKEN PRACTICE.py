

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