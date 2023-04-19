import { useNavigate } from "react-router-dom"

function DeleteProfileButton() {
    const nagivate = useNavigate()
    function handleDeleteProfile() {

        fetch('/users_by_id', {
            method: "DELETE",
        }).then(res =>{
            nagivate('/')
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <button onClick={handleDeleteProfile}>DELETE PROFILE</button>
    )
}
export default DeleteProfileButton;