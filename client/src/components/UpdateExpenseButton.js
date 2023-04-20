import { useNavigate } from "react-router-dom"

function UpdateExpenseButton({username}) {
    const nagivate = useNavigate()
    async function handleUpdateExpense() {

        await fetch('/update_expenses', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(username)
        })
    }

    return (
        <button onClick={handleUpdateExpense}>Update Expense</button>
    )
}
export default UpdateExpenseButton;