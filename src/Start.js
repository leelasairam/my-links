import React from 'react'
import App from "./App";
import './Start.css';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from "./Login";
import { useState} from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
export default function Start() {
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

    const signUserOut = () => {
      signOut(auth).then(() => {
        localStorage.clear();
        setIsAuth(false);
        window.location.pathname = "/login";
      });
    };
  
    return (
      <Router>
        <nav style={{textAlign:'center',backgroundColor:'#256D85',padding:'1rem'}}>
          {!isAuth ? (
            <>
                <Link style={{marginRight:'0.5rem',color:'white',fontWeight:'900'}} to="/login"> Login  </Link>
                <span style={{color:'yellow'}}>to access the app</span>
            </>
            
          ) : (
            <>
              
              <Link className='homebtn'  to="/app"> 🏠Home </Link>
              <button className='logoutbtn' onClick={signUserOut}> ⏴LogOut</button>
              
            </> 
          )}
        </nav>
        <Routes>
          
          <Route path="/app" element={<App isAuth={isAuth} />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        </Routes>
      </Router>
    );
}
