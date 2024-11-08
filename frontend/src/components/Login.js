// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        // Send POST request to the backend
        const response = await axios.post('http://localhost:5000/login', { email, password });
        
        if (response && response.data) { // Check if response and response.data exist
            console.log(response.data); // You can handle the token or user data here
            alert('Login successful');
            window.location.href = "/mainpage";
            // Save token or handle successful login logic here
        } else {
            throw new Error("Unexpected response structure"); // Handle unexpected response
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert(error.response?.data?.message || "Login failed");
    }

};
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Login to continue to Tech Store</p>
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
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="footer">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
