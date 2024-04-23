import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { apiserver } from "../config";
import { refreshAuthToken } from "../authService";

const FullNews = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [media, setMedia] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFullNews = async () => {
            const token = localStorage.getItem("token");
            try {
                // Получение деталей новости
                const newsResponse = await axios.get(`${apiserver}/news/list/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNews(newsResponse.data);

                // Получение медиа файлов связанных с новостью
                const mediaResponse = await axios.get(`${apiserver}/news/media/?news_id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedia(Array.isArray(mediaResponse.data) ? mediaResponse.data : []);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        fetchFullNews(); // Повторить запросы после успешного обновления токена
                    } else {
                        console.error("Не удалось обновить токен.");
                    }
                } else {
                    console.error("Ошибка при получении данных: ", error);
                }
            }
        };

        fetchFullNews();
    }, [id, navigate]);

    if (!news) return <div>Loading...</div>;

    return (
        <div className="full_news_container">
            <h1>{news ? news.title : 'Loading...'}</h1>
            <p>{news ? news.text : 'Loading...'}</p>
            {media.map((m, index) => (
                <img key={index} src={m.media} alt="News" />
            ))}
        </div>
    );
};

export default FullNews;
