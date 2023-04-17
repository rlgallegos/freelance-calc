import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import '../App.css';

import WelcomePage from './WelcomePage';
import Home from './Home';
import SignUp from './SignUp';
import Profile from './Profile';

function App() {
  return (
    <div className="App">

      <header>

        <h1>Finance Calculator</h1>

        <nav>
          {/* no links for: Welcome Page & Signup */}
          <Link className='link' to='/home'>Home</Link>
          <Link className='link' to='/profile'>Profile</Link>
          
        </nav>

      </header>

      <Routes> 
        <Route path='/' element={<WelcomePage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

    </div>
  );
}

export default App;
