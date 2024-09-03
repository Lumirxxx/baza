import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const NewsEdit = ({ newsId, onClose, onNewsUpdated }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [publicatedAt, setPublicatedAt] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiserver}/news/list-admin/${newsId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                const newsData = response.data;
                setTitle(newsData.title);
                setText(newsData.text);
                setPublicatedAt(newsData.publicated_at);
                setCoverPreview(newsData.cover); // Assuming the cover URL is returned
                setFilePreviews(newsData.media.map(file => file.url)); // Assuming media URLs are returned
            } catch (error) {
                console.error('Error fetching news data:', error);
            }
        };
    
        fetchNewsData();
    }, [newsId]);
    

    const handleEditNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('text', text);
            formData.append('publicated_at', publicatedAt);
            if (coverFile) {
                formData.append('cover', coverFile);
            }
    
            const response = await axios.patch(`${apiserver}/news/list-admin/${newsId}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Update media files if they were changed
            if (mediaFiles.length > 0) {
                const uploadPromises = mediaFiles.map(file => {
                    const mediaFormData = new FormData();
                    mediaFormData.append('news_id', newsId);
                    mediaFormData.append('media', file);
    
                    return axios.post(`${apiserver}/news/media/`, mediaFormData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                });
    
                await Promise.all(uploadPromises);
            }
    
            console.log('Новость обновлена:', response.data);
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
    
            onNewsUpdated();
        } catch (error) {
            console.error('Error editing news:', error);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setMediaFiles(prevMediaFiles => [...prevMediaFiles, ...files]); // добавляем новые файлы к существующим
        const previews = files.map(file => URL.createObjectURL(file));
        setFilePreviews(prevPreviews => [...prevPreviews, ...previews]); // добавляем новые превью к существующим
    };
    

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    return (
        <div className="add-news">
            <div className='add-news_title'>Редактировать новость</div>
            <div type="button" className="close-btn" onClick={onClose}>
               <img src='./close-circle.svg' alt="Закрыть"/>
            </div>
            <div className="form-group">
                <label className='label_add_news'>Заголовок</label>
                <input className='edit_news_textarea' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label_add_news'>Дата и время</label>
                <input className='edit_news_textarea' type="datetime-local" value={publicatedAt} onChange={(e) => setPublicatedAt(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label_add_news'>Текст</label>
                <textarea className='add_news_text add_news_textarea' value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="form-group">
                <label className="label_add_news">Добавить фото / видео</label>
                <div className="file-input-wrapper">
                    <input type="file" multiple onChange={handleFileChange} />
                    <button className="custom-file-button">
                        <img src="/filedownload.svg" alt="Загрузить файл" />
                        Загрузить файл
                    </button>
                </div>
            </div>
            {filePreviews.length > 0 && (
                <div className="file-preview-container">
                    {filePreviews.map((preview, index) => (
                        <div key={index} className="file-preview">
                            <img src={preview} alt={`preview-${index}`} width="100" />
                        </div>
                    ))}
                </div>
            )}

            <div className="form-group">
                <div className="file-input-wrapper form-group">
                    <input type="file" onChange={handleCoverChange} />
                    <button className="custom-file-button">
                        <img src="/filedownload.svg" alt="Загрузить обложку" />
                        Загрузить обложку
                    </button>
                </div>
                {coverPreview && (
                    <div className="cover-preview file-preview">
                        <img src={coverPreview} alt="Cover preview" width="100" />
                    </div>
                )}
            </div>

            <div className="form-group">
                <input className='edit_news_checkbox' type="checkbox" id="edit_news_checkbox-id" />
                <label className='label_edit_news' htmlFor="edit_news_checkbox-id">Добавить новость в мини ленту</label>
            </div>
            <button
                className="save-button"
                onClick={handleEditNews}
            >Сохранить</button>

            {/* Сообщение об успешном обновлении */}
            {showSuccessMessage && (
                <div className="success-message">
                    <div className='success-icon'>
                        <img src="/tick-square.svg" alt="Success" />
                    </div>
                    <div className='success-text'>Данные успешно сохранены.</div>
                </div>
            )}
        </div>
    );
};

export default NewsEdit;
