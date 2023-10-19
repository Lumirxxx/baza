import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArticleEditForm from "../ArticleEditForm/ArticleEditForm";
import AddButtonSectionsMain from "../Addbutton/AddButtonSectionsMain";
import AddButtonSections from "../Addbutton/AddButtonSections";
import EditButtonSection from "../Addbutton/EditButtonSection";
import AddButtonMenu from "../Addbutton/AddButtonMenu";
import EditButtonMenu from "../Addbutton/EditButtonMenu";
import AddButtonSubsections from "../Addbutton/AddButtonSubsections";
import EditButtonSubsection from "../Addbutton/EditButtonSubsections";







const Main = () => {
    const [menu_id, setMenuId] = useState(null);
    const [menu, setMenu] = useState([]);
    const [sections, setSections] = useState([]);
    const [subsections, setSubsections] = useState([]);
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [isSectionsOpen, setIsSectionsOpen] = useState(true); // Добавлено состояние для отслеживания открытых секций
    // const [isArticlesOpen, setIsArticlesOpen] = useState(true);
    const navigate = useNavigate();
    // const handleEditArticle = (article) => {
    //     setSelectedArticle(article);
    // };


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
                if (error.response && error.response.status === 401) {
                    navigate("/");
                } else {
                    console.log(error);
                }
            }

        };

        fetchData();
    }, []); // Пустой массив в качестве зависимости
    const handleSectionButtonClick = async (menu_id) => {
        try {
            if (isSectionsOpen) {
                // Если секции уже открыты, закрываем их вместе с статьями
                setSections([]);
                setIsSectionsOpen(false);
                setArticles([]);
                setSubsections([]);
            } else {
                const response = await axios.get(
                    `http://192.168.10.109:8000/api/v1/sections/?menu_id=${menu_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                console.log(menu_id)
                setSections(response.data);
                setIsSectionsOpen(true);
                setArticles([]);
                setSubsections([]);
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/");
            } else {
                console.log(error);
            }
        }
    };

    const handleSubsectionButtonClick = async (sectionId) => {
        try {
            const response = await axios.get(`http://192.168.10.109:8000/api/v1/subsections/?section_id=${sectionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log(sectionId)
            setSubsections(response.data);
            setArticles([]);
        } catch (error) {
            console.log(error);
        }
    }


    const handleArticleButtonClick = async (subsectionId) => {
        try {
            const response = await axios.get(`http://192.168.10.109:8000/api/v1/articles/?subsection_id=${subsectionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setArticles(response.data);
            setSelectedArticle(response.data[0]); // Предполагая, что данные ответа являются массивом, выберите первую статью по умолчанию

            console.log(response.data);

        } catch (error) {
            console.log(`http://192.168.10.109:8000/api/v1/articles/?subsection_id=${subsectionId}/`)
            console.log(subsectionId)
            console.log(error);
        }
    };

    const handleDeleteMenu = async (menuId) => {
        try {
            await axios.delete(`http://192.168.10.109:8000/api/v1/menu/${menuId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMenu(menu.filter((menu) => menu.id !== menuId));
        } catch (error) {
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
    const handleDeleteSubsection = async (subsectionId) => {
        try {
            await axios.delete(`http://192.168.10.109:8000/api/v1/subsections/${subsectionId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSubsections(subsections.filter((subsection) => subsection.id !== subsectionId));
        } catch (error) {
            console.log(error);
        }
    }

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
    const handleSectionUpdate = (updatedSection) => {
        setSections((prevSections) => {
            const updatedSections = prevSections.map((section) => {
                if (section.id === updatedSection.id) {
                    return updatedSection;
                }
                return section;
            });
            return updatedSections;
        });
    };
    const handleSubsectionUpdate = (updatedSubsection) => {
        setSubsections((prevSubsections) => {
            const updatedSubsections = prevSubsections.map((subsection) => {
                if (subsection.id === updatedSubsection.id) {
                    return updatedSubsection;
                }
                return subsection;
            });
            return updatedSubsections;
        });
    }


    return (
        <div className="main_container">
            <div className="header_container">
                <div className="main_page_logo">
                    <img src="/Headerlogomain.svg" alt="Logo" />
                </div>
            </div>
            <div className="menu_container">

                <div className="menu_container_left">

                    {menu.map((menuItem) => (
                        <div className="menu_item">
                            <button
                                className="button_body"
                                key={menuItem.id}
                                onClick={() => handleSectionButtonClick(menuItem.id)}
                            >
                                <div className="button_text">{menuItem.name}</div>
                            </button>
                            <div className="cl-btn-4" onClick={() => handleDeleteMenu(menuItem.id)}></div>
                            <EditButtonMenu menuItem={menuItem} menuId={menuItem.id} />
                        </div>

                    ))}
                    <AddButtonMenu />
                </div>
                <div className="menu_container_right">
                    {sections.length > 0 && (
                        <div className="sections_container">
                            {sections.map((section) => (
                                <div
                                    className="section_button"
                                    key={section.id}


                                >
                                    <div className="section_button_content" onClick={() => handleSubsectionButtonClick(section.id)}>
                                        <div className="section_img_container">

                                            {section.img && <img className="section_img" src={section.img} alt="Section Image" />}

                                        </div>
                                        <div className="section_name">{section.name}</div>
                                    </div>
                                    <div className="button_update-container">
                                        <EditButtonSection
                                            key={section.id}
                                            section={section}
                                            onUpdate={handleSectionUpdate}
                                        />
                                        <div className="cl-btn-4" onClick={() => handleDeleteSection(section.id)}></div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <AddButtonSections menuId={menu_id} />
                                {/* <AddButtonSectionsMain menuId={menu_id} /> */}
                            </div>
                        </div>
                    )}
                    {
                        subsections.length > 0 && (
                            <div className="subsections_container">
                                {subsections.map((subsection) => (
                                    <div className="section_button" key={subsection.id} onClick={() => handleArticleButtonClick(subsection.id)}
                                    >
                                        <div className="subsection_button_content">
                                            <div className="section_img_container">
                                                {subsection.img && <img className="section_img" src={subsection.img} alt="Subsection Image" />}
                                            </div>
                                            <div className="subsection_name">{subsection.name}</div>
                                        </div>
                                        <div className="button_update-container">
                                            <div className="section_button-container">
                                                <div className="section_button_edit">
                                                    <div className="cl-btn-4" onClick={() => handleDeleteSubsection(subsection.id)}></div>
                                                    <EditButtonSubsection subsection={subsection} subsections={subsections} subsectionId={subsection.id} onUpdate={handleSubsectionUpdate} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                                <AddButtonSubsections subsections={subsections} />
                            </div>
                        )}
                    {articles.length > 0 && (
                        <div className="article_container">
                            <div className="article_button_container">
                                {articles.map((article) => (
                                    <div key={article.id}>
                                        <div className="article_content">
                                            <div className="article_content_text" dangerouslySetInnerHTML={{ __html: article.text }}></div>
                                            {article.items && (
                                                <ul>
                                                    {article.items.map((item) => (
                                                        <div>
                                                            <li key={item.id}>{item.text}</li>
                                                        </div>
                                                    ))}
                                                </ul>
                                            )}
                                            <div className="cl-btn-4 delete_button" onClick={() => handleDeleteArticle(article.id)}></div>
                                            {/* {selectedArticle && <ArticleEditForm article={selectedArticle} selectedArticle={selectedArticle} />} */}

                                        </div>
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

        </div>
    );
};

export default Main;

