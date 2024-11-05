import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { ReactComponent as NextArrow } from '../icons/nextArrowblack.svg';
import { ReactComponent as PrevArrow } from '../icons/prevArrowblack.svg';

const SliderComponent = ({ media, initialSlide, onClose }) => {
    const [isEnd, setIsEnd] = useState(false);
    const [isBeginning, setIsBeginning] = useState(true);
    const swiperRef = React.useRef(null);

    const goNext = () => {
        if (swiperRef.current !== null) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current !== null) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const handleSlideChange = () => {
        if (swiperRef.current !== null) {
            const swiperInstance = swiperRef.current.swiper;
            setIsEnd(swiperInstance.isEnd);
            setIsBeginning(swiperInstance.isBeginning);
        }
    };

    useEffect(() => {
        // Вызываем handleSlideChange для инициализации начального состояния слайдера
        handleSlideChange();
    }, []);

    const isVideo = (url) => {
        return url.match(/\.(mp4|webm|ogg)$/);
    };

    return (
        <div className="slider">
            <Swiper
                ref={swiperRef}
                spaceBetween={0}
                slidesPerView={1}
                loop={false}
                speed={500}
                initialSlide={initialSlide}
                onSlideChange={handleSlideChange}
            >
                {media.map((m, index) => (
                    <SwiperSlide key={index}>
                        <div className="slider-media">
                            {isVideo(m.media) ? (
                                <video controls className="slider-media-content slider-media-content_video">
                                    <source src={m.media} type="video/mp4" />
                                    Ваш браузер не поддерживает элемент <code>video</code>.
                                </video>
                            ) : (
                                <div
                                    className="slider-img_full-news slider-media-content"
                                    style={{ backgroundImage: `url(${m.media})` }}
                                    alt={`Media ${index + 1}`}
                                ></div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className={`swiper-button-next-custom ${isEnd ? 'hidden_arrow' : ''}`} onClick={goNext}>
                <NextArrow />
            </div>
            <div className={`swiper-button-prev-custom ${isBeginning ? 'hidden_arrow' : ''}`} onClick={goPrev}>
                <PrevArrow />
            </div>

            <div className="close-btn-container" onClick={onClose}>
                <img className="close-btn" src="/newclsbtn.svg" alt="Close" />
            </div>
        </div>
    );
};

export default SliderComponent;
