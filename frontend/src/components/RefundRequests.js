// src/components/RefundRequests.js

import React, { useState, useEffect } from 'react';
import './RefundRequests.css';
import Layout from './Layout';
import axios from 'axios';

// Refund Request Card Component
const RefundCard = ({ refund, onApprove, onDecline }) => {
  const formattedDate = refund?.order?.purchaseDate
    ? new Date(refund.order.purchaseDate).toLocaleDateString()
    : 'N/A';

  return (
    <div className="refund-card">
      <div className="refund-summary">
        <div className="refund-info-grid">
          <div className="refund-info-item">
            <span className="info-label">Refund ID</span>
            <span className="info-data">{refund._id || 'N/A'}</span>
          </div>
          <div className="refund-info-item">
            <span className="info-label">Order ID</span>
            <span className="info-data">{refund?.order?._id || 'N/A'}</span>
          </div>
          <div className="refund-info-item">
            <span className="info-label">Customer ID</span>
            <span className="info-data">{refund?.user || 'N/A'}</span>
          </div>
          <div className="refund-info-item">
            <span className="info-label">Status</span>
            <span className={`status ${refund?.refund_status?.toLowerCase() || 'unknown'}`}>
              {refund?.refund_status || 'Unknown'}
            </span>
          </div>
          <div className="refund-info-item">
            <span className="info-label">Date</span>
            <span className="info-data">{formattedDate}</span>
          </div>
        </div>

        <div className="refund-actions">
          <button
            className="approve-button"
            onClick={() => onApprove(refund._id)}
            disabled={refund?.refund_status !== 'Pending'}
          >
            Approve
          </button>
          <button
            className="decline-button"
            onClick={() => onDecline(refund._id)}
            disabled={refund?.refund_status !== 'Pending'}
          >
            Decline
          </button>
        </div>
      </div>

      <div className="products-list">
        {refund?.products?.map((product) => (
          <div key={product?.product?._id || Math.random()} className="product-item">
            <div className="product-details">
              <h4 className="product-name">{product?.product?.name || 'N/A'}</h4>
              <p>Price: ${product?.product?.price?.toFixed(2) || 'N/A'}</p>
              <p>Quantity: {product?.quantity || 'N/A'}</p>
            </div>
          </div>
        )) || <p>No products available</p>}
      </div>
    </div>
  );
};

// Main Refund Requests Page Component
const RefundRequests = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/refunds');
        setRefunds(response.data.refunds || []);
      } catch (error) {
        console.error('Error fetching refunds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  const handleApprove = async (refundId) => {
    try {
      await axios.put(`http://localhost:5000/api/refunds/approve/${refundId}`);
      alert('Refund approved successfully');
      setRefunds((prev) =>
        prev.map((refund) =>
          refund._id === refundId
            ? { ...refund, refund_status: 'Approved' }
            : refund
        )
      );
    } catch (error) {
      console.error('Error approving refund:', error);
      alert('Failed to approve refund');
    }
  };

  const handleDecline = async (refundId) => {
    try {
      await axios.put(`http://localhost:5000/api/refunds/decline/${refundId}`);
      alert('Refund declined successfully');
      setRefunds((prev) =>
        prev.map((refund) =>
          refund._id === refundId
            ? { ...refund, refund_status: 'Declined' }
            : refund
        )
      );
    } catch (error) {
      console.error('Error declining refund:', error);
      alert('Failed to decline refund');
    }
  };

  if (loading) return <p>Loading refund requests...</p>;

  return (
    <Layout>
      <div className="refunds-page">
        <h2>Refund Requests</h2>
        <div className="refunds-container">
          {refunds.length === 0 ? (
            <p className="no-refunds">No refund requests found.</p>
          ) : (
            refunds.map((refund) => (
              <RefundCard
                key={refund?._id || Math.random()}
                refund={refund}
                onApprove={handleApprove}
                onDecline={handleDecline}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RefundRequests;
