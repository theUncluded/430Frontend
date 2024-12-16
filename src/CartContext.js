import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { currentUserId } = useContext(UserContext);
    const [cartItems, setCartItems] = useState([]);

    // Persist cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Initialize cart from local storage on app load
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cartItems'));
        console.log("Loaded cart from localStorage:", savedCart); // Debug log
        if (savedCart) {
            setCartItems(savedCart);
        }
    }, []);
    useEffect(() => {
        if (currentUserId && cartItems.length > 0) {
            console.log('Cart items changed, saving to DB:', cartItems); // Debug log
            saveCartToDB(); // Save updated cart to the database
        }
    }, [cartItems, currentUserId]); // Trigger whenever `cartItems` or `currentUserId` changes
    
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
        console.log('Attempting to save cart to DB:', cartItems); // Log cart items being sent
        if (!currentUserId) {
            console.error('No user ID found, skipping save.');
            return;
        }
    
        try {
            const response = await fetch('https://four30finalback-1.onrender.com/cart/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId,
                    cart_items: cartItems,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Error saving cart: ${response.statusText}`);
            }
    
            console.log('Cart saved to database successfully.');
        } catch (error) {
            console.error('Error saving cart to database:', error);
        }
    };
    

    // Fetch the cart from the database when the user logs in
    const fetchCartFromDB = async () => {
        if (!currentUserId) return;
    
        try {
            const response = await fetch(`https://four30finalback-1.onrender.com/cart/${currentUserId}`);
            if (!response.ok) throw new Error('Failed to fetch cart from DB');
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart from database:", error);
        }
    };
    

    // Merge local cart and backend cart (prioritize local cart quantities)
    const mergeCarts = (backendCart, localCart) => {
        const merged = [...backendCart];

        localCart.forEach((localItem) => {
            const existingItem = merged.find(item => item.product_id === localItem.product_id);
            if (existingItem) {
                existingItem.quantity = localItem.quantity; // Prioritize local quantity
            } else {
                merged.push(localItem);
            }
        });

        return merged;
    };

    // Checkout function that deducts stock from the database
    const checkout = async () => {
        try {
            const response = await fetch('https://four30finalback-1.onrender.com/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUserId, cart_items: cartItems })
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                setCartItems([]); // Clear cart on successful checkout
                localStorage.removeItem('cart'); // Clear local storage
            } else {
                alert(data.message || "Checkout failed.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred during checkout.");
        }
    };

    // Sync cart with backend when user logs in
    useEffect(() => {
        if (currentUserId) {
            fetchCartFromDB();
        }
    }, [currentUserId]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateItemQuantity,
                removeFromCart,
                fetchCartFromDB,
                checkout,
                saveCartToDB,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
