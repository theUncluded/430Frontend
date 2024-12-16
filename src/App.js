import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Navbar';
import ProductList from './ProductList';
import ProductGrid from './ProductGrid';
import AdminPanel from './AdminPanel';
import Checkout from './Checkout';
import { ProductProvider } from './ProductContext';
import { CartProvider } from './CartContext';
import { UserProvider } from './UserContext';
import './App.css';

function App() {
    return (
        <ProductProvider>
            <UserProvider> {/* UserProvider wraps CartProvider */}
                <CartProvider>
                    <Router>
                        <div className="App">
                            <Header />
                            <Routes>
                                <Route path="/" element={<ProductGrid />} />
                                <Route path="/products" element={<ProductList />} />
                                <Route path="/admin" element={<AdminPanel />} />
                                <Route path="/checkout" element={<Checkout />} />
                            </Routes>
                        </div>
                    </Router>
                </CartProvider>
            </UserProvider>
        </ProductProvider>
    );
}

export default App;
