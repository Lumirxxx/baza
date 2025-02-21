import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import AddNews from '../AddNews/AddNews';
import NewsSearch from '../NewsSearch/NewsSearch';
import NewsList from '../NewsList/NewsList';
import Users from '../Users/Users';
import AdminDocuments from '../AdminDocuments/AdminDocuments';
import { apiserver } from "../config";
import { setupAxiosInterceptors } from "../authService";

const AdminPage = () => {
    const [selectedSection, setSelectedSection] = useState('news');
    const [news, setNews] = useState([]);
    const [searchParams, setSearchParams] = useState({ date: '', title: '' });
    const [showAddNewsForm, setShowAddNewsForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(null); // Добавляем состояние для проверки прав доступа
    const navigate = useNavigate();
 
    useEffect(() => {
        setupAxiosInterceptors(navigate);

        const checkAdminAccess = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Отсутствует токен. Перенаправление на главную.");
                    navigate("/");
                    return;
                }

                const userResponse = await axios.get(`${apiserver}/auth/users/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userResponse.data.length > 0 && userResponse.data[0].is_staff) {
                    setIsAdmin(true); // Устанавливаем состояние админа
                } else {
                    console.warn("Доступ запрещён: пользователь не является администратором.");
                    navigate("/"); // Перенаправляем неадминов на главную
                }
            } catch (error) {
                console.error("Ошибка при проверке прав администратора:", error);
                navigate("/"); // В случае ошибки также перенаправляем
            }
        };

        checkAdminAccess();
    }, [navigate]);

    useEffect(() => {
        if (isAdmin) {
            const fetchNews = async () => {
                try {
                    const newsResponse = await axios.get(`${apiserver}/news/list-admin/`);
                    setNews(newsResponse.data);
                } catch (error) {
                    console.error("Ошибка при получении данных: ", error);
                }
            };
            fetchNews();
        }
    }, [isAdmin]);

    if (isAdmin === null) {
        return <p>Проверка доступа...</p>; // Пока идет проверка, не показываем страницу
    }

    const handleUpdateNews = (updatedNews) => {
        setNews(news.map(item => item.id === updatedNews.id ? updatedNews : item));
    };

    const handleSearch = (params) => {
        setSearchParams(params);
    };

    const handleToggleAddNewsForm = () => setShowAddNewsForm(!showAddNewsForm);

    const handleEditToggle = (isEditMode) => {
        setIsEditing(isEditMode);
    };

    const renderSection = () => {
        switch (selectedSection) {
            case 'users':
                return <Users />;
            case 'news':
                return (
                    <div>
                        {!showAddNewsForm && !isEditing && (
                            <>
                                <div className='add_news_title'>Список новостей</div>
                                <NewsSearch onSearch={handleSearch} />
                            </>
                        )}
                        <button
                            className="add-news-toggle-button"
                            onClick={handleToggleAddNewsForm}
                        >
                            {showAddNewsForm ? (
                                <>
                                    <span style={{ color: '#022B94' }}>Вернуться к списку новостей</span>
                                    <img
                                        className="return-news-icon"
                                        src="/arrow-left.svg"
                                        alt="Return Icon"
                                    />
                                </>
                            ) : (
                                <>
                                    Добавить новость
                                    <img className='add_news-icon' src="/add-icon.svg" alt="Add Icon" />
                                </>
                            )}
                        </button>
                   {showAddNewsForm ? (
    <AddNews onSuccess={handleToggleAddNewsForm} />
) : (
    <NewsList
        news={news}
        searchParams={searchParams}
        onEditToggle={handleEditToggle}
    />
    
)}
                    </div>
                );
            case 'ipmwiki':
                return <div>IPM Wiki</div>;
                case 'contracts':
                    return <AdminDocuments />;
            default:
                return <div>Новости</div>;
        }
    };

    return (
        <div className="admin-page">
            <Sidebar selectedSection={selectedSection} onSelectSection={setSelectedSection} />
            <div className="content">
                {renderSection()}
            </div>
            
        </div>
    );
};

export default AdminPage;




