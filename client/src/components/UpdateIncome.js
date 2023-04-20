

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
        <button onClick={handleClick}>Update Your Income post user token</button>
    )
}
export default UpdateIncome