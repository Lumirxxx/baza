import React from "react";
import MainHeader from "../MainHeader/MainHeader";
import NewsSlider from "../NewsSlider/NewsSlider";
import BigNews from "../BigNews/BigNews";
import Partners from "../Partners/Partners";
const MainNews = () => {

    return (
        <div className="main_news_container">

            <MainHeader />
            <NewsSlider />
            <div className="main_news-row">
                <BigNews />
                <Partners />
            </div>
        </div>
    );
}
export default MainNews