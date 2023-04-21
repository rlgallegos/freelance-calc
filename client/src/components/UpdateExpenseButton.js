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
        <div>
            <button className="profileBtn" onClick={handleUpdateExpense}>Update Expense</button>
        </div>
    )
}
export default UpdateExpenseButton;