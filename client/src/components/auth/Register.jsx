import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import "./register.css";
export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function isValidPassword(password) {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= minLength;
    return hasUpper && hasLower && hasDigit && hasSpecial && isLongEnough;
  }

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      if (!isValidPassword(password)) {
        
        toast.error("Password must be at least 6 characters long and contain an uppercase, lowercase, digit, and special character.");
        navigate("/register");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      await axios.post(`${import.meta.env.VITE_EXPRESS_API}/api/user/register`, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      });

      toast.success("Registered successfully!");
      localStorage.setItem("uid", firebaseUser.uid);
      navigate(`/inbox/${firebaseUser.uid}`, { replace: true });
    } catch (err) {
      console.error("Register failed:", err);
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="register-page">
    <div className="register-container">
      <h2>Register</h2>
      <form id="register" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder='Email'
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          value={email}
        />
        <input
          type="password"
          placeholder='Password'
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          value={password}
        />
        <button type="submit">Submit</button>
        <p> Already have an account? <a href="/login">Login</a></p>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </div>
  );
}
