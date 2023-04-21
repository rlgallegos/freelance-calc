// import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css';

// import SignUp from './SignUp';
import Login from './Login';
import Bobby from '../images/cheesy.png'

function WelcomePage(){

    const navigate = useNavigate()
    function handleClick(){
        navigate('/signup')
    }

    return(
        <div className="welcome-page">
            <div className='welcome-page-left'>
                <div className="welcome-page-header">
                    <div className="welcome-page-header-text">
                        <h1>Freelance Calculator</h1>
                        <h2>Take control of your work hours</h2>
                    </div>
                    <img src={Bobby} alt='Happy Man' className='bobby'/>
                </div>

                {/* <h3>Track your epxences to better plan out your work schedule</h3> */}
                <br></br>
                <div className='welcome-page-contents'>
                    <h3 className='welcome-page-contents-header'>Freelance calculator provides convenient work-hour management enabled by seamless banking integration.</h3>
                    <p className='welcome-page-contents-text'>Introducing Freelance Calculator - the ultimate financial tool for freelancers and independent contractors! Our powerful platform seamlessly integrates with the Plaid API to provide users with a comprehensive overview of their financial situation. With Freelance Calculator, users can easily connect to their bank accounts and track their income, expenses, and savings in real-time. Our intuitive interface makes it easy to analyze spending patterns, identify areas where you can save money, and accurately calculate the number of hours you need to work to cover your expenses. Whether you're just starting out or are a seasoned freelancer, Freelance Calculator is the perfect tool to help you manage your finances and stay on top of your game. Try it out today and take control of your financial future! </p>
                </div>
            </div>

            <div className='signin'>
                <h4>Log in:</h4>
                <Login />
                <div className='signup-button-container'>
                    <button onClick={handleClick}>Sign up</button>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage;