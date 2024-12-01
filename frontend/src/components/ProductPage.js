// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom"; // URL parametrelerini almak için useParams kullanıyoruz

// const ProductPage = () => {
//   const { productId } = useParams(); // URL'deki productId parametresini alıyoruz
//   const [product, setProduct] = useState(null);

//   // Mock API URL for fetching product details
//   const apiUrl = `https://f3837756-d355-4b7f-a67e-4ec8cdf214c7.mock.pstmn.io/getProductDetails/${productId}`;

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();
//         console.log("Fetched product details:", data);

//         if (!data || !data.product) {
//           console.error("Product not found:", data);
//           return;
//         }

//         setProduct(data.product);
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       }
//     };

//     fetchProductDetails();
//   }, [productId]);

//   if (!product) {
//     return <p>Loading product details...</p>;
//   }

//   return (
//     <div className="product-page">
//       <h1>{product.name}</h1>
//       <img src={product.image} alt={product.name} />
//       <p>{product.category}</p>
//       <p>{product.description}</p>
//       <p>{product.price}</p>
//     </div>
//   );
// };

// export default ProductPage;

//working
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "./ProductPage.css";

// const ProductPage = () => {
//   const { productId } = useParams(); // Get productId from URL
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await fetch(`https://c86dbe19-36b2-45ac-9f68-3322b4926d8c.mock.pstmn.io/getProductPage/${productId}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id: productId }), // Pass productId in request body if needed
//         });

//         const data = await response.json();
//         console.log("Fetched product data:", data); // Check if data is as expected

//         if (data && data.product) {
//           setProduct(data.product);
//         } else {
//           console.error("Invalid product data", data);
//         }
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductDetails();
//   }, [productId]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!product) {
//     return <p>Product not found.</p>;
//   }

//   return (
//     <div className="product-page">
//       <h1>{product.name}</h1>
//       <img src={product.image} alt={product.name} />
//       <p>{product.description}</p>
//       <p>Price: ${product.price}</p>
//       {/* Add any other product details you want to display */}
//     </div>
//   );
// };

// export default ProductPage;

/* import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://c86dbe19-36b2-45ac-9f68-3322b4926d8c.mock.pstmn.io/getProductPage/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: productId }),
        });

        const data = await response.json();
        if (data && data.product) {
          setProduct(data.product);
        } else {
          console.error("Invalid product data", data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-page">
      <img src={product.image} alt={product.name} className="product-image" />
      <h1 className="product-name">{product.name}</h1>
      <p className="product-price">{product.price}</p>
      <p className="product-description">{product.description}</p>
      <button className="add-to-cart-button">Add to Cart</button>
    </div>
  );
};

export default ProductPage;
 
*/

// src/components/ProductPage.js
/*

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://c86dbe19-36b2-45ac-9f68-3322b4926d8c.mock.pstmn.io/getProductPage/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: productId }),
          }
        );

        const data = await response.json();
        if (data && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image); // Set initial main image
        } else {
          console.error("Invalid product data", data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-page">
      <div className="image-gallery">
        {}

        {product.images && product.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={product.name}
            onClick={() => setSelectedImage(img)}
            className="thumbnail"
          />
        ))}
      </div>
      <div className="main-image">
        <img src={selectedImage} alt={product.name} />
      </div>
      <div className="product-details">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">{product.price}</p>
        <div className="product-rating">
          ★★★★☆ <span>({product.reviews || 122} reviews)</span>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="size-selector">
          <p>Select Size:</p>
          <button>M</button>
          <button>L</button>
          <button>XL</button>
        </div>
        <button className="add-to-cart-button">Add to Cart</button>
        <div className="additional-info">
          <p>100% Original product</p>
          <p>Cash on delivery is available on this product.</p>
          <p>Easy return and exchange policy within 7 days.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

*/

/* // src/components/ProductPage.js
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const reviewsRef = useRef(null); // Reference to the reviews section

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://c86dbe19-36b2-45ac-9f68-3322b4926d8c.mock.pstmn.io/getProductPage/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: productId }),
          }
        );

        const data = await response.json();
        if (data && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image);
        } else {
          console.error("Invalid product data", data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  // Function to scroll to the reviews section
  const scrollToReviews = () => {
    reviewsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="product-page">
      <div className="left-column">
        <div className="image-gallery">
          {product.images &&
            product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={product.name}
                onClick={() => setSelectedImage(img)}
                className={`thumbnail ${
                  selectedImage === img ? "selected" : ""
                }`}
              />
            ))}
        </div>
        <div className="main-image">
          <img src={selectedImage} alt={product.name} />
        </div>
      </div>

      <div className="right-column">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">{product.price}</p>

        {}
        <div className="product-rating" onClick={scrollToReviews}>
          ★★★★☆ <span>({product.reviews || 122} reviews)</span>
        </div>

        <p className="product-description">{product.description}</p>

        <button className="add-to-cart-button">Add to Cart</button>

        <div className="additional-info">
          <p>100% Original product</p>
          <p>Cash on delivery is available on this product.</p>
          <p>Easy return and exchange policy within 7 days.</p>
        </div>
      </div>

      {}
      <div className="reviews-section" ref={reviewsRef}>
        <h2>Customer Reviews</h2>
        {}
        <div className="review">
          <p><strong>User1</strong> ★★★★★</p>
          <p>Great product! Highly recommend.</p>
        </div>
        <div className="review">
          <p><strong>User2</strong> ★★★★☆</p>
          <p>Good value for the price.</p>
        </div>
        {}
      </div>
    </div>
  );
};

export default ProductPage; */
/*
// src/components/ProductPage.js
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const reviewsRef = useRef(null); // Reference to the reviews section

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://c86dbe19-36b2-45ac-9f68-3322b4926d8c.mock.pstmn.io/getProductPage/${productId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: productId }),
          }
        );

        const data = await response.json();
        if (data && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image);
        } else {
          console.error("Invalid product data", data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  // Function to scroll to the reviews section
  const scrollToReviews = () => {
    reviewsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="product-page">
      <div className="product-card">
        <div className="left-column">
          <div className="image-gallery">
            {product.images &&
              product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.name}
                  onClick={() => setSelectedImage(img)}
                  className={`thumbnail ${
                    selectedImage === img ? "selected" : ""
                  }`}
                />
              ))}
          </div>
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
        </div>

        <div className="right-column">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">{product.price}</p>

          {}
          <div className="product-rating" onClick={scrollToReviews}>
            ★★★★☆ <span>({product.reviews || 122} reviews)</span>
          </div>

          <p className="product-description">{product.description}</p>

          <button className="add-to-cart-button">Add to Cart</button>

          <div className="additional-info">
            <p>100% Original product</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {}
      <div className="reviews-section" ref={reviewsRef}>
        <h2>Customer Reviews</h2>
        {}
        <div className="review">
          <p><strong>User1</strong> ★★★★★</p>
          <p>Great product! Highly recommend.</p>
        </div>
        <div className="review">
          <p><strong>User2</strong> ★★★★☆</p>
          <p>Good value for the price.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
*/
/*
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch the product details
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-page">
      <div className="product-image-container">
        <img src={product.photo} alt={product.name} className="product-image" />
      </div>
      <div className="product-details-container">
        <h1>{product.name}</h1>
        <p className="product-category">Category: {product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <button className="add-to-cart-button">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductPage;
*/
/*
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";

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

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="product-page">
      <div className="product-details">
        <img src={product.photo} alt={product.name} className="product-image" />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <h2>${product.price.toFixed(2)}</h2>
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
*/

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