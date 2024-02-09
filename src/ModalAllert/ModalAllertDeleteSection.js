import React, { useContext } from "react";
import { ModalAllertDeleteSectionContext } from '../Main/Main.js';
const ModalAllertDeleteSection = () => {
    const { handleDeleteSection, sectionId, errorMessage, cancelDeleteSection } = useContext(ModalAllertDeleteSectionContext);
    return (
        <div>
            <div className="modal-container">
                <div className="modal">
                    <div className="modal_alert-content">
                        <div className="modal_alert-text">Вы уверены, что хотите удалить пункт раздела?</div>
                        {errorMessage && <p className="error-message_login">{errorMessage}</p>}
                        <div className="modal-actions">
                            <div className="modal-actions_buttons modal-actions_buttons_red" onClick={() => handleDeleteSection(sectionId)}>Удалить</div>
                            <div className="modal-actions_buttons" onClick={() => cancelDeleteSection()}>Отмена</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ModalAllertDeleteSection