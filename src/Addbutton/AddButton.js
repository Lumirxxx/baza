import React, { useState, useEffect } from "react";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { apiserver } from "../config";
import { apiserverwiki } from "../config";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// Компонент кнопки "Добавить "
const AddButton = () => {
    const [sections, setSections] = useState([]);// Состояние разделов
    const [showForm, setShowForm] = useState(false); // Состояние отображения формы
    const [subsectionId, setSectionId] = useState(null);// Состояние выбранного подраздела
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);// Состояние выбранных изображений
    const [editorState, setEditorState] = useState(EditorState.createEmpty());// Состояние редактора
    const [contentHtml, setContentHtml] = useState("");// Состояние HTML-контента
    const [selectedImage, setSelectedImage] = useState(null);// Состояние выбранного изображения
    // Обработчик клика по кнопке "Добавить"
    const handleButtonClick = () => {
        fetchSections();// Получение списка разделов
        setShowForm(true);// Установка состояния отображения формы
    };

    const handleSectionChange = (event) => {
        const subsectionId = event.target.value;
        setSectionId(subsectionId);
    };

    const handleEditorStateChange = (state) => {
        setEditorState(state);
        const contentState = state.getCurrentContent();
        const contentHtml = draftToHtml(convertToRaw(contentState));
        const cleanedContentHtml = contentHtml.replace(/"|\\n/g, "");
        setContentHtml(cleanedContentHtml);
    };

    const fetchSections = () => {
        const token = localStorage.getItem("token");
        axios
            .get(`${apiserverwiki}/subsections/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setSections(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (subsectionId !== null) {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("subsection_id", subsectionId);
            formData.append("text", contentHtml);

            selectedImages.forEach((image, index) => {
                formData.append(`image_${index}`, image);
            });

            axios
                .post(`${apiserverwiki}/articles/`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    const articleId = response.data.id;

                    const fileFormData = new FormData();
                    fileFormData.append("name", fileName); // Обновлено: Добавить fileName в fileFormData
                    fileFormData.append("file", file); // Обновлено: Добавить file в fileFormData
                    fileFormData.append("article_id", articleId);
                    axios
                        .post(`${apiserverwiki}/files/`, fileFormData, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        })
                        .then((response) => {
                            const fileName = response.data.name;
                            const file = response.data.file;
                            const fileFormData = new FormData();
                            fileFormData.append("name", fileName);
                            fileFormData.append("file", file);
                            console.log("Файл загружен:", response.data);
                        })
                        .catch((error) => {
                            console.log("Ошибка при загрузке файла:", error);
                        });

                    console.log("Новая статья добавлена:", response.data);
                })
                .catch((error) => {
                    console.log("Ошибка при добавлении новой статьи:", error);
                });
        } else {
            console.log("subsectionId равен null");
        }

        setSectionId(null);
        setEditorState(EditorState.createEmpty());
        setSelectedImages([]);
        // setSelectedImage(null);
        setShowForm(false);
    };

    const handleImageUpload = async (file) => {
        setSelectedImage(file);

        const formData = new FormData();
        const token = localStorage.getItem("token");
        formData.append("img", file);

        try {
            const response = await axios.post(`${apiserverwiki}/images/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            const imageUrl = response.data.img;
            console.log("Image URL:", imageUrl);
        } catch (error) {
            console.log("Ошибка при загрузке изображения:", error);
        }
    };

    useEffect(() => {
        const rawContentState = JSON.parse(localStorage.getItem("content"));
        if (rawContentState) {
            const contentState = convertFromRaw(rawContentState);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, []);

    return (
        <div>
            <button onClick={handleButtonClick}>Add Article</button>

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <select value={subsectionId} onChange={handleSectionChange}>
                        <option value="" disabled selected>Select a section</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>

                    <Editor
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                        toolbar={{
                            options: ["inline", "blockType", "list", "textAlign", "link", "embedded", "image"],
                            inline: { options: ["bold", "italic", "underline"] },
                            blockType: { options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"] },
                            list: { options: ["unordered", "ordered"] },
                            textAlign: { options: ["left", "center", "right"] },
                            link: { options: ["link"] },
                            embedded: { options: ["image"] },
                            image: {
                                uploadCallback: handleImageUpload,
                                urlEnabled: true,
                                uploadEnabled: true,
                                previewImage: true,
                                alt: { present: false, mandatory: false }
                            },
                        }}
                    />

                    <div>
                        <label htmlFor="name">Имя файла:</label>
                        <input type="text" id="name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="file">Выберите файл:</label>
                        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>


                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default AddButton;