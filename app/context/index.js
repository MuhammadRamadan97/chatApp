'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create the ContextProvider component
export const UserProvider = ({ children }) => {
    // State for user
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);

    // Load user and usersList from localStorage on mount
    useEffect(() => {
        console.log('Component mounted');
        const storedUser = localStorage.getItem('user');
        const storedUsersList = localStorage.getItem('usersList');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log('User loaded from localStorage:', JSON.parse(storedUser));
        } else {
            console.log('No user found in localStorage');
        }

        if (storedUsersList) {
            setUsersList(JSON.parse(storedUsersList));
            console.log('Users list loaded from localStorage:', JSON.parse(storedUsersList));
        } else {
            console.log('No users list found in localStorage');
        }
    }, []);

    // Save user to localStorage when it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log('User saved to localStorage:', user);
        }
    }, [user]);

    // Save usersList to localStorage when it changes
    useEffect(() => {
        if (usersList.length > 0) {
            localStorage.setItem('usersList', JSON.stringify(usersList));
            console.log('Users list saved to localStorage:', usersList);
        }
    }, [usersList]);

    // State for selectedUser
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser, selectedUser, setSelectedUser, usersList, setUsersList }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};
