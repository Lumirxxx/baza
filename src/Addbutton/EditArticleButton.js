import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// import 'tinymce/tinymce';
// import 'tinymce/themes/silver';
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/code';

import axios from 'axios';

const EditArticleButton = ({ article }) => {
    const editorRef = useRef(null);
    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(article.text);
    const [articleName, setArticleName] = useState(article.name);
    const [isEditorOpen, setIsEditorOpen] = useState(false);//Строка отвечает за открытие редактора
    const TINY_MCE_API_KEY = 'efmk99udzjlbefwmmwhnslhwuza5j24xnv0xoq9r6mauop7v';
    const TINY_MCE_SCRIPT_SRC = `https://cdn.tiny.cloud/1/${TINY_MCE_API_KEY}/tinymce/5/tinymce.min.js`;

    const handleEditClick = () => {
        setEditing(true);
    };

    const articleData = {
        text: editedContent,
        name: articleName,
        // subsection_id: selectedSubsection,
    };
    const handleImageUpload = async (blobInfo, success, failure,) => {
        const token = localStorage.getItem('token');

        const imageUrl = blobInfo.blobUri();
        const imageFile = await fetch(imageUrl).then((response) => response.blob());

        const formData = new FormData();
        formData.append('img', imageFile, blobInfo.filename());

        try {
            const response = await axios.post('http://192.168.10.109:8000/api/v1/images/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const editor = editorRef.current;
            // editor.insertContent(`<img src="${response.data.img}" alt=""/>`);

            success(response.data.img);
            console.log(response.data.img);
        } catch (error) {
            console.error('Ошибка отправки изображения:', error);
            failure('Ошибка загрузки изображения из-за ошибки сервера.');
        }
    };


    const handleSaveClick = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('text', editedContent);
        formData.append('name', articleName);
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
        // setArticleName(content);
    };

    return (
        <div>
            {!editing ? (
                <button onClick={handleEditClick}>Редактировать статью</button>
            ) : (
                <div>
                    <div className='modal'>
                        <div className="modal-editor form_modal">
                            <Editor
                                value={editedContent + articleName}
                                tinymceScriptSrc={TINY_MCE_SCRIPT_SRC}
                                apiKey="efmk99udzjlbefwmmwhnslhwuza5j24xnv0xoq9r6mauop7v"
                                init={{
                                    height: 500,
                                    menubar: false,
                                    images_upload_url: 'http://192.168.10.109:8000/api/v1/images/',
                                    images_upload_handler: handleImageUpload,
                                    plugins: [
                                        'paste, link, image ,code',
                                    ],
                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | image',

                                }}
                                onEditorChange={handleChange}
                            />
                            <div className='button_article-editor' >
                                <button className="form_button" onClick={handleSaveClick}>Сохранить</button>
                                <button className="form_button" onClick={handleCancelClick}>Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EditArticleButton;