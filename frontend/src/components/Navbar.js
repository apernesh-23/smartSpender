import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { removeAuth } from '../utils/auth';
import './Navbar.css';

const Navbar = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('smartspender_user') || '{}');

  const handleLogout = () => {
    removeAuth();
    setIsAuthenticated(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          💰 SmartSpender
        </Link>
        <div className="navbar-links">
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/expenses" 
            className={location.pathname === '/expenses' ? 'active' : ''}
          >
            Expenses
          </Link>
          <Link 
            to="/insights" 
            className={location.pathname === '/insights' ? 'active' : ''}
          >
            AI Insights
          </Link>
          <span className="navbar-user">Hello, {user.name || 'User'}</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
