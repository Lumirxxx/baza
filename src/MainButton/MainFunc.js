import React from "react";

const MainFunc = () => {
    const handleButtonClick = () => {
        // Обработчик событий для кнопки
        console.log("Кнопка нажата");
    };

    return (
        <div className="button_body" onClick={handleButtonClick}>
            <div className="button_img_container">
                <img src="./buttonfunc.svg" className="button_img"></img>
            </div>
            <div className="button_text">Основной функционал</div>
        </div>
    );
};

export default MainFunc;
