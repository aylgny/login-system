import React, { useState } from "react";
import "./PaymentPage.css";
import Layout from './Layout';
import { useNavigate } from "react-router-dom";
import "react-credit-cards/es/styles-compiled.css";
import Cards from "react-credit-cards";

const PaymentPage = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: "",
    focused: "",
    issuer: "",
  });

  const navigate = useNavigate();

  // Card Type Detection
  const detectCardType = (number) => {
    const trimmedNumber = number.replace(/\s+/g, ""); // Remove spaces
    if (/^5[1-5]/.test(trimmedNumber)) {
      return "mastercard";
    } else if (/^4/.test(trimmedNumber)) {
      return "visa";
    }
    return "unknown";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format card number with spaces
    let formattedValue = value;
    if (name === "cardNumber") {
      formattedValue = value.replace(/[^0-9]/g, "").replace(/(.{4})/g, "$1 ").trim();
      const cardType = detectCardType(formattedValue);
      setPaymentDetails((prev) => ({ ...prev, issuer: cardType }));
    }

    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: formattedValue,
    }));
  };

  const handleFocus = (e) => {
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      focused: e.target.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      userId: localStorage.getItem("userId"),
      status: "Processing",
      address: paymentDetails.billingAddress,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      debugger;
      const data = await response.json();
      const sanitizedPdfPath = data.pdfPath.replace(/^invoices[\\/]/, '');
      const filePath = sanitizedPdfPath;
      // Split the path using both backslash and forward slash as separators
      const parts = filePath.split(/[/\\]/);
      
      // Get the last part, which should be the filename
      const fileName = parts.pop();      
      navigate(`/congrats/${fileName}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="payment-page">
        <h1>Secure Payment</h1>
        
        {/* Credit Card Visualization */}
        <Cards
          cvc={paymentDetails.cvv}
          expiry={paymentDetails.expirationDate.replace("/", "")}
          focused={paymentDetails.focused}
          name={paymentDetails.nameOnCard}
          number={paymentDetails.cardNumber.replace(/\s+/g, "")}
          issuer={paymentDetails.issuer}
        />

        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nameOnCard">Name on Card</label>
            <input
              type="text"
              id="nameOnCard"
              name="nameOnCard"
              value={paymentDetails.nameOnCard}
              onChange={handleInputChange}
              onFocus={handleFocus}
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
              onFocus={handleFocus}
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
                onFocus={handleFocus}
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
                onFocus={handleFocus}
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
              onFocus={handleFocus}
              required
              placeholder="1234 Main St, Apt 101"
            />
          </div>
          <button type="submit" className="submit-button">
            Pay Now
          </button>
        </form>

        {/* Show detected card type */}
        {paymentDetails.issuer !== "unknown" && (
          <p className="card-type">Detected Card: {paymentDetails.issuer.toUpperCase()}</p>
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage;
