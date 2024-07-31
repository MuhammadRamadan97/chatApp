// utils/cookies.js
export const getCookie = (name) => {
    if (typeof window !== 'undefined') {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    return null; // Return null or a default value if `document` is not available
};