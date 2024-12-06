// CartContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { currentUserId } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.product_id === product.product_id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const updateItemQuantity = (productId, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product_id === productId ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
    };

    // Save the cart to the database
    const saveCartToDB = async () => {
        if (!currentUserId) return;

        try {
            const response = await fetch('http://127.0.0.1:8080/cart/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUserId, cart_items: cartItems })
            });

            if (!response.ok) {
                throw new Error(`Error saving cart: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error saving cart to database:", error);
        }
    };

    // Fetch the cart from the database when the user logs in
    const fetchCartFromDB = async () => {
        if (!currentUserId) return;

        try {
            const response = await fetch(`http://127.0.0.1:8080/cart/${currentUserId}`);
            if (!response.ok) {
                throw new Error(`Error fetching cart: ${response.statusText}`);
            }
            const data = await response.json();
            setCartItems(data); // Set cart items based on response
        } catch (error) {
            console.error("Error fetching cart from database:", error);
        }
    };

    // Checkout function that deducts stock from the database
    const checkout = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUserId, cart_items: cartItems })
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                setCartItems([]); // Clear cart on successful checkout
            } else {
                alert(data.message || "Checkout failed.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred during checkout.");
        }
    };

    useEffect(() => {
        if (currentUserId) {
            saveCartToDB();
        }
    }, [cartItems, currentUserId]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateItemQuantity, removeFromCart, fetchCartFromDB, checkout }}>
            {children}
        </CartContext.Provider>
    );
};
