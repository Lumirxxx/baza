import React, { useState } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const AddNews = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [publicatedAt, setPublicatedAt] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    const isFormComplete = title && publicatedAt && text;

    const handleAddNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${apiserver}/news/list-admin/`, { title, text, publicated_at: publicatedAt }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const newsId = response.data.id;
            const uploadPromises = mediaFiles.map(file => {
                const formData = new FormData();
                formData.append('news_id', newsId);
                formData.append('media', file);

                return axios.post(`${apiserver}/news/media/`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            });

            await Promise.all(uploadPromises);
            console.log('Новость добавлена:', response.data);
            setTitle('');
            setText('');
            setPublicatedAt('');
            setMediaFiles([]);
            setFilePreviews([]);
        } catch (error) {
            console.error('Error adding news:', error);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setMediaFiles(files);
        const previews = files.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    return (
        <div className="add-news">
            <div className='add-news_title'>Добавить новость</div>
            <div className="form-group">
                <label className='label_add_news'>Заголовок</label>
                <input className='add_news_textarea' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
                <label className='label_add_news'>Дата и время</label>
                <input className='add_news_textarea' type="datetime-local" value={publicatedAt} onChange={(e) => setPublicatedAt(e.target.value)} />
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
                <input className='add_news_checkbox' type="checkbox" id="add_news_checkbox-id" />
                <label className='label_add_news' htmlFor="add_news_checkbox-id">Добавить новость в мини ленту</label>
            </div>
            <button
                className={`save-button ${isFormComplete ? '' : 'save-button-disabled'}`}
                onClick={handleAddNews}
                disabled={!isFormComplete}
            >Сохранить</button>
        </div>
    );
};

export default AddNews;
