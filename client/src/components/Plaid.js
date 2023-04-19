import React, {useState, useEffect} from 'react';
import Link from './Link';



function Plaid() {

    const [linkToken, setLinkToken] = useState(null);

    const generateToken = async () => {
      const response = await fetch('/create_link_token', {
        method: 'POST',
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    };

    useEffect(() => {
        generateToken();
    }, []);

    return (linkToken != null ? <Link linkToken={linkToken} /> : <></>);

};

export default Plaid