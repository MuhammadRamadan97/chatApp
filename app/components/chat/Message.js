import { useUser } from '@/app/context';
import React from 'react';

export default function Message({ message }) {
    const { user } = useUser();
    const isCurrentUser = message.sender === user.id;

    if (!message) return null;

    // Helper function to check if the message text contains Arabic characters
    const containsArabic = (text) => /[\u0600-\u06FF\u0750-\u077F]/.test(text);

    const isArabic = containsArabic(message.text);

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`pt-2 pb-2 pr-1 pl-1 rounded-lg  m-1 max-w-xs ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                aria-label={isCurrentUser ? 'Your message' : `Message from ${message.sender}`}
                style={{ direction: isArabic ? 'rtl' : 'ltr', textAlign: isArabic ? 'right' : 'left' }}
            >
                <p>{message.text}</p>
            </div>
        </div>
    );
}
