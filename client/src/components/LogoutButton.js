import { useNavigate } from "react-router-dom"

function LogoutButton() {
    const nagivate = useNavigate()
    function handleLogout() {
        fetch('/logout', {
            method: "DELETE",
        }).then(res =>{
            nagivate('/')
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <button className="logoutBtn" onClick={handleLogout}>Logout</button>
    )
}
export default LogoutButton