import React, { useContext } from "react";
import { DeleteSectionButtonContext } from '../Main/Main.js';

const DeleteSectionButton = () => {
    const { profile, deleteSectionModal, sectionId, section } = useContext(DeleteSectionButtonContext);

    return (
        <div className="delete_button_position">
            {(profile.is_staff || profile.is_moderate) && (
                <div>
                    <div className="cl-btn-4" onClick={() => deleteSectionModal(section.id)} title="Удалить">Удалить данный пункт</div>
                </div>
            )}
        </div>
    );
}

export default DeleteSectionButton;