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
import AddFilesButton from "../Addbutton/AddFilesButton";
import EditArticleButton from "../Addbutton/EditArticleButton";
import Files from "../Files/Files";
import Editor2 from "../Addbutton/Editor2";
const Main = () => {
    const [menu_id, setMenuId] = useState(null);
    const [sectionId, setSectionId] = useState(null);
    const [menu, setMenu] = useState([]);
    const [sections, setSections] = useState([]);
    const [articles, setArticles] = useState([]);//текущие статьи
    const [files, setFiles] = useState([]);
    const [isSectionsOpen, setIsSectionsOpen] = useState(false); // Добавлено состояние для отслеживания открытых секций
    const navigate = useNavigate();
    const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
    const [menuName, setMenuName] = useState('');
    const [showSubsections, setShowSubsections] = useState(false);
    const [selectedSectionItemId, setSelectedSectionItemId] = useState(null);
    const [subsectionId, setSubsectionId] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);//текущая статья
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


                    console.log("isSectionsOpen:", isSectionsOpen);
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
                // setSelectedSectionItemId(null);
                setSelectedMenuItemId(null);
                setSections([]);
                setIsSectionsOpen(false);
                setArticles([]);


            } else {
                const response = await axios.get(
                    `http://192.168.10.109:8000/api/v1/sections/?menu_id=${menu_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const selectedMenuItem = menu.find((item) => item.id === menu_id);
                const menuName = selectedMenuItem ? selectedMenuItem.name : "";
                setMenuName(menuName);
                setMenuId(menu_id);
                console.log()
                console.log("Menu Name:", menuName);
                console.log(menu[0].name);
                console.log(menuName)
                setSections(response.data);
                setIsSectionsOpen(true);
                //setArticles([]);

                setSelectedSectionItemId(null);
                setSelectedMenuItemId(menu_id);
                console.log(menu_id)
                setShowSubsections(true);
                console.log(sectionId)

            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/");
            } else {
                console.log(error);

            }
        }
    };



    const handleArticleButtonClick = async (sectionId) => {
        try {
            const response = await axios.get(`http://192.168.10.109:8000/api/v1/articles/?section_id=${sectionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSelectedSectionItemId(sectionId);
            setSectionId(sectionId)

            // console.log(sectionId)
            // console.log(articles)


            setArticles(response.data);


        } catch (error) {
            console.log(error);
        }
    }


    const handleSelectArticle = (articleObj) => {
        setSelectedArticle(articleObj)
    }

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
                                <img className="menu_img" src={menuItem.img} alt="" />
                                <div className="button_text">{menuItem.name}</div>
                            </button>
                            <div className="cl-btn-4 delete_button-menu" onClick={() => handleDeleteMenu(menuItem.id)} title="Удалить"></div>
                            <EditButtonMenu menuItem={menuItem} menuId={menuItem.id} />
                        </div>

                    ))}
                    <AddButtonMenu />
                </div>
                <div className="menu_container_right">
                    <div className="container_position_col">
                        {sections.length > 0 && (

                            <div className="sections_container">
                                {sections.map((section) => (
                                    <div
                                        className="section_button"
                                        key={section.id}
                                        onClick={() => handleArticleButtonClick(section.id)}


                                    >
                                        <div className="section_button_content" >
                                            <div className="section_img_container">

                                                {section.img && <img className="section_img" src={section.img} alt="Section Image" />}

                                            </div>
                                            <div className="section_name">{section.name}</div>
                                        </div>
                                        <div className="button_update-container">

                                            <div className="cl-btn-4" onClick={() => handleDeleteSection(section.id)} title="Удалить"></div>
                                        </div>
                                        <EditButtonSection
                                            key={section.id}
                                            section={section}
                                            onUpdate={handleSectionUpdate}
                                        />
                                    </div>
                                ))}

                                {/* <AddButtonSectionsMain menuId={menu_id} /> */}
                            </div>



                        )}
                        {selectedMenuItemId !== null ? (
                            <AddButtonSections menu={menu} menuName={menuName} menuId={selectedMenuItemId} menu_id={menu_id} />
                        ) : null}
                    </div>


                    <div className="container_position_col container_position_col-sub" >
                        {

                            <div className="articles_container">
                                {articles.map((article) => (
                                    <div className="section_button" key={article.id}
                                    >
                                        <div className="subsection_button_content" onClick={() => handleSelectArticle(article)}>
                                            <div className="section_img_container">
                                                {article.img && <img className="section_img" src={article.img} alt="Subsection Image" />}
                                            </div>
                                            <div className="subsection_name">{article.name}</div>
                                        </div>
                                        <div className="button_update-container">
                                            <div className="section_button-container">
                                                <div className="section_button_edit">
                                                </div>

                                            </div>

                                        </div>
                                        {/* <EditButtonSubsection subsection={subsection} articles={articles} subsectionId={subsection.id} onUpdate={handleSubsectionUpdate} /> */}
                                    </div>
                                ))}

                            </div>


                        }
                        <div>
                            {
                                selectedSectionItemId !== null && showSubsections && sections.length > 0 && (
                                    <Editor2 subsectionId={subsectionId} sectionId={sectionId} />
                                    // <AddButtonSubsections sectionId={sectionId} subsections={subsections} />
                                )
                            }


                        </div>
                    </div >
                    {selectedArticle && (

                        <div className="article_container">
                            <div className="article_button_container">

                                <div key={selectedArticle.id}>
                                    <div className="article_content">
                                        <div className="article_service-buttons">
                                            <div className="cl-btn-4 delete_button" onClick={() => handleDeleteArticle(selectedArticle.id)} title="Удалить"></div>
                                            <AddFilesButton articleId={selectedArticle.id} />

                                            <EditArticleButton article={selectedArticle} />
                                        </div>
                                        <div>
                                            <h1 className="article_content_name" dangerouslySetInnerHTML={{ __html: selectedArticle.name }} ></h1>
                                            <div className="article_content_text" dangerouslySetInnerHTML={{ __html: selectedArticle.text }}></div>
                                        </div>
                                    </div>
                                </div>
                                <Files articleId={selectedArticle.id} />
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

