import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiserver } from "../config";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { refreshAuthToken } from "../authService";
import { ReactComponent as NextArrow } from '../icons/nextArrow.svg';  // Path to your SVG file
import { ReactComponent as PrevArrow } from '../icons/prevArrow.svg';  // Path to your SVG file

const NewsSlider = () => {
    const [news, setNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            const token = localStorage.getItem("token");
            try {
                const newsResponse = await axios.get(`${apiserver}/news/list/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Filter news to include only those where to_slider is true
                const filteredNews = newsResponse.data.filter(item => item.to_slider === true);
                setNews(filteredNews);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        fetchNews();
                    } else {
                        console.error("Failed to refresh token.");
                    }
                } else {
                    console.error("Error fetching data: ", error);
                }
            }
        };
        fetchNews();
    }, [navigate]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: 3,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    return (
        <div className='slider_container_background'>
            <Slider {...settings}>
                {news.map((item, index) => (
                    <div key={index}>
                        <div onClick={() => navigate(`/news/${item.id}`)} className='slider_container'>
                            <div style={{ backgroundImage: `url(${item.cover})` }} className='slider_img_container'>
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