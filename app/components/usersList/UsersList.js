'use client';

import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import UserItem from './UserItem';
import { UserContext, useUser } from '@/app/context';
import LogoutBtn from './LogoutBtn';

const socket = io('https://chatapp-9974.onrender.com/');

const UsersList = () => {
    const [usersList, setUsersList] = useState([]);
    const [onlineUsersList, setOnlineUsersList] = useState([]);
    const username = useUser().user.username;
    const { setSelectedUser } = useContext(UserContext);

    useEffect(() => {
        // Fetch the list of users excluding the current user
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/users/');
                setUsersList(response.data.filter(user => user.username !== username));
                console.log('Users:', response.data);
            } catch (error) {
                console.error('Something went wrong', error);
            }
        };

        fetchData();
    }, [username]);

    useEffect(() => {
        socket.on('online users list', (onlineUsersList) => {
            setOnlineUsersList(onlineUsersList);
        });

        const user = {
            username,
        };

        socket.emit('user info', user);

        // Clean up the event listener when component unmounts
        return () => {
            socket.off('online users list');
        };
    }, [username]);

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
