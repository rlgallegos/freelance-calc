import { useState } from "react"


function ConnectIncome({userInfo}) {
    const [attempted, setAttempted] = useState(false)
    const [message, setMessage] = useState(null)

    function handleClick() {
        fetch('/user_token', {
            method: 'POST'
        })
        .then(r => {
            if (r.ok) {
                console.log('Income Correctly Linked')
                setAttempted(true)
                setMessage('Thank you for setting up a plaid accout!')
            } else {
                console.log('Failed to Correctly Link')
                setAttempted(true)
                r.json().then(data => setMessage(data.error))
            }
        })
    }
    return (
        <div>
            {!attempted && <button className="profileBtn" onClick={handleClick}>Initialize Plaid Account</button>}
            {attempted && <p className="refresh">{message}</p>}
        </div>
    )
}
export default ConnectIncome