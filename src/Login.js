import React from 'react'
import { auth, provider } from "./firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuth }) {
    let navigate = useNavigate();

    const signInWithGoogle = () => {
      signInWithPopup(auth, provider).then((result) => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/app");
      });
    };
  
  return (
    <div style={{textAlign:'center',marginTop:'5rem'}}>
      <p>Click below button to sign in with google account </p>
      <button style={{backgroundColor:'#47B5FF',border:'none'}} onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}
