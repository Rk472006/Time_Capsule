
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

export default function Navbar({ uid }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(`${path}/${uid}`);
    setMenuOpen(false);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-brand"> Time Capsule</div>
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
        <button onClick={handleLogout} >Logout</button>
      </div>
    </header>
  );
}
