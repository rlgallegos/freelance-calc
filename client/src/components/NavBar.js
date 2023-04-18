import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import '../App.css';



function NavBar(){
    return(
        <div className='NavBar'>
            <header>
                <h1>Finance Calulator</h1>
                <nav>
                    <Link className='link' to='/home'>Home</Link>
                    <Link className='link' to='/profile'>Profile</Link>
                </nav>
            </header>
        </div>
    )
        
    
}

export default NavBar;