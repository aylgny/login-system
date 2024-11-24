import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import React Router
import "./MainPage.css";
import axios from 'axios'; // Import axios for making HTTP requests

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("All Products"); // Default value for selected category

  const apiUrl = "https://f3837756-d355-4b7f-a67e-4ec8cdf214c7.mock.pstmn.io/getCertainProducts";
  const categoriesApiUrl = "http://localhost:5000/api/categories"; // URL for fetching categories

  // Fetching product data
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
        if (!data || !data.product) {
          console.error("Malformed API response", data);
          return;
        }

        setProducts(data.product);
        setFilteredProducts(data.product);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetching categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoriesApiUrl); // GET request for categories
        let fetchedCategories = response.data;

        // Sort categories, ensuring "All Products" is at the top if present
        fetchedCategories.sort((a, b) => {
          if (a.name === "All Products") return -1;
          if (b.name === "All Products") return 1;
          return a.name.localeCompare(b.name); // Alphabetical order for other categories
        });

        setCategories(fetchedCategories); // Update categories state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handling search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handling category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Filter products based on search term and selected category
  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  return (
    <div className="main-page">
      <div className="sidebar">
        <h3>Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category._id} onClick={() => handleCategoryChange(category.name)}>
              {category.name}
            </li>
          ))}
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
                  {/* Display product image */}
                  <img 
                    src={product.photo} // Updated to use product.photo
                    alt={product.name} 
                    className="product-image" // Optional CSS class for styling
                  />
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
