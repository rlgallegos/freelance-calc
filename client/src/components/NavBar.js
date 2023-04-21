import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import '../App.css';



function NavBar(){
    return(
        <header className='navbar'>
            <h1 className='navbar-header'> Freelance Calulator</h1>
            <nav className='navbar-routes'>
                <Link className="material-symbols-outlined" to='/home'>home</Link>
                <Link className="material-symbols-outlined" to='/profile'>person</Link>
            </nav>
        </header>
    )
        
    
}

export default NavBar;