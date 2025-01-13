// src/components/Comments.js

import React, { useState, useEffect } from 'react';
import './Comments.css';
import Layout from './Layout';
import axios from 'axios';

// Comment Card Component
const CommentCard = ({ comment, onApprove, onDecline }) => {
  return (
    <div className="comment-card">
      <div className="comment-summary">
        <div className="comment-info-grid">
          <div className="comment-info-item">
            <span className="info-label">Product Name</span>
            <span className="info-data">{comment.productName || 'N/A'}</span>
          </div>
          <div className="comment-info-item">
            <span className="info-label">User</span>
            <span className="info-data">{comment.user?.firstName || 'Anonymous'}</span>
          </div>
          <div className="comment-info-item">
            <span className="info-label">Rating</span>
            <span className="info-data">{comment.rating || 'N/A'}</span>
          </div>
          <div className="comment-info-item">
            <span className="info-label">Comment</span>
            <span className="info-data">{comment.comment || 'N/A'}</span>
          </div>
        </div>

        <div className="comment-actions">
          <button
            className="approve-button"
            onClick={() => onApprove(comment.productId, comment.commentId)} // commentId kullanımı
          >
            Approve
          </button>
          <button
            className="decline-button"
            onClick={() => onDecline(comment.productId, comment.commentId)} // commentId kullanımı
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};


// Main Comments Page Component
const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews/waiting');
        setComments(response.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleApprove = async (productId, commentId) => {
    console.log(`Approving productId: ${productId}, commentId: ${commentId}`);
    try {
      await axios.post('http://localhost:5000/api/reviews/approve', {
        productId,
        ratingId: commentId,
      });
      alert('Comment approved successfully');
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      ); // Remove approved comment from the list
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Failed to approve comment');
    }
  };
  
  const handleDecline = async (productId, commentId) => {
    console.log(`Declining productId: ${productId}, commentId: ${commentId}`);
    try {
      await axios.post('http://localhost:5000/api/reviews/decline', {
        productId,
        ratingId: commentId,
      });
      alert('Comment declined successfully');
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      ); // Remove declined comment from the list
    } catch (error) {
      console.error('Error declining comment:', error);
      alert('Failed to decline comment');
    }
  };

  if (loading) return <p>Loading comments...</p>;

  return (
    <Layout>
      <div className="comments-page">
        <h2>Comments Management</h2>
        <div className="comments-container">
          {comments.length === 0 ? (
            <p className="no-comments">No waiting comments found.</p>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment._id || Math.random()}
                comment={comment}
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

export default Comments;
