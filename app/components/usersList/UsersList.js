'use client';

import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import UserItem from './UserItem';
import { UserContext, useUser } from '@/app/context';
import LogoutBtn from './LogoutBtn';

// Initialize socket connection
const socket = io('https://chatapp-zeta-steel.vercel.app/');

const UsersList = () => {
    const [onlineUsersList, setOnlineUsersList] = useState([]);
    const { user } = useUser();
    const { setSelectedUser, usersList } = useContext(UserContext);
    const username = user.username;

    useEffect(() => {

        // Handler to update online users list
        const handleOnlineUsersListUpdate = (list) => {
            console.log('Online Users List Updated:', list);
            setOnlineUsersList(list);
        };

        // Set up socket event listeners
        socket.on('online users list', handleOnlineUsersListUpdate);

        // Emit user info
        const userInfo = { username };
        socket.emit('user info', userInfo);

        // Clean up event listeners on component unmount
        return () => {
            socket.off('online users list', handleOnlineUsersListUpdate);
        };
    }, [username]); // Dependency array to ensure the effect runs when `username` changes

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <ul>
                {usersList.length > 0 ? (
                    usersList.map(user => (
                        <UserItem
                            key={user._id}
                            user={user}
                            isOnline={onlineUsersList.some(onlineUser => onlineUser.username === user.username)}
                            onClick={handleUserClick}
                        />
                    ))
                ) : (
                    <li>No users available</li>
                )}
            </ul>
            <div className="mt-4">
                <LogoutBtn />
            </div>
        </div>
    );
};

export default UsersList;
