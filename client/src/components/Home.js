import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../App.css';

import ExpensesBreakdown from './ExpensesBreakdown'
import NavBar from './NavBar';
import ExpensePieChart from './ExpensePieChart';
import ProgressBar from './ProgressBar';

function Home(){
    const [isNegative, setIsNegative] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/check_session')
        .then(res => {
            if (res.ok) {
                res.json().then(user => {
                    console.log(user)
                    setUserInfo(user)
                })
            } else {
                navigate('/')
            }
        })
    }, [])
    
    //Income and Expenses:

    const monthlyIncome = userInfo.income && userInfo.income[0].monthly_total_income
    const hourlyWage = userInfo.income && userInfo.income[0].hourly_wage

    const foodAndBeverageExpense = userInfo.expenses && userInfo.expenses[0].amount
    const rentExpense = userInfo.expenses && userInfo.expenses[1].amount
    const utilitiesExpense = userInfo.expenses && userInfo.expenses[2].amount
    const insuranceExpense = userInfo.expenses && userInfo.expenses[3].amount
    const billpayExpense = userInfo.expenses && userInfo.expenses[4].amount
    const taxesExpense = userInfo.expenses && userInfo.expenses[5].amount

    const expenseTotal = foodAndBeverageExpense + rentExpense + utilitiesExpense + insuranceExpense + billpayExpense + taxesExpense

    const currentNet = monthlyIncome - expenseTotal
    const hoursToWorkForMonth = Math.ceil(expenseTotal/hourlyWage)
    const hoursCompleted = Math.ceil(monthlyIncome/hourlyWage)
    const hoursToWork = hoursToWorkForMonth - hoursCompleted

    
    const color = "#0088fe"
    let completed = (monthlyIncome / expenseTotal) * 100
    if (completed > 100){
        completed = 100
    }
    completed = parseInt(completed)

  
    return(
        <div>
            <NavBar/>
            <div className='home'>
                <div className='top-container'>
                    <div className='info-container'>
                        <h3>Income Tracker:</h3>
                        <p><b>Income:</b> ${monthlyIncome}</p>
                        <p><b>Expense Goal:</b> ${expenseTotal}</p>
                        <p><b>Current Net: </b>{currentNet > 0 ? <span style={{color: '#57C478'}}>+${currentNet}</span> : <span style={{color: '#A40001'}}>-${currentNet*(-1)}</span>}</p>
                        <br/>
                        {currentNet > 0 ? <p>Congrats! You've met your goal!</p> : null}
                        <p><b>Progress Bar</b></p>
                        <ProgressBar bgcolor={color} completed={completed} />
                        <br/>
                    </div>
                    <div className='info-container'>
                        <h3>Work Hour Tracker:</h3>
                        <p><b>Hourly Wage:</b> ${hourlyWage}/hr </p> 
                        <p><b>Monthly Required Hours:</b> {hoursToWorkForMonth} hrs</p>
                        <p><b>Hours Left:</b> {currentNet > 0 ? "0hrs: You've met your goal!" : `${hoursToWork} hrs`}</p>
                    </div>
                    <p className="note">Please note that the expense goal is calculated by last month's expenses</p>
                </div>
                <div className='info-container'>
                    <h3>Monthly Expense Breakdown:</h3>
                    <ExpensePieChart/>
                    <div className='categories'>
                        <p><b>Rent:</b> ${rentExpense}</p>
                        <p><b>Utilites:</b> ${utilitiesExpense}</p> 
                        <p><b>Food and Beverages:</b> ${foodAndBeverageExpense}</p>
                        <p><b>Insurance:</b> ${insuranceExpense}</p>
                        <p><b>Taxes:</b> ${taxesExpense}</p>
                        <p><b>Automatic Payments:</b> ${billpayExpense}</p>
                    </div>
                </div>
            </div>
            {/* <p className="note">Please note that the expense goal is calculated by last month's expenses</p> */}
        </div>
    )
}

export default Home;