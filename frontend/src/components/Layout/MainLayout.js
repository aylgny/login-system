// src/components/Layout/MainLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header'; // Adjust the path based on your structure
import './MainLayout.css'; // Optional: Create if you need specific styles for the layout

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Renders the child routes */}
      </main>
    </>
  );
};

export default MainLayout;
