import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

function Link({linkToken, setThankYou, thankYou}) {
  const [failMessage, setFailMessage] = useState(null)

      // 'Set-Cookie','cross-site-cookie=bar; SameSite=None; Secure'

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      console.log('onSuccess callback successfully reached')
      setThankYou(true)
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
    //Handle errors
    onExit: (err, metadata) => {
      console.log('onExit callback reached');
      if (err) {
        console.log('Error:', err);
        // Handle specific error conditions
        if (err.error_code === 'ITEM_LOGIN_REQUIRED') {
          console.log('User needs to log in');
        } else if (err.error_code === 'INVALID_CONFIGURATION') {
          console.log('Invalid Link configuration');
        } else {
          console.log('Other error:', err.error_message);
        }
      } else {
        console.log('Link flow exited without error');
      }
      console.log('Metadata:', metadata);
      // Perform any necessary actions or display error messages
      setFailMessage('No Bank Income Located')
    },
  });



  return (
    <>
      <button className="profileBtn" onClick={() => open()} disabled={!ready}>
      Connect a bank account
      </button>
      <br></br>
      {thankYou && <p>Income sources correctly located</p>}
      {failMessage && <p>{failMessage}</p>}
    </>


  );

}

export default Link