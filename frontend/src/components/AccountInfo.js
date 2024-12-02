import React, { useState, useEffect } from 'react';
import './AccountInfo.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AccountInfo = () => {
  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
  const [user, setUser] = useState(null); // State for user data
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'success', 'error'

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUser(response.data); // Initialize user state with fetched data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
        }); // Initialize with empty fields if there's an error
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus(null); // Reset save status

    try {
      const response = await axios.put(`http://localhost:5000/api/user/${userId}`, user);
      if (response.status === 200) {
        setSaveStatus('success');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      setSaveStatus('error');
    }
  };

  // Show a loading state while data is being fetched
  if (!user) {
    return <p>Loading user data...</p>;
  }

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
            <div className="detail-item">
              <label htmlFor="firstName" className="label">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user.firstName}
                readOnly
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
                readOnly

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
                readOnly
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
                readOnly
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountInfo;
