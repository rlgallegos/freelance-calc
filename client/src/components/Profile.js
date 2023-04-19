import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

import NavBar from './NavBar';
import EditHourlyWageButton from './EditHourlyWageButton';
import UpdateExpenseButton from './UpdateExpenseButton';
import LogoutButton from './LogoutButton';
import DeleteProfileButton from './DeleteProfileButton';
import Plaid from './Plaid';

function Profile(){
    const [startLink, setStartLink] = useState(false)
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


    function handleStartLink() {
        setStartLink(true)
    }

    
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
            {/* Move this to the correct location */}
            <button onClick={handleStartLink}>Click Me to Start the whole Plaid stuff</button>      
            {startLink && <Plaid />}

        </div>
    )
}

export default Profile;