'use client';

import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import UserItem from './UserItem';
import { UserContext, useUser } from '@/app/context';
import LogoutBtn from './LogoutBtn';

const socket = io('https://chatapp-9974.onrender.com/');

const UsersList = () => {
    const [usersList, setUsersList] = useState([]);
    const [onlineUsersList, setOnlineUsersList] = useState([]);
    const username = useUser().user.username;
    const { setSelectedUser, selectedUser } = useContext(UserContext);

    useEffect(() => {
        socket.on('users list', (usersList) => {
            setUsersList(usersList.filter(user => user.username !== username));
            console.log(usersList);
        });

        socket.on('online users list', (onlineUsersList) => {
            setOnlineUsersList(onlineUsersList);
        });

        const user = {
            username,
        };

        socket.emit('user info', user);

        // Clean up the event listeners when component unmounts
        return () => {
            socket.off('users list');
            socket.off('online users list');
        };
    }, []);

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <ul>
                {usersList.map(user => (
                    <UserItem
                        key={user._id}
                        user={user}
                        isOnline={onlineUsersList.some(onlineUser => onlineUser.username === user.username)}
                        onClick={handleUserClick}
                    />
                ))}
            </ul>
            <div className="mt-4">
                <LogoutBtn />
            </div>
        </div>
    );
};

export default UsersList;
