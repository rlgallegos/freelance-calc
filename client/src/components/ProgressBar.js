import React, {useState, useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import '../App.css';



function ProgressBar({bgcolor, completed}){

    const containerStyles = {
        height: 20,
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        // margin: 0
    }
    
    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right'
    }
    
    const labelStyles = {
        padding: 10,
        color: 'white',
        fontWeight: 'bold'
    }

    return(
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
  
    )
        
    
}

export default ProgressBar;