import React from 'react';
import UserStatusIcon from './UserStatusIcon';

const UserItem = ({ user, isOnline, onClick }) => {
    return (
        <li
            key={user._id}
            className="flex items-center bg-gray-200 mb-2 cursor-pointer"
            onClick={() => onClick(user._id)}
        >
            <UserStatusIcon isOnline={isOnline} />
            <span className="text-lg">{user.username}</span>
        </li>
    );
};

export default UserItem;
