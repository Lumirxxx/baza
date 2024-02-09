
import React, { useContext } from "react";
import { ButtonMenuContext } from '../Main/Main.js';


const ButtonMenu = () => {
    const { menu_id, menuItem, handleSectionButtonClick } = useContext(ButtonMenuContext);
    return (
        <div>
            <button
                className={`button_body ${(menu_id == menuItem.id) ? 'active' : ''}`}
                key={menuItem.id}
                onClick={() => handleSectionButtonClick(menuItem.id)}
            >
                <img className="menu_img" src={menuItem.img} alt="" />
                <div className="button_text">{menuItem.name}</div>
            </button>
        </div>
    )
}

export default ButtonMenu