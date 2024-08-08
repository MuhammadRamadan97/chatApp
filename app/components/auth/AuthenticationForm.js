import React, { useState } from 'react';

function AuthenticationForm({ isRegister, onSubmit, isLoading, error }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ username, password });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center bg-sky-200 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="mb-6 w-full">
                <input
                    className="border border-teal-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
            </div>
            <div className="mb-6 w-full">
                <input
                    className="border border-teal-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
            </div>
            <button
                className={`w-full py-2 rounded-md text-white font-semibold transition-colors ${isLoading ? 'bg-teal-400' : 'bg-teal-500 hover:bg-teal-600'}`}
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
    );
}

export default AuthenticationForm;
