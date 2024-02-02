import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArticleEditForm from "../ArticleEditForm/ArticleEditForm";
import AddButtonSectionsMain from "../Addbutton/AddButtonSectionsMain";
import AddButtonSections from "../Addbutton/AddButtonSections";
import EditButtonSection from "../Addbutton/EditButtonSection";
import AddButtonMenu from "../Addbutton/AddButtonMenu";
import EditButtonMenu from "../Addbutton/EditButtonMenu";
import AddFilesButton from "../Addbutton/AddFilesButton";
import EditArticleButton from "../Addbutton/EditArticleButton";
import Files from "../Files/Files";
import Editor2 from "../Addbutton/Editor2";
import LogoutButton from "../logout/LogoutButton";
import DepartList from "../departList/departList";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";
import DeleteMenuButton from "../DeleteButton/DeleteButton";
const Main = () => {
    const [menu_id, setMenuId] = useState(null);
    const [menu, setMenu] = useState([]);
    const [sectionId, setSectionId] = useState(null);//текущая секция
    const [sections, setSections] = useState([]);
    const [articles, setArticles] = useState([]);//текущие статьи
    const [isSectionsOpen, setIsSectionsOpen] = useState(false); // Добавлено состояние для отслеживания открытых секций
    const navigate = useNavigate();
    const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
    const [menuName, setMenuName] = useState('');
    const [showSubsections, setShowSubsections] = useState(false);
    const [selectedSectionItemId, setSelectedSectionItemId] = useState(null);
    const [subsectionId, setSubsectionId] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);//текущая статья
    // const [articleId, setArticleId] = useState(null);//текущая статья
    const [profile, setProfile] = useState(false);//Стейт для отслеживания состояния админа
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalDeleteArticle, setShowModalDeleteArticle] = useState(false);
    let isRedirected = false;
    const isRedirectedRef = useRef(false);
    const [errorMessage, setErrorMessage] = useState("");
    // const [name, setName] = useState('');
    // useEffect(() => {
    //     setSelectedArticle(selectedArticle);
    //     console.log(selectedArticle)
    // }, [selectedArticle]);

    // Функция для обновления состояния isStaff
    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://192.168.10.109:8000/api/v1/profile/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!isRedirectedRef.current) {
                    setProfile(response.data[0]);
                    console.log(response.data[0]);
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 401 && !isRedirectedRef.current) {
                    isRedirectedRef.current = true;
                    localStorage.removeItem('token');
                    navigate("/");

                }
            });
    }, [isRedirectedRef, navigate]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                let isRedirected = false;

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
                if (error.response && error.response.status === 401 && !isRedirected) {
                    navigate("/");
                    localStorage.removeItem('token');

                } else {
                    console.log(error);
                }
            }

        };

        fetchData();

    }, [isRedirected]); // Пустой массив в качестве зависимости
    const handleSectionButtonClick = async (menu_id, id) => {
        try {
            if (menu_id === id) {
                if (isSectionsOpen) {
                    if (menu_id === selectedMenuItemId) {
                        setSelectedMenuItemId(null);
                        setSections([]);
                        setIsSectionsOpen(false);
                        setArticles([]);
                        setShowSubsections(false);
                        return;
                    }
                }
                setMenuId(null);
            } else {
                setMenuId(id);
            }

            if (menu_id === selectedMenuItemId) {
                setSelectedMenuItemId(null);
                setSections([]);
                setIsSectionsOpen(false);
                setArticles([]);
                setShowSubsections(false);
                return;
            }

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
            setSections(response.data);
            setIsSectionsOpen(true);
            setSelectedSectionItemId(null);
            setSelectedMenuItemId(menu_id);
            setShowSubsections(true);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/");
                localStorage.removeItem('token');
            } else {
                console.log(error);
            }
        }
    };



    const handleArticleButtonClick = async (sectionId, id) => {
        try {
            if (sectionId === selectedSectionItemId) {
                setSelectedSectionItemId(null);
                setArticles([]);
                setSectionId(null);
            } else {
                setSectionId(sectionId);
                const response = await axios.get(`http://192.168.10.109:8000/api/v1/articles/?section_id=${sectionId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setSelectedSectionItemId(sectionId);
                setArticles(response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/");
                localStorage.removeItem('token');
            } else {
                console.log(error);
            }
        }
    }


    const handleSelectArticle = (articleObj) => {
        setSelectedArticle((prevArticle) => {
            console.log(articleObj.id); // Вывод актуального значения articleObj
            return articleObj;
        });
    };

    const handleDeleteMenu = async (menuId) => {
        setSelectedMenuId(menuId);
        setShowDeleteConfirmation(true);
        setMenuName()
        console.log(menuName)
    };

    const confirmDeleteMenu = async () => {
        try {
            await axios.delete(
                `http://192.168.10.109:8000/api/v1/menu/${selectedMenuId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setShowDeleteConfirmation(false);
            setMenu((prevMenu) =>
                prevMenu.filter((menu) => menu.id !== selectedMenuId)
            );
        } catch (error) {
            if (error.request.status === 500) {
                setErrorMessage('Невозможно удалить так как имеются дочерние элементы');
            }
            console.log(error);
        }
        setSelectedMenuId(null);

    };

    const cancelDeleteMenu = () => {
        setSelectedMenuId(null);
        setShowDeleteConfirmation(false);
    };


    const handleDeleteSection = async (sectionId) => {
        try {
            await axios.delete(`http://192.168.10.109:8000/api/v1/sections/${sectionId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setSelectedSectionItemId(null);
            setArticles([]);
            setSectionId(null);
            setSections(sections.filter((section) => section.id !== sectionId));
            console.log(sections)

            cancelDeleteSection()

        } catch (error) {
            if (error.request.status === 500) {
                setErrorMessage('Невозможно удалить так как имеются дочерние элементы');
            }
            console.log(error);
        }
    };
    const deleteSectionModal = (sectionId) => {
        setSectionId(sectionId)
        setShowModalDelete(true)
        console.log(sectionId)

    }
    const cancelDeleteSection = () => {
        setShowModalDelete(false)
    }
    const deleteArticleModal = () => {
        setShowModalDeleteArticle(true)
        console.log(articles)
    }
    const cancelArticleModal = () => {
        setShowModalDeleteArticle(false)
    }

    const handleDeleteArticle = async (articleId) => {
        try {
            await axios.delete(`http://192.168.10.109:8000/api/v1/articles/${articleId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setArticles(articles.filter((article) => article.id !== articleId));
            setSelectedArticle(null);
            cancelArticleModal()
        } catch (error) {
            console.log(error);
        }
    };
    const handleAddSection = (newSectionData) => {
        setSections(prevSections => [...prevSections, newSectionData]);
    };
    // Обработчик обновления данных секции
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
    // Обработчик обновления данных статьи
    const handleArticleUpdate = (updatedArticle) => {
        setSelectedArticle(updatedArticle);
        console.log(updatedArticle.name)


    };

    // Обработчик добавления обновления статьи
    const handleAddArticle = (newArticle) => {
        setArticles([...articles, newArticle]);
    };
    const handleMenuUpdate = (updatedMenu) => {
        setMenu((prevMenu) => {
            const updatedMenuItems = prevMenu.map((menuItem) => {
                if (menuItem.id === updatedMenu.id) {
                    return updatedMenu;
                }
                return menuItem;
            });
            return updatedMenuItems;
        });
    }

    const handleMenuAdd = (newMenu) => {
        setMenu((prevMenu) => [...prevMenu, newMenu]);
    }




    return (
        <div className="main_container">
            <div className="header_container">
                <div className="main_page_logo">
                    <img src="/HeaderlogomainNew.svg" alt="Logo" />
                </div>
                <div className="header_service-buttons">
                    {(profile.is_staff) && (
                        <DepartList profile={profile} />
                    )}
                    <LogoutButton />

                </div>

            </div>
            <div className="menu_container">

                <div className="menu_container_left">

                    {menu.map((menuItem) => (
                        <div title={menuItem.name} className="menu_item">
                            {/* <button
                                className={`button_body ${(menu_id == menuItem.id) ? 'active' : ''}`}
                                key={menuItem.id}
                                onClick={() => handleSectionButtonClick(menuItem.id)}
                            >
                                <img className="menu_img" src={menuItem.img} alt="" />
                                <div className="button_text">{menuItem.name}</div>
                            </button> */}
                            {/* {(profile.is_staff || profile.is_moderate) && (


                                <div className="button_delete-container">

                                    <div
                                        className="cl-btn-4 delete_button"
                                        onClick={() => handleDeleteMenu(menuItem.id)}
                                        title="Удалить"
                                    ></div>
                                </div>

                            )} */}
                            <DeleteMenuButton handleSectionButtonClick={handleSectionButtonClick} handleDeleteMenu={handleDeleteMenu} profile={profile} menu_id={menuItem.id} menuItem={menuItem} selectedMenuId={selectedMenuId} menuId={menuItem.id} onUpdate={handleMenuUpdate} />
                            {showDeleteConfirmation && (
                                <div className="modal">
                                    <div className="modal_alert-content">

                                        <div className="modal_alert-text">Вы уверены, что хотите удалить пункт меню?</div>
                                        {errorMessage && <p className="error-message_login">{errorMessage}</p>}
                                        <div className="modal-actions">
                                            <div className="modal-actions_buttons modal-actions_buttons_red" onClick={confirmDeleteMenu}>Удалить</div>
                                            <div className="modal-actions_buttons" onClick={cancelDeleteMenu}>Отмена</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(profile.is_staff || profile.is_moderate) && (
                                <EditButtonMenu menuItem={menuItem} menuId={menuItem.id} onUpdate={handleMenuUpdate} />
                            )}

                        </div>

                    ))}
                    {(profile.is_staff || profile.is_moderate) && (
                        <AddButtonMenu onUpdate={handleMenuAdd} />
                    )}
                    <div>
                        <ScrollToTopButton />
                    </div>
                </div>
                <div className="menu_container_right">
                    <div className="container_position_col">
                        {sections.length > 0 && (

                            <div className="sections_container">
                                {sections.map((section) => (
                                    <div className="section_item_container">
                                        <div
                                            className={`section_button ${(sectionId == section.id) ? 'active' : ''}`}
                                            title={section.name}


                                            onClick={() => handleArticleButtonClick(section.id)}


                                        >

                                            <div className="section_button_content" >
                                                <div className="section_img_container">

                                                    {section.img && <img className="section_img" src={section.img} alt="Section Image" />}

                                                </div>
                                                <div className="section_name">{section.name}</div>
                                            </div>


                                        </div>

                                        <div className="button_update-container">
                                            {(profile.is_staff || profile.is_moderate) && (
                                                <div>
                                                    <div className="cl-btn-4" onClick={() => deleteSectionModal(sectionId)} title="Удалить"></div>

                                                </div>
                                            )}


                                        </div>

                                        {(profile.is_staff || profile.is_moderate) && (
                                            <EditButtonSection

                                                section={section}
                                                onUpdate={handleSectionUpdate}
                                            />
                                        )}
                                    </div>

                                ))}


                                {showModalDelete && (
                                    <div className="modal-container">
                                        <div className="modal">
                                            <div className="modal_alert-content">
                                                <div className="modal_alert-text">Вы уверены, что хотите удалить пункт раздела?</div>
                                                {errorMessage && <p className="error-message_login">{errorMessage}</p>}
                                                <div className="modal-actions">
                                                    <div className="modal-actions_buttons modal-actions_buttons_red" onClick={() => handleDeleteSection(sectionId)}>Удалить</div>
                                                    <div className="modal-actions_buttons" onClick={() => cancelDeleteSection()}>Отмена</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* <AddButtonSectionsMain menuId={menu_id} /> */}
                            </div>



                        )}

                        {selectedMenuItemId !== null && (profile.is_staff || profile.is_moderate) && (
                            <AddButtonSections menu={menu} menuName={menuName} menuId={selectedMenuItemId} menu_id={menu_id} onUpdate={handleAddSection} />
                        )}
                    </div>


                    <div className="container_position_col container_position_col-sub" >
                        {articles.length > 0 && (



                            <div className="sections_container sections_container-articles_name">
                                {articles.map((article) => (
                                    <div
                                        title={article.name}
                                        onClick={() => handleSelectArticle(article)}
                                        key={article.id}
                                        className={`section_button ${selectedArticle && selectedArticle.id === article.id ? 'active' : ''}`}
                                    >
                                        <div className="subsection_button_content" >
                                            <div className="section_img_container section_img_container-articles">
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



                        )}
                        <div>
                            {
                                selectedSectionItemId !== null && showSubsections && sections.length > 0 && (profile.is_staff || profile.is_moderate) && (
                                    <Editor2 subsectionId={subsectionId} sectionId={sectionId} onUpdate={handleAddArticle} />

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

                                            {(profile.is_staff || profile.is_moderate) && (
                                                <EditArticleButton article={selectedArticle} onUpdate={handleArticleUpdate} />
                                            )}

                                            {showModalDeleteArticle && (
                                                <div className="modal-container">
                                                    <div className="modal">
                                                        <div className="modal_alert-content">
                                                            <div className="modal_alert-text">Вы уверены, что хотите удалить статью?</div>
                                                            <div className="modal-actions">
                                                                <div className="modal-actions_buttons modal-actions_buttons_red" onClick={() => handleDeleteArticle(selectedArticle.id)}>Удалить</div>
                                                                <div className="modal-actions_buttons" onClick={() => cancelArticleModal()}>Отмена</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}


                                            {(profile.is_staff || profile.is_moderate) && (
                                                <AddFilesButton articleId={selectedArticle.id} />
                                            )}
                                            {(profile.is_staff || profile.is_moderate) && (
                                                <div className="cl-btn-4 delete_button" onClick={() => deleteArticleModal()} title="Удалить"></div>
                                            )}





                                        </div>
                                        <div className="article_content_container-name">
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
                {/* <Link to="/admin">Admin Page</Link> Добавить Link для перехода на AdminPage */}
            </div>

        </div>
    );
};

export default Main;

