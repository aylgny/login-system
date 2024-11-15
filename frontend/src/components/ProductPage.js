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

        {/* Ratings and Comments */}
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

      {/* Reviews Section */}
      <div className="reviews-section" ref={reviewsRef}>
        <h2>Customer Reviews</h2>
        {/* Mock reviews for demonstration */}
        <div className="review">
          <p><strong>User1</strong> ★★★★★</p>
          <p>Great product! Highly recommend.</p>
        </div>
        <div className="review">
          <p><strong>User2</strong> ★★★★☆</p>
          <p>Good value for the price.</p>
        </div>
        {/* Add more reviews as needed */}
      </div>
    </div>
  );
};

export default ProductPage;

