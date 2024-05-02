import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = ({ media, onClose }) => {
    const settings = {
        dots: true,
        lazyLoad: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0
    };

    return (
        <div className="slider">
            <Slider className='slider_full_news' {...settings}>
                {media.map((m, index) => (
                    <div key={index}>
                        <img src={m.media} alt={`Media ${index + 1}`} />
                    </div>
                ))}
            </Slider>

            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default SliderComponent;
