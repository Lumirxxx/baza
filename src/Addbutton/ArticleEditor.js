import React, { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiserver } from "../config";

import axios from 'axios';
// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);

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
            const response = await axios.get(`${apiserver}/api/v1/subsections/`,
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
    const handleSelectFile = (event) => {
        setSelectedFile(event.target.files[0]);
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
        formData.append("image", selectedFile);

        try {
            await axios.post(`${apiserver}/api/v1/articles/`, articleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {

                const articleId = response.data.id;

                const fileFormData = new FormData();
                fileFormData.append("name", fileName);
                fileFormData.append("file", file);
                fileFormData.append("article_id", articleId);

                axios.post(`${apiserver}/api/v1/files/`, fileFormData, {
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
                // Вызов метода upload
                // handlers.imageUploader.upload(selectedFile)
                //     .then((imageUrl) => {
                //         // Делайте что-то с полученным URL изображения
                //     })
                //     .catch((error) => {
                //         console.log('Ошибка при загрузке изображения:', error);
                //     });

                console.log('Статья загружена:', response.data);
            }).catch((error) => {
                console.log('Ошибка при загрузке статьи или изображения:', error);
            });
        } catch (error) {
            console.log('Ошибка при загрузке статьи или изображения:', error);
        }
    };


    const modules = {
        // #3 Add "image" to the toolbar
        toolbar: [
            ["bold", "italic", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ header: [1, 2, false] }],
            ['link', 'image'],
            ['clean'],
        ],




        // # 4 Add module and upload function
        imageUploader: {
            upload: (file) => {
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    const token = localStorage.getItem('token');

                    formData.append('token', token);
                    formData.append("img", file);
              
                    fetch(
                        `${apiserver}/api/v1/images/`,
                        {
                            method: "POST",
                            body: formData,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    )
                        .then(response => response.json())
                        .then(result => {
                            if (result && result.img) {
                                console.log(result);
                                resolve(result.img);
                                console.log(result.img);
                            } else {
                                console.log(result);
                                reject("Загрузка не удалась");
                            }
                        });
                });
            }
        },

      

    };
    return (
        <div>
            <ReactQuill
                theme='snow'
                value={content}
                onChange={setContent}
                modules={modules}
             
                
            // handlers={handlers}
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

