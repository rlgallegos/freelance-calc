import React, {useState, useEffect} from 'react';
import '../App.css';

function SignUp(){
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirmation: ''
    })
    function handleSubmit(e) {
        e.preventDefault()
    }
    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input name='username' value={formData['username']} onChange={handleChange} type='text' placeholder='Enter username' />
                <input name='password' value={formData['password']} onChange={handleChange} type='text' placeholder='Enter password' />
                <input name='passwordConfirmation' value={formData['passwordConfirmation']} onChange={handleChange} type='text' placeholder='Confirm password' />
                <input type='submit' />
            </form>

            <p>Signup page</p>
        </div>
    )
}

export default SignUp;