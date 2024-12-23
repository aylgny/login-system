import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";

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
import GearTechLogo from '../assets/icons/geartech.png';
import wishlistIcon from '../assets/icons/wishlist.png';

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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortCriteria, setSortCriteria] = useState("price-asc");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const productsApiUrl = "http://localhost:5000/api/products";
  const categoriesApiUrl = "http://localhost:5000/api/categories";

  // Fetching products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(productsApiUrl);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetching categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoriesApiUrl);
        let fetchedCategories = response.data;

        // Sort categories, ensuring "All Products" is at the top if present
        fetchedCategories.sort((a, b) => {
          if (a.name === "All Products") return -1;
          if (b.name === "All Products") return 1;
          return a.name.localeCompare(b.name);
        });

        setCategories(fetchedCategories);
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
    localStorage.removeItem("userId");
    localStorage.clear();
    alert("Logged out successfully!"); // Show a feedback message
    setDropdownOpen(false); // Close the dropdown
    navigate("/"); // Redirect to login page
    };

  // Handle account icon click
  const handleAccountClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/account");
    } else {
      setDropdownOpen((prevState) => !prevState);
    }
  };

  // Handle click outside dropdown
  const handleClickOutside = (event) => {
    if (!event.target.closest(".user-icon-container")) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
      filtered.sort((a, b) => a.quantity - b.quantity);
    } else if (sortCriteria === "popularity-asc") {
      filtered.sort((a, b) => b.quantity - a.quantity);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortCriteria, products]);

  return (
    <div className="layout-container">
      {/* Header Section */}
      <header className="main-header">
        <Link to="/mainpage" className="logo-link">
          <img src={GearTechLogo} alt="GearTech Logo" className="geartech-logo" />
        </Link>
       
        {/* Icon Group */}
        <div className="icon-group">
          <div className="cart-icon">
            <Link to="/cart">
              <img src={require("../assets/icons/shopping.png")} alt="Cart" />
            </Link>
          </div>

          {localStorage.getItem("token") && (
          <div className="wishlist-icon">
            <Link to="/wishlist">
              <img src={require("../assets/icons/wishlist.png")} alt="Wishlist" />
            </Link>
          </div>
          )}
          
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
                handleCategoryChange(category.name);
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

      {/* Main Content */}
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
