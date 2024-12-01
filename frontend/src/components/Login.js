// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // New state for error messages

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message before attempting login
    try {
      // Send POST request to the backend
      const response = await axios.post('http://localhost:5000/login', { email, password });

      if (response && response.data) { // Check if response and response.data exist
        //console.log(response.data); // Optional: Debug the response
        const { token, user } = response.data; // Extract token and user object

        // Save the token and userId in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id); // Save the user ID in localStorage

        // Redirect the user to the main page
        window.location.href = "/mainpage";
      } else {
        throw new Error("Unexpected response structure"); // Handle unexpected response
      }
    } catch (error) {
      console.error('Error logging in:', error);
      
      // Determine the error message to display
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Backend provided error message
      } else if (error.message) {
        setErrorMessage(error.message); // General error message
      } else {
        setErrorMessage("Login failed. Please try again."); // Fallback message
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Login to continue to Tech Store</p>
        
        {/* Display the error message if it exists */}
        {errorMessage && (
          <div className="error-message" style={{ color: 'red', fontSize: '0.8em', marginBottom: '10px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="login-button"
            style={{ background: 'blue', color: 'white', width: '100px', height: '50px' }}
          >
            Login
          </button>
        </form>
        <div className="footer">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
