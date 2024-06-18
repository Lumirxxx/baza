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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${apiserver}/news/list/`, {
                title,
                text,
                newsline
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage("Новость успешно добавлена!");
            setTitle("");
            setText("");
            setNewsline(false);
            setShowForm(false);
        } catch (error) {
            console.error("Ошибка при добавлении новости: ", error);
            setErrorMessage("Не удалось добавить новость");
        }
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
                    <button type="submit">Сохранить</button>
                </form>
            )}

            {errorMessage && <p className="error_message">{errorMessage}</p>}
            {successMessage && <p className="success_message">{successMessage}</p>}
        </div>
    );
};

export default AdminPage;
