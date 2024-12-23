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
  const [isWishlisted, setIsWishlisted] = useState(false); // Wishlist status

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
    // Check if the product is in the wishlist
    const checkWishlistStatus = async () => {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = "674cdb83a58ccb372bf49485"; // Default userId
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
        const wishlist = response.data.wishlist || [];
        const isInWishlist = wishlist.some((item) => item.product._id === productId);
        setIsWishlisted(isInWishlist);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [productId]);

  const toggleWishlist = async () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to proceed.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/wishlist", {
        userId,
        productId,
      });

      if (response.data.message.includes("added")) {
        setIsWishlisted(true);
        alert("Product added to wishlist.");
      } else if (response.data.message.includes("removed")) {
        setIsWishlisted(false);
        alert("Product removed from wishlist.");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while updating the wishlist."
      );
    }
  };

  const handleAddToCart = async () => {
    let userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

    if (!userId) {
      userId = "674cdb83a58ccb372bf49485";
    }

    try {
      // Send the POST request to add the product to the user's cart
      const response = await axios.post("http://localhost:5000/api/cart", {
        userId: userId,
        productId: product._id,
        quantity: 1, // Default quantity to add
      });

      // Optionally notify the user
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

  // Calculate average rating for approved reviews
  const approvedRatings = product.ratings.filter(
    (rating) => rating.approved === "true" || rating.approved === true
  );

  const averageRating =
    product.ratings.length > 0
      ? (
        product.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
        product.ratings.length
        ).toFixed(1)
      : null;

  // Function to render star icons based on the rating
  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(ratingValue)) {
        stars.push(<span key={i} className="star filled">&#9733;</span>); // Filled star
      } else if (i - ratingValue < 1) {
        stars.push(<span key={i} className="star half">&#9733;</span>); // Half star (optional)
      } else {
        stars.push(<span key={i} className="star">&#9734;</span>); // Empty star
      }
    }
    return stars;
  };

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

            {/* Wishlist Button */}
            <button
              className={`wishlist-button ${
                isWishlisted ? "wishlisted" : ""
              }`}
              onClick={toggleWishlist}
            >
              {isWishlisted
                ? "❤️"
                : "🤍"}
            </button>
          </div>
        </div>

        {/* Ratings and Reviews Section */}
        <div className="reviews-section">
          <h2>
            Customer Reviews
            {averageRating && (
              <span className="average-rating">
                {" "}
                - {averageRating} {renderStars(averageRating)}
              </span>
            )}
          </h2>
          {product.ratings.length > 0 ? (
            approvedRatings.map((rating, index) => (
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
      </div>
    </Layout>
  );
};

export default ProductPage;
