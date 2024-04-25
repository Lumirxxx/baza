import React, { useContext } from "react";
import { ModalAllertDeleteMenuContext } from '../Main/Main.js';

const ModalAllertDeleteMenu = () => {
    const { showDeleteConfirmation, errorMessage, confirmDeleteMenu, cancelDeleteMenu } = useContext(ModalAllertDeleteMenuContext);

    return (
        <div>
            {showDeleteConfirmation && (
                <div className="modal_main-window">
                    <div className="modal_alert-content">

                        <div className="modal_alert-text">Вы уверены, что хотите удалить пункт меню?</div>
                        {errorMessage && <p className="error-message_login">{errorMessage}</p>}
                        <div className="modal-actions">
                            <div className="modal-actions_buttons modal-actions_buttons_red" onClick={confirmDeleteMenu}>Удалить</div>
                            <div className="modal-actions_buttons" onClick={cancelDeleteMenu}>Отмена</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default ModalAllertDeleteMenu