// src/components/Order.js

import React, { useState } from 'react';
import './Order.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';

// Mock orders data
const orders = [
  {
    id: 'ORD123456',
    date: '2024-04-25',
    status: 'Processing',
    total: 150.0,
    products: [
      {
        id: 'PROD1',
        name: 'Wireless Headphones',
        quantity: 2,
        price: 50.0,
        image: 'https://cdn.akakce.com/anker/anker-powercore-26800-mah-tasinabilir-sarj-cihazi-z.jpg',
      },
      {
        id: 'PROD2',
        name: 'Bluetooth Speaker',
        quantity: 1,
        price: 50.0,
        image: 'https://via.placeholder.com/300x300',
      },
      // Add more products as needed
    ],
  },
  {
    id: 'ORD123457',
    date: '2024-04-20',
    status: 'Delivered',
    total: 80.0,
    products: [
      {
        id: 'PROD3',
        name: 'Smart Watch',
        quantity: 1,
        price: 80.0,
        image: 'https://via.placeholder.com/300x300',
      },
    ],
  },
  {
    id: 'ORD12345512327',
    date: '2024-04-20',
    status: 'In-Transit',
    total: 80.0,
    products: [
      {
        id: 'PROD322',
        name: 'Smart Watch',
        quantity: 1,
        price: 80.0,
        image: 'https://via.placeholder.com/300x300',
      },
    ],
  },
  // Add more orders as needed
];

// Component to display individual product details
const ProductItem = ({ product }) => {
  return (
    <div className="product-item">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-details">
        <h4 className="product-name">{product.name}</h4>
        <p>Quantity: {product.quantity}</p>
        <p>Price: ${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

// Component to display individual order summary and products
const OrderCard = ({ order }) => {
  const [showProducts, setShowProducts] = useState(false);

  const toggleProducts = () => {
    setShowProducts((prev) => !prev);
  };

  // Format date
  const formattedDate = new Date(order.date).toLocaleDateString();

  // Determine status color
  const statusColors = {
    processing: '#FFC107', // Yellow
    delivered: '#28A745',  // Green
    'in-transit': '#17A2B8', // Teal
  };

  const statusClass = order.status.toLowerCase().replace(' ', '-');

  return (
    <div className="order-card">
      <div className="order-summary" onClick={toggleProducts}>
        <div className="order-info-grid">
          <div className="order-info-item">
            <span className="info-label">Order ID</span>
            <span className="info-data">{order.id}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Date</span>
            <span className="info-data">{formattedDate}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Status</span>
            <span className={`status ${statusClass}`}>{order.status}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Total</span>
            <span className="info-data">${order.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="toggle-icon">
          {showProducts ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-up"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-down"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>
      
    </div>
  );
};

// Main OrdersPage component {showProducts && (
    //     <div className="products-list">
    //     {order.products.map((product) => (
    //       <ProductItem key={product.id} product={product} />
    //     ))}
    //   </div>
    // )}
const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="orders-page">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Menu</h3>
          <ul>
            <li>
              <Link to="/account" className="sidebar-link">
                Account Info
              </Link>
            </li>
            <li>
              <Link to="/order" className="sidebar-link">
                Order History
              </Link>
            </li>
            {/* Add more sidebar links as needed */}
          </ul>
        </div>

        {/* Orders Container */}
        <div className="orders-container">
          <h2>Order History</h2>
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search orders by ID or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredOrders.length === 0 ? (
            <p className="no-orders">No orders found.</p>
          ) : (
            filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
