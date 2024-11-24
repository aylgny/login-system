import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MainPage.css";
import axios from "axios";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("All Products"); // Default to "All Products"
  const [sortCriteria, setSortCriteria] = useState("price-asc"); // Default sorting criteria

  const productsApiUrl = "http://localhost:5000/api/products";
  const categoriesApiUrl = "http://localhost:5000/api/categories"; // URL for fetching categories

  // Fetching products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(productsApiUrl);
        setProducts(response.data); // Store products
        setFilteredProducts(response.data); // Initially show all products
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

  // Handle sorting criteria
  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  // Filter products based on search term and selected category
  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
  
    // Apply sorting based on the criteria
    if (sortCriteria === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === "popularity-desc") {
      filtered.sort((a, b) => a.quantity - b.quantity); // High popularity: least stock first
    } else if (sortCriteria === "popularity-asc") {
      filtered.sort((a, b) => b.quantity - a.quantity); // Low popularity: most stock first
    }
  
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortCriteria, products]);
  


  return (
    <div className="main-page">
      {/* Sidebar for categories */}
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

      {/* Main content area */}
      <div className="product-container">
        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Sorting dropdown */}
        <div className="sort-container">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortCriteria} onChange={handleSortChange}>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popularity-desc">Popularity: Low to High</option>
            <option value="popularity-asc">Popularity: High to Low</option>
          </select>
        </div>

        {/* Product list */}
        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="product-item-link">
                <div className="product-item">
                  <img src={product.photo} alt={product.name} className="product-image" />
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>{product.category}</p>
                    <p>${product.price.toFixed(2)}</p>
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
