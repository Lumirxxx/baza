import React from 'react';
const DeleteConfirmationModal = ({ username, onDelete, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal_windos-delete">
                <div className='modal-header_delete'>Вы уверены, что хотите удалить пользователя?</div>
                <div className="modal-body">
                    <div className='modal-body_delete-login'>Логин</div>
                    <input className='delete_user-input' type="text" value={username} readOnly></input>
                    <div className="modal-actions">
                        <button className="delete-button" onClick={onDelete}>Удалить</button>
                        <button className="cancel-button" onClick={onCancel}>Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;