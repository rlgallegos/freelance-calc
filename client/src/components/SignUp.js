import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css';

import { useFormik } from 'formik';
import * as yup from "yup";

// import Plaid from './Plaid';

function SignUp(){
    const navigate = useNavigate()
    const [startLink, setStartLink] = useState(false)


    //Formik Schema Logic
    const formSchema = yup.object().shape({
        password: yup.string().required("Must enter a password").max(15),
        username: yup.string().required("Must enter a username").max(15),
        passwordConfirmation: yup
            .string()
            .oneOf([yup.ref('password')], 'Your passwords do not match.').max(15).required('Must enter a password confirmation')
      });


    //Formik Logic
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            passwordConfirmation: ''
        },
        validationSchema: formSchema,
        validateOnChange: false,
        onSubmit: values => {
            fetch('/signup', {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            .then(() => {
                navigate('/')
            })
        }
    })

    function handleStartLink() {
        setStartLink(true)
    }

    return(
        <div className='signup-outter-container'>
        <div className='signup-container'>
            <h1 className='signup-header'> 
                Sign Up!
            </h1>
            <form className='signup-form' onSubmit={formik.handleSubmit}>

                <input name='username' value={formik.values.username} onChange={formik.handleChange} type='text' placeholder='Enter username' />
                <br />
                <p style={{color: "red"}}>{formik.errors.username}</p>
                <br />
                <input name='password' value={formik.values.password} onChange={formik.handleChange} type='text' placeholder='Enter password' />
                <br />
                <p style={{color: "red"}}>{formik.errors.password}</p>
                <br />
                <input name='passwordConfirmation' value={formik.values.passwordConfirmation} onChange={formik.handleChange} type='text' placeholder='Confirm password' />
                <br />
                <p style={{color: "red"}}>{formik.errors.passwordConfirmation}</p>
                <br />
                <input className='loginSubmit' type='submit' />
            </form>
        </div>
            
            
            
            
            {/* Move this to the correct location */}
            {/* <button onClick={handleStartLink}>Click Me to Start the whole Plaid stuff</button>      
            {startLink && <Plaid />} */}


        </div>
    )
}

export default SignUp;