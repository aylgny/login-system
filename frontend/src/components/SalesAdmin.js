import React from 'react';
import './SalesAdmin.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <Layout>
      <div className="admin-page">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Menu</h3>
          <ul>
            <li>
              <Link to="/ProductUpdate" className="sidebar-link">Set Discount</Link>
            </li>
            <li>
              <Link to="/RefundRequests" className="sidebar-link">Refund Requests</Link>
            </li>
            <li>
              <Link to="/OrderAdmin" className="sidebar-link">Orders</Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2>Admin Panel</h2>
          <p>Welcome to the admin panel. Use the menu on the left to manage the platform.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
