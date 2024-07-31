import React from 'react';

const UserStatusIcon = ({ isOnline }) => {
    return (
        <span className={isOnline ? 'text-green-500 mr-2' : 'text-gray-500 mr-2'}>
            ●
        </span>
    );
};

export default UserStatusIcon;
