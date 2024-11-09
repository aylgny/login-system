import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // React Router'ı import et
import "./MainPage.css";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Products");

  // Mock API URL for fetching products
  const apiUrl = "https://f3837756-d355-4b7f-a67e-4ec8cdf214c7.mock.pstmn.io/getCertainProducts";

  // Fetching product data from mock API using POST request
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();
        console.log("Fetched products:", data); // Debugging log

        // Handling malformed or missing data
        if (!data || !data.product) {
          console.error("Malformed API response", data);
          return;
        }

        setProducts(data.product);
        setFilteredProducts(data.product); // Initially show all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handling search filter
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handling category filter
  const handleCategoryChange = (category) => {
    setCategory(category);
  };

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (category !== "All Products") {
      filtered = filtered.filter((product) => product.category === category);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, category, products]);

  return (
    <div className="main-page">
      <div className="sidebar">
        <h3>Categories</h3>
        <ul>
          <li onClick={() => handleCategoryChange("Accessories")}>Accessories</li>
          <li onClick={() => handleCategoryChange("Computers")}>Computers</li>
          <li onClick={() => handleCategoryChange("Phones")}>Phones</li>
          <li onClick={() => handleCategoryChange("TVs")}>TVs</li>
          <li onClick={() => handleCategoryChange("All Products")}>All Products</li>
        </ul>
      </div>

      <div className="product-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-item-link">
                <div className="product-item">
                  <img src={product.image} alt={product.name} />
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>{product.category}</p>
                    <p>{product.price}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
