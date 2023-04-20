// import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

// import SignUp from './SignUp';
import Login from './Login';

//TESTING PURPOSES:
// import PieChart from './ExpensePieChart';
// import ColorPieChart from './ColorPieChart';


function WelcomePage(){

    const navigate = useNavigate()
    function handleClick(){
        navigate('/signup')
    }

    return(
        <div>

        <div className="welcomePage">
            <div>
                <h1>Freelance Calculator</h1>
                <h2>Take control of your work hours</h2>
                {/* <h3>Track your epxences to better plan out your work schedule</h3> */}
                <br></br>
                <div>
                    <h3>Track your expenses to better plan out your work schedule</h3>
                    <p>If you need help calcuating how much you need to work to ... blah blah blah blah blah blah blah blah blah blah blah blah </p>
                    <h3>What we do:</h3>
                    <p>(Here we enter all the information we want to say about our website)</p>
                </div>
            </div>

            <div className='Signin'>
                <h4>Log in:</h4>
                <Login />
                <br /><br />
                <button onClick={handleClick}>Sign up</button>
            </div>
        </div>

            {/* <PieChart/>
            <ColorPieChart/> */}
        </div>
    )
}

export default WelcomePage;