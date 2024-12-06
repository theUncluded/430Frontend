import React, { useState, useEffect } from 'react';
import './AdminPanel.css';  // Import the CSS file

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // Track the product being edited
    const [updatedProduct, setUpdatedProduct] = useState({
        name: '',
        price: '',
        stock: ''
    });
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        category: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch products data from the root route
    // Fetch products data from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://nrrj2nu1b2.execute-api.us-east-1.amazonaws.com/dev');
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        }, []);
        
    // Handle editing product
    const handleEditProduct = (product) => {
        setEditingProduct(product.product_id);
        setUpdatedProduct({
            name: product.product_name,
            price: product.price,
            stock: product.stock
        });
    };

    // Handle updating the product
    const handleUpdateProduct = async (productId) => {
        const response = await fetch('https://nrrj2nu1b2.execute-api.us-east-1.amazonaws.com/dev/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                new_name: updatedProduct.name,
                new_price: updatedProduct.price,
                new_stock: updatedProduct.stock,
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Product updated successfully');
            setProducts(products.map(product =>
                product.product_id === productId ? { ...product, ...updatedProduct } : product
            ));
            setEditingProduct(null);  // Stop editing
        } else {
            alert('Failed to update product');
        }
    };

    // Handle cancelling the edit
    const handleCancelEdit = () => {
        setEditingProduct(null); // Reset editing mode
        setUpdatedProduct({
            name: '',
            price: '',
            stock: ''
        }); // Clear input fields
    };

    // Handle adding a new product
    const handleAddProduct = async () => {
        const response = await fetch('https://nrrj2nu1b2.execute-api.us-east-1.amazonaws.com/dev/add_product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                new_p_name: newProduct.name,
                new_p_price: newProduct.price,
                new_p_stock: newProduct.stock,
                new_p_cat: newProduct.category
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Product added successfully');
            setProducts([...products, newProduct]); // Update products list
            setNewProduct({ name: '', price: '', stock: '', category: '' }); // Reset form
        } else {
            alert('Failed to add product');
        }
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            
            <div className="stock-management-container">
                <div className="stock-management">
                    <h3>Manage Products</h3>
                    <ul>
                        {products.map(product => (
                            <li key={product.product_id} className="product-item">
                                {editingProduct === product.product_id ? (
                                    // Display inputs if product is being edited
                                    <div className="product-edit">
                                        <input
                                            type="text"
                                            value={updatedProduct.name}
                                            onChange={e => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                                            placeholder="name"
                                        />
                                        <input
                                            type="number"
                                            value={updatedProduct.stock}
                                            onChange={e => setUpdatedProduct({ ...updatedProduct, stock: e.target.value })}
                                            placeholder="stock"
                                        />
                                        <input
                                            type="number"
                                            value={updatedProduct.price}
                                            onChange={e => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                                            placeholder="price"
                                        />
                                        <div className="edit-buttons">
                                            <button onClick={() => handleUpdateProduct(product.product_id)}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    // Display product details if not editing
                                    <div className="product-details">
                                        <strong>{product.product_name}</strong> - ${product.price} - {product.stock} in stock
                                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="stock-creation">
                    <h3>Add New Product</h3>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                    <button onClick={handleAddProduct}>Add Product</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
