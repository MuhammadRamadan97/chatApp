'use client';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AuthenticationForm from './AuthenticationForm';
import ToggleFormButton from './ToggleFormButton';
import { UserContext } from '@/app/context';

function AuthenticationPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const router = useRouter();
    const { setUser, setUsersList } = useContext(UserContext);

    const handleSubmit = async ({ username, password }) => {
        setError('');
        setIsLoading(true); // Set loading state to true

        try {
            let response;
            if (isRegister) {
                response = await axios.post('/api/user/register', { username, password });
            } else {
                response = await axios.post('/api/user/login', { username, password });
            }

            // Save token in cookie
            document.cookie = `token=${response.data.token}; expires=1`;

            // Set user context
            setUser({ username: response.data.result.username, id: response.data.result._id });
            setUsersList(response.data.usersList.filter(user => user.username !== username));

            // Navigate to home page
            router.push('/');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError('Invalid credentials');
                } else if (error.response.status === 404) {
                    setError('User not found');
                } else {
                    setError('Something went wrong');
                }
            } else {
                setError('Something went wrong');
            }
        } finally {
            setIsLoading(false); // Set loading state to false after login attempt
        }
    };

    const handleToggleForm = () => {
        setIsRegister(!isRegister);
        setError('');
    };

    return (
        <div className="bg-sky-300 p-4 rounded-lg flex flex-col items-center justify-center" style={{ height: '100vh', width: '100vw' }}>
            <h2 className="text-4xl font-bold mb-4 text-blue-700 ">{isRegister ? 'Register' : 'Login'}</h2>
            <AuthenticationForm
                isRegister={isRegister}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
            />
            <ToggleFormButton isRegister={isRegister} onToggle={handleToggleForm} />
        </div>
    );
}

export default AuthenticationPage;
