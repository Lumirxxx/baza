import React, { useContext } from "react";
import { ModalAllertDeleteArticleContext } from '../Main/Main.js';



const ModalAllertDeleteArticle = () => {
    const { handleDeleteArticle, selectedArticle, cancelArticleModal, } = useContext(ModalAllertDeleteArticleContext)
    return (
        <div>
            <div className="modal-container">
                <div className="modal">
                    <div className="modal_alert-content">
                        <div className="modal_alert-text">Вы уверены, что хотите удалить статью?</div>
                        <div className="modal-actions">
                            <div className="modal-actions_buttons modal-actions_buttons_red" onClick={() => handleDeleteArticle(selectedArticle.id)}>Удалить</div>
                            <div className="modal-actions_buttons" onClick={() => cancelArticleModal()}>Отмена</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ModalAllertDeleteArticle