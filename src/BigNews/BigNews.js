import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiserver } from "../config";
import { apiserverwiki } from "../config";
import { refreshAuthToken } from "../authService";
const BigNews = () => {
    const [news, setNews] = useState([]);
    const [media, setMedia] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            const token = localStorage.getItem("token");
            try {
                const newsResponse = await axios.get(`${apiserver}/news/list/`, {
                    headers: { Authorization: `Bearer ${token}` }

                });
                setNews(newsResponse.data);
                // console.log(newsResponse.data)

                const mediaResponse = await axios.get(`${apiserver}/news/media/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedia(mediaResponse.data);
                // console.log(mediaResponse.data)
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        fetchNews();
                    } else {
                        console.error("Не удалось обновить токен.");
                    }
                } else {
                    console.error("Ошибка при получении данных: ", error);
                }
            }
        };

        fetchNews();
    }, []);

    const getFirstMediaForNews = (newsId) => {
        const newsMedia = media.find(m => m.news_id === newsId);
        return newsMedia ? newsMedia.media : null;
    };

    return (
        <div className="big_news_container">
            <div className='news_title'>Новости</div>
            {news.map((item) => (
                <div key={item.id} className="news_item" onClick={() => navigate(`/news/${item.id}`)}>
                    <div className='news_item_row'>
                        <div className='news_title_content'>{item.title}</div>
                        <img className='news_img' src={getFirstMediaForNews(item.id)} alt="News" />

                    </div>
                    <div className='news_date'>{item.created_at.split(' ')[0]}</div>
                </div>
            ))}
        </div>
    );
};

export default BigNews;
