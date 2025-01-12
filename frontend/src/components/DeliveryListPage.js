import React, { useState, useEffect } from 'react';
import './DeliveryListPage.css';
import Layout from './Layout';
import axios from 'axios';

// Modal Component
const Modal = ({ show, onClose, children }) => {
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

// Component to display individual product details
const DeliveryItem = ({ product, order }) => {
  return (
    <div className="delivery-item">
      <div className="delivery-details">
        <p><strong>Product ID:</strong> {product.product._id}</p>
        <p><strong>Product Name:</strong> {product.product.name}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Total Price:</strong> ${product.price.toFixed(2) * product.quantity}</p>
        <p><strong>Delivery Address:</strong> {order.address}</p>
        <p>
          <strong>Delivery Status:</strong>
          <span className={`delivery-status ${product.delivery_status}`}>
            {product.delivery_status}
          </span>
        </p>
      </div>
    </div>
  );
};

const handleViewInvoice = async (userId, orderId) => {
  try {
    const response = await axios.post('http://localhost:5000/api/create-invoice', {
      userID: userId,
      orderID: orderId,
    });

    if (response.status === 200) {
      const { filePath } = response.data;
      const fileUrl = `${process.env.PUBLIC_URL}/invoices/${filePath}`;
      window.open(fileUrl, '_blank');
    } else {
      console.error('Invoice could not be created:', response.data.message);
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
  }
};

// Component to display each delivery group (per order)
const DeliveryCard = ({ order }) => {
  return (
    <div className="delivery-card">
      <div className="delivery-header">
        <h3>
          Order ID: {order._id}
          <span className={`order-status ${order.status}`}>
            {order.status}
          </span>
        </h3>
        <button
          className="view-invoice-button"
          onClick={() => handleViewInvoice(order.user._id, order._id)}
        >
          View Invoice
        </button>
      </div>
      <div className="delivery-list">
        {order.products.map((product, index) => (
          <DeliveryItem key={index} product={product} order={order} />
        ))}
      </div>
    </div>
  );
};

const DeliveryListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ordersAdmin');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading deliveries...</p>;

  return (
    <Layout>
      <div className="delivery-list-page">
        <h2>Delivery List</h2>
        {orders.length === 0 ? (
          <p>No deliveries found.</p>
        ) : (
          orders.map((order) => (
            <DeliveryCard key={order._id} order={order} />
          ))
        )}
      </div>
    </Layout>
  );
};

export default DeliveryListPage;