import { useNavigate } from "react-router-dom"
import { useFormik } from 'formik';
import * as yup from "yup";


function EditHourlyWageButton({userID}) {
    const navigate = useNavigate()
    console.log(userID)


    //Formik Schema Logic
    const formSchema = yup.object().shape({
        hourly_wage: yup
        .number()
        .positive()
        .integer()
        .required("Must enter a new value")
        .typeError("Please enter a valid number")
        });

    //Formik Logic
    const formik = useFormik({
        initialValues: {
            hourly_wage: '' 
        },
        validationSchema: formSchema,
        validateOnChange: false,
        onSubmit: values => {
            console.log(values)
            fetch(`/income/${userID}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            .then(() => {
                console.log('reached here')
                navigate('/profile')
            })
        }
    })


    // function handleedit() {

    //     fetch(`/users/${userID}`, {
    //         method: "PATCH",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify("///FORM DATA")
    //     }).then(res =>{
    //         nagivate('/')
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <input name='hourly_wage' value={formik.values.hourly_wage} onChange={formik.handleChange} type='text' placeholder='Enter new hourly wage' />
                <p style={{color: "red"}}>{formik.errors.hourly_wage}</p>
                <input type='submit' />
            </form>
        </div>

    )
}
export default EditHourlyWageButton