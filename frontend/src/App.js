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
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import Signup from './components/Signup'; // Import your Signup component
import MainPage from './components/MainPage';
import ProductPage from "./components/ProductPage";
import ShoppingCart from "./components/ShoppingCart";
import PaymentPage from "./components/PaymentPage";
import OrdersPage from "./components/Order";
import AccountPage from "./components/AccountInfo";



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainPage />} /> {/* Main page as default route */}
          <Route path="/mainpage" element={<MainPage />} />

          {/* Login and Signup routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Product page */}
          <Route path="/product/:productId" element={<ProductPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/cart" element={<ShoppingCart />} />

          <Route path="/payment" element={<PaymentPage />} />

          <Route path="/order" element={<OrdersPage />} />
          <Route path="/account" element={<AccountPage />} />



        </Routes>
      </div>
    </Router>
  );
}

export default App;