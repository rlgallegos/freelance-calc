import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

import NavBar from './NavBar';
import EditHourlyWageButton from './EditHourlyWageButton';
import UpdateExpenseButton from './UpdateExpenseButton';
import LogoutButton from './LogoutButton';
import DeleteProfileButton from './DeleteProfileButton';
import Plaid from './Plaid';
import Link from './Link';
import ConnectIncome from './ConnectIncome';
import UpdateIncome from './UpdateIncome';
// import Link2 from './Link2';

function Profile(){
    const [incomeLink, setIncomeLink] = useState(null)
    // const [startLink, setStartLink] = useState(false)
    const [userInfo, setUserInfo] = useState()
    // const [linkToken, setLinkToken] = useState(null)
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
    
    // function handleUpdateBank() {
    //     fetch('/income_token', {
    //         method: "POST"
    //     }).then(res => res.json())
    //     .then(data => setIncomeLink(data))
    // }


    return(
        <div>
            <NavBar/>
            <p>Profile page</p>
            <p>Username: {username}</p>
            <p>Hourly Wage: ${hourlyWage}/hr</p>
            {userInfo && <EditHourlyWageButton userID={userInfo.id} />}
            {/* {userInfo && <ConnectIncome username={userInfo.username} />} */}
            {userInfo && <UpdateIncome username={userInfo.username} />}
            {userInfo && <UpdateExpenseButton username={userInfo.username} /> }
            <LogoutButton />
            <DeleteProfileButton/>
            {/* {incomeLink && <Link2 />} */}
            {/* <button onClick={handleUpdateBank}>Click me to get your bank info</button> */}
            {/* Move this to the correct location */}
            {/* <button onClick={handleStartLink}>Click Me to Start the whole Plaid stuff</button>       */}
            <Plaid />
        </div>
    )
}

export default Profile;