import React, { useState } from "react";
import axios from "axios";

const EditButtonSubsection = ({ subsection, subsectionId, onUpdate }) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState(subsection.name);

    const handleButtonClick = () => {
        setShowForm(true);
        console.log(subsection.name)
    };

    const handleInputChange = (event) => {
        setName(event.target.value);

    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        axios
            .patch(
                `http://192.168.10.109:8000/api/v1/subsections/${subsectionId}/`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log(subsection.name)
                console.log(subsectionId)
                console.log("Раздел обновлен:", response.data);
                onUpdate(response.data);
                setShowForm(false);
            })
            .catch((error) => {
                console.log(subsectionId)
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
                <form className="form_edit" onSubmit={handleSubmit} action="http://192.168.10.109:8000/api/v1/subsections/">
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

export default EditButtonSubsection;