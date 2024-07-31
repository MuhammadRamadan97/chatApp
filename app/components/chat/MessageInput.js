import React, { useState } from 'react';

export default function MessageInput({ onSendMessage, disabled }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (disabled) return;
        onSendMessage(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border p-2 w-full"
                placeholder="Type a message..."
                disabled={disabled}
            />
            <button
                type="submit"
                className={`mt-2 px-4 py-2 rounded ${disabled ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                disabled={disabled}
            >
                Send
            </button>
        </form>
    );
}
