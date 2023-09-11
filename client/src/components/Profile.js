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
    const [thankYou, setThankYou] = useState(false)



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
     
    const [showEdit, setShowEdit] = useState(false)
    function handleClick(){
        setShowEdit(!showEdit)
    }

    function handleTransactions(){
        fetch('/transactions')
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }

    function handlePayroll(){
        fetch('/payroll')
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }
    
    return(
        <div>
            <NavBar/>
            <div className="profile">
                <p><b>Username:</b> {username}</p>
                <p><b>Hourly Wage:</b> ${hourlyWage}/hr <button className="editBtn" onClick={handleClick}>Edit</button></p>
                {showEdit ? <EditHourlyWageButton userID={userInfo.id} /> : null}
                <div className="buttonsContainer">
                {userInfo && 
                    <div>
                        <h4>Currently showing income from: {userInfo.bank_name}- {userInfo.account_name}</h4>
                    </div>}
                    <div>
                        {userInfo && !userInfo.bank_name ?
                        <> 
                        <h3 className="buttonsContainerText">Connect To Your Bank</h3>
                        <p>Connecting to your bank via Plaid</p>
                        </> :
                        <>
                        <h3 className="buttonsContainerText">Connect a Different Bank</h3>
                        <p>Update to a different bank via Plaid</p>                        
                        </>}
                    </div>
                    <br></br>
                    {userInfo && <ConnectIncome userInfo={userInfo} />}
                    <Plaid thankYou={thankYou} setThankYou={setThankYou} />
                    <br></br>
                    <div className="buttonsContainerSubText">If you feel that your current information is out of date,</div>
                    <div className="buttonsContainerSubText">please feel free to update by choosing the options below</div>
                    {/* {thankYou && <p>Thank you for linking your account!</p>} */}
                    <div className='profile-button-container'>
                        {userInfo && <UpdateIncome username={userInfo.username} />}
                        {userInfo && <UpdateExpenseButton username={userInfo.username} /> }
                    </div>

                </div>
                <div className="buttonsContainerLower">
                    <LogoutButton />
                    <DeleteProfileButton/>
                </div>
                <button onClick={handleTransactions}>Get Transactions</button>
                <button onClick={handlePayroll}>Get Payroll</button>
            </div>
        </div>
    )
}

export default Profile;