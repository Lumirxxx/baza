import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddButton from "../Addbutton/AddButton";
import AddButtonSections from "../Addbutton/AddButtonSections";

const Main = () => {
    const [menu, setMenu] = useState([]);
    const [sections, setSections] = useState([]);
    const [articles, setArticles] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://192.168.10.109:8000/api/v1/menu/", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.length > 0) {
                    console.log(response.data);
                    setMenu(response.data);
                    console.log('получили меню');
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []); // Пустой массив в качестве зависимости




    const handleSectionButtonClick = async (menu_id) => {
        try {
            const response = await axios.get(`http://192.168.10.109:8000/api/v1/sections/?menu_id=${menu_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSections(response.data);
            setArticles([]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleArticleButtonClick = async (sectionId) => {
        try {
            const response = await axios.get(`http://192.168.10.109:8000/api/v1/articles/?section_id=${sectionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setArticles(response.data);
            console.log(response.data);

        } catch (error) {
            console.log(`http://192.168.10.109:8000/api/v1/articles/?section_id=${sectionId}/`)
            console.log(sectionId)
            console.log(error);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            await axios.delete(`http://192.168.10.109:8000/api/v1/sections/${sectionId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSections(sections.filter((section) => section.id !== sectionId));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteArticle = async (articleId) => {
        try {
            await axios.delete(`http://192.168.10.109:8000/api/v1/articles/${articleId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setArticles(articles.filter((article) => article.id !== articleId));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="main_container">
            <div className="menu_container">
                <div className="menu_container_left">
                    <div className="main_page_logo">
                        <img src="/Headerlogomain.svg" alt="Logo" />
                    </div>
                    {menu.map((menuItem) => (
                        <button
                            className="button_body"
                            key={menuItem.id}
                            onClick={() => handleSectionButtonClick(menuItem.id)}
                        >
                            <div className="button_text">{menuItem.name}</div>
                        </button>
                    ))}
                </div>
                <div className="menu_container_right">
                    {sections.length > 0 && (
                        <div className="sections_container">
                            {sections.map((section) => (
                                <div
                                    className="section_button"
                                    key={section.id}
                                    onClick={() => handleArticleButtonClick(section.id)}
                                >
                                    <div className="section_button_content">
                                        <div className="section_img_container">
                                            <img className="section_img" src={section.img} alt="Section Image" />
                                        </div>
                                        <div className="section_name">{section.name}</div>
                                    </div>
                                    <div className="cl-btn-4" onClick={() => handleDeleteSection(section.id)}></div>
                                </div>
                            ))}
                        </div>
                    )}
                    {articles.length > 0 && (
                        <div className="article_container">
                            <div className="article_button_container">
                                {articles.map((article) => (
                                    <div key={article.id}>
                                        <div className="article_content">
                                            <div>{article.text}</div>
                                            {article.items && (
                                                <ul>
                                                    {article.items.map((item) => (
                                                        <li key={item.id}>{item.text}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="cl-btn-4" onClick={() => handleDeleteArticle(article.id)}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="admin_button">
                <Link to="/admin">Admin Page</Link> {/* Добавить Link для перехода на AdminPage */}
            </div>

            {/* <AddButton />
            <AddButtonSections /> */}
        </div>
    );
};

export default Main;

