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
      <Routes> 
        <Route path='/home' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/' element={<WelcomePage />} />
      </Routes> 
    </div>
  );
}

export default App;
