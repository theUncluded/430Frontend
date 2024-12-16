import React, { useState, useContext, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { UserContext } from './UserContext';
import { useCart } from './CartContext';
import Login from './Login';
import Cart from './Cart';

function Navbar() {
  const [click, setClick] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { handleLogin, handleLogout, isLoggedIn, userName } = useContext(UserContext);
  const { cartItems, fetchCartFromDB } = useCart();

  // Search functionality state
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);

  const handleClick = () => setClick(!click);

  const toggleLoginModal = () => {
    setLoginModalOpen(prev => !prev);
  };

  const toggleCart = () => {
    setCartOpen(prev => !prev);
  };

  const handleLoginSuccess = (userId, name) => {
    handleLogin(userId, name);
    fetchCartFromDB(userId);
    setLoginModalOpen(false);
  };

  // Fetch products for search suggestions
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://four30finalback-1.onrender.com/');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Search handling functions
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      setSuggestions(products.filter(product =>
        product.product_name.toLowerCase().includes(term.toLowerCase())
      ));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.product_name);
    setSuggestions([]);
    handleSearchSubmit();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            Vitamin Store
            <i className="fas fa-code"></i>
          </NavLink>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
            />
            {suggestions.length > 0 && (
              <div className="autocomplete-container">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="autocomplete-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.product_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink exact to="/" activeClassName="active" className="nav-links" onClick={handleClick}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/products" activeClassName="active" className="nav-links" onClick={handleClick}>
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/admin" activeClassName="active" className="nav-links" onClick={handleClick}>
                Admin
              </NavLink>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <div className="user-menu">
                  <NavLink to="#" className="nav-links" onClick={(e) => e.preventDefault()}>
                    {userName}
                  </NavLink>
                  <div className="user-menu-content">
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              ) : (
                <NavLink to="#" className="nav-links" onClick={(e) => {
                  e.preventDefault();
                  toggleLoginModal();
                }}>
                  Login
                </NavLink>
              )}
            </li>
          </ul>

          <div className="cart-icon" onClick={toggleCart}>
            <img 
              src="/Images/cart_icon.png" 
              alt="Cart Icon" 
              style={{ width: '50px', height: '50px' }} 
            />
            <span className="cart-count">
              {cartItems.reduce((count, item) => count + item.quantity, 0)}
            </span>
          </div>

          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
          </div>
        </div>
      </nav>

      <Login 
        isOpen={isLoginModalOpen} 
        onClose={toggleLoginModal} 
        onLoginSuccess={handleLoginSuccess}  
      />

      {cartOpen && <Cart onClose={toggleCart} />}
    </>
  );
}

export default Navbar;