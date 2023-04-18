import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css';

function SignUp(){
    const nagivate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirmation: ''
    })
    function handleSubmit(e) {
        e.preventDefault()
        fetch('/signup', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            nagivate('/')

        })
    }
    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    // console.log(formData)

    return(
        <div>
            <h1>
                Sign Up!
            </h1>
            <form onSubmit={handleSubmit}>
                <input name='username' value={formData['username']} onChange={handleChange} type='text' placeholder='Enter username' />
                <input name='password' value={formData['password']} onChange={handleChange} type='text' placeholder='Enter password' />
                <input name='passwordConfirmation' value={formData['passwordConfirmation']} onChange={handleChange} type='text' placeholder='Confirm password' />
                <input type='submit' />
            </form>
        </div>
    )
}

export default SignUp;