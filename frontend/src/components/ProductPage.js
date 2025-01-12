import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";
import Layout from './Layout';

import brandPreo from "../assets/logos/preo.png";
import brandApple from "../assets/logos/apple.png";
import brandSamsung from "../assets/logos/samsung.png";
import brandLG from "../assets/logos/lg.png";
import brandAsus from "../assets/logos/asus.png";
import brandMsi from "../assets/logos/msi.png";
import brandFakir from "../assets/logos/fakir.png";
import brandBraun from "../assets/logos/braun.png";
import brandNikon from "../assets/logos/nikon.png";
import brandSony from "../assets/logos/sony.png";

import iconGuarantee from "../assets/deliverables/guarantee.svg";
import iconDelivery from "../assets/deliverables/delivery.svg";
import iconRefund from "../assets/deliverables/refund.svg";
import iconShipment from "../assets/deliverables/shipment.svg";

import iconFacebook from "../assets/socials/facebook.png";
import iconX from "../assets/socials/x.avif";
import iconLinkedIn from "../assets/socials/linkedin.png";
import iconYouTube from "../assets/socials/youtube.png";
import iconInstagram from "../assets/socials/instagram.png";
import iconWhatsApp from "../assets/socials/whatsapp.png";

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
    (rating) => rating.approved === "approved"
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

              {/* Updated price rendering */}
              <h2 className="product-price">
                {product.discount > 0 ? (
                  <div className="price-with-discount">
                    <span className="product-discount-badge">-%{product.discount}</span>
                    <div className="price-details">
                      <span className="product-old-price">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="product-current-price">
                        ${product.current_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="product-current-price">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </h2>


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
      {/* Info About Website Section */}
      <div className="info-cards-section">
        <div className="info-card">
          <img src={iconGuarantee} alt="Guarantee Icon" className="info-icon" />
          <h4>Extra Guarantee</h4>
          <p>Extend your product’s legal guarantee for peace of mind.</p>
        </div>
        <div className="info-card">
          <img src={iconDelivery} alt="Delivery Icon" className="info-icon" />
          <h4>Fast Delivery</h4>
          <p>Same-day shipping for select cities, next-day for others.</p>
        </div>
        <div className="info-card">
          <img src={iconShipment} alt="Free Shipping Icon" className="info-icon" />
          <h4>Free Shipping Over $150</h4>
          <p>Enjoy free shipping for orders above $150.</p>
        </div>
        <div className="info-card">
          <img src={iconRefund} alt="Refund Icon" className="info-icon" />
          <h4>Easy Refund</h4>
          <p>Return within 30 days if you are not fully satisfied.</p>
        </div>
      </div>

      {/* Follow Us Section */}
      <div className="follow-us-section">
        <span className="follow-text">Follow Us</span>
        <div className="social-icons">
          <img src={iconFacebook} alt="Facebook" />
          <img src={iconX} alt="X" />
          <img src={iconLinkedIn} alt="LinkedIn" />
          <img src={iconYouTube} alt="YouTube" />
          <img src={iconInstagram} alt="Instagram" />
          <img src={iconWhatsApp} alt="WhatsApp" />
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
