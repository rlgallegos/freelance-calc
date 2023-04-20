import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import ExpensesBreakdown from './ExpensesBreakdown'
import NavBar from './NavBar';

//TESTING PURPOSES:
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
                res.json().then(user => setUserInfo(user)).then(() => console.log(userInfo))
            } else {
                navigate('/')
            }
        })
    }, [])
    console.log(userInfo)
    
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

    const currentNet = monthlyIncome - expenseTotal
    // const currentNet = 30 - 1000
    
    const color = "#0088fe"
    let completed = (monthlyIncome / expenseTotal) * 100
    if (completed > 100){
        completed = 100
    }

  
    return(
        <div>
            <NavBar/>
            <div className='home'>

                <div className='top-container'>
                    <div className='info-container'>
                        <h3>Income Tracker:</h3>
                        <p>This month's Income: ${monthlyIncome}</p>
                        <p>Expense Goal: ${expenseTotal}</p>
                        <div className='net-display'>
                            <p>Current Net:</p>
                            {currentNet > 0 ? <p style={{color: '#57C478'}}>+${currentNet}</p> : <p style={{color: '#A40001'}}>-${currentNet*(-1)}</p>}
                        </div>
                        {currentNet > 0 ? <p>Congrats! You've met your goal!</p> : null}
                        <p>Progress Bar:</p>
                        <ProgressBar bgcolor={color} completed={completed} />
                        <br/>


                        {/* <p>*please note that the expense goal is calculated by last months  expenses</p> */}
                        

                    </div>
                    <div className='info-container'>
                        <h3>Work Hour Tracker:</h3>
                        <p>Based on your hourly wage of ${hourlyWage}/hr: </p> 
                        <p>This month, you need {Math.ceil(expenseTotal/hourlyWage)} hours of work  this month is needed to meet the expense goal</p>
                        <p>Hours needed to work currently?? : </p>
                       

                    </div>
                </div>
 
                <div className='info-container'>
                    <ExpensePieChart/>
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
            
        </div>

    )
}

export default Home;