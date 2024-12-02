import React, { useState } from "react";
import "./PaymentPage.css";
import Layout from './Layout';
import axios from "axios";
import { useNavigate } from "react-router-dom";




const PaymentPage = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
  });

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    console.log("Payment details submitted:", paymentDetails);
    alert("Payment Successful!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // Example order data
    const orderData = {
      userId: localStorage.getItem("userId"),
      status: "Processing"
    };

    //console.log("User ID from localStorage:", );


    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData) // Veriyi JSON formatında gönderiyoruz
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Order response:", data);
      alert("Payment Successful! Order created.");
      navigate("/mainpage");


    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="payment-page">
        <h1>Secure Payment</h1>
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nameOnCard">Name on Card</label>
            <input
              type="text"
              id="nameOnCard"
              name="nameOnCard"
              value={paymentDetails.nameOnCard}
              onChange={handleInputChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleInputChange}
              required
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="expirationDate">Expiration Date</label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={paymentDetails.expirationDate}
                onChange={handleInputChange}
                required
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleInputChange}
                required
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="billingAddress">Billing Address</label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              value={paymentDetails.billingAddress}
              onChange={handleInputChange}
              required
              placeholder="1234 Main St, Apt 101"
            />
          </div>
          <button type="submit" className="submit-button">
            Pay Now
          </button>
        </form>
      </div>
    </Layout>

  );
};

export default PaymentPage;