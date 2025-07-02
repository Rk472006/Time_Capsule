import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';      
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Inbox from './components/dashboard/inbox/Inbox';
import Sent from './components/dashboard/sent/Sent';
import Create from './components/dashboard/create/Create';
import Bin from './components/dashboard/Bin/Bin';
import ProtectedRoute from './components/auth/ProtectedRoute';
function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inbox/:uid" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/sent/:uid" element={<ProtectedRoute><Sent /></ProtectedRoute>} />
        <Route path="/create/:uid" element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route path="/bin/:uid" element={<ProtectedRoute><Bin /></ProtectedRoute>} />
      </Routes>
  
  );
}

export default App;
