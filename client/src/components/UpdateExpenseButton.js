import { useNavigate } from "react-router-dom"

function UpdateExpenseButton() {
    const nagivate = useNavigate()
    function handleUpdateExpense() {

        fetch('/update_expenses')
        .then(() =>{
            nagivate('/home')
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <button onClick={handleUpdateExpense}>Update Expense</button>
    )
}
export default UpdateExpenseButton;