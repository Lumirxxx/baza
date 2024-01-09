import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// import 'tinymce/tinymce';
// import 'tinymce/themes/silver';
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/code';

import axios from 'axios';

const EditArticleButton = ({ article }) => {
    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(article.text);
    const TINY_MCE_API_KEY = 'efmk99udzjlbefwmmwhnslhwuza5j24xnv0xoq9r6mauop7v';
    const TINY_MCE_SCRIPT_SRC = `https://cdn.tiny.cloud/1/${TINY_MCE_API_KEY}/tinymce/5/tinymce.min.js`;

    const handleEditClick = () => {
        setEditing(true);
    };

    const articleData = {
        text: editedContent,
        // subsection_id: selectedSubsection,
    };

    const handleSaveClick = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('text', editedContent);
        formData.append('token', token);
        // formData.append('img', selectedFile);

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
                    <Editor
                        value={editedContent}
                        tinymceScriptSrc={TINY_MCE_SCRIPT_SRC}
                        apiKey="efmk99udzjlbefwmmwhnslhwuza5j24xnv0xoq9r6mauop7v"
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'paste, link, image ,code',
                            ],
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
                        }}
                        onEditorChange={handleChange}
                    />
                    <button onClick={handleSaveClick}>Сохранить</button>
                    <button onClick={handleCancelClick}>Отмена</button>
                </div>
            )}
        </div>
    );
};

export default EditArticleButton;