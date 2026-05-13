import PastTickets from './PastTickets';
import AdminDashboard from './AdminDashboard';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Register from './Register';
import ForgotPassword from './ForgotPassword'; // YENİ EKLENDİ

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/past-tickets" element={<PastTickets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* YENİ EKLENDİ */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;