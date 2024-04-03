
import React, { useContext } from "react";
import { DeleteArticleButtonContext } from '../Main/Main.js';

const DeleteArticleButton = () => {
    const { profile, deleteArticleModal } = useContext(DeleteArticleButtonContext);

    return (
        <div>
            {(profile.is_staff || profile.is_moderate) && (
                <div className="cl-btn-4 delete_button delete_button_article" onClick={() => deleteArticleModal()} title="Удалить"> Удалить статью </div>
            )}
        </div>
    )
}


export default DeleteArticleButton
