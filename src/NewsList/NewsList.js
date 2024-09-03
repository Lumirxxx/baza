import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsEdit from '../NewsEdit/NewsEdit';
import { apiserver } from '../config'; // убедитесь, что путь к конфигу правильный

const NewsList = ({ news, searchParams }) => {
    const [filteredNews, setFilteredNews] = useState(news);
    const [editingNewsId, setEditingNewsId] = useState(null);

    // Метод для перезапроса списка новостей
    const fetchNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiserver}/news/list-admin/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setFilteredNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    useEffect(() => {
        const filterNews = () => {
            let filtered = news;

            if (searchParams.title) {
                filtered = filtered.filter(item =>
                    item.title.toLowerCase().includes(searchParams.title.toLowerCase())
                );
            }

            if (searchParams.date) {
                const searchDate = searchParams.date.split('.').reverse().join('-');
                filtered = filtered.filter(item =>
                    item.publicated_at.startsWith(searchDate)
                );
            }

            setFilteredNews(filtered);
        };

        filterNews();
    }, [news, searchParams]);

    const handleEditClick = (newsId) => {
        setEditingNewsId(newsId);
    };

    const handleCloseEditForm = () => {
        setEditingNewsId(null);
    };

    const handleNewsUpdated = () => {
        setEditingNewsId(null);
        fetchNews();  // Перезапрос списка новостей после редактирования
    };

    return (
        <div className="news-list">
            {filteredNews.length === 0 ? (
                <p>Новостей по вашему запросу не найдено.</p>
            ) : (
                filteredNews.map((item) => (
                    <div key={item.id} className="news-item">
                        <img src={item.cover} alt={item.title} className="news-cover" />
                        <div className="news-details">
                            <div className="news-title">{item.title}</div>
                            <div className="news-date">
                                {item.publicated_at.split(' ')[0]}
                            </div>
                            <button
                                className="edit-button"
                                onClick={() => handleEditClick(item.id)}
                            >
                                Редактировать
                            </button>
                        </div>
                        {editingNewsId === item.id && (
                            <NewsEdit
                                newsId={item.id}
                                onClose={handleCloseEditForm}
                                onNewsUpdated={handleNewsUpdated}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default NewsList;
