import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import cartIcon from './Images/cart_icon.png';

// Navbar component, handling the top navigation of the app
function Navbar({ cartItems, cartProducts }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to handle dropdown visibility

  // Toggle the visibility of the cart dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Calculate the total price of items in the cart
  const calculateTotal = () => {
    return cartProducts.reduce((total, product) => total + product.price, 0).toFixed(2);
  };

  return (
    <header className="navbar">
      <div className="store-name">Vitamin Shop</div>
      <div className="nav-buttons">
        {/* Navigation links */}
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/admin" className="nav-link">Admin</Link>
        <button className="cart-button" onClick={toggleDropdown}>
          <img src={cartIcon} alt="Cart" className="cart-icon"/>
          {/* Display the number of items in the cart */}
          {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
        </button>
        {isDropdownOpen && (
          <div className="cart-dropdown">
            {/* Display the total price of the items in the cart */}
            <p>Total: ${calculateTotal()}</p>
            <Link to="/checkout" className="checkout-button">Checkout</Link> 
          </div>
        )}
      </div>
    </header>
  );
}

// Export the Navbar component
export default Navbar;
