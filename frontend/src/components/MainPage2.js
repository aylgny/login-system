import React, { useState } from 'react';
import './MainPage.css'; // Import the CSS file

// Sample product data
const productData = [
    { id: 1, name: 'Product 1', category: 'Electronics', price: '$19.99', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', category: 'Clothing', price: '$29.99', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', category: 'Books', price: '$39.99', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', category: 'Electronics', price: '$49.99', image: 'https://via.placeholder.com/150' },
    // Add more products as needed
];

const MainPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter products based on the selected category
    const filteredProducts = selectedCategory === 'All'
        ? productData
        : productData.filter(product => product.category === selectedCategory);

    return (
        <div className="container">
            {/* Sidebar with Categories */}
            <div className="sidebar">
                <h3>Categories</h3>
                <ul className="category-list">
                    <li className="category-item" onClick={() => setSelectedCategory('All')}>All</li>
                    <li className="category-item" onClick={() => setSelectedCategory('Electronics')}>Electronics</li>
                    <li className="category-item" onClick={() => setSelectedCategory('Clothing')}>Clothing</li>
                    <li className="category-item" onClick={() => setSelectedCategory('Books')}>Books</li>
                </ul>
            </div>

            {/* Main Content Area for Product Listing */}
            <div className="main-content">
                <h2>Products</h2>
                <div className="product-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h4>{product.name}</h4>
                            <p>{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
