import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

const Editor2 = ({ sectionId, onUpdate }) => {
    const editorRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState('');
    const [imgUrl, setImgUrl] = useState('')
        ;
    const [article, setArticle] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSubsection, setSelectedSubsection] = useState('');
    const [content, setContent] = useState('');

    const [isEditorOpen, setIsEditorOpen] = useState(false);//Строка отвечает за открытие редактора
    const TINY_MCE_API_KEY = 'efmk99udzjlbefwmmwhnslhwuza5j24xnv0xoq9r6mauop7v';
    const TINY_MCE_SCRIPT_SRC = `https://cdn.tiny.cloud/1/${TINY_MCE_API_KEY}/tinymce/5/tinymce.min.js`;


    useEffect(() => {
        fetchSubsections();
        setSelectedSubsection(sectionId);
    }, [sectionId]);
    const handleButtonClick = () => {
        setIsEditorOpen(true);
    };

    const handleEditorClose = () => {
        setIsEditorOpen(false);
        setName('')
        setErrorMessage('')
    };

    const fetchSubsections = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://192.168.10.109:8000/api/v1/sections/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setSections(response.data);
        } catch (error) {
            console.log('Error fetching sections:', error);
        }
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


            success(response.data.img);
            console.log(response.data.img);
        } catch (error) {
            console.error('Ошибка отправки изображения:', error);
            failure('Ошибка загрузки изображения из-за ошибки сервера.');
        }
    };


    const handleVideoUploaded = async (blobInfo, success, failure) => {
        const token = localStorage.getItem('token');
        const videoUrl = blobInfo.blobUri();

        const videoFile = await fetch(videoUrl).then((response) => response.blob());
        const formData = new FormData();
        formData.append('video', videoFile, blobInfo.filename());

        try {
            const response = await axios.post('http://192.168.10.109:8000/api/v1/videos/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            success(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Ошибка отправки видео:', error);
            failure('Ошибка загрузки видео из-за ошибки сервера.');
        }
    }

    const handleSubmit = async () => {
        // Получить содержимое редактора
        const editor = editorRef.current;
        const content = editor.getContent();

        // Обновить значения imgUrl и article
        setImgUrl(content);
        setArticle(content);

        // Остальной код для отправки формы
        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('video', content)
        formData.append('img', content);
        formData.append('text', content);
        formData.append('name', name);
        formData.append('token', token);
        formData.append('section_id', selectedSubsection);
        formData.append('menu_id', '');
        // formData.append('section_id', '');

        try {
            const response = await axios.post('http://192.168.10.109:8000/api/v1/articles/', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            onUpdate(response.data)
            handleEditorClose();
            console.log('Результат отправки статьи:', response.data);

        } catch (error) {
            // console.error(error.message);
            setErrorMessage(error.response.data)

            console.error('Ошибка отправки статьи:', error.response.data);
        }
    };
    const handleSelectSubsection = (event) => {
        setSelectedSubsection(event.target.value);
        console.log(selectedSubsection)
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    return (

        <div  >

            <div className="section_button section_button_add " onClick={handleButtonClick}>
                <div className="section_name ">Добавить статью</div>
            </div>
            {isEditorOpen && (


                <div>
                    <div className="modal">
                        <div className="modal-editor form_modal">
                            <select className='form_menu_input' disabled value={selectedSubsection} onChange={handleSelectSubsection}>
                                <option value="">Выбрать раздел</option>
                                {sections.map((subsection) => (
                                    <option disabled key={subsection.id} value={subsection.id}>{subsection.name}</option>
                                ))}
                            </select>

                            <input required className='article_name-input form_menu_input' placeholder='Название статьи' type="text" value={name} onChange={handleNameChange} />
                            {errorMessage && <div className="error-message">{errorMessage.name}</div>}

                            <Editor
                                tinymceScriptSrc={TINY_MCE_SCRIPT_SRC}
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                apiKey="efmk99udzjlbefwmmwhnslhwuza5j24xnv0xoq9r6mauop7v"
                                init={{
                                    plugins: 'image , paste, wordcount ,media',
                                    toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons | media',

                                    images_upload_url: 'http://192.168.10.109:8000/api/v1/images/',
                                    images_upload_handler: handleImageUpload,
                                    file_picker_callback: function (callback, value, meta) {
                                        /* Provide file and text for the link dialog */
                                        if (meta.filetype === 'file') {
                                            callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                                        }

                                        /* Provide image and alt text for the image dialog */
                                        if (meta.filetype === 'image') {
                                            callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
                                        }

                                        /* Provide alternative source and posted for the media dialog */
                                        if (meta.filetype === 'media') {
                                            callback('movie.mp4', { source2: 'alt.ogg', poster: 'http://192.168.10.109:8000/media/files/video_2024-02-12_14-17-41_pOyX8Ct.mp4' });
                                        }
                                    },
                                    paste_data_images: true,
                                    media_live_embeds: true,

                                    height: 600,

                                }}

                            />
                            {errorMessage && <div className="error-message">{errorMessage.text}</div>}
                            <div className='button_article-editor'>





                                <button className="form_button" onClick={handleSubmit}>Отправить</button>
                                <button className="form_button" onClick={handleEditorClose}>Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor2;

