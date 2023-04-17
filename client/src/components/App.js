import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import '../App.css';

import WelcomePage from './WelcomePage';
import Home from './Home';
import SignUp from './SignUp';
import Profile from './Profile';
import LogoutButton from './LogoutButton';

function App() {
  return (
    <div className="App">

      <header>

        <h1>Finance Calculator</h1>

        <nav>
          {/* no links for: Welcome Page & Signup */}
          <Link className='link' to='/home'>Home</Link>
          <Link className='link' to='/profile'>Profile</Link>
          <LogoutButton />
        </nav>

      </header>

      <Routes> 
        <Route path='/home' element={<Home />} />
        {/* <Route path='/signup' element={<SignUp />} /> */}
        <Route path='/profile' element={<Profile />} />
        <Route path='/' element={<WelcomePage />} />
      </Routes>

    </div>
  );
}

export default App;
