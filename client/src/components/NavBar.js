import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import '../App.css';



function NavBar(){
    return(
        <header className='navbar'>
            <h1 className='navbar-header'> Finance Calulator</h1>
            <nav className='navbar-routes'>
                <Link className='link' to='/home'>Home</Link>
                <Link className='link' to='/profile'>Profile</Link>
            </nav>
        </header>
    )
        
    
}

export default NavBar;