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
import MainLayout from './components/Layout/MainLayout'; // Import the MainLayout

import Login from './components/Login'; // Import your Login component
import Signup from './components/Signup'; // Import your Signup component
import MainPage from './components/MainPage';
import ProductPage from "./components/ProductPage";
import ShoppingCart from "./components/ShoppingCart";
import InvoicesPage from "./components/InvoicesPage";
import OrderPage from "./components/Order";


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that use the MainLayout (with Header) */}
        <Route element={<MainLayout />}>
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/" element={<MainPage />} /> {/* Main page as default route */}
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />

          {/* Invoice page */}
          <Route path="/invoices/" element={<InvoicesPage />} />
          <Route path="/orders/" element={<OrderPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
          {/* Add more routes that should include the Header here */}
        </Route>

        {/* Routes that do NOT use the MainLayout (without Header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Add more auth or standalone routes here */}
      </Routes>
    </Router>
  );
}


export default App;
