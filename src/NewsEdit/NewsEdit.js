import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const NewsEdit = ({ newsId, onClose, onNewsUpdated }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [publicatedAt, setPublicatedAt] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]); // Новые медиафайлы для загрузки
    const [filePreviews, setFilePreviews] = useState([]); // Превью для новых файлов
    const [existingMedia, setExistingMedia] = useState([]); // Существующие медиафайлы
    const [coverFile, setCoverFile] = useState(null); // Новый файл обложки
    const [coverPreview, setCoverPreview] = useState(null); // Превью для новой обложки
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Прогресс загрузки

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
                setCoverPreview(newsData.cover);

                const mediaResponse = await axios.get(`${apiserver}/news/media/`, {
                    params: { news_id: newsId },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setExistingMedia(mediaResponse.data);
            } catch (error) {
                console.error('Error fetching news data:', error);
            }
        };

        fetchNewsData();
    }, [newsId]);

    // Обновление новости
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
    
            // Обновление данных новости
            const response = await axios.patch(`${apiserver}/news/list-admin/${newsId}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Загружаем новые медиафайлы
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
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted); // Устанавливаем прогресс загрузки
                        },
                    });
                });
    
                await Promise.all(uploadPromises);
            }
    
            console.log('Новость обновлена:', response.data);
            setShowSuccessMessage(true);
    
            // Ожидание 3 секунд перед закрытием формы и обновлением
            setTimeout(() => {
                setShowSuccessMessage(false);
                onNewsUpdated();  // Обновляем список новостей
            }, 3000); // Задержка в 3 секунды для отображения сообщения
        } catch (error) {
            console.error('Error editing news:', error);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        const newPreviews = files.map(file => {
            const fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : null;
            return {
                type: fileType,
                url: URL.createObjectURL(file),
                file: file 
            };
        });
    
        setFilePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        setMediaFiles(prevMediaFiles => [...prevMediaFiles, ...files]);
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleRemoveExistingFile = async (mediaId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiserver}/news/media/${mediaId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setExistingMedia(existingMedia.filter(media => media.id !== mediaId));
        } catch (error) {
            console.error('Error deleting media file:', error);
        }
    };

    return (
        <div className="add-news">
            <div className='add-news_title'>Редактировать новость</div>
            <div type="button" className="close-btn-edit" onClick={onClose}>
                <div className='back_to_news_list'>
                    <img src='./arrow-left.svg' alt="Закрыть" />
                    </div>
                                
                                <div className='back_to_news_list-text'>Вернуться к списку новостей</div>
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

            {/* Превью существующих медиафайлов */}
            {existingMedia && existingMedia.length > 0 && (
                <div className="file-preview-container">
                    {existingMedia.map((file, index) => {
                        const isImage = file.media.match(/\.(jpeg|jpg|gif|png)$/);
                        const isVideo = file.media.match(/\.(mp4|webm)$/);

                        return (
                            <div key={index} className="file-preview">
                                {isImage ? (
                                    <img src={file.media} alt={`preview-${index}`} width="100" />
                                ) : isVideo ? (
                                    <video width="100" controls>
                                        <source src={file.media} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : null}
                                
                                <div 
                                    className="remove-file-button"
                                    onClick={() => handleRemoveExistingFile(file.id)}
                                >
                                    <img className='close-btn_img' src="./close-circle1.svg" alt="Remove" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Превью новых медиафайлов */}
            {filePreviews.length > 0 && (
                <div className="file-preview-container">
                    {filePreviews.map((preview, index) => (
                        <div key={index} className="file-preview">
                            {preview.type === 'image' ? (
                                <img src={preview.url} alt={`preview-${index}`} width="100" />
                            ) : preview.type === 'video' ? (
                                <video width="100" controls>
                                    <source src={preview.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}

            {/* Прогресс загрузки */}
            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                    Загрузка: {uploadProgress}%
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

            <div className="form-group  form-group_flex">
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
