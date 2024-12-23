import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]); // Wishlist items
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching wishlist items for the logged-in user
    const fetchWishlistItems = async () => {
      try {
        let userId = localStorage.getItem("userId"); // Check if userId exists in localStorage

        // If userId is not found, use the default userId
        if (!userId) {
          console.log("No userId found in localStorage. Using default userId.");
          userId = "674cdb83a58ccb372bf49485"; // Default userId
        }

        const response = await axios.get(
          `http://localhost:5000/api/wishlist/${userId}`
        );
        const wishlistData = response.data.wishlist;

        if (wishlistData && wishlistData.length > 0) {
          const productsWithDefaults = wishlistData.map((item) => ({
            ...item,
            price: item.product?.price || "$0.00", // Default price
          }));

          setWishlistItems(productsWithDefaults);
        } else {
          setWishlistItems([]); // Set to empty array if no items
        }
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleRemoveRequest = async (productId) => {
  let userId = localStorage.getItem("userId"); // Check if userId exists in localStorage

  if (!userId) {
    console.log("No userId found in localStorage. Please log in.");
    return;
  }

  try {
    const response = await axios.post(`http://localhost:5000/api/wishlist`, {
      userId,
      productId,
    });

    // Check the response message
    if (response.data.message.includes("removed")) {
      // Permanently remove the item from the wishlist state
      const updatedWishlistItems = wishlistItems.filter(
        (item) => item.product._id !== productId
      );
      setWishlistItems(updatedWishlistItems);
      alert("Product removed from wishlist.");
    }
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    alert(
      error.response?.data?.message ||
        "An error occurred while removing the item from the wishlist."
    );
  }
};


  const handleRemoveItem = (index) => {
    const updatedWishlistItems = wishlistItems.filter((_, i) => i !== index);
    setWishlistItems(updatedWishlistItems);
  };

  const handleMoveToCart = async (productId) => {
    let userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    
    if (!userId) {
      console.log("No userId found in localStorage. Using default userId.");
      userId = "674cdb83a58ccb372bf49485"; // Default userId
    }

    try {
      await axios.post(`http://localhost:5000/api/cart`, {
        userId,
        productId,
        quantity: 1, // Default quantity
      });

      // Optionally remove the item from wishlist after adding to cart
      //handleRemoveRequest(productId);
    } catch (error) {
      console.error("Error moving item to cart:", error);
    }
    alert("Product added to cart.")
  };

  return (
    <Layout>
      <div className="wishlist">
        <div className="wishlist-items">
          <h2>Wishlist</h2>
          {wishlistItems.length === 0 && (
            <p className="empty-wishlist-message-large">Your wishlist is empty.</p>
          )}
          {wishlistItems.map((item, index) => (
            <div key={item.product._id} className="wishlist-item">
              <img
                src={item.product.photo}
                alt={item.product.name}
                className="item-image"
              />
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p>Price: € {parseFloat(item.product.price).toFixed(2)}</p>
              </div>
              <div className="item-actions">
                <button
                  className="move-to-cart"
                  onClick={() => handleMoveToCart(item.product._id)}
                >
                  Add to Cart
                </button>
                <button
                  className="remove-item"
                  onClick={() => {
                    handleRemoveRequest(item.product._id);
                    handleRemoveItem(index);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <Link to="/mainpage" className="back-to-shop">
            ← Back to shop
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
