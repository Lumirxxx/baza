import React from 'react';

const NewsDeleteConfirmationModal = ({ newsTitle, onDelete, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal_windos-delete">
                <div className="modal-header_delete">
                    Вы уверены, что хотите удалить новость?
                </div>
                <div className="modal-body">
        
               
                    <div className='delete_news-title'>{newsTitle}</div>
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

export default NewsDeleteConfirmationModal;
