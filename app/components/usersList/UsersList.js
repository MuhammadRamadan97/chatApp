'use client';

import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import UserItem from './UserItem';
import { UserContext, useUser } from '@/app/context';
import LogoutBtn from './LogoutBtn';

// Initialize socket connection
socket = io('https://chatapp-1-5zsg.onrender.com');

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
        <div className="flex flex-col p-4 bg-sky-300 h-full w-full">
            <ul className="space-y-2 overflow-y-auto flex-grow">
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
                    <li className="text-gray-600">No users available</li>
                )}
            </ul>
            <div className="mt-auto w-full text-center">
                <LogoutBtn />
            </div>
        </div>
    );
};

export default UsersList;
