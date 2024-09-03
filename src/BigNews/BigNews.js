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
            try {
                const newsResponse = await axios.get(`${apiserver}/news/list/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNews(newsResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Попытка обновить токен
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        // Если токен обновлен, повторно выполняем запрос
                        fetchNews();
                    } else {
                        console.error("Не удалось обновить токен. Перенаправление на страницу логина.");
                        // Перенаправление на страницу логина
                        navigate("/");
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
                        {item.cover && <img className='news_img' src={item.cover} alt="News Cover" />}
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BigNews;
