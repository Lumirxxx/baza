import React, { useEffect } from 'react';

const SnackBarUsers = ({ message, isOpen, onClose, type }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Автоматически закрыть через 3 секунды
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Условное определение цвета
    const backgroundColor = type === 'delete' ? '#FF5A5A' : '#38B15A'; // Красный для удаления, зеленый для добавления/редактирования

    return (
        <div className="snackbar_users" style={{ backgroundColor }}>
            <div className="snackbar-content">
                <img src='./tick-square.svg'></img>
                <span className="snackbar-message">{message}</span>
            </div>
        </div>
    );
};

export default SnackBarUsers;
