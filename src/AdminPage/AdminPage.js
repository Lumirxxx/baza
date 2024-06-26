import React, { useState } from "react";
import axios from "axios";
import { apiserver } from "../config";

const AdminPage = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [newsline, setNewsline] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [files, setFiles] = useState([]);
    const [mediaIds, setMediaIds] = useState([]);

    const handleMediaUpload = async () => {
        try {
            const token = localStorage.getItem("token");
            const mediaPromises = files.map(file => {
                const formData = new FormData();
                formData.append("file", file);

                return axios.post(`${apiserver}/news/media/`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            });

            const responses = await Promise.all(mediaPromises);
            return responses.map(response => response.data.id);
        } catch (error) {
            console.error("Ошибка при загрузке медиа-файлов: ", error);
            throw error;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const mediaIds = await handleMediaUpload();

            const token = localStorage.getItem("token");
            await axios.post(`${apiserver}/news/list/`, {
                title,
                text,
                newsline,
                media: mediaIds
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSuccessMessage("Новость успешно добавлена!");
            setTitle("");
            setText("");
            setNewsline(false);
            setFiles([]);
            setShowForm(false);
        } catch (error) {
            console.error("Ошибка при добавлении новости: ", error);
            setErrorMessage("Не удалось добавить новость");
        }
    };

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    return (
        <div className="admin_page">
            <h1>Администрирование новостей</h1>
            <button onClick={() => setShowForm(!showForm)}>Добавить новость</button>

            {showForm && (
                <form onSubmit={handleSubmit} className="news_form">
                    <div className="form_group">
                        <label htmlFor="title">Заголовок</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form_group">
                        <label htmlFor="text">Текст</label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form_group">
                        <label>
                            <input
                                type="checkbox"
                                checked={newsline}
                                onChange={(e) => setNewsline(e.target.checked)}
                            />
                            Добавить в мини ленту
                        </label>
                    </div>
                    <div className="form_group">
                        <label htmlFor="files">Добавить файлы</label>
                        <input
                            type="file"
                            id="files"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="file_preview_container">
                        {files.length > 0 && files.map((file, index) => (
                            <div key={index} className="file_preview">
                                {file.type.startsWith("image/") ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        width="50"
                                        height="50"
                                    />
                                ) : (
                                    <video
                                        src={URL.createObjectURL(file)}
                                        width="50"
                                        height="50"
                                        controls
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="submit">Сохранить</button>
                </form>
            )}

            {errorMessage && <p className="error_message">{errorMessage}</p>}
            {successMessage && <p className="success_message">{successMessage}</p>}
        </div>
    );
};

export default AdminPage;
