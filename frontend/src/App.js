import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketDetails from './pages/TicketDetails';
import CreateTicket from './pages/CreateTicket';
import AdminPanel from './pages/AdminPanel';

function App() {
  // For simplicity, authentication state and role can be managed here or with context
  // Placeholder for auth check
  const isAuthenticated = !!localStorage.getItem('token');
  const userType = localStorage.getItem('userType'); // 'representante', 'comunitario', 'admin'

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets/create" element={userType === 'representante' ? <CreateTicket /> : <Navigate to="/" replace />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        {userType === 'admin' && <Route path="/admin" element={<AdminPanel />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
