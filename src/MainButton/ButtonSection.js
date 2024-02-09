import React, { useContext } from "react";
import { ButtonSectionContext } from '../Main/Main.js';
const ButtonSection = () => {
    const { sectionId, section, handleArticleButtonClick } = useContext(ButtonSectionContext);
    return (
        <div>
            <div
                className={`section_button ${(sectionId == section.id) ? 'active' : ''}`}
                title={section.name}
                onClick={() => handleArticleButtonClick(section.id)}
            >
                <div className="section_button_content" >
                    <div className="section_img_container">

                        {section.img && <img className="section_img" src={section.img} alt="Section Image" />}

                    </div>
                    <div className="section_name">{section.name}</div>
                </div>
            </div>
        </div>
    )
}
export default ButtonSection;