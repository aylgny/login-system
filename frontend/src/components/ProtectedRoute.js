// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, userRole }) => {
  const allowedRoles = ["product_manager", "sales_manager"]; // Whitelisted roles

  if (!allowedRoles.includes(userRole)) {
    alert("You are not authorized to access this page."); // Optional: Remove in production
    return <Navigate to="/" replace />; // Redirect unauthorized users
  }

  return children; // Render the child components for authorized users
};

export default ProtectedRoute;
