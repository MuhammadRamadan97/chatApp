'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create the ContextProvider component
export const UserProvider = ({ children }) => {
    // State for user
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedState = localStorage.getItem('user');
        if (storedState) {
            setUser(JSON.parse(storedState));
        }
    }, []);

    useEffect(() => {
        if (user !== null) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);
    useEffect(() => {
        console.log('Current user:', user); // Log the current user
    }, [user]);

    // State for selectedUser
    const [selectedUser, setSelectedUser] = useState(null);



    return (
        <UserContext.Provider value={{ user, setUser, selectedUser, setSelectedUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};

