import React from "react";


// export default DeleteMenuButton
const DeleteMenuButton = ({ menuItem, handleSectionButtonClick, handleDeleteMenu, profile, menu_id }) => {

    return (
        <div className="delete_button_position">

            {(profile.is_staff || profile.is_moderate) && (
                <div className="button_delete-container">
                    <div
                        className="cl-btn-4 delete_button"
                        onClick={() => handleDeleteMenu(menuItem.id)}
                        title="Удалить"
                    > Удалить пункт меню</div>
                </div>
            )}
        </div>
    );
};
export default DeleteMenuButton