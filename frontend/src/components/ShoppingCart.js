import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingCart.css";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import axios from "axios";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]); // API'den gelen tüm ürünler
  const [shippingCost, setShippingCost] = useState(5.0);
  const [totalItemsPrice, setTotalItemsPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching cart items for the logged-in user
    const fetchCartItems = async () => {
      try {
        //const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
        let userId = localStorage.getItem("userId"); // Check if userId exists in localStorage
        
        // If userId is not found, use the default userId
        if (!userId) {
          console.log("No userId found in localStorage. Using default userId.");
          userId = "674cdb83a58ccb372bf49485"; // Default userId
        }

        const response = await axios.get(
          `http://localhost:5000/api/cart/${userId}`
        );
        const cartData = response.data.cart;

        if (cartData && cartData.length > 0) {
          const productsWithDefaults = cartData.map((item) => ({
            ...item,
            price: item.product?.price || "$0.00", // Default price
            quantity: item.quantity || 1, // Default quantity
          }));

          setCartItems(productsWithDefaults);
        } else {
          setCartItems([]); // Set to empty array if no items
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        //alert("An error occurred while fetching cart items.");
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    // Recalculate total price when cart items change
    calculateTotalPrice(cartItems);
  }, [cartItems]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    setTotalItemsPrice(total);
  };

  const handleIncrement = async (productId, currentQuantity, maxStock) => {
    const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
  
    if (currentQuantity >= maxStock) {
      alert(`You cannot add more than ${maxStock} units of this product.`);
      return;
    }
  
    try {
      await axios.post(`http://localhost:5000/api/cart`, {
        userId,
        productId,
        quantity: 1, // Increment by 1
      });
    } catch (error) {
      console.error("Error incrementing item quantity:", error);
    }
  };
  

  const handleDecrement = async (productId) => {
    let userId = localStorage.getItem("userId"); // Check if userId exists in localStorage
        
    // If userId is not found, use the default userId
    if (!userId) {
      console.log("No userId found in localStorage. Using default userId.");
      userId = "674cdb83a58ccb372bf49485"; // Default userId
    }
    try {
      await axios.post(`http://localhost:5000/api/cart/decrement`, {
        userId,
        productId,
      });
    } catch (error) {
      console.error("Error decrementing item quantity:", error);
    }
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity =
      (updatedCartItems[index].quantity || 1) + delta;
    if (updatedCartItems[index].quantity < 1) {
      updatedCartItems[index].quantity = 1; // Minimum quantity
    }

    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems); // Update total price
  };

  const handleRemoveRequest = async (productId) => {
    let userId = localStorage.getItem("userId"); // Check if userId exists in localStorage
        
    // If userId is not found, use the default userId
    if (!userId) {
      console.log("No userId found in localStorage. Using default userId.");
      userId = "674cdb83a58ccb372bf49485"; // Default userId
    }
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove`, {
        data: { userId, productId },
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
    calculateTotalPrice(updatedCartItems);
  };

  const handleShippingChange = (event) => {
    const cost = parseFloat(event.target.value);
    setShippingCost(cost);
  };

  const handleCheckout = () => {
    let userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    
    if (userId) {
      // If userId is available, check if the cart has items and proceed to payment
      if (cartItems.length === 0) {
        alert("Your cart is empty. Add some items before proceeding to checkout.");
        return;
      }
      navigate("/payment"); // Navigate to payment if user is logged in and cart is not empty
    } else {
      // If no userId, alert the user to log in
      alert("Please log in to proceed.");
    }
  };

  const totalPrice = totalItemsPrice;

  return (
    <Layout>
      <div className="shopping-cart">
        <div className="cart-items">
          <h2>Shopping Cart</h2>
          {cartItems.length === 0 && (
            <p className="empty-cart-message-large">Your cart is empty.</p>
          )}
          {cartItems.map((item, index) => (
            <div key={item.product._id} className="cart-item">
              <img
                src={item.product.photo}
                alt={item.product.name}
                className="item-image"
              />
              <div className="item-details">
                <h3>{item.product.name}</h3>
              </div>
              <div className="item-quantity">
                <button
                  onClick={() => {
                    handleDecrement(item.product._id);
                    handleQuantityChange(index, -1);
                  }}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => {
                    handleIncrement(item.product._id, item.quantity, item.product.quantity);
                    handleQuantityChange(index, 1);
                  }}
                  disabled={item.quantity >= item.product.quantity} // Disable if stock limit is reached
                >
                  +
                </button>
              </div>
              <p className="item-price">
                € {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
              </p>
              <button
                className="remove-item"
                onClick={() => {
                  handleRemoveRequest(item.product._id);
                  handleRemoveItem(index);
                }}
              >
                ×
              </button>
            </div>
          ))}
          <Link to="/mainpage" className="back-to-shop">
            ← Back to shop
          </Link>
        </div>
        <div className="summary">
          <h2>Summary</h2>
          <div className="summary-item">
            <span>{cartItems.length} Items: </span>
            <span>€ {totalItemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-item">

          </div>
          <div className="summary-total">
            <span>Total Price: </span>
            <span>€ {totalPrice.toFixed(2)}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            CHECKOUT
          </button>
          {cartItems.length === 0 && (
            <p className="empty-cart-message">Your shopping cart is empty.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShoppingCart;
