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
const DeliveryItem = ({ product, order, onUpdateDeliveryStatus }) => {
  const [deliveryStatus, setDeliveryStatus] = useState(product.delivery_status);

  const handleUpdateDeliveryStatus = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${order._id}/products/${product.product._id}/${deliveryStatus.toLowerCase()}`
      );
      if (response.status === 200) {
        onUpdateDeliveryStatus(product.product._id, deliveryStatus);
      } else {
        console.error('Failed to update delivery status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  return (
    <div className="delivery-item">
      <div className="delivery-details">
        <p><strong>Product ID:</strong> {product.product._id}</p>
        <p><strong>Product Name:</strong> {product.product.name}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Total Price:</strong> ${product.price.toFixed(2)*product.quantity}</p>
        <p><strong>Delivery Address:</strong> {order.address}</p>
        <p className="status-container">
          <strong>Delivery_Status:</strong>
          <input
            className="status-input"
            type="text"
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
          />
          <button className="status-button" onClick={handleUpdateDeliveryStatus}>Change</button>
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
const DeliveryCard = ({ order, onUpdateOrderStatus, onUpdateDeliveryStatus }) => {
  const [orderStatus, setOrderStatus] = useState(order.status);

  const handleUpdateOrderStatus = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderStatus.toLowerCase()}/${order._id}`
      );
      if (response.status === 200) {
        onUpdateOrderStatus(order._id, orderStatus);
      } else {
        console.error('Failed to update order status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="delivery-card">
      <div className="delivery-header">
        <h3>Order ID: {order._id}</h3>
        <button
          className="view-invoice-button"
          onClick={() => handleViewInvoice(order.user._id, order._id)}
        >
          View Invoice
        </button>
      </div>
      <div className="order-status status-container">
        <strong>Order_Status:</strong>
        <input
          className="status-input"
          type="text"
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
        />
        <button className="status-button" onClick={handleUpdateOrderStatus}>Change</button>
      </div>
      <div className="delivery-list">
        {order.products.map((product, index) => (
          <DeliveryItem key={index} product={product} order={order} onUpdateDeliveryStatus={onUpdateDeliveryStatus} />
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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const updateDeliveryStatus = (productId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => ({
        ...order,
        products: order.products.map((product) =>
          product.product._id === productId
            ? { ...product, delivery_status: newStatus }
            : product
        ),
      }))
    );
  };

  if (loading) return <p>Loading deliveries...</p>;

  return (
    <Layout>
      <div className="delivery-list-page">
        <h2>Delivery List</h2>
        {orders.length === 0 ? (
          <p>No deliveries found.</p>
        ) : (
          orders.map((order) => (
            <DeliveryCard key={order._id} order={order} onUpdateOrderStatus={updateOrderStatus} onUpdateDeliveryStatus={updateDeliveryStatus} />
          ))
        )}
      </div>
    </Layout>
  );
};

export default DeliveryListPage;