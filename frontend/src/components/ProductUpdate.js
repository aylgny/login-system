import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductUpdate.css";
import Layout from './Layout';

const ProductUpdate = () => {
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false); // New state for price modal
  const [newDiscount, setNewDiscount] = useState("");
  const [newPrice, setNewPrice] = useState(""); // New state for new price

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    if (newDiscount < 0 || newDiscount > 100) {
      alert("Discount must be between 0 and 100.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/products/discount", {
        productId,
        newDiscount: parseFloat(newDiscount),
      });
      setProduct(response.data.updatedProduct); // Update product details
      setShowDiscountModal(false); // Close the modal
      setNewDiscount(""); // Reset input field
    } catch (error) {
      console.error("Error updating discount:", error);
      alert(error.response?.data?.message || "Failed to update discount.");
    }
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    if (newPrice <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/api/products/price", {
        productId,
        newPrice: parseFloat(newPrice),
      });
      setProduct(response.data.updatedProduct); // Update product details
      setShowPriceModal(false); // Close the modal
      setNewPrice(""); // Reset input field
    } catch (error) {
      console.error("Error updating price:", error);
      alert(error.response?.data?.message || "Failed to update price.");
    }
  };

  const openDiscountModal = () => {
    setNewDiscount(product.discount || ""); // Pre-fill with current discount
    setShowDiscountModal(true);
  };

  const openPriceModal = () => {
    setNewPrice(product.price || ""); // Pre-fill with current price
    setShowPriceModal(true);
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

            {/* Enhanced Price Display */}
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
<div className="buttons-container">
   {/* Buttons */}
   <button
              className="discount-button"
              onClick={openDiscountModal}
            >
              Set Discount
            </button>
            <button
              className="price-button"
              onClick={openPriceModal}
            >
              Set Price
            </button>
</div>
          
          </div>
        </div>

        {/* Discount Modal */}
        {showDiscountModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Set Discount</h2>
              <form onSubmit={handleDiscountSubmit}>
                <label>
                  New Discount (%):
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    min="0"
                    max="100"
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button type="submit" className="modal-submit">Update</button>
                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={() => setShowDiscountModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Price Modal */}
        {showPriceModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Set Price</h2>
              <form onSubmit={handlePriceSubmit}>
                <label>
                  New Price ($):
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button type="submit" className="modal-submit">Update</button>
                  <button
                    type="button"
                    className="modal-cancel"
                    onClick={() => setShowPriceModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductUpdate;
