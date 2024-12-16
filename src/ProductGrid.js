import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import './ProductGrid.css';

const ProductGrid = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://four30finalback-1.onrender.com/');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched products:", data);  // Log the fetched data
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-grid">
      {products
      .slice(0, 8)
      .filter(product => product.product_name && product.product_name.length <= 30)
      .map(product => (
        <div key={product.product_id} className="product-card">
          {/* Placeholder image since there's no image data */}
          <img src={`/Images/${product.product_id}.jpg`} alt={product.product_name}  onError={(e) => e.target.src = '/images/default.jpg'}/>
          <h3 className="product-title">{product.product_name || "Untitled Product"}</h3>
          <p className="product-price"><strong>${product.price.toFixed(2)}</strong></p>
          <button className="add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
