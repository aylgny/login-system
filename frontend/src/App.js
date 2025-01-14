/*// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import Signup from './components/Signup'; // Import your Signup component
import MainPage from './components/MainPage';
import ProductPage from "./components/ProductPage";


function App() {
  return (
    <Router>
      <div className="App">
        {
        // Define routes here
        }
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/product/:productId" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
*/
// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import Signup from './components/Signup'; // Import your Signup component
import MainPage from './components/MainPage';
import ProductPage from "./components/ProductPage";
import ShoppingCart from "./components/ShoppingCart";
import Wishlist from "./components/Wishlist";
import PaymentPage from "./components/PaymentPage";
import OrdersPage from "./components/Order";
import AccountPage from "./components/AccountInfo";
import CongratsPage from "./components/CongratsPage";
import OrdersPageAdmin from "./components/OrderAdmin";
import DeliveryListPage from './components/DeliveryListPage';
import ProductUpdate from './components/ProductUpdate';
import ProductManagement from './components/ProductManagement';
import RefundRequests from './components/RefundRequests';
import SalesAdmin from './components/SalesAdmin'; 
import ProductAdmin from './components/ProductAdmin'; 
import Comments from './components/Comments'; 
import DiscountedProducts from "./components/DiscountedProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";



function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
          setUserRole(response.data.status); // Fetch and set the user's status
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/SalesAdmin"
          element={
            <ProtectedRoute userRole={userRole}>
              <SalesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProductAdmin"
          element={
            <ProtectedRoute userRole={userRole}>
              <ProductAdmin />
            </ProtectedRoute>
          }
        />
          {/* Public routes */}
          <Route path="/" element={<MainPage />} /> {/* Main page as default route */}
          <Route path="/mainpage" element={<MainPage />} />

          {/* Login and Signup routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Product page */}
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/productUpdate/:productId" element={<ProductUpdate />} />
          <Route path="/productManagement" element={<ProductManagement />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/payment" element={<PaymentPage />} />

          <Route path="/order" element={<OrdersPage />} />
          <Route path="/account" element={<AccountPage />} />

          <Route path="/congrats/:pdfPath" element={<CongratsPage/>} />
          <Route path="/orderAdmin" element={<OrdersPageAdmin />} />
          <Route path="/deliveryList" element={<DeliveryListPage />} />
          <Route path="/refundRequests" element={<RefundRequests />} />
          
          <Route path="/salesAdmin" element={<SalesAdmin />} /> {/* SalesAdmin route */}
          <Route path="/productAdmin" element={<ProductAdmin />} />
          {/* Comments Management */}
          <Route path="/comments" element={<Comments />} />

          <Route path="/discounted-products" element={<DiscountedProducts />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;