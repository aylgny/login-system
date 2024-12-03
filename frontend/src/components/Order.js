// src/components/OrdersPage.js

import React, { useState, useEffect } from 'react';
import './Order.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Modal Component
const Modal = ({ show, onClose, children }) => {
  // Close modal on 'Esc' key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (show) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            aria-label={`${index} Star`}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

// Component to display individual product details
const ProductItem = ({ product, onClick }) => {
  const imageUrl = `${product.photo}`;
  // Fallback image URL
  const fallbackImage = 'https://via.placeholder.com/150'; // Replace with your fallback image URL

  return (
    <div className="product-item" onClick={() => onClick(product)}>
      {/* Display the product image with fallback */}
      <img
        src={imageUrl}
        alt={product.name}
        className="product-image"
        onError={(e) => { e.target.src = fallbackImage; }}
      />
      <div className="product-details">
        <h4 className="product-name">{product.name}</h4>
        <p>Quantity: {product.quantity}</p>
        <p>Price: ${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

// Component to display individual order summary and products
const OrderCard = ({ order, onProductClick }) => {
  const [showProducts, setShowProducts] = useState(false);

  const toggleProducts = () => {
    setShowProducts((prev) => !prev);
  };

  // Format date
  const formattedDate = new Date(order.purchaseDate).toLocaleDateString();

  // Determine status color
  const statusClass = order.status.toLowerCase().replace(' ', '-');

  // Function to group products into rows of 3 and 4 alternately
  const groupProducts = (products) => {
    const rows = [];
    let index = 0;
    let toggle = true; // true for 3, false for 4

    while (index < products.length) {
      const count = toggle ? 3 : 4;
      rows.push(products.slice(index, index + count));
      index += count;
      toggle = !toggle;
    }

    return rows;
  };

  const productRows = groupProducts(order.products);

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
          {productRows.map((row, rowIndex) => (
            <div className="products-row" key={rowIndex}>
              {row.map((item) => (
                <ProductItem
                  key={item.product._id}
                  product={{ ...item.product, quantity: item.quantity }}
                  onClick={() => onProductClick(item.product, order.status)} // Pass both product and order.status
                />
              ))}
            </div>
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null); // New state variable
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Handler to open modal with product details
  const handleProductClick = (product, orderStatus) => { // Receive both product and orderStatus
    setSelectedProduct(product);
    setSelectedOrderStatus(orderStatus); // Set the order status
    setRating(0);
    setComment('');
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedOrderStatus(null);
    setRating(0);
    setComment('');
  };

  // Handler to submit comment and rating
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating before submitting your comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Send POST request to the backend to submit the review
      const response = await axios.post(`http://localhost:5000/api/products/${selectedProduct._id}/reviews`, {
        userId,
        rating,
        comment,
      });

      if (response.status === 200) {
        // alert('Your review has been submitted successfully!');
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(error.response.data.message || 'There was an error submitting your review.');
      } else {
        // Network error or other issues
        alert('There was an error submitting your review. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} onProductClick={handleProductClick} />
            ))
          )}
        </div>

        {/* Modal for Product Details */}
        {selectedProduct && (
          <Modal show={!!selectedProduct} onClose={handleCloseModal}>
            <div className="modal-product-details">
              <img
                src={selectedProduct.photo}
                alt={selectedProduct.name}
                className="modal-product-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
              />
              <div className="modal-product-info">
                <h2>{selectedProduct.name}</h2>
                {selectedOrderStatus === 'delivered' ? (
  <p><strong>Description:</strong> {selectedProduct.description || 'No description available.'}</p>
) : (
  <p>You cannot write a review before delivery.</p>
)}
                {/* Add more product details as needed */}
                <Link to={`/product/${selectedProduct._id}`} className="modal-view-link" onClick={handleCloseModal}>
                  View Product Page
                </Link>
              </div>
            </div>

            {/* Divider */}
            <hr className="modal-divider" />

            {/* Review Section */}
            <div className="modal-review-section">
              <h3>Leave a Review</h3>
              <form onSubmit={handleSubmit} className="review-form">
                {/* Star Rating Input */}
                <div className="form-group">
                  <label htmlFor="rating"><strong>Rating:</strong></label>
                  <StarRating rating={rating} setRating={setRating} />
                </div>

                {/* Comment Area */}
                <div className="form-group">
                  <label htmlFor="comment"><strong>Comment:</strong></label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="form-group">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={selectedOrderStatus !== 'delivered' || isSubmitting} // Disable based on order status
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
