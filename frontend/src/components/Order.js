// src/components/Order.js

import React, { useState } from 'react';
import './Order.css';
import Layout from './Layout';

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
      {
        id: 'PROD4',
        name: 'Gaming Mouse',
        quantity: 1,
        price: 30.0,
        image: 'https://via.placeholder.com/300x300',
      },
      {
        id: 'PROD5',
        name: 'Mechanical Keyboard',
        quantity: 1,
        price: 70.0,
        image: 'https://via.placeholder.com/300x300',
      },
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
    status: 'in-transit',
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

  return (

    <div className="order-card">
      <div className="order-summary" onClick={toggleProducts}>
        <div className="order-info">
          <div>
            <span className="label">Order ID:</span> {order.id}
          </div>
          <div>
            <span className="label">Date:</span> {formattedDate}
          </div>
          <div>
            <span className="label">Status:</span>{' '}
            <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
          </div>
          <div>
            <span className="label">Total:</span> ${order.total.toFixed(2)}
          </div>
        </div>
        <div className="toggle-icon">
          {showProducts ? (
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
          ) : (
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
          )}
        </div>
      </div>
      {showProducts && (
        <div className="products-list">
          {order.products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main OrdersPage component
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
        {/* Orders Container */}
        <div className="orders-container">
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
