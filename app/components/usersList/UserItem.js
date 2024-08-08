import React from 'react';
import UserStatusIcon from './UserStatusIcon';

const UserItem = ({ user, isOnline, onClick }) => {
    return (
        <li
            className="flex font-bold text-3xl items-center bg-sky-500 mb-3 cursor-pointer rounded-md py-3 px-3 hover:bg-sky-400 transition-colors"
            onClick={() => onClick(user._id)}
        >
            <UserStatusIcon isOnline={isOnline} />
            <span className="text-2xl font-semibold text-white ml-4 flex-1 text-center">{user.username}</span>
        </li>
    );
};

export default UserItem;
