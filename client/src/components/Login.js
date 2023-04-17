import React, {useState, useEffect} from 'react';
import '../App.css';

function Login(){
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    function handleSubmit(e) {
        e.preventDefault()
        fetch('/login', {
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }
    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }


    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input name='username' value={formData['username']} onChange={handleChange} type='text' placeholder='Enter username' />
                <input name='password' value={formData['password']} onChange={handleChange} type='text' placeholder='Enter password' />
                <input type='submit' />
            </form>
        </div>
    )
}

export default Login;