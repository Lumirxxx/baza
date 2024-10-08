import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsEdit from '../NewsEdit/NewsEdit';
import NewsDeleteConfirmationModal from '../NewsDeleteConfirmationModal/NewsDeleteConfirmationModal';
import SnackBar from '../SnackBar/SnackBar'; // Импорт готового SnackBar
import { apiserver } from '../config'; // убедитесь, что путь к конфигу правильный

const NewsList = ({ news, searchParams }) => {
    const [filteredNews, setFilteredNews] = useState(news);
    const [editingNewsId, setEditingNewsId] = useState(null);
    const [deletingNewsId, setDeletingNewsId] = useState(null); // Состояние для ID новости на удаление
    const [deletingNewsTitle, setDeletingNewsTitle] = useState(''); // Состояние для названия новости

    const [snackbarMessage, setSnackbarMessage] = useState(''); // Состояние для сообщения snackbar
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false); // Состояние для управления видимостью snackbar
    const [snackbarType, setSnackbarType] = useState(''); // Тип snackbar ('delete', 'success' и т.д.)

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

    // Функция для удаления новости с подтверждением
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
            setDeletingNewsId(null); // Закрыть модальное окно после удаления
            fetchNews(); // Перезапрос списка новостей после удаления

            // Установить сообщение и показать snackbar
            setSnackbarMessage(`Новость "${deletingNewsTitle}" успешно удалена.`);
            setSnackbarType('delete'); // Указываем, что это тип удаления
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    const handleCancelDelete = () => {
        setDeletingNewsId(null); // Закрыть модальное окно без удаления
    };

    const closeSnackbar = () => {
        setIsSnackbarOpen(false); // Закрыть snackbar
    };

    return (
        <div className="news-list">
            {/* Если редактирование новости открыто, список не отображается */}
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
                                        <img src='./edit-icon.svg' className='edit-icon'></img>
                                    </button>
                                    {/* Добавление кнопки для удаления с иконкой */}
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

            {/* Форма редактирования новости */}
            {editingNewsId && (
                <NewsEdit
                    newsId={editingNewsId}
                    onClose={handleCloseEditForm}
                    onNewsUpdated={handleNewsUpdated}
                />
            )}

            {/* Модальное окно для подтверждения удаления */}
            {deletingNewsId && (
                <NewsDeleteConfirmationModal
                    newsTitle={deletingNewsTitle}
                    onDelete={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}

            {/* Добавляем компонент Snackbar */}
            <SnackBar
                message="Данные успешно удалены."
                isOpen={isSnackbarOpen}
                onClose={closeSnackbar}
                type={snackbarType} // Тип snackbar ('delete', 'success' и т.д.)
            />
        </div>
    );
};

export default NewsList;
