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

    const renderMedia = (mediaItem, index, isLarge = false) => {
        const isImage = mediaItem.media.endsWith(".jpg") || mediaItem.media.endsWith(".jpeg") || mediaItem.media.endsWith(".png");
        const isVideo = mediaItem.media.endsWith(".mp4") || mediaItem.media.endsWith(".webm") || mediaItem.media.endsWith(".ogg");
    
        if (isImage) {
            return (
                <div className={isLarge ? 'full_news_img large_media' : 'full_news_img small_media'} key={index} onClick={() => openSliderAtIndex(index)}>
                    <div className={isLarge ? 'full_news_img-bg' : 'full_news_img-bg_small'} style={{ backgroundImage: `url(${mediaItem.media})` }} alt={`Media ${index + 1}`}></div>
                </div>
            );
        }
    
        if (isVideo) {
            return (
                <div className={isLarge ? 'full_news_video large_media' : 'full_news_video small_media'} key={index} onClick={() => openSliderAtIndex(index)}>
                    <video className="background-video" controls>
                        <source src={mediaItem.media} type="video/mp4" />
                        Ваш браузер не поддерживает видео-теги.
                    </video>
                    <div className='video-play-trangle'>
                        <img src="/trianglevideo.svg" alt="Play Video"></img>
                    </div>
                </div>
            );
        }
    
        return null;
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
                            {media.length > 0 && renderMedia(media[0], 0, true)}
                            <div className="small_media_container">
                                {media.slice(1, 4).map((m, index) => renderMedia(m, index + 1))}
                            </div>
                        </div>
                    </div>
                    <div className='full_news_btns'>
                    <button
                        className="add-news-toggle-button return-login-button full_news_btns_return "
                        onClick={() => navigate('/MainNews')}
                    >
                        <>
                            <span>Вернуться к списку новостей</span>
                            <img
                                className="return-news-icon return-icon-login-page"
                                src="/arrow-left-black.svg"
                                alt="Return Icon"
                            />
                        </>
                    </button>
                    {!showAllMedia && (
                        <div className="show_all-news_btn" onClick={() => openSliderAtIndex(0)}>Смотреть все</div>
                    )}
                   
                    </div>
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
