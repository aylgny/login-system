import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingCart.css";
import { Link } from "react-router-dom";
import Layout from './Layout';


const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]); // API'den gelen tüm ürünler
  const [shippingCost, setShippingCost] = useState(5.0);
  const [totalItemsPrice, setTotalItemsPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching product data from the mock API
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          "https://f3837756-d355-4b7f-a67e-4ec8cdf214c7.mock.pstmn.io/getCertainProducts",
          {
            method: "POST",
          }
        );
        const data = await response.json();
        const productsWithQuantity = data.product.map((item) => ({
          ...item,
          quantity: 1, // Varsayılan olarak quantity 1
        }));
        setCartItems(productsWithQuantity); // Tüm ürünleri state'e ekle
        calculateTotalPrice(productsWithQuantity); // Fiyatları hesapla
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + parseFloat(item.price.slice(1)) * item.quantity,
      0
    );
    setTotalItemsPrice(total);
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
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
              </div>
              <div className="item-quantity">
                <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(index, 1)}>+</button>
              </div>
              <p className="item-price">€ {(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}</p>
              <button className="remove-item" onClick={() => handleRemoveItem(index)}>×</button>
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