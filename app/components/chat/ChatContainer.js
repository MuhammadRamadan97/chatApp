'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { UserContext } from '@/app/context';

let socket;


socket = io('https://chatapp-9974.onrender.com/');
export default function ChatContainer() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, selectedUser } = useContext(UserContext);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/messages', { cache: 'no-store' });
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                    console.log(response.data);
                } else {
                    console.error('Invalid response data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Listen for new messages
        const handleNewMessage = (msg) => {

            setMessages((prevMessages) => [...prevMessages, msg]);

            scrollToBottom();



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
