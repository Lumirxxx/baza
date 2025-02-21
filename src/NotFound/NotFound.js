import React from "react";
import { useNavigate } from "react-router-dom";


const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page"  style={{backgroundImage: "url(/4042.svg)"}}>
            <div className="not-found-container">
                <div className="not-found-content" >
                <div className="not-found-img">
                <img src="/404.svg" alt="404" />
            </div>
            <div className="not-found-text" >
            Страница, к которой вы обращаетесь не существует или была перенесена. Рекомендуем вернуться на главную страницу сайта.
            </div>
            <button className="not-found-button" onClick={() => navigate("/")}>Вернуться на главную</button>
            </div>
                </div>
          
           
        </div>
    );
};

export default NotFound;