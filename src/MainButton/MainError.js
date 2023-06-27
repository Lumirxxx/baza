import React from "react";

const MainError = () => {
    const handleButtonClick = () => {
        // Обработчик событий для кнопки
        console.log("Кнопка нажата");
    };

    return (
        <div className="button_body" onClick={handleButtonClick}>
            <div className="button_img_container">
                <img src="./mainerror.svg" className="button_img"></img>
            </div>
            <div className="button_text">Ошибки / Решения</div>
        </div>
    );
};

export default MainError;
