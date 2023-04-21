import React, {useState, useEffect} from 'react';
import Link from './Link';



function Plaid({setThankYou, thankYou}) {
    const [startLink, setStartLink] = useState(false)
    const [linkToken, setLinkToken] = useState(null);

    

    const generateToken = async () => {
      const response = await fetch('/create_link_token', {
        method: 'POST',
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    };

    function handleStartLink() {
      setStartLink(true)
    }
    useEffect(() => {
      if (startLink) {
        generateToken();
      }
    }, [startLink])


    // useEffect(() => {
    //     generateToken();
    // }, []);

    return(
      <div>
        <br></br>
        <button className="profileBtn" onClick={handleStartLink}>Link Your Bank Account</button>
        <br></br>
        {linkToken && <Link thankYou={thankYou} setThankYou={setThankYou} linkToken={linkToken} />}
        <br></br>
      </div>
    )
};

export default Plaid