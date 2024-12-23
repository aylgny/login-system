// src/components/Header/Header.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // Import the corresponding CSS

// Import Icons (ensure these paths are correct based on your project structure)
import shoppingIcon from "../assets/icons/shopping.png";
import userIcon from "../assets/icons/account.png";
import logoutIcon from "../assets/icons/logout.png";
import { ReactComponent as EcommerceLogo } from "../assets/icons/EcommerceLogo.svg";
import GearTechLogo from '../assets/icons/geartech.png';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleAccountClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.clear();
    // Redirect to login page
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="main-header">
      {/* Clickable Logo */}
      <Link to="/mainpage" className="logo-link">
        
        <img src ={GearTechLogo} alt="GearTech Logo" className="geartech-logo" />
      </Link>



      {/* Icon Group */}
      <div className="icon-group">
        {/* Cart Icon */}
        <div className="cart-icon">
          <Link to="/cart">
            <img src={shoppingIcon} alt="Cart" />
          </Link>
        </div>

        <div className="wishlist-icon">
          <Link to="/wishlist">
            <img src={require("../assets/icons/wishlist.png")} alt="Wishlist" />
          </Link>
        </div>

        {/* Account Icon */}
        <div
          className="user-icon-container"
          onClick={handleAccountClick}
          ref={dropdownRef}
        >
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
        {localStorage.getItem("token") && (
          <div className="logout-icon-container" onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;