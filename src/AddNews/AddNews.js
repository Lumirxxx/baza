import React, { useState } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const AddNews = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [publicatedAt, setPublicatedAt] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const isFormComplete = title && publicatedAt && text;

    const handleAddNews = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('text', text);
            formData.append('publicated_at', publicatedAt);
            if (coverFile) {
                formData.append('cover', coverFile);
            }

            const response = await axios.post(`${apiserver}/news/list-admin/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newsId = response.data.id;
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
            console.log('Новость добавлена:', response.data);

            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);

            // Очистка полей формы
            setTitle('');
            setText('');
            setPublicatedAt('');
            setMediaFiles([]);
            setFilePreviews([]);
            setCoverFile(null);
            setCoverPreview(null);
        } catch (error) {
            console.error('Error adding news:', error);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setMediaFiles(prevFiles => [...prevFiles, ...files]);
    
        const previews = files.map(file => {
            const fileType = file.type.split('/')[0]; // image или video
            if (fileType === 'image') {
                return { url: URL.createObjectURL(file), type: 'image' };
            } else if (fileType === 'video') {
                return { url: URL.createObjectURL(file), type: 'video' };
            } else {
                return { url: URL.createObjectURL(file), type: 'other' };
            }
        });
    
        setFilePreviews(prevPreviews => [...prevPreviews, ...previews]);
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleRemoveFile = (index) => {
        setMediaFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setFilePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
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
                {preview.type === 'image' ? (
                    <img src={preview.url} alt={`preview-${index}`} width="100" />
                ) : preview.type === 'video' ? (
                    <video width="100" controls>
                        <source src={preview.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : null}
                <div 
                    className="remove-file-button"
                    onClick={() => handleRemoveFile(index)}
                >
                    <img className='close-btn_img' src="./close-circle1.svg" alt="Remove" />
                </div>
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
                <input className='add_news_checkbox' type="checkbox" id="add_news_checkbox-id" />
                <label className='label_add_news' htmlFor="add_news_checkbox-id">Добавить новость в мини ленту</label>
            </div>
            <button
                className={`save-button ${isFormComplete ? '' : 'save-button-disabled'}`}
                onClick={handleAddNews}
                disabled={!isFormComplete}
            >Сохранить</button>

            {/* Сообщение об успешном сохранении */}
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

export default AddNews;
