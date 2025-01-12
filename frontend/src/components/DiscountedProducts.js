import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DiscountedProducts.css";

const DiscountedProducts = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        const products = response.data.filter((product) => product.discount > 0);
        setDiscountedProducts(products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching discounted products:", err);
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  return (
    <div className="discounted-products-page">
      <h1>Discounted Products</h1>
      {loading ? (
        <p>Ürünler yükleniyor...</p>
      ) : discountedProducts.length === 0 ? (
        <p>Şu anda indirimde olan ürün bulunmamaktadır.</p>
      ) : (
        <div className="discounted-products-grid">
          {discountedProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="discounted-product-item-link"
            >
              <div className="discounted-product-item">
                <span className="discount-badge">%{product.discount}</span>
                <img
                  src={product.photo}
                  alt={product.name}
                  className="product-image"
                />
                <h4>{product.name}</h4>
                <div className="price-details">
                  <span className="old-price">${product.price.toLocaleString()}</span>
                  <span className="current-price">
                    ${product.current_price.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountedProducts;
