import React from 'react';
import './ProductAdmin.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';

const ProductAdmin = () => {
  return (
    <Layout>
      <div className="product-admin-page">
        <div className="sidebar">
          <h3>Menu</h3>
          <ul>
            <li>
              <Link to="/deliveryList" className="sidebar-link">Delivery List</Link>
            </li>
            <li>
              <Link to="/approveComments" className="sidebar-link">Approve/Disapprove Comments</Link>
            </li>
            <li>
              <Link to="/productManagement" className="sidebar-link">Add/Remove Products or Categories</Link>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <h2>Product Manager Admin Panel</h2>
          <p>Select an option from the menu to manage the system.</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductAdmin;
