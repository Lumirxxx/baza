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
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFullNews = async () => {
            const token = localStorage.getItem("token");
            try {
                const newsResponse = await axios.get(`${apiserver}/news/list/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNews(newsResponse.data);

                const mediaResponse = await axios.get(`${apiserver}/news/media/?news_id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedia(Array.isArray(mediaResponse.data) ? mediaResponse.data : []);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        fetchFullNews();
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

    const openSliderAtIndex = (index) => {
        setCurrentMediaIndex(index);
        setShowAllMedia(true);
    };

    return (
        <div>
            <div className="full_news_container main_news_container">
                <div className="fixed-header">
                    <MainHeader />
                </div>
                <div className="fixed-news-slider">
                    <NewsSlider />
                </div>
                <div className='full_news-content'>
                    <div className='news_title news_title_full'>{news ? news.title : 'Loading...'}</div>
                    <div className='news_main-content_container'>
                        <div className='news_text'>
                            {news ? news.text.split('\n').map((item, key) => {
                                return <span key={key}>{item}<br /></span>
                            }) : 'Loading...'}
                        </div>
                        <div className="media_container">
                            <div className='full_news_img' style={{ width: '694px', height: '394px' }} onClick={() => openSliderAtIndex(0)}>
                                <div className='full_news_img-bg' style={{ backgroundImage: `url(${media.length > 0 ? media[0].media : ''})` }} alt={`Media 1`}></div>
                            </div>
                            <div className="small_media_container">
                                {media.slice(1, 4).map((m, index) => (
                                    <div className='full_news_img small_media' key={index} onClick={() => openSliderAtIndex(index + 1)}>
                                        <div className='full_news_img-bg_small' style={{ backgroundImage: `url(${m.media})` }} alt={`Media ${index + 2}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {!showAllMedia && (
                        <div className="show_all-news_btn" onClick={() => openSliderAtIndex(0)}>Смотреть все</div>
                    )}
                </div>
                {showAllMedia && (
                    <div className="modal-slider_full-news">
                        <div className="modal-content">
                            <SliderComponent media={media} initialSlide={currentMediaIndex} onClose={() => setShowAllMedia(false)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullNews;

