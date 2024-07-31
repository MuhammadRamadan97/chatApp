import React, { useState } from 'react';

function AuthenticationForm({ isRegister, onSubmit, isLoading, error }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ username, password });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="mb-4">
                <label className="text-green-500">Username:</label>
                <input
                    className="border border-green-500 rounded-md px-2 py-1 w-64"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="text-green-500">Password:</label>
                <input
                    className="border border-green-500 rounded-md px-2 py-1 w-64"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md" type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : (isRegister ? 'Register' : 'Login')}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
}

export default AuthenticationForm;
