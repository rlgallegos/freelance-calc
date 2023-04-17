import React, {useState, useEffect} from 'react';
import '../App.css';
import SignUp from './SignUp';
import Login from './Login';

function WelcomePage(){

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
            <div>
                <h3>New to the Finance Calculator?</h3>
                <h4>Sign up below:</h4>
                <SignUp />
                <h3>Already a member?</h3>
                <h4>Log in below:</h4>
                <Login />
            </div>
        </div>
    )
}

export default WelcomePage;