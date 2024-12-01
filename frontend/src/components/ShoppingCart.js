import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingCart.css";
import { Link } from "react-router-dom";
import Layout from './Layout';
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
        const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        const cartData = response.data.cart;
        
        if (cartData && cartData.length > 0) {
          const productsWithDefaults = cartData.map((item) => ({
            ...item,
            price: item.product?.price || "$0.00", // Default price
            quantity: item.quantity || 1, // Default quantity
          }));

          setCartItems(productsWithDefaults);
          //calculateTotalPrice(productsWithDefaults);
        } else {
          setCartItems([]); // Set to empty array if no items
        }
      

        //setCartItems(productsWithDefaults);
        //calculateTotalPrice(productsWithDefaults);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        alert("An error occurred while fetching cart items.");
      }
    };

    fetchCartItems();
  }, []);
  

  useEffect(() => {
    // Recalculate total price when cart items change
    calculateTotalPrice(cartItems);
  }, [cartItems]); // cartItems dependency ekledik


  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    setTotalItemsPrice(total);
  };

  
  const handleIncrement = async (productId) => {
    const userId = localStorage.getItem("userId"); // Get the logged-in user's ID

    try {
      const response = await fetch(`http://localhost:5000/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1, // Increment by 1
        }),
      });

     
    } 
      catch (error) {
      console.error("Error incrementing item quantity:", error);
    }
  };

  // Handle decrementing item quantity
  const handleDecrement = async (productId) => {
    const userId = localStorage.getItem("userId"); // Get the logged-in user's ID

    try {
      const response = await fetch(`http://localhost:5000/api/cart/decrement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
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
    calculateTotalPrice(updatedCartItems); // Güncel fiyatı hesapla


  };

  const handleRemoveRequest = async (productId) => {
    const userId = localStorage.getItem("userId"); // Get the logged-in user's ID

    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      });

      
    } 
      catch (error) {
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
    navigate("/payment");
  };

  const totalPrice = totalItemsPrice + shippingCost;

  return (
    <Layout>
      <div className="shopping-cart">
        <div className="cart-items">
          <h2>Shopping Cart</h2>
          {cartItems.map((item, index) => (
            <div key={item.product._id} className="cart-item">
              <img src={item.product.photo} alt={item.product.name} className="item-image" />
              <div className="item-details">
                <h3>{item.product.name}</h3>
              </div>
              <div className="item-quantity">
                <button onClick={() => {
                  handleDecrement(item.product._id);
                  handleQuantityChange(index, -1);

                }}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => {
                  handleIncrement(item.product._id);
                  handleQuantityChange(index, 1);
                }}>+</button>
              </div>
              <p className="item-price">€ {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
              <button className="remove-item" onClick={() => {
                  handleRemoveRequest(item.product._id);
                  handleRemoveItem(index);
              }}>×</button>
            </div>
          ))}
          <Link to="/mainpage" className="back-to-shop">← Back to shop</Link>
        </div>
        <div className="summary">
          <h2>Summary</h2>
          <div className="summary-item">
            <span>{cartItems.length} Items: </span>
            <span>€ {totalItemsPrice.toFixed(2)}</span>

          </div>
          <div className="summary-item">
            <label htmlFor="shipping">Shipping  </label>
            <select id="shipping" onChange={handleShippingChange}>
              <option value="5.00">Standard-Delivery - €5.00</option>
              <option value="10.00">Express-Delivery - €10.00</option>
            </select>
          </div>
          <div className="summary-item">
            <label htmlFor="code">Coupon </label>
            <input type="text" id="code" placeholder="Enter your code" />
          </div>
          <div className="summary-total">
            <span>Total Price: </span>
            <span>€ {totalPrice.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            CHECKOUT
          </button>
        </div>
      </div>
    </Layout>

  );
};

export default ShoppingCart;