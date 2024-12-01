import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";
import axios from "axios";

// Import icons
import userIcon from "../assets/icons/account.png";
import logoutIcon from "../assets/icons/logout.png";
import allProductsIcon from "../assets/icons/all.png";
import accessoriesIcon from "../assets/icons/accessory.png";
import camerasIcon from "../assets/icons/camera.png";
import headphonesIcon from "../assets/icons/headphone.png";
import laptopsIcon from "../assets/icons/laptop.png";
import speakersIcon from "../assets/icons/speaker.png";
import tvsIcon from "../assets/icons/tv.png";
import GearTechLogo from "../assets/icons/geartech.png";

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

const Layout = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const productsApiUrl = "http://localhost:5000/api/products";
  const categoriesApiUrl = "http://localhost:5000/api/categories";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(productsApiUrl);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoriesApiUrl);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleCategoryChange = (category) => setSelectedCategory(category);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* Header Section */}
      <header className="main-header">
        <Link to="/mainpage" className="logo-link">
          <img src={GearTechLogo} alt="GearTech Logo" className="geartech-logo" />
        </Link>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="icon-group">
          <div className="cart-icon">
            <Link to="/cart">
              <img src={require("../assets/icons/shopping.png")} alt="Cart" />
            </Link>
          </div>
          <div className="user-icon-container" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
          {localStorage.getItem("token") && (
            <div className="logout-icon-container" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout Icon" />
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
              onClick={() => handleCategoryChange(category.name)}
            >
              <img src={categoryIcons[category.name]} alt={category.name} className="category-icon" />
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
