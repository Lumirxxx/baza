import React, { useState, useEffect } from "react";
import axios from "axios";
import AddButton from "../Addbutton/AddButton";
import AddButtonSections from "../Addbutton/AddButtonSections";

const Main = () => {
    const [menu, setMenu] = useState([]);
    const [sections, setSections] = useState([]);
    const [articles, setArticle] = useState([]);
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    const [articleButtonId, setArticleButtonId] = useState(null);




    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://192.168.10.109:8000/api/v1/menu/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setMenu(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://192.168.10.109:8000/api/v1/sections/?menu_id=${selectedButtonId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setSections(response.data);
            })
            .catch((error) => {
                console.log(error);
                console.log('http://192.168.10.109:8000/api/v1/sections/?menu_id=' + selectedButtonId)
            });
    }, [selectedButtonId]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://192.168.10.109:8000/api/v1/articles/?section_id=${articleButtonId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setArticle(response.data);
            })
            .catch((error) => {
                console.log(error);
                console.log('http://192.168.10.109:8000/api/v1/articles/?section_id=' + articleButtonId)
            });
    }, [articleButtonId]);

    const handleDeleteSection = (sectionId) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`http://192.168.10.109:8000/api/v1/sections/${sectionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Section deleted successfully");
            })
            .catch((error) => {
                console.log("Error deleting section:", error);
            });
    };

    const handleDeleteArticle = (articleId) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`http://192.168.10.109:8000/api/v1/articles/${articleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Article deleted successfully");
            })
            .catch((error) => {
                console.log("Error deleting article:", error);
            });
    };

    return (
        <div className="main_page_container">
            <div className="main_page_container_custom">
                <div className="main_page">
                    <div className="main_page_logo">
                        <img src="/Headerlogomain.svg"></img>
                    </div>
                    {menu.map((menuItem) => (
                        <button
                            className="button_body"
                            key={menuItem.id}
                            onClick={() => setSelectedButtonId(menuItem.id)}
                        >
                            <div className="button_text">{menuItem.name}</div>
                        </button>
                    ))}
                    <AddButton sections={sections} />
                    <AddButtonSections menu={menu} />
                </div>
                <div className="menu_container_right">
                    {sections.length > 0 && (
                        <div className="sections_container">
                            {sections.map((section) => (
                                <div
                                    className="section_button"
                                    key={section.id}
                                    onClick={() => setArticleButtonId(section.id)}
                                >
                                    <div>
                                        <div>
                                            <img src={section.img}></img>

                                        </div>
                                        <div>
                                            {section.name}
                                        </div>

                                    </div>
                                    <button onClick={() => handleDeleteSection(section.id)}>Delete</button>
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
                                        <button onClick={() => handleDeleteArticle(article.id)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main;

