import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Load user data from local storage on app load
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');

        if (storedUserId && storedUserName) {
            setCurrentUserId(parseInt(storedUserId));
            setUserName(storedUserName);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (userId, name) => {
        // Set user state
        setCurrentUserId(userId);
        setUserName(name);
        setIsLoggedIn(true);

        // Store user data in local storage
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', name);
    };

    const handleLogout = () => {
        setCurrentUserId(null);
        setUserName('');
        setIsLoggedIn(false);

        // Clear user data from local storage
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    };

    return (
        <UserContext.Provider value={{ currentUserId, userName, isLoggedIn, handleLogin, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};
