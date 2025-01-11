import React, { useState, useEffect } from 'react';
import './ProductManagement.css';
import Layout from './Layout';
import axios from 'axios';

// Modal Component
const Modal = ({ show, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (show) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// Component to display individual product details
const ProductItem = ({ product, onDelete, onUpdateQuantity }) => {
  const [newQuantity, setNewQuantity] = useState(product.quantity);

  const handleQuantityChange = (e) => {
    setNewQuantity(e.target.value);
  };

  const handleUpdate = () => {
    onUpdateQuantity(product._id, parseInt(newQuantity, 10));
  };

  return (
    <div className="product-item">
      <div className="product-details">
        <p><strong>Product ID:</strong> {product._id}</p>
        <p><strong>Product Name:</strong> {product.name}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
      </div>
      <div className="product-actions">
        <input type="number" value={newQuantity} onChange={handleQuantityChange} placeholder="New Quantity" />
        <button onClick={handleUpdate}>Update Quantity</button>
        <button onClick={() => onDelete(product._id)}>Delete</button>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    category: '',
    name: '',
    model: '',
    serialNumber: '',
    description: '',
    quantity: '',
    price: '',
    warrantyStatus: false,
    distributor: '',
    photo: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/deleteProduct/${productId}`);
      fetchProducts(); // Refresh product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put('/api/products/quantity', { productId, newQuantity });
      fetchProducts(); // Refresh product list after updating quantity
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('/api/addProduct', newProduct);
      fetchProducts(); // Refresh product list after adding new product
      setShowAddProductForm(false);
      setNewProduct({
        category: '',
        name: '',
        model: '',
        serialNumber: '',
        description: '',
        quantity: '',
        price: '',
        warrantyStatus: false,
        distributor: '',
        photo: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <Layout>
      <div className="product-management">
        <div className="header">
          <h2>Product Management</h2>
          <button onClick={() => setShowAddProductForm(true)}>Add Product</button>
        </div>

        {showAddProductForm && (
          <Modal show={showAddProductForm} onClose={() => setShowAddProductForm(false)}>
            <h2>Add New Product</h2>
            <div className="input-group">
              <input type="text" name="category" value={newProduct.category} onChange={handleInputChange} placeholder="Category" />
            </div>
            <div className="input-group">
              <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" />
            </div>
            <div className="input-group">
              <input type="text" name="model" value={newProduct.model} onChange={handleInputChange} placeholder="Model" />
            </div>
            <div className="input-group">
              <input type="text" name="serialNumber" value={newProduct.serialNumber} onChange={handleInputChange} placeholder="Serial Number" />
            </div>
            <div className="input-group">
              <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" />
            </div>
            <div className="input-group">
              <input type="number" name="quantity" value={newProduct.quantity} onChange={handleInputChange} placeholder="Quantity" />
            </div>
            <div className="input-group">
              <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price" />
            </div>
            <div className="input-group">
              <input type="text" name="distributor" value={newProduct.distributor} onChange={handleInputChange} placeholder="Distributor" />
            </div>
            <div className="input-group">
              <input type="text" name="photo" value={newProduct.photo} onChange={handleInputChange} placeholder="Photo URL" />
            </div>
            <div className="input-group">
              <label>
                Warranty Status:
                <input type="checkbox" name="warrantyStatus" checked={newProduct.warrantyStatus} onChange={(e) => setNewProduct({ ...newProduct, warrantyStatus: e.target.checked })} />
              </label>
            </div>
            <button className="submit-button" onClick={handleAddProduct}>Submit</button>
          </Modal>
        )}

        <div className="product-list">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                onDelete={handleDeleteProduct}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductManagement;