import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { apiserver } from "../config";
import { refreshAuthToken } from "../authService";
import MainHeader from "../MainHeader/MainHeader";
import NewsSlider from "../NewsSlider/NewsSlider";
import SliderComponent from "../SliderComponent/SliderComponent";

const FullNews = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [media, setMedia] = useState([]);
    const [showAllMedia, setShowAllMedia] = useState(false);
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

    const toggleShowAllMedia = () => {
        setShowAllMedia(!showAllMedia);
    };

    return (
        <div className="full_news_container main_news_container">
            <MainHeader />
            <NewsSlider />
            <div className='full_news-content'>
                <div className='news_title news_title_full'>{news ? news.title : 'Loading...'}</div>
                <div>{news ? news.text : 'Loading...'}</div>
                {media.slice(0, showAllMedia ? media.length : 4).map((m, index) => (
                    <div className='full_news_img' key={index} style={{ width: index === 0 ? '694px' : '220px' }}>
                        <img src={m.media} alt={`Media ${index + 1}`} />
                    </div>
                ))}
                {!showAllMedia && (
                    <button onClick={toggleShowAllMedia}>Смотреть все</button>
                )}
            </div>
            {showAllMedia && <SliderComponent media={media} onClose={toggleShowAllMedia} />}
        </div>
    );
};

export default FullNews;
