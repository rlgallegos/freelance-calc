import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import ExpensesBreakdown from './ExpensesBreakdown';

function Home(){
    const [isNegative, setIsNegative] = useState(false)
    const [userInfo, setUserInfo] = useState({})
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

    console.log(userInfo)

    //Calculations
    let weeklyIncome = 0
    let weeklyExpenses = 0
    let avgIncome = 0
    if (userInfo.income) {

        //Calculate Weekly Income
        let totalIncome = 0
        let totalHourly = 0
        userInfo.income.forEach(income => {
            totalIncome += income.annual_total_income
            totalHourly += income.hourly_wage
        })
        weeklyIncome = (totalIncome / 52).toFixed(2)

        //Calculate Weekly Expenses
        let totalExpenses = 0
        userInfo.expenses.forEach(expense => {
            totalExpenses += expense.amount
        })
        weeklyExpenses = (totalExpenses / 4).toFixed(2)

        //Calculate average hourly
        avgIncome = totalHourly / (userInfo.income.length).toFixed(2)
    }


    return(
        <div>
            <div className='info-container'>
                <h3>Current Net</h3>
                <p>//Put Net Here//</p>
            </div>
            <div className='info-container'>
                <h3>Hours per week to meet expenses:</h3>
                <p>$ {(weeklyExpenses/avgIncome).toFixed(2)}</p>
            </div>
            <div className='info-container'>
                <h3>Hours per week to meet expenses:</h3>
                <p>//Put deficit logic here//</p>   
            </div>
            {isNegative && <ExpensesBreakdown expenses={userInfo.expenses} weeklyExpenses={weeklyExpenses} />}
        </div>
    )
}

export default Home;