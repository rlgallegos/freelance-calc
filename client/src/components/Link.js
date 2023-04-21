import { usePlaidLink } from 'react-plaid-link';

function Link({linkToken}) {

    // 'Set-Cookie','cross-site-cookie=bar; SameSite=None; Secure'

const { open, ready } = usePlaidLink({
  token: linkToken,
  onSuccess: (public_token, metadata) => {
    console.log('onSuccess callback successfully reached')
    // send public_token to server
    fetch('/exchange_public_token', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(public_token)
    })
    .then(res => {
        console.log(res.json())
    })
  },
});



return (
  <button className="profileBtn" onClick={() => open()} disabled={!ready}>
    Connect a bank account
  </button>
);

}

export default Link