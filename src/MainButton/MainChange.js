import React from "react";

const MainChange = () => {
    const handleButtonClick = () => {
        // Обработчик событий для кнопки
        console.log("Кнопка нажата");
    };

    return (
        <div className="button_body" onClick={handleButtonClick}>
            <div className="button_img_container">
                <img src="./MainChange.svg" className="button_img"></img>
            </div>
            <div className="button_text">Версии / ChangeLog</div>
        </div>
    );
};

export default MainChange;
