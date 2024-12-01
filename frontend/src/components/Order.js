import React, { useState, useEffect } from 'react';
import './Order.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Component to display individual product details
const ProductItem = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} key={product._id} className="product-item-link">
      <div className="product-item">
        {/* Display the product image */}
        <img src={product.photo} alt={product.name}className="product-image"/>
        <div className="product-details">
          <h4 className="product-name">{product.name}</h4>
          <p>Quantity: {product.quantity}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
};

// Component to display individual order summary and products
const OrderCard = ({ order }) => {
  const [showProducts, setShowProducts] = useState(false);

  const toggleProducts = () => {
    setShowProducts((prev) => !prev);
  };

  // Format date
  const formattedDate = new Date(order.purchaseDate).toLocaleDateString();

  // Determine status color
  const statusClass = order.status.toLowerCase().replace(' ', '-');

  return (
    <div className="order-card">
      <div className="order-summary" onClick={toggleProducts}>
        <div className="order-info-grid">
          <div className="order-info-item">
            <span className="info-label">Order ID</span>
            <span className="info-data">{order._id}</span>
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
            <span className="info-data">
              ${order.products.reduce((total, p) => total + p.product.price * p.quantity, 0).toFixed(2)}
            </span>
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
      {showProducts && (
        <div className="products-list">
          {order.products.map((item) => (
            <ProductItem key={item.product._id} product={{ ...item.product, quantity: item.quantity }} />
          ))}
        </div>
      )}
    </div>
  );
};

// Main OrdersPage component
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading orders...</p>;

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
            filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
