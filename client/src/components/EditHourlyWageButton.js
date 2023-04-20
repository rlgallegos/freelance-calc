import { useNavigate } from "react-router-dom"

function EditHourlyWageButton() {
    const nagivate = useNavigate()
    function handleedit() {

        fetch('/logout', {
            method: "DELETE",
        }).then(res =>{
            nagivate('/')
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <button onClick={handleedit}>Update the HOURLY WAGE</button>
    )
}
export default EditHourlyWageButton