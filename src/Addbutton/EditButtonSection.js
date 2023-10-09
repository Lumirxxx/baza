import React, { useState } from "react";
import axios from "axios";

const EditButtonSection = ({ section, onUpdate }) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState(section.name);

    const handleButtonClick = () => {
        setShowForm(true);
    };

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        axios
            .patch(
                `http://192.168.10.109:8000/api/v1/sections/${section.id}/`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log("Раздел обновлен:", response.data);
                onUpdate(response.data);
                setShowForm(false);
            })
            .catch((error) => {
                console.log("Ошибка при обновлении раздела:", error);
            });
    };

    return (
        <div className="section_button-container">
            {!showForm ? (
                <div className="section_button section_button_edit" onClick={handleButtonClick}>
                    <div className="section_name">ред</div>
                </div>
            ) : (
                <form className="form_edit" onSubmit={handleSubmit}>
                    <input
                        required
                        type="text"
                        value={name}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={() => setShowForm(false)}>
                        Отмена
                    </button>
                </form>
            )}
        </div>
    );
};

export default EditButtonSection;