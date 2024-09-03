import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import AddNews from '../AddNews/AddNews';
import NewsSearch from '../NewsSearch/NewsSearch';
import Users from '../Users/Users';
import NewsList from '../NewsList/NewsList'; // Импортируем новый компонент
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiserver } from "../config";
import { setupAxiosInterceptors } from "../authService";

const AdminPage = () => {
    const [selectedSection, setSelectedSection] = useState('news');
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [searchParams, setSearchParams] = useState({ date: '', title: '' });
    const [showAddNewsForm, setShowAddNewsForm] = useState(false);

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

    const renderSection = () => {
        switch (selectedSection) {
            case 'users':
                return <Users />;
            case 'news':
                return (
                    <div>
                        <div className='add_news_title'>Список новостей</div>
                        <NewsSearch onSearch={handleSearch} />
                        <button
                            className="add-news-toggle-button"
                            onClick={() => setShowAddNewsForm(!showAddNewsForm)}
                        >
                            {showAddNewsForm ? 'Добавить новость' : 'Добавить новость'}
                            <img className='add_news-icon' src="/add-icon.svg" alt="Add Icon" />
                        </button>
                        {showAddNewsForm ? (
                            <AddNews />
                        ) : (
                            <NewsList news={news} searchParams={searchParams} />
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
