import React from "react";
import { useNavigate } from "react-router-dom";



const MainHeader = () => {
    const navigate = useNavigate();

    const handleNewsClick = () => {
        navigate('/KnowledgeBase');
    };

    return (
        <div className="header">
            <div className="header_container">
                <div className="header_logo">
                    <img src="/MainLogon.svg" alt="Logo" />
                </div>
                <div className="header_menu-container">
                    <div className="header_menu">
                        <div onClick={handleNewsClick}>База знаний</div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default MainHeader