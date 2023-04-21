import { useState } from "react"


function ConnectIncome({userInfo}) {
    const [refresh, setRefresh] = useState(false)

    function handleClick() {
        fetch('/user_token', {
            method: 'POST'
        })
        .then(r => {
            if (r.ok) {
                console.log('Income Correctly Linked')
                setRefresh(!refresh)
            } else {
                console.log('Failed to Correctly Link')
            }
        })
    }

    return (
        <div>
            {!userInfo.user_token ? <button className="profileBtn" onClick={handleClick}>Initialize Plaid Account</button> : <p>Thank you for setting up a plaid accout!</p>}
        </div>
    )
}
export default ConnectIncome