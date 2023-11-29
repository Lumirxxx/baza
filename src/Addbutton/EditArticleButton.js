import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const EditArticleButton = ({ article }) => {
    const [content, setContent] = useState('');
    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(article.text);
    const [text, setText] = useState(article.text);

    const handleEditClick = () => {
        setEditing(true);
    };

    const articleData = {
        text: editedContent,
        // subsection_id: selectedSubsection,
    };

    const handleSaveClick = async () => {
        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('text', editedContent);
        formData.append('token', token);
        // formData.append('img', selectedFile);

        // обработка сохранения
        try {
            const response = await axios.patch(`http://192.168.10.109:8000/api/v1/articles/${article.id}/`, articleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            });

            const articleId = response.data.id;

            const fileFormData = new FormData();
            fileFormData.append("article_id", articleId);
            console.log('Статья изменена:', response.data);

        } catch (error) {
            console.log('Ошибка при загрузке статьи или изображения:', error);
            console.log(error.response.data);
        }

        setEditing(false);
    };

    const handleCancelClick = () => {
        setEditing(false);
        setEditedContent(article.text);
    };

    const handleChange = (content) => {
        setEditedContent(content);
    };

    return (
        <div>
            {!editing ? (
                <button onClick={handleEditClick}>Редактировать статью</button>
            ) : (
                <div>
                    <ReactQuill value={editedContent} onChange={handleChange} />
                    <button onClick={handleSaveClick}>Сохранить</button>
                    <button onClick={handleCancelClick}>Отмена</button>
                </div>
            )}
        </div>
    );
};

export default EditArticleButton;