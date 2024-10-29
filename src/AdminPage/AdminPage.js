import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import AddNews from '../AddNews/AddNews';
import NewsSearch from '../NewsSearch/NewsSearch';
import NewsList from '../NewsList/NewsList';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiserver } from "../config";
import { setupAxiosInterceptors } from "../authService";

const AdminPage = () => {
    const [selectedSection, setSelectedSection] = useState('news');
    const [news, setNews] = useState([]);
    const [searchParams, setSearchParams] = useState({ date: '', title: '' });
    const [showAddNewsForm, setShowAddNewsForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Состояние для отслеживания открытия формы редактирования
    const navigate = useNavigate();

    useEffect(() => {
        setupAxiosInterceptors(navigate);

        const fetchNews = async () => {
            try {
                const newsResponse = await axios.get(`${apiserver}/news/list-admin/`);
                setNews(newsResponse.data);
            } catch (error) {
                console.error("Ошибка при получении данных: ", error);
            }
        };

        fetchNews();
    }, [navigate]);

    const handleUpdateNews = (updatedNews) => {
        setNews(news.map(item => item.id === updatedNews.id ? updatedNews : item));
    };

    const handleSearch = (params) => {
        setSearchParams(params); // Устанавливаем параметры поиска
    };

    const handleToggleAddNewsForm = () => setShowAddNewsForm(!showAddNewsForm);

    const handleEditToggle = (isEditMode) => {
        setIsEditing(isEditMode); // Обновляем состояние при открытии и закрытии формы редактирования
    };

    const renderSection = () => {
        switch (selectedSection) {
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
                                onEditToggle={handleEditToggle} // Передаём функцию для управления режимом редактирования
                            />
                        )}
                    </div>
                );
            case 'ipmwiki':
                return <div>IPM Wiki</div>;
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
