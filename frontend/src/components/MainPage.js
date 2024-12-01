import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./MainPage.css";
import axios from "axios";


// Import local icons
import userIcon from "../assets/icons/account.png";
import logoutIcon from "../assets/icons/logout.png";
import allProductsIcon from "../assets/icons/all.png";
import accessoriesIcon from "../assets/icons/accessory.png";
import camerasIcon from "../assets/icons/camera.png";
import headphonesIcon from "../assets/icons/headphone.png";
import laptopsIcon from "../assets/icons/laptop.png";
import speakersIcon from "../assets/icons/speaker.png";
import tvsIcon from "../assets/icons/tv.png";


// Map categories to icons
const categoryIcons = {
  "All Products": allProductsIcon,
  Accessories: accessoriesIcon,
  Cameras: camerasIcon,
  Headphones: headphonesIcon,
  Laptops: laptopsIcon,
  Speakers: speakersIcon,
  TVs: tvsIcon,
};


const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("All Products"); // Default to "All Products"
  const [sortCriteria, setSortCriteria] = useState("price-asc"); // Default sorting criteria
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
 
  const productsApiUrl = "http://localhost:5000/api/products";
  const categoriesApiUrl = "http://localhost:5000/api/categories"; // URL for fetching categories
  const location = useLocation();


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


  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setDropdownOpen(false); // Close the dropdown
    navigate("/"); // Redirect to login page
    };


  // Handle account icon click
  const handleAccountClick = () => {
    const token = localStorage.getItem("token");
    //alert(Token: ${token}); // Show the token in an alert


    if (token) {
      // If token exists, redirect to account page
      navigate("/account");
    } else {
      // If no token, toggle the dropdown
      setDropdownOpen((prevState) => !prevState);
    }
  };


  // Handle click outside dropdown
  const handleClickOutside = (event) => {
    if (!event.target.closest(".user-icon-container")) {
      setDropdownOpen(false);
    }
  };


  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);




  // Filter products based on search term and selected category
  useEffect(() => {

    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }

    let filtered = products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    });


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
  }, [searchTerm, selectedCategory, sortCriteria, products, location.state]);


  return (
    <div className="main-page">


      {/* Header Section */}
      <header className="main-header">
        <h1 className="logo">LOGO</h1>




        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        {/* Icon Group */}
        <div className="icon-group">
          {/* Cart Icon */}
          <div className="cart-icon">
            <Link to="/cart">
              <img
                src={require("../assets/icons/shopping.png")}
                alt="Cart"
              />
            </Link>
          </div>




          {/* Account Icon */}
          <div className="user-icon-container" onClick={handleAccountClick}>
            <img src={userIcon} alt="User Icon" className="user-icon" />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/login">
                  <button className="dropdown-button">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="dropdown-button">Sign Up</button>
                </Link>
              
              </div>
            )}
          </div>




          {/* Logout Icon */}
          {localStorage.getItem("token") && (
            <div className="logout-icon-container" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" className="logout-icon" />
            </div>
          )}
        </div>
      </header>




      {/* Horizontal Category Bar */}
      <div className="category-bar">
        <ul className="category-list">
          {categories.map((category) => (
            <li
              key={category._id}
              className={`category-item ${
                selectedCategory === category.name ? "active-category" : ""
              }`}
              onClick={() => {
                navigate("/MainPage", { state: { selectedCategory: category.name } });

                handleCategoryChange(category.name)
              }}
            >
              <img
                src={categoryIcons[category.name]}
                alt={category.name}
                className="category-icon"
              />
              {category.name}
            </li>
          ))}
        </ul>
      </div>


      {/* Sort and Products Section */}
      <div className="sort-container">
        <label htmlFor="sort"></label>
        <select id="sort" value={sortCriteria} onChange={handleSortChange}>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popularity-desc">Popularity: Low to High</option>
          <option value="popularity-asc">Popularity: High to Low</option>
        </select>
      </div>


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
                 
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))
        )}
        </div>
    </div>
  );
};


export default MainPage;