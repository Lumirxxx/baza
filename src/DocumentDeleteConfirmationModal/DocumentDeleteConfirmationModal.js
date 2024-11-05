import React from 'react';

const DocumentDeleteConfirmationModal = ({ documentName, contractInfo, onDelete, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal_windos-delete">
                <div className="modal-header_delete">
                    Вы уверены, что хотите удалить документ?
                </div>
                <div className="modal-body">
                    <div className='delete_document-title'>{documentName}</div>
                    <div className='delete_document-contract'>{contractInfo}</div>
                    <div className="modal-actions">
                        <button className="delete-button" onClick={onDelete}>
                            Удалить
                        </button>
                        <button className="cancel-button" onClick={onCancel}>
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDeleteConfirmationModal;
