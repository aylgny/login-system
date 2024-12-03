import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";
import Layout from './Layout';

const ProductPage = () => {
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userMap, setUserMap] = useState({}); // Map for storing user info


  // New states for review
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch product details from the backend
    const fetchProduct = async () => {
      
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data); // Set the product data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Run the effect when productId changes

  useEffect(() => {
    // Fetch user details for each review
    const fetchUserDetails = async () => {
      if (!product || product.ratings.length === 0) return;

      const userIds = product.ratings.map((rating) => rating.user);
      const uniqueUserIds = [...new Set(userIds)];

      try {
        const userResponses = await Promise.all(
          uniqueUserIds.map((userId) =>
            axios.get(`http://localhost:5000/api/user/${userId}`)
          )
        );

        const userDetails = userResponses.reduce((acc, response) => {
          const user = response.data;
          acc[user._id] = `${user.firstName} ${user.lastName}`;
          return acc;
        }, {});

        setUserMap(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [product]);



  const handleAddToCart = async () => {
    let userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  
    if (!userId) {
      userId = "674cdb83a58ccb372bf49485";
    }
    //alert("674cdb83a58ccb372bf49485");
    try {
      // Send the POST request to add the product to the user's cart
      const response = await axios.post("http://localhost:5000/api/cart", {
      userId: userId,
      productId: product._id,
      quantity: 1, // Default quantity to add
    });
  
      alert(response.data.message || "Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
  
      // Use alert to show server-side messages or default message
      alert(
        error.response?.data?.message ||
        `Error occurred while adding to cart. Please check the console.`
      );
    }
  };

  // New handler for submitting a review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      alert("Please log in to submit a review.");
      return;
    }

    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    if (comment.trim() === "") {
      alert("Please enter a comment.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        {
          userId: userId,
          rating: rating,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product's ratings
      setProduct((prevProduct) => ({
        ...prevProduct,
        ratings: [...prevProduct.ratings, response.data.review],
      }));

      // Reset form fields
      setRating(0);
      setHoverRating(null);
      setComment("");

      alert("Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while submitting your review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <div className="product-page">
        <div className="product-details">
          <img src={product.photo} alt={product.name} className="product-image" />
          <div className="product-info">
            <h1>{product.name}</h1>
            {product.model && (
              <>
                <p className="product-model">Model: {product.model}</p>
                <br />
              </>
            )}
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            <h2>${product.price.toFixed(2)}</h2>

            {/* Stock Information */}
            <p className="product-stock">
              {product.quantity > 0 ? (
                <span className="in-stock">In Stock ({product.quantity} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </p>

            {/* Warranty and Distributor */}
            {product.warrantyStatus && <p className="product-warranty">Warranty Available</p>}
            <p className="product-distributor">Distributor: {product.distributor}</p>

            {/* Add to Cart Button */}
            <button
              className={`add-to-cart-button ${product.quantity === 0 ? "disabled" : ""}`}
              disabled={product.quantity === 0}
              onClick={handleAddToCart}
            >
              {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Ratings and Reviews Section */}
        {/* Ratings and Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.ratings.length > 0 ? (
            product.ratings
              .filter((rating) => rating.approved === "true" || rating.approved === true) // Filter approved reviews
              .map((rating, index) => (
                <div key={index} className="review-item">
                  <p className="review-rating">⭐ {rating.rating}/5</p>
                  <p className="review-comment">{rating.comment}</p>
                  <p className="review-user">
                     {userMap[rating.user] || "Anonymous User"}
                  </p>
                </div>
              ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>


          


        {/* Add Review Section */}
        {/* <div className="reviews-section">
          <h2>Add a Review</h2>
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              
              className="review-textarea"
              rows="6" // Increased from default
              cols="60" // Adjust as needed
            ></textarea>
            <button type="submit" className="submit-review-button" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div> */}
      </div>
    </Layout>
  );
};

export default ProductPage;
