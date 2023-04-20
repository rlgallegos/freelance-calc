import React, {useState, useEffect} from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from "yup";

function Login(){
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const navigate = useNavigate()

    //Formik Schema Logic
    const formSchema = yup.object().shape({
        password: yup.string().required("Must enter a password").max(15),
        username: yup.string().required("Must enter a username").max(15)
        });

    
    //Formik Logic
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: formSchema,
        validateOnChange: false,
        onSubmit: values => {
            fetch('/login', {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
        .then(() =>{
            console.log('here')
            fetch('/update_income',{
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values.username)
            })
        })
            .then(() => {
                navigate('/home')
            })
        }
    })





    // function handleSubmit(e) {
    //     e.preventDefault()
    //     fetch('/login', {
    //         method: 'POST',
    //         headers:  {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(formData)
    //     })
    //     .then(() =>{
    //         fetch('/update_income',{
    //             method: "PATCH"
    //         })
    //     })
    //     .then(() => {
    //         navigate('/home')
    //     })
    // }
    // function handleChange(e) {
    //     setFormData({...formData, [e.target.name]: e.target.value})
    // }


    return(
        <div>
            <form onSubmit={formik.handleSubmit}>
                <input name='username' value={formik.values.username} onChange={formik.handleChange} type='text' placeholder='Enter username' />
                <br />
                <p style={{color: "red"}}>{formik.errors.username}</p>
                <br />
                <input name='password' value={formik.values.password} onChange={formik.handleChange} type='password' placeholder='Enter password' />
                <br />
                <p style={{color: "red"}}>{formik.errors.password}</p>
                <br />
                <input type='submit' />
            </form>
        </div>
    )
}

export default Login;