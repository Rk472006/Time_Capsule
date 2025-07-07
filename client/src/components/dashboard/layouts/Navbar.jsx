import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../utils/firebase'; 
import toast from 'react-hot-toast';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate('/');
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!authUser) return null; 

  return (
    <header className="navbar">
      <div className="navbar-brand">Time Capsule</div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
        <button
          className={location.pathname === '/inbox' ? 'active' : ''}
          onClick={() => handleNavigate('/inbox')}
        >
          Inbox
        </button>
        <button
          className={location.pathname === '/sent' ? 'active' : ''}
          onClick={() => handleNavigate('/sent')}
        >
          Sent
        </button>
        <button
          className={location.pathname === '/create' ? 'active' : ''}
          onClick={() => handleNavigate('/create')}
        >
          Create
        </button>
        <button
          className={location.pathname === '/bin' ? 'active' : ''}
          onClick={() => handleNavigate('/bin')}
        >
          Bin
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
