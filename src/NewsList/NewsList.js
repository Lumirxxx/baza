import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsEdit from '../NewsEdit/NewsEdit';
import NewsDeleteConfirmationModal from '../NewsDeleteConfirmationModal/NewsDeleteConfirmationModal';
import SnackBar from '../SnackBar/SnackBar'; // Импорт готового SnackBar
import { apiserver } from '../config';

const NewsList = ({ news, searchParams, onEditToggle }) => {
    const [filteredNews, setFilteredNews] = useState(news);
    const [editingNewsId, setEditingNewsId] = useState(null);
    const [deletingNewsId, setDeletingNewsId] = useState(null);
    const [deletingNewsTitle, setDeletingNewsTitle] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState('');

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
                filtered = filtered.filter(item => {
                    const itemDate = item.publicated_at.split(' ')[0];
                    return itemDate.includes(searchParams.date);
                });
            }
    
            setFilteredNews(filtered);
        };
    
        filterNews();
    }, [news, searchParams]);
    
    const handleEditClick = (newsId) => {
        setEditingNewsId(newsId);
        onEditToggle(true); // Переход в режим редактирования
    };

    const handleCloseEditForm = () => {
        setEditingNewsId(null);
        onEditToggle(false); // Возврат к списку
    };

    const handleNewsUpdated = () => {
        setEditingNewsId(null);
        fetchNews();
        setSnackbarMessage("Новость успешно обновлена.");
        setSnackbarType('success');
        setIsSnackbarOpen(true);
        onEditToggle(false);
    };

    const handleDeleteClick = (newsId, newsTitle) => {
        setDeletingNewsId(newsId);
        setDeletingNewsTitle(newsTitle);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiserver}/news/list-admin/${deletingNewsId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setDeletingNewsId(null);
            fetchNews();
            setSnackbarMessage(`Новость "${deletingNewsTitle}" успешно удалена.`);
            setSnackbarType('delete');
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    const handleCancelDelete = () => {
        setDeletingNewsId(null);
    };

    const closeSnackbar = () => {
        setIsSnackbarOpen(false);
    };

    return (
        <div className="news-list">
            {editingNewsId ? null : (
                <>
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
                                        className="edit-button_news-list"
                                        onClick={() => handleEditClick(item.id)}
                                    >
                                        <img src='./edit-icon.svg' className='edit-icon' alt="Edit"/>
                                    </button>
                                    <button
                                        className="delete-button_news-list edit-button_news-list"
                                        onClick={() => handleDeleteClick(item.id, item.title)}
                                    >
                                        <img src="/delete-icon.svg" alt="Удалить" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </>
            )}

            {editingNewsId && (
                <NewsEdit
                    newsId={editingNewsId}
                    onClose={handleCloseEditForm}
                    onNewsUpdated={handleNewsUpdated}
                />
            )}

            {deletingNewsId && (
                <NewsDeleteConfirmationModal
                    newsTitle={deletingNewsTitle}
                    onDelete={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            <SnackBar
                message={snackbarMessage}
                isOpen={isSnackbarOpen}
                onClose={closeSnackbar}
                type={snackbarType}
            />
        </div>
    );
};

export default NewsList;
