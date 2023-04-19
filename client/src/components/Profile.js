import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

import NavBar from './NavBar';
import EditHourlyWageButton from './EditHourlyWageButton';
import UpdateExpenseButton from './UpdateExpenseButton';
import LogoutButton from './LogoutButton';
import DeleteProfileButton from './DeleteProfileButton';

function Profile(){
    const [userInfo, setUserInfo] = useState()
    const navigate = useNavigate()
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

    const username = userInfo && userInfo.username
    const hourlyWage = userInfo && userInfo.income[0].hourly_wage
    
    return(
        <div>
            <NavBar/>
            <p>Profile page</p>
            <p>Username: {username}</p>
            <p>Hourly Wage: ${hourlyWage}/hr</p>
            <EditHourlyWageButton />
            <UpdateExpenseButton />
            <LogoutButton />
            <DeleteProfileButton/>
            
        </div>
    )
}

export default Profile;