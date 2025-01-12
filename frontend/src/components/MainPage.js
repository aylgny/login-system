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
import tabletsIcon from "../assets/icons/tablet.png";
import teknosuLogo from "../assets/icons/teknosu.png";
import wishlistIcon from "../assets/icons/wishlist.png";
import adminIcon from "../assets/icons/admin_panel.png";


/* BRAND LOGOS (replace with your actual images) */
import brandPreo from "../assets/logos/preo.png";
import brandApple from "../assets/logos/apple.png";
import brandSamsung from "../assets/logos/samsung.png";
import brandLG from "../assets/logos/lg.png";
import brandAsus from "../assets/logos/asus.png";
import brandMsi from "../assets/logos/msi.png";
import brandFakir from "../assets/logos/fakir.png";
import brandBraun from "../assets/logos/braun.png";
import brandNikon from "../assets/logos/nikon.png";
import brandSony from "../assets/logos/sony.png";


/* SOCIAL ICONS (replace with your actual images or font icons) */
import iconFacebook from "../assets/socials/facebook.png";
import iconX from "../assets/socials/x.avif"; // old Twitter
import iconLinkedIn from "../assets/socials/linkedin.png";
import iconYouTube from "../assets/socials/youtube.png";
import iconInstagram from "../assets/socials/instagram.png";
import iconWhatsApp from "../assets/socials/whatsapp.png";

// PROMOTION IMAGES (local)
import promo1 from "../assets/promotions/bose-promo.png";
import promo2 from "../assets/promotions/lg-promo.png";
import promo3 from "../assets/promotions/airpods.png";
import promo4 from "../assets/promotions/airtag.jpg";
import promo5 from "../assets/promotions/apple_watch.jpg";
import promo6 from "../assets/promotions/samsung_unpacked.png";
import promo7 from "../assets/promotions/samsung_watch_.jpg";


// import promo3 from "../assets/promotions/promo3.png"; // If you add a third image, uncomment

// NEW: Icons for guarantee/delivery/refund/shipment placeholders
import iconGuarantee from "../assets/deliverables/guarantee.svg";
import iconDelivery from "../assets/deliverables/delivery.svg";
import iconRefund from "../assets/deliverables/refund.svg";
import iconShipment from "../assets/deliverables/shipment.svg";

// Map categories to icons
const categoryIcons = {
  "All Products": allProductsIcon,
  Accessories: accessoriesIcon,
  Cameras: camerasIcon,
  Headphones: headphonesIcon,
  Laptops: laptopsIcon,
  Speakers: speakersIcon,
  TVs: tvsIcon,
  Tablets: tabletsIcon,
};

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortCriteria, setSortCriteria] = useState("price-asc");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popularProducts, setPopularProducts] = useState([]); // For popular products

  // Promotions state
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const promotions = [
    { id: 1, image: promo1 },
    { id: 2, image: promo2 },
    { id: 3, image: promo3 },
    { id: 4, image: promo4 },
    { id: 5, image: promo5 },
    { id: 6, image: promo6 },
    { id: 7, image: promo7 },
  ];

  // Router & location
  const navigate = useNavigate();
  const location = useLocation();

  // API URLs (adjust as needed)
  const productsApiUrl = "http://localhost:5000/api/products";
  const categoriesApiUrl = "http://localhost:5000/api/categories";

  const [openFilters, setOpenFilters] = useState({
    priceRange: false,
    ratings: false,
    categories: false,
  });
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const toggleFilter = (filterName) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [filterName]: !prevState[filterName],
    }));
  };
  
  const applyPriceFilter = () => {
    // Apply price range filter logic here
  };
  
  const toggleRatingFilter = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };
  
  const toggleCategoryFilter = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };
  

useEffect(() => {
  let filtered = products;

  // Apply price filter
  if (minPrice) {
    filtered = filtered.filter((product) => product.current_price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((product) => product.current_price <= parseFloat(maxPrice));
  }

  // Apply ratings filter
  if (selectedRatings.length > 0) {
    filtered = filtered.filter((product) =>
      selectedRatings.some((rating) => product.rating >= rating)
    );
  }

  // Apply categories filter
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((product) => selectedCategories.includes(product.category));
  }

  setFilteredProducts(filtered);
}, [minPrice, maxPrice, selectedRatings, selectedCategories, products]);


  // Fetching products
// Fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(productsApiUrl);
        setProducts(response.data);
        setFilteredProducts(response.data);

        // Filter for popular products (rating >= 4)
        const popular = response.data.filter(
          (product) =>
            product.ratings &&
            product.ratings.length > 0 &&
            product.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
              product.ratings.length >= 4
        );
        setPopularProducts(popular);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(categoriesApiUrl);
        let fetchedCategories = response.data;

        // Sort so "All Products" is on top if present
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

  // Promotions auto-slide (5s)
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextPromo();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [promotions.length]);

  // Manual forward/back
  const handleNextPromo = () => {
    setCurrentPromotionIndex((prev) =>
      prev === promotions.length - 1 ? 0 : prev + 1
    );
  };
  const handlePrevPromo = () => {
    setCurrentPromotionIndex((prev) =>
      prev === 0 ? promotions.length - 1 : prev - 1
    );
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle sort
  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.clear();
    alert("Logged out successfully!");
    setDropdownOpen(false);
    navigate("/");
  };

  // Account icon click
  const handleAccountClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/account");
    } else {
      setDropdownOpen((prev) => !prev);
    }
  };

  // Close dropdown if clicked outside
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

  // Filter & sort
  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }

    let filtered = products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.description &&
          product.description.toLowerCase().includes(searchLower))
      );
    });

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sorting by `current_price`
    if (sortCriteria === "price-asc") {
      filtered.sort((a, b) => a.current_price - b.current_price);
    } else if (sortCriteria === "price-desc") {
      filtered.sort((a, b) => b.current_price - a.current_price);
    } else if (sortCriteria === "popularity-desc") {
      filtered.sort((a, b) => a.quantity - b.quantity);
    } else if (sortCriteria === "popularity-asc") {
      filtered.sort((a, b) => b.quantity - a.quantity);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortCriteria, products, location.state]);

  return (
    <div className="main-page">
      {/* Header Section */}
      <header className="main-header">
        <Link to="/mainpage" className="logo-link">
          <img src={teknosuLogo} alt="teknosu Logo" className="teknosu-logo" />
        </Link>
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
          {localStorage.getItem("token") && (
              <div className="admin-icon">
                <Link to="/SalesAdmin">
                  <img src={adminIcon} alt="Admin" />
                </Link>
              </div>
            )}
          <div className="cart-icon">
            <Link to="/cart">
              <img src={require("../assets/icons/shopping.png")} alt="Cart" />
            </Link>
          </div>
          {localStorage.getItem("token") && (
            <div className="wishlist-icon">
              <Link to="/wishlist">
                <img src={wishlistIcon} alt="Wishlist" />
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

          {/* Admin Panel Button */}
          {localStorage.getItem("token") && (
            (localStorage.getItem("userStatus") === "sales_manager" ||
              localStorage.getItem("userStatus") === "product_manager") && (
              <div className="admin-panel-icon">
                <Link to="/admin">
                  <button className="admin-panel-button">Admin Panel</button>
                </Link>
              </div>
            )
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

      {/* Parent Div for Filters and Promotions */}
      <div className="mainpage-content">  {/* This is the parent div */}
        {/* Filters Section */}
        <div className="filters-section">
          <h3 className="filters-title">Filters</h3>

          {/* Price Range Filter */}
          <div className="filter-category">
            <div className="filter-header">
              <span>Price Range</span>
            </div>
            <div className="filter-options">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
              />
              <button onClick={applyPriceFilter} className="apply-button">Apply</button>
            </div>
          </div>
        </div>


        {/* Promotions Section */}
        {/* PROMOTIONS SLIDER (bigger container + manual Next/Prev) */}
        <div className="promotions-section">
          <div className="promotion-slide">
            {/* Promotion Image */}
            <img
              src={promotions[currentPromotionIndex].image}
              alt={`Promotion ${promotions[currentPromotionIndex].id}`}
              className="promotion-image"
            />
            {/* Manual Buttons */}
            <button className="promotion-nav-button prev-button" onClick={handlePrevPromo}>
              ‹
            </button>
            <button className="promotion-nav-button next-button" onClick={handleNextPromo}>
              ›
            </button>
          </div>
        </div>
      </div>
      

      {/* Sort & Products */}
      <div className="sort-container">
        <label htmlFor="sort"></label>
        <select id="sort" value={sortCriteria} onChange={handleSortChange}>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popularity-desc">Popularity: High to Low</option>
          <option value="popularity-asc">Popularity: Low to High</option>
        </select>
      </div>

      <div className="mainpage-product-list">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="mainpage-product-item-link"
            >
              <div className="mainpage-product-item">
                {/* discount badge pinned top-left if discount > 0 */}
                {product.discount > 0 && (
                  <span className="mainpage-discount-badge">
                    %{product.discount}
                  </span>
                )}
                <img
                  src={product.photo}
                  alt={product.name}
                  className="mainpage-product-image"
                />
                <div className="mainpage-product-details">
                  <h4>{product.name}</h4>
                  {product.discount > 0 ? (
                    <>
                      <span className="mainpage-old-price">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="mainpage-current-price">
                        ${product.current_price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="mainpage-current-price">
                      ${product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      {/* Popular Products Section */}
      <div className="popular-products-section">
        <h3 className="section-title">Discover Popular Products</h3>
        <div className="popular-products-list">
          {loading ? (
            <p>Loading popular products...</p>
          ) : popularProducts.length === 0 ? (
            <p>No popular products found.</p>
          ) : (
            popularProducts.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="popular-product-item-link"
              >
                <div className="popular-product-item">
                  <img
                    src={product.photo}
                    alt={product.name}
                    className="popular-product-image"
                  />
                  <div className="popular-product-details">
                    <h4>{product.name}</h4>
                    <p>
                      {product.ratings.length > 0 && (
                        <span>
                          ⭐{" "}
                          {(
                            product.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
                            product.ratings.length
                          ).toFixed(1)}{" "}
                          ({product.ratings.length} reviews)
                        </span>
                      )}
                    </p>
                    <p>${product.current_price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>




      <div className="discounted-products-section">
        <h2>Discounted Products</h2>
        <div className="discounted-products-list">
          {products
            .filter((product) => product.discount > 0) // Sadece indirimde olan ürünler
            .slice(0, 5) // İlk 5 ürünü göstermek için (isteğe bağlı)
            .map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="mainpage-product-item-link"
              >
                <div className="mainpage-product-item">
                  <span className="mainpage-discount-badge">%{product.discount}</span>
                  <img
                    src={product.photo}
                    alt={product.name}
                    className="mainpage-product-image"
                  />
                  <div className="mainpage-product-details">
                    <h4>{product.name}</h4>
                    <span className="mainpage-old-price">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="mainpage-current-price">
                      ${product.current_price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <Link to="/discounted-products" className="view-more-button">
          See all the discounted products
        </Link>
      </div>

      {/* BRAND LOGOS SECTION (below product grid) */}
      <div className="brand-logos-section">
        <h3 className="brand-logos-title">Our Brands</h3>
        <div className="brand-logos">
          <img src={brandPreo} alt="Preo" />
          <img src={brandApple} alt="Apple" />
          <img src={brandSamsung} alt="Samsung" />
          <img src={brandLG} alt="LG" />
          <img src={brandAsus} alt="Asus" />
          <img src={brandMsi} alt="Msi" />
          <img src={brandFakir} alt="Fakir" />
          <img src={brandBraun} alt="Braun" />
          <img src={brandNikon} alt="Nikon" />
          <img src={brandSony} alt="Sony" />
          {/* Additional brand logos if needed */}
        </div>
      </div>

      {/* INFO ABOUT WEBSITE (with icons) */}
      <div className="info-cards-section">
        <div className="info-card">
          <img
            src={iconGuarantee}
            alt="Guarantee Icon"
            className="info-icon"
          />
          <h4>Extra Guarantee</h4>
          <p>Extend your product’s legal guarantee for peace of mind.</p>
        </div>
        <div className="info-card">
          <img src={iconDelivery} alt="Delivery Icon" className="info-icon" />
          <h4>Fast Delivery</h4>
          <p>Same-day shipping for select cities, next-day for others.</p>
        </div>
        <div className="info-card">
          <img src={iconShipment} alt="Free Shipping Icon" className="info-icon" />
          <h4>Free Shipping Over $150</h4>
          <p>Enjoy free shipping for orders above $150.</p>
        </div>
        <div className="info-card">
          <img src={iconRefund} alt="Refund Icon" className="info-icon" />
          <h4>Easy Refund</h4>
          <p>Return within 30 days if you are not fully satisfied.</p>
        </div>
      </div>

      {/* FOLLOW US SECTION */}
      <div className="follow-us-section">
        <span className="follow-text">Follow Us</span>
        <div className="social-icons">
          <img src={iconFacebook} alt="Facebook" />
          <img src={iconX} alt="X" />
          <img src={iconLinkedIn} alt="LinkedIn" />
          <img src={iconYouTube} alt="YouTube" />
          <img src={iconInstagram} alt="Instagram" />
          <img src={iconWhatsApp} alt="WhatsApp" />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
