'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create the ContextProvider component
export const UserProvider = ({ children }) => {
    // State for user
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);
    useEffect(() => {
        const storedState = localStorage.getItem('user');
        if (storedState) {
            setUser(JSON.parse(storedState));
        }
        const storedUsersList = localStorage.getItem('usersList');
        if (usersList) {
            setUsersList(JSON.parse(storedUsersList));
        }
    }, []);

    useEffect(() => {
        if (user !== null) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);
    useEffect(() => {
        if (usersList !== null) {
            localStorage.setItem('usersList', JSON.stringify(usersList));
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

