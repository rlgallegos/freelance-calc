import React, {useState, useEffect} from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Home(){
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate

    useEffect(() => {
        fetch('/check_session')
        .then(res => {
            if (res.ok) {
                res.json().then(user => setUserInfo(user))
            } 
            else {
                navigate('/')
            }
        })
    }, [])

    return(
        <div>
            <p>Home Page: Display Content after login</p>
        </div>
    )
}

export default Home;