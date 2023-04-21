

function ConnectIncome() {
    function handleClick() {
        fetch('/user_token', {
            method: 'POST'
        })
        .then(r => {
            if (r.ok) {
                console.log('Income Correctly Linked')
            } else {
                console.log('Failed to Correctly Link')
            }
        })
    }

    return (
        <div>
            <button className="profileBtn" onClick={handleClick}>Authorize Income</button>
        </div>
    )
}
export default ConnectIncome