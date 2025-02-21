import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiserver } from "../config";
import { refreshAuthToken } from "../authService";

const BigNews = () => {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            const token = localStorage.getItem("token");

            // Если токена нет — сразу перенаправляем на страницу логина
            if (!token) {
                console.error("Отсутствует токен авторизации. Перенаправление на страницу логина.");
                navigate("/");
                return;
            }

            try {
                const newsResponse = await axios.get(`${apiserver}/news/list/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNews(newsResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn("Токен устарел. Попытка обновления...");
                    
                    // Попытка обновления токена
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    
                    if (refreshTokenSuccess) {
                        console.log("Токен успешно обновлен. Повторяем запрос...");
                        fetchNews(); // Повторный запрос
                    } else {
                        console.error("Не удалось обновить токен. Перенаправление на страницу логина.");
                        navigate("/"); // Если не удалось обновить — редирект на логин
                    }
                } else {
                    console.error("Ошибка при получении данных: ", error);
                }
            }
        };
        

        fetchNews();
    }, [navigate]);
    
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className='news_title'>Новости</div>

            <div className="big_news_container">
                {news.map((item) => (
                    <div key={item.id} className="news_item" onClick={() => navigate(`/news/${item.id}`)}>
                        <div className='news_item_row'>
                            <div className='news_title_content'>{item.title}</div>
                            
                            <div className='news_date'>{item.created_at.split(' ')[0]}</div>
                        </div>
                        {/* Используем поле cover для отображения обложки новости */}
                        <div style={{ backgroundImage: `url(${item.cover})` }} className='slider_img_container'></div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BigNews;


   