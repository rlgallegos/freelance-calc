import { useState } from "react"


function UpdateIncome({username}) {
    const [message, setMessage] = useState(null)

    async function handleClick() {
        await fetch('/update_income', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username})
        }).then(res => {
            if (res.ok){
                res.json().then(data => setMessage(data.success))
            } else {
                res.json().then(data => setMessage(data.error))
            }
        })
    }

    return (
        <div>
            <button className="profileBtn" onClick={handleClick}>Update Your Income</button>
            {message && <p>{message}</p>}
        </div>
    )
}
export default UpdateIncome