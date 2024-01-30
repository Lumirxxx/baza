import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="scroll-to-top-button" style={{ position: 'fixed', bottom: '20px', right: '-3px' }}>
            {isVisible && (
                <button className='scroll-button' onClick={scrollToTop} title="Наверх">
                    <img className='scroll-img' src='./scroll.svg'></img>
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;