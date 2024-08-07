'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { UserContext } from '@/app/context';
import { unstable_noStore as noStore } from 'next/cache';

let socket;

socket = io('https://chatapp-9974.onrender.com/');

export default function ChatContainer() {
    noStore();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, selectedUser } = useContext(UserContext);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Request notification permission
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        const fetchMessages = () => {
            socket.emit('request messages', { userId: user.id, selectedUserId: selectedUser });
        };

        if (socket && user.id && selectedUser) {
            fetchMessages();
        }

        const handleMessages = (fetchedMessages) => {
            setMessages(JSON.parse(fetchedMessages));
            console.log('Fetched messages:', JSON.parse(fetchedMessages));
            setLoading(false);
            scrollToBottom();
        };

        socket.on('response messages', handleMessages);

        // Clean up the effect by removing the listener
        return () => {
            if (socket) {
                socket.off('response messages', handleMessages);
            }
        };
    }, [user.id, selectedUser]);

    useEffect(() => {
        const handleNewMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            scrollToBottom();

            // Send notification if window is not active
            if (document.hidden && Notification.permission === 'granted' && msg.sender !== user.id) {
                new Notification(`New message from ${msg.sender}`, {
                    body: msg.text,
                });
            }
        };

        if (socket) {
            socket.on('chat message', handleNewMessage);
        }

        // Clean up the effect by removing the listener
        return () => {
            if (socket) {
                socket.off('chat message', handleNewMessage);
            }
        };
    }, [selectedUser, user.id]);

    const sendMessage = (text) => {
        if (text.trim() === '') return;

        const newMsg = {
            text,
            sender: user.id,
            receiver: selectedUser,
            time: new Date().toISOString(),
        };

        // Emit the message to the server
        if (socket) {
            socket.emit('chat message', newMsg);
        }
        setMessages((prevMessages) => [...prevMessages, newMsg]);

        scrollToBottom();
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const filteredMessages = messages.filter(
        (msg) =>
            (msg.sender === user.id && msg.receiver === selectedUser) ||
            (msg.sender === selectedUser && msg.receiver === user.id)
    );

    useEffect(() => {
        scrollToBottom();
    }, [filteredMessages]);

    return (
        <div className="flex flex-col h-full">
            {!selectedUser && <h3>Choose a user to begin chatting</h3>}
            {loading ? (
                <div>Loading messages...</div>
            ) : (
                <>
                    <div className="flex-grow overflow-y-auto">
                        <MessageList messages={filteredMessages} />
                        <div ref={messagesEndRef} />
                    </div>

                    {selectedUser && <MessageInput onSendMessage={sendMessage} />}
                </>
            )}
        </div>
    );
}
