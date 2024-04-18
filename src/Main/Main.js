import React, { useState, useEffect, useRef, createContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
import DeleteMenuButton from "../DeleteButton/DeleteMenuButton";
import ModalAllertDeleteMenu from "../ModalAllert/ModalAllertDeleteMenu";
import ModalAllertDeleteSection from "../ModalAllert/ModalAllertDeleteSection";
import ModalAllertDeleteArticle from "../ModalAllert/ModalAllerDeleteArticle";
import ButtonMenu from "../MainButton/ButtonMenu";
import ButtonSection from "../MainButton/ButtonSection";
import ButtonArticleName from "../MainButton/ButtonArticleName";
import GanttChart from "../GanttComponent/Gantt";
import { apiserver } from "../config";
import { apiserverwiki } from "../config";
import { refreshAuthToken } from "../authService"

//Экспортируем контекст
export const DeleteSectionButtonContext = React.createContext();
export const DeleteArticleButtonContext = React.createContext();
export const ModalAllertDeleteMenuContext = React.createContext();
export const ModalAllertDeleteSectionContext = React.createContext();
export const ModalAllertDeleteArticleContext = React.createContext();
export const ButtonMenuContext = React.createContext();
export const ButtonSectionContext = React.createContext();
export const ButtonArticleNameContext = React.createContext();
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
    const [profile, setProfile] = useState(false);//Стейт для отслеживания состояния админа
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalDeleteArticle, setShowModalDeleteArticle] = useState(false);
    let isRedirected = false;
    const isRedirectedRef = useRef(false);
    const [errorMessage, setErrorMessage] = useState("");
    const location = useLocation();
    const wikiId = location.state?.wikiId;

    // Функция для обновления состояния isStaff
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`${apiserver}/auth/profile/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!isRedirectedRef.current) {
                    setProfile(response.data[0]);
                    console.log(response.data[0]);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Попытка обновить токен
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        // Если токен успешно обновлён, повторяем запрос
                        fetchData();
                    } else {
                        console.error("Не удалось обновить токен.");

                        // Ошибка обновления токена или другие действия
                    }
                } else {
                    console.error("Ошибка при получении данных: ", error);
                }
            }
        };

        fetchData();
    }, [isRedirectedRef], [navigate]);

    // Функция для обновления токена
    // const refreshAuthToken = async () => {
    //     const refreshToken = localStorage.getItem("refreshToken");
    //     try {
    //         const response = await axios.post(`${apiserver}/token/refresh/`, {
    //             refreshToken: refreshToken
    //         });
    //         // Сохраняем новый токен в localStorage
    //         localStorage.setItem("token", response.data.token);
    //         // Возвращаем true, указывая на успешное обновление токена
    //         return true;
    //     } catch (error) {
    //         console.error("Ошибка при обновлении токена:", error);
    //         // В случае ошибки при обновлении токена возвращаем false
    //         return false;
    //     }
    // };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                let isRedirected = false;

                const response = await axios.get(`${apiserverwiki}/menu/?wiki_id=${wikiId}`, {
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
                    // Попытка обновить токен
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        // Если токен успешно обновлён, повторяем запрос
                        fetchData();
                    } else {
                        console.error("Не удалось обновить токен.");

                        // Ошибка обновления токена или другие действия
                    }
                } else {
                    console.error("Ошибка при получении данных: ", error);
                }
            }

        };

        fetchData();

    }, [isRedirected], [wikiId]); // Пустой массив в качестве зависимости
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
                `${apiserverwiki}/sections/?menu_id=${menu_id}`,
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
                const response = await axios.get(`${apiserverwiki}/articles/?section_id=${sectionId}`, {
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
                `${apiserverwiki}/menu/${selectedMenuId}/`,
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
            await axios.delete(`${apiserverwiki}/sections/${sectionId}/`, {
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
            await axios.delete(`${apiserverwiki}/articles/${articleId}/`, {
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
                            <ButtonMenuContext.Provider value={{ menuItem, handleSectionButtonClick, menu_id }}>
                                <ButtonMenu />
                            </ButtonMenuContext.Provider>

                            {(profile.is_staff || profile.is_moderate) && (
                                <EditButtonMenu menuItem={menuItem} menuId={menuItem.id} onUpdate={handleMenuUpdate} deleteMenuButtonComponent={<DeleteMenuButton handleSectionButtonClick={handleSectionButtonClick} handleDeleteMenu={handleDeleteMenu} profile={profile} menu_id={menu_id} menuItem={menuItem} selectedMenuId={selectedMenuId} menuId={menuItem.id} onUpdate={handleMenuUpdate} />} />
                            )}
                            <ModalAllertDeleteMenuContext.Provider value={{ showDeleteConfirmation, errorMessage, confirmDeleteMenu, cancelDeleteMenu }}>
                                <ModalAllertDeleteMenu />
                            </ModalAllertDeleteMenuContext.Provider>

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
                                        <div>
                                            <ButtonSectionContext.Provider value={{ ButtonMenuContext, sectionId, section, handleArticleButtonClick }}>
                                                <ButtonSection />
                                            </ButtonSectionContext.Provider>
                                        </div>
                                        {(profile.is_staff || profile.is_moderate) && (
                                            <div>
                                                <DeleteSectionButtonContext.Provider value={{ profile, deleteSectionModal, sectionId, section }}>
                                                    <EditButtonSection

                                                        section={section}
                                                        onUpdate={handleSectionUpdate}
                                                    />
                                                </DeleteSectionButtonContext.Provider>
                                            </div>
                                        )}
                                    </div>

                                ))}
                                {showModalDelete && (
                                    <ModalAllertDeleteSectionContext.Provider value={{ handleDeleteSection, sectionId, cancelDeleteSection }}>
                                        <ModalAllertDeleteSection />
                                    </ModalAllertDeleteSectionContext.Provider>
                                )}
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
                                    <ButtonArticleNameContext.Provider value={{ handleSelectArticle, selectedArticle, article }}>
                                        <ButtonArticleName />
                                    </ButtonArticleNameContext.Provider>
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
                                                <DeleteArticleButtonContext.Provider value={{ profile, deleteArticleModal, article: selectedArticle }} >
                                                    <EditArticleButton article={selectedArticle} onUpdate={handleArticleUpdate} />
                                                </DeleteArticleButtonContext.Provider>
                                            )}

                                            {showModalDeleteArticle && (
                                                <ModalAllertDeleteArticleContext.Provider value={{ handleDeleteArticle, selectedArticle, cancelArticleModal, handleDeleteArticle }}>
                                                    <ModalAllertDeleteArticle />
                                                </ModalAllertDeleteArticleContext.Provider>
                                            )}


                                            {(profile.is_staff || profile.is_moderate) && (
                                                <AddFilesButton articleId={selectedArticle.id} />
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
                {/* <GanttChart /> */}
                {/* <Link to="/admin">Admin Page</Link> Добавить Link для перехода на AdminPage */}
            </div>

        </div>
    );
};

export default Main;


