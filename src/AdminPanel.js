import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({
        name: '',
        stock: '',
        price: ''
    });
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        category: '',
        thumbnail: ''
    });

    useEffect(() => {
        fetch('https://four30finalback-1.onrender.com/')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleEditProduct = (product) => {
        setEditingProduct(product.product_id);
        setUpdatedProduct({
            name: product.product_name,
            stock: product.stock,
            price: product.price
        });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setUpdatedProduct({ name: '', stock: '', price: '' });
    };

    const handleUpdateProduct = async (productId) => {
        try {
            const response = await fetch(`https://four30finalback-1.onrender.com/admin/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    new_name: updatedProduct.name,
                    new_stock: updatedProduct.stock,
                    new_price: updatedProduct.price
                })
            });
            const result = await response.json();
            alert(result.message);

            setProducts(products.map(product => 
                product.product_id === productId
                    ? { ...product, product_name: updatedProduct.name, stock: updatedProduct.stock, price: updatedProduct.price }
                    : product
            ));

            handleCancelEdit();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleAddProduct = async () => {
        try {
            const response = await fetch('https://four30finalback-1.onrender.com/add_product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    new_p_name: newProduct.name,
                    new_p_price: newProduct.price,
                    new_p_stock: newProduct.stock,
                    new_p_cat: newProduct.category
                })
            });
            const result = await response.json();
            alert(result.message);

            fetch('https://four30finalback-1.onrender.com/')
                .then(response => response.json())
                .then(data => setProducts(data))
                .catch(error => console.error('Error fetching products:', error));

            setNewProduct({ name: '', price: '', stock: '', category: '', thumbnail: '' });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="stock-management-container">
                <div className="stock-management">
                    <h3>Manage Products</h3>
                    <ul>
                        {products.map(product => (
                            <li key={product.product_id} className="product-item">
                                {editingProduct === product.product_id ? (
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
                                    <div className="product-details">
                                        <img src={`/Images/${product.product_id}.jpg`} alt={product.product_name}  onError={(e) => e.target.src = '/images/default.jpg'} className='product-thumbnail'/>
                                        <div className="product-info">
                                            <strong>{product.product_name}</strong> - ${product.price} - {product.stock} in stock
                                        </div>
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
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Name"
                    />
                    <input
                        type="number"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Price"
                    />
                    <input
                        type="number"
                        value={newProduct.stock}
                        onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="Stock"
                    />
                    <input
                        type="text"
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        placeholder="Category"
                    />
                    <input
                        type="text"
                        value={newProduct.thumbnail}
                        onChange={e => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
                        placeholder="Thumbnail URL"
                    />
                    <button onClick={handleAddProduct}>Add Product</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
