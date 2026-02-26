import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import MyBookings from './pages/MyBookings';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Check localStorage if context is not yet updated
  const hasToken = !!localStorage.getItem('token');
  return (isAuthenticated || hasToken) ? <>{children}</> : <Navigate to="/login" />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || JSON.parse(localStorage.getItem('user') || '{}').role === 'ADMIN';
  return (isAuthenticated || localStorage.getItem('token')) && isAdmin ? <>{children}</> : <Navigate to="/" />;
};



const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/welcome" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Authenticated Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/bookings" element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/welcome" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
