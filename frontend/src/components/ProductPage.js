import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // URL parametrelerini almak için useParams kullanıyoruz

const ProductPage = () => {
  const { productId } = useParams(); // URL'deki productId parametresini alıyoruz
  const [product, setProduct] = useState(null);

  // Mock API URL for fetching product details
  const apiUrl = `https://f3837756-d355-4b7f-a67e-4ec8cdf214c7.mock.pstmn.io/getProductDetails/${productId}`;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Fetched product details:", data);

        if (!data || !data.product) {
          console.error("Product not found:", data);
          return;
        }

        setProduct(data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.category}</p>
      <p>{product.description}</p>
      <p>{product.price}</p>
    </div>
  );
};

export default ProductPage;
