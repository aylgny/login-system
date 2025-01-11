// src/components/OrdersPage.js

import React, { useState, useEffect } from 'react';
import './OrderAdmin.css';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

import axios from 'axios';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

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

const ProductItem = ({ product, onClick }) => {
  const imageUrl = `${product.photo}`;
  // Fallback image URL
  const fallbackImage = 'https://via.placeholder.com/150'; // Replace with your fallback image URL

  return (
    <div className="product-item-a" onClick={() => onClick(product)}>
      {/* Display the product image with fallback */}
      <img
        src={imageUrl}
        alt={product.name}
        className="product-image"
        onError={(e) => {
          e.target.src = fallbackImage;
        }}
      />
      <div className="product-details">
        <h4 className="product-name">{product.name}</h4>
        <p>Quantity: {product.quantity}</p>
        {/* Updated to display the purchase price */}
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>Product Id: {product._id}</p>
      </div>
    </div>
  );
};
const handleViewInvoice = async (userID, orderID) => {
  try {
    const response = await axios.post('http://localhost:5000/api/create-invoice', {
      userID,
      orderID
    });

    if (response.status === 200) {
      const { filePath } = response.data;
      const fileUrl = `${process.env.PUBLIC_URL}/invoices/${filePath}`; // Path to the PDF
      window.open(fileUrl, '_blank'); // Open PDF in a new tab
    } else {
      console.error('Invoice could not be created:', response.data.message);
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
  }
};

const handleDownloadInvoice = async (userID, orderID) => {
  try {
    const response = await axios.post('http://localhost:5000/api/create-invoice', {
      userID,
      orderID
    });

    if (response.status === 200) {
      const { filePath } = response.data;
      const fileUrl = `${process.env.PUBLIC_URL}/invoices/${filePath}`; // Path to the PDF
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `invoice_${orderID}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('Invoice could not be created:', response.data.message);
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
  }
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

  return (
    <div className="order-card">
      <div className="order-summary" onClick={toggleProducts}>
        <div className="order-info-grid">
          <div className="order-info-item">
            <span className="info-label">Order ID</span>
            <span className="info-data">{order._id}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Customer ID</span>
            <span className="info-data">{order.user._id}</span>
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
            {/* Updated to calculate total using the purchase price */}
            <span className="info-data">
              $
              {order.products
                .reduce((total, p) => total + p.price * p.quantity, 0)
                .toFixed(2)}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="invoice-buttons">
        <button
          className="view-invoice-button"
          onClick={() => handleViewInvoice(order.user._id, order._id)}
        >
          View Invoice
        </button>
        <button
          className="download-invoice-button"
          onClick={() => handleDownloadInvoice(order.user._id, order._id)}
        >
          Download Invoice
        </button>
      </div>

      {showProducts && (
        <div className="products-list">
          {order.products.map((item) => (
            <ProductItem
              key={item.product._id}
              product={{
                ...item.product,
                price: item.price, // Pass the purchase price from the order schema
                quantity: item.quantity,
              }}
              onClick={() => onProductClick(item.product, order.status)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main OrdersPage component
const OrdersPageAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [profitLossData, setProfitLossData] = useState([]); // Initialize as an empty array
  const [revenueData, setRevenueData] = useState([]); // Initialize revenue data as an empty array
  const [showProfitLossChart, setShowProfitLossChart] = useState(false); // Separate state for Profit/Loss chart
  const [showRevenueChart, setShowRevenueChart] = useState(false); // Separate state for Revenue chart
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
        const response = await axios.get(`http://localhost:5000/api/ordersAdmin`);
        setOrders(response.data);
        setFilteredOrders(response.data); // Set initial filtered orders to all orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const filterOrdersByDate = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.purchaseDate);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    setFilteredOrders(filtered);
    calculateProfitLoss(filtered);
    calculateRevenue(filtered);
  };

  const calculateProfitLoss = async (orders) => {
    const dailyProfitLoss = {};

    for (const order of orders) {
      const orderDate = new Date(order.purchaseDate).toLocaleDateString();

      if (!dailyProfitLoss[orderDate]) {
        dailyProfitLoss[orderDate] = 0;
      }

      for (const product of order.products) {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${product.product._id}`);
          const actualProduct = response.data;

          const sellingPrice = product.price;
          const costPrice = (2 / 3) * actualProduct.price;
          const quantity = product.quantity;
          const profitOrLoss = (sellingPrice - costPrice) * quantity;

          dailyProfitLoss[orderDate] += profitOrLoss;
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    }

    const profitLossArray = Object.keys(dailyProfitLoss).map((date) => ({
      date,
      profitOrLoss: dailyProfitLoss[date]
    }));

    setProfitLossData(profitLossArray);
  };

  const calculateRevenue = (orders) => {
    const dailyRevenue = {};

    for (const order of orders) {
      const orderDate = new Date(order.purchaseDate).toLocaleDateString();

      if (!dailyRevenue[orderDate]) {
        dailyRevenue[orderDate] = 0;
      }

      const orderTotal = order.products.reduce((total, p) => total + p.product.price * p.quantity, 0);
      dailyRevenue[orderDate] += orderTotal;
    }

    const revenueArray = Object.keys(dailyRevenue).map((date) => ({
      date,
      revenue: dailyRevenue[date]
    }));

    setRevenueData(revenueArray);
  };

  if (loading) return <p>Loading orders...</p>;

  const profitLossChartData = {
    labels: profitLossData.map(item => item.date),
    datasets: [
      {
        label: 'Daily Profit/Loss',
        data: profitLossData.map(item => item.profitOrLoss),
        backgroundColor: profitLossData.map(item => item.profitOrLoss >= 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'),
        borderColor: profitLossData.map(item => item.profitOrLoss >= 0 ? 'rgba(76, 175, 80, 1)' : 'rgba(244, 67, 54, 1)'),
        borderWidth: 1,
        fill: true,
      }
    ]
  };

  const revenueChartData = {
    labels: revenueData.map(item => item.date),
    datasets: [
      {
        label: 'Daily Revenue',
        data: revenueData.map(item => item.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

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

  return (
    <Layout>
      <div className="orders-page">
        <h2>Order History</h2>
        <div className="orders-header">
          <div className="date-filter">
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <button onClick={filterOrdersByDate}>Filter</button>
            <button onClick={() => setShowProfitLossChart(true)} className="view-chart-button">
              View Loss-Profit Chart
            </button>
            <button onClick={() => setShowRevenueChart(true)} className="view-chart-button">
              View Revenue Chart
            </button>
          </div>
          {/* Search Bar */}
          {/*<div className="search-bar">
            <input
              type="text"
              placeholder="Search orders by ID or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>*/}
        </div>

        {/* Orders Container */}
        <div className="orders-container">
          
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
                
                {/* Add more product details as needed */}
                <Link to={`/product/${selectedProduct._id}`} className="modal-view-link" onClick={handleCloseModal}>
                  View Product Page
                </Link>
              </div>
            </div>
          </Modal>
        )}

        {showProfitLossChart && (
          <Modal show={showProfitLossChart} onClose={() => setShowProfitLossChart(false)}>
            <h3>Profit/Loss Analysis</h3>
            <Line data={profitLossChartData} options={chartOptions} />
          </Modal>
        )}

        {showRevenueChart && (
          <Modal show={showRevenueChart} onClose={() => setShowRevenueChart(false)}>
            <h3>Revenue Analysis</h3>
            <Line data={revenueChartData} options={chartOptions} />
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPageAdmin;