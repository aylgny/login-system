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

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  
    if (!token) {
      alert("Please log in to add items to the cart.");
      return;
    }
  
    try {
      // Send the POST request to add the product to the user's cart
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { userId: userId, productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
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
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.ratings.length > 0 ? (
            product.ratings.map((rating, index) => (
              <div key={index} className="review-item">
                <p className="review-rating">⭐ {rating.rating}/5</p>
                <p className="review-comment">"{rating.comment}"</p>
                <p className="review-user">- User {rating.user}</p>
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