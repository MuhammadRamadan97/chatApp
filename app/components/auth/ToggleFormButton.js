import React from 'react';

function ToggleFormButton({ isRegister, onToggle }) {
    return (
        <button className="text-blue-600 text-lg mt-3 hover:backdrop-opacity-35" onClick={onToggle}>
            {isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
        </button>
    );
}

export default ToggleFormButton;
