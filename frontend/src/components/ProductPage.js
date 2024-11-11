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

import React, { useState, useEffect } from "react";
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
