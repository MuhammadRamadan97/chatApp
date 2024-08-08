import { useUser } from '@/app/context';
import React from 'react';
import { format, isSameDay, parseISO, isToday, isYesterday } from 'date-fns';

export default function Message({ message, previousMessage }) {
    const { user } = useUser();
    const isCurrentUser = message.sender === user.id;

    if (!message) return null;

    // Helper function to check if the message text contains Arabic characters
    const containsArabic = (text) => /[\u0600-\u06FF\u0750-\u077F]/.test(text);

    const isArabic = containsArabic(message.text);

    // Format the message time (e.g., "hh:mm a" for time)
    const formattedTime = format(parseISO(message.time), 'hh:mm a');

    // Determine if we need to show the date separator
    const showDateSeparator = !previousMessage || !isSameDay(parseISO(message.time), parseISO(previousMessage.time));

    // Format the date (e.g., "Today", "Yesterday", "Friday 13 May")
    let formattedDate;
    if (isToday(parseISO(message.time))) {
        formattedDate = "Today";
    } else if (isYesterday(parseISO(message.time))) {
        formattedDate = "Yesterday";
    } else {
        formattedDate = format(parseISO(message.time), 'EEEE d MMM');
    }

    return (
        <div className="message">
            {showDateSeparator && (
                <div className="flex justify-center">
                    <div className="date-separator rounded-md text-center bg-slate-300 text-gray-700 text-lg mt-4 mb-2 px-3 py-1">
                        {formattedDate}
                    </div>
                </div>
            )}
            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`pt-2 pb-2 font-mono ${isCurrentUser ? 'pl-3 pr-1' : 'justify-start pr-3 pl-1'} ${isArabic ? 'marhey-font' : ''} rounded-lg m-1 text-lg max-w-xs ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-emerald-300 text-black'}`}
                    aria-label={isCurrentUser ? 'Your message' : `Message from ${message.sender}`}
                    style={{ direction: isArabic ? 'rtl' : 'ltr', textAlign: isArabic ? 'right' : 'left' }}
                >
                    <p>{message.text}</p>
                    <span className={`text-xs ${isCurrentUser ? 'text-teal-300' : 'text-fuchsia-500'}`} style={{ userSelect: 'none' }}>
                        {formattedTime}
                    </span>
                </div>
            </div>
        </div>
    );
}
