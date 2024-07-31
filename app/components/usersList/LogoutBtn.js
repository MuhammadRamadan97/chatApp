
export default function LogoutBtn() {
    const handleLogout = () => {
        if (typeof document !== 'undefined') {
            // Delete specific cookies
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // Add more cookie deletions if needed

            // Redirect user to the authentication page
            window.location.href = "/auth";
        }
        localStorage.setItem('user', null);
    };

    return (
        <button onClick={handleLogout} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Logout
        </button>
    );
}