

function UpdateIncome({username}) {

    async function handleClick() {
        await fetch('/update_income', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username})
        })
    }

    return (
        <div>
            <button className="profileBtn" onClick={handleClick}>Update Your Income post user token</button>
        </div>
    )
}
export default UpdateIncome