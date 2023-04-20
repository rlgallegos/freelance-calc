import React, {useState, useEffect} from 'react'
import { PieChart, Pie, Tooltip, Cell} from 'recharts';
import '../App.css';

function ExpensePieChart(){

    const [userInfo, setUserInfo] = useState({})
    useEffect(() => {
        fetch('/check_session')
        .then(res => {
            if (res.ok) {
                res.json().then(user => setUserInfo(user))
            } 
        })
    }, [])

    const foodAndBeverageExpense = userInfo.expenses && userInfo.expenses[0].amount
    const rentExpense = userInfo.expenses && userInfo.expenses[1].amount
    const utilitiesExpense = userInfo.expenses && userInfo.expenses[2].amount
    const insuranceExpense = userInfo.expenses && userInfo.expenses[3].amount
    const billpayExpense = userInfo.expenses && userInfo.expenses[4].amount
    const taxesExpense = userInfo.expenses && userInfo.expenses[5].amount

    const expenseTotal = foodAndBeverageExpense + rentExpense + utilitiesExpense + insuranceExpense + billpayExpense + taxesExpense

    const data = [
        {name: 'Food & Beverages', value: foodAndBeverageExpense},
        {name: 'Rent', value: rentExpense},
        {name: 'Utilites', value: utilitiesExpense},
        {name: 'Insurance', value: insuranceExpense},
        {name: 'AutoPay Bills', value: billpayExpense},
        {name: 'Taxes', value: taxesExpense},
    ]

    const COLORS = ['#0088fe', '#b977f0', '#ff65c4', '#ff6c8b', '#ff9053', '#ffbb28' ];

  return (
    <div>
        <h3>Expense Breakdown:</h3>
        <h5>The total expense displayed is ${expenseTotal}</h5>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#0088fe"
            label
          />
            {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          <Tooltip />
        </PieChart>

    </div>
  )
  
}

export default ExpensePieChart