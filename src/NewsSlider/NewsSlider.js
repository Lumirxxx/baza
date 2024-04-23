import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiserver } from "../config";
import { apiserverwiki } from "../config";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { refreshAuthToken } from "../authService";
import { ReactComponent as NextArrow } from '../icons/nextArrow.svg';  // Путь к вашему SVG файлу
import { ReactComponent as PrevArrow } from '../icons/prevArrow.svg';  // Путь к вашему SVG файлу

const NewsSlider = () => {
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

                const mediaResponse = await axios.get(`${apiserver}/news/media/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedia(mediaResponse.data);
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
    }, [navigate]);

    const getFirstMediaForNews = (newsId) => {
        const newsMedia = media.filter(m => m.news_id === newsId);
        return newsMedia.length > 0 ? newsMedia[0].media : null;
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: 3,
        nextArrow: <NextArrow />,  // Использование кастомной стрелки вперед
        prevArrow: <PrevArrow />   // Использование кастомной стрелки назад
    };


    return (
        <div className='slider_container_background'>
            <Slider {...settings}>
                {news.map((item, index) => (
                    <div >
                        <div className='slider_container' key={index}>

                            <div style={{ backgroundImage: `url(${getFirstMediaForNews(item.id)})` }} className='slider_img_container'>
                                {/* <img className='slider_img' src={getFirstMediaForNews(item.id)} alt="News" /> */}
                            </div>
                            <div className='slider_title'>{item.title}</div>

                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default NewsSlider;
