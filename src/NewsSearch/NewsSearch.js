import React, { useState } from "react";

const NewsSearch = ({ onSearch }) => {
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");

    const handleDateChange = (event) => {
        setDate(event.target.value);
        if (event.target.value === "") {
            onSearch({ date: "", title });
        }
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        if (event.target.value === "") {
            onSearch({ date, title: "" });
        }
    };

    const handleSearch = () => {
        onSearch({ date, title });
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="news-search">
            <div className="news-search-container">
                <input
                    className="news-search-input"
                    placeholder="Найти по дате"
                    type="text"
                    value={date}
                    onChange={handleDateChange}
                    onKeyDown={handleKeyDown}
                />
                <button className="news-search-button" onClick={handleSearch}>
                    <img src="/search-icon.svg" alt="Search" />
                </button>
            </div>
            <div className="news-search-container">
                <input
                    className="news-search-input"
                    placeholder="Найти по названию"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onKeyDown={handleKeyDown}
                />
                <button className="news-search-button" onClick={handleSearch}>
                    <img src="/search-icon.svg" alt="Search" />
                </button>
            </div>
        </div>
    );
};

export default NewsSearch;
