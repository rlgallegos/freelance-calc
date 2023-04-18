import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import SignUp from './SignUp';
import Login from './Login';


function WelcomePage(){

    // const [showSignup, setShowSignup] = useState(false);
    // function handleClick(){
    //     setShowSignup((showSignup) => !showSignup);
    // }
    const navigate = useNavigate()
    function handleClick(){
        navigate('/signup')
    }

    return(
        <div>
            <h2>Welcome!</h2>
            <br></br>
            <div>
                <h3>Who we are:</h3>
                <p>(Here we enter information about who we are)</p>
                <h3>What we do:</h3>
                <p>(Here we enter all the information we want to say about our website)</p>
            </div>

            <div className='Signin'>
                <h4>Log in:</h4>
                <Login />

                <button onClick={handleClick}>Sign up</button>
                {/* {showSignup ? <SignUp /> : null} */}
            </div>
        </div>
    )
}

export default WelcomePage;