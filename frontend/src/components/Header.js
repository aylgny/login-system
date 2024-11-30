// src/components/Header/Header.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Import the corresponding CSS

// Import Icons (ensure these paths are correct based on your project structure)
import shoppingIcon from '../assets/icons/shopping.png';
import userIcon from '../assets/icons/all.png';
import logoutIcon from '../assets/icons/logout.png';
import { ReactComponent as EcommerceLogo } from '../assets/icons/EcommerceLogo.svg';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleAccountClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Optionally, clear other user-related data here
    // Redirect to login page
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="main-header">
      {/* Clickable Logo */}
      <Link to="/mainpage" className="logo-link">
        <EcommerceLogo className="logo-svg" />
      </Link>



      {/* Icon Group */}
      <div className="icon-group">
        {/* Cart Icon */}
        <div className="cart-icon">
          <Link to="/cart">
            <img src={shoppingIcon} alt="Cart" />
          </Link>
        </div>

        {/* Account Icon */}
        <div className="user-icon-container" onClick={handleAccountClick} ref={dropdownRef}>
          <img src={userIcon} alt="User Icon" className="user-icon" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/orders">
                <button className="dropdown-button">Orders</button>
              </Link>
              <Link to="/login">
                <button className="dropdown-button">Login</button>
              </Link>
              <Link to="/signup">
                <button className="dropdown-button">Sign Up</button>
              </Link>
            </div>
          )}
        </div>

        {/* Logout Icon */}
        {localStorage.getItem('token') && (
          <div className="logout-icon-container" onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
