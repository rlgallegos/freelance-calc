

function LogoutButton() {

    function handleLogout() {
        fetch('/logout', {
            method: "DELETE",
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}
export default LogoutButton