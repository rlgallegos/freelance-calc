import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

import NavBar from './NavBar';
import LogoutButton from './LogoutButton';
import EditProfile from './EditProfile';

function Profile(){
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState()
    useEffect(() => {
        fetch('/check_session')
        .then(res => {
            if (res.ok) {
                res.json().then(user => setUserInfo(user))
            } else {
                navigate('/')
            }
        })
    }, [])

    console.log(userInfo)

    const [showEdit, setShowEdit] = useState(false)
    function handleClick() {
        setShowEdit((showEdit) => !showEdit)
    }









    // const plaidRequestBody = {
    //     "client_id": "643d947ffcfd210012e71a2f",
    //     "secret": "8dae0930715056a722a284658a5748",
    //     "access_token": "access-sandbox-694ba0cc-a57a-4572-b077-2e719a93f54e",
    //     "start_date": "2021-01-01",
    //     "end_date": "2021-12-10"
    //     // "public_token": "public-sandbox-af79aab8-bbb8-473f-be52-ae59b024a38d" 
    //   }

    // useEffect(() => {
    //     fetch('https://sandbox.plaid.com/transactions/get', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(plaidRequestBody)
    //     })
    //     .then(res => res.json())
    //     .then(data => {
    //         setPlaidData(data)
    //     })
    // }, [])

    // console.log(plaidData)

    return(
        <div>
            <NavBar/>
            <p>Profile page</p>
            <p>Username: Display USERNAME</p>
            <p>Hourly Wage: Display HOURLY WAGE</p>

            {/* INFORMATION THAT CAN BE CHANGED/ EDITED */}
            <div>
                <button onClick={handleClick}>Edit</button>
                {showEdit ? <EditProfile /> : null}
                
                
            </div>
            {/* <Plaid /> */}
            <LogoutButton />
        </div>
    )
}

export default Profile;