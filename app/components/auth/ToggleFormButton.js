import React from 'react';

function ToggleFormButton({ isRegister, onToggle }) {
    return (
        <button className="text-blue-500 mt-2" onClick={onToggle}>
            {isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
        </button>
    );
}

export default ToggleFormButton;
