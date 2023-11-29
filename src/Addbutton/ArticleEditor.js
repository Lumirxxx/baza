import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const ArticleEditor = () => {
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [subsections, setSubsections] = useState([]);
    const [selectedSubsection, setSelectedSubsection] = useState('');
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchSubsections();
    }, []);

    const fetchSubsections = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://192.168.10.109:8000/api/v1/subsections/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setSubsections(response.data);
        } catch (error) {
            console.log('Error fetching subsections:', error);
        }
    };

    const handleSelectSubsection = (event) => {
        setSelectedSubsection(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const articleData = {
            text: content,
            subsection_id: selectedSubsection,
        };

        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('text', content);
        formData.append('token', token);
        formData.append('img', selectedFile);

        try {
            await axios.post('http://192.168.10.109:8000/api/v1/articles/', articleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                const articleId = response.data.id;

                const fileFormData = new FormData();
                fileFormData.append("name", fileName);
                fileFormData.append("file", file);
                fileFormData.append("article_id", articleId);

                axios.post("http://192.168.10.109:8000/api/v1/files/", fileFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }).then((response) => {
                    const fileName = response.data.name;
                    const file = response.data.file;
                    const fileFormData = new FormData();
                    fileFormData.append("name", fileName);
                    fileFormData.append("file", file);
                    console.log("Файл загружен:", response.data);
                }).catch((error) => {
                    console.log("Ошибка при загрузке файла:", error);
                });

                console.log('Статья загружена:', response.data);
            }).catch((error) => {
                console.log('Ошибка при загрузке статьи или изображения:', error);
            });
        } catch (error) {
            console.log('Ошибка при загрузке статьи или изображения:', error);
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
        ],
    };

    return (
        <div>
            <ReactQuill
                theme='snow'
                value={content}
                onChange={setContent}
                modules={modules}
            />
            <select value={selectedSubsection} onChange={handleSelectSubsection}>
                <option value="">Выбрать раздел</option>
                {subsections.map((subsection) => (
                    <option key={subsection.id} value={subsection.id}>{subsection.name}</option>
                ))}
            </select>
            <div>
                <label htmlFor="name">Имя файла:</label>
                <input type="text" id="name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </div>

            <div>
                <label htmlFor="file">Выберите файл:</label>
                <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default ArticleEditor;