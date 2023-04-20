import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import ExpensesBreakdown from './ExpensesBreakdown'
import NavBar from './NavBar';

function Home(){
    const [isNegative, setIsNegative] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/check_session')
        .then(res => {
            if (res.ok) {
                res.json().then(user => setUserInfo(user)).then(() => console.log(userInfo))
            } else {
                navigate('/')
            }
        })
    }, [])
    
    //Income and Expenses:
    console.log(userInfo)

    const monthlyIncome = userInfo.income && userInfo.income[0].monthly_total_income
    const hourlyWage = userInfo.income && userInfo.income[0].hourly_wage

    const foodAndBeverageExpense = userInfo.expenses && userInfo.expenses[0].amount
    const rentExpense = userInfo.expenses && userInfo.expenses[1].amount
    const utilitiesExpense = userInfo.expenses && userInfo.expenses[2].amount
    const insuranceExpense = userInfo.expenses && userInfo.expenses[3].amount
    const billpayExpense = userInfo.expenses && userInfo.expenses[4].amount
    const taxesExpense = userInfo.expenses && userInfo.expenses[5].amount

    const expenseTotal = foodAndBeverageExpense + rentExpense + utilitiesExpense + insuranceExpense + billpayExpense + taxesExpense


    return(
        <div>
            <NavBar/>
            <div className='info-container'>
                <h3>Current Net</h3>
                <p>{monthlyIncome} / {expenseTotal}</p>
            </div>
            <div className='info-container'>
                <h3>Hours per week to meet expenses:</h3>
                <p>{Math.ceil(expenseTotal/hourlyWage)} hours needed to meet total expense of {expenseTotal}</p>
                <p>Hours needed to work currently?? : </p>
            </div>
            <div className='info-container'>
                <h3>Monthy Breakdown by Category:</h3>
                <p>Rent: {rentExpense}</p>
                <p>Utilites: {utilitiesExpense}</p> 
                <p>Food and Beverages: {foodAndBeverageExpense}</p>
                <p>Insurance: {insuranceExpense}</p>
                <p>Taxes: {taxesExpense}</p>
                <p>Automatic Payemnts: {billpayExpense}</p>
            </div>
        </div>
    )
}

export default Home;