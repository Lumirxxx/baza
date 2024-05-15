import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeedBack from "../feedback/feedback";

const MainHeader = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Получаем текущий маршрут
    const [feedbackVisible, setFeedbackVisible] = useState(false);

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const toggleFeedback = () => {
        setFeedbackVisible(!feedbackVisible);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="header" >
            <div className="header_container">
                <FeedBack toggleFeedback={toggleFeedback} feedbackVisible={feedbackVisible} />
                <div className="header_logo">
                    <img src="/MainLogon.svg" alt="Logo" />
                </div>
                <div className="header_menu-container">
                    <div className="header_menu">
                        <div
                            className={`heder_menu-object ${isActive('/MainNews') ? 'isActive' : ''}`}
                            onClick={() => handleMenuClick('/MainNews')}
                        >
                            Главная
                        </div>
                        <div
                            className={`heder_menu-object ${isActive('/MainProjects') ? 'isActive' : ''}`}
                            onClick={() => handleMenuClick('/MainProjects')}
                        >
                            Проекты
                        </div>
                        <div
                            className={`heder_menu-object ${isActive('/KnowledgeBase') ? 'isActive' : ''}`}
                            onClick={() => handleMenuClick('/KnowledgeBase')}
                        >
                            База знаний
                        </div>
                        <div className="heder_menu-object_form-feedback" onClick={toggleFeedback}>
                            {/* <img src="/feedback.svg" alt="Feedback" /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainHeader;