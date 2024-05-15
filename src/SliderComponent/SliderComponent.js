import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = ({ media, onClose }) => {
    const settings = {
        dots: false,
        infinite: true, // Здесь изменение
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: 1,
        initialSlide: 0
    };


    return (
        <div className="slider">
            <Slider className='slider_full_news' {...settings}>
                {media.map((m, index) => (
                    <div key={index}>
                        <div className="slider-media">
                            <div className='slider-img_full-news' style={{ backgroundImage: `url(${m.media})` }} alt={`Media ${index + 1}`}></div>
                            {/* <img src={m.media} alt={`Media ${index + 1}`} /> */}
                        </div>
                    </div>
                ))}
            </Slider>

            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default SliderComponent;

