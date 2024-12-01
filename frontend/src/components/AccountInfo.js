// src/components/AccountInfo.js

import React, { useState } from 'react';
import './AccountInfo.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';

const AccountInfo = () => {
  // Initial mock user data; in a real application, fetch this from an API or context
  const initialUser = {
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1 (555) 987-6543',
    email: 'jane.smith@example.com',
  };

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'success', 'error'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSave = (e) => {
    e.preventDefault();

    // Here, you would typically send the updated user data to your backend API
    // For demonstration, we'll mock the save operation with a timeout

    // Reset save status
    setSaveStatus(null);

    // Simulate API call
    setTimeout(() => {
      // Mock success response
      const isSuccess = true;

      if (isSuccess) {
        setSaveStatus('success');
        setIsEditing(false);
        // In a real app, you might update the global state or refetch user data
      } else {
        setSaveStatus('error');
      }
    }, 1000);
  };

  return (
    <Layout>
      <div className="account-info-page">
        <div className="sidebar">
          <h3>Menu</h3>
          <ul>
          <li><Link to="/account" className="sidebar-link">Account Info</Link></li>
        <li><Link to="/order" className="sidebar-link">Order History</Link></li>
          </ul>
        </div>
        <div className="main-content">
          <h2>Account Information</h2>
          <form className="account-details" onSubmit={handleSave}>
            <div className="detail-item">
              <label htmlFor="firstName" className="label">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="detail-item">
              <label htmlFor="lastName" className="label">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="detail-item">
              <label htmlFor="phone" className="label">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                required
                pattern="^\+?[0-9\s\-()]{7,}$"
                title="Please enter a valid phone number."
              />
            </div>
            <div className="detail-item">
              <label htmlFor="email" className="label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="save-button">Save Changes</button>
            {saveStatus === 'success' && <p className="success-message">Changes saved successfully!</p>}
            {saveStatus === 'error' && <p className="error-message">Failed to save changes. Please try again.</p>}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AccountInfo;
