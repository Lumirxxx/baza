import React from "react";
import MainHeader from "../MainHeader/MainHeader";
import NewsSlider from "../NewsSlider/NewsSlider";
import BigNews from "../BigNews/BigNews";
import Partners from "../Partners/Partners";
const MainNews = () => {

    return (
        <div className="main_news_container">
            <div className="heder_slider_position" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
                <MainHeader />
                <NewsSlider />
            </div>

            <div className="main_news-row" style={{ paddingTop: "340px" }}>
                <BigNews />
                <Partners />
            </div>
        </div>
    );
}
export default MainNews