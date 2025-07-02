import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {Toaster} from 'react-hot-toast';
import './home.css';
export default function Home() {
  const navigate = useNavigate();

 const handleLogin = () => {
   navigate("/login");
 };

 const handleRegister = () => {
   navigate("/register");
 };

  return (
    <div className="home-page">
      <Toaster position="top-right" />
      <div className="app-container">
        <h1 className="title">⏳ Time Capsule</h1>
        <p className="subtitle">
          Save messages for the future. Unlock them when the time is right.
        </p>
        <div className="button-container">
          <button onClick={handleLogin}> Login</button>
          <button onClick={handleRegister}> Register</button>
        </div>
      </div>
    </div>
  );
}
