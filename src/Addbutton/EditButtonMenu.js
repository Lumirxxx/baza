import React, { useState } from "react";
import axios from "axios";

const EditButtonMenu = ({ menuItem, menuId }) => {
    const [name, setName] = useState(menuItem.name);
    const [img, setImg] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleButtonClick = () => {
        setShowForm(true);
        console.log(menuItem.name);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", name);
            formData.append("img", img);

            const response = await axios.patch(
                `http://192.168.10.109:8000/api/v1/menu/${menuId}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.data);

            // Сброс значений формы
            setName("");
            setImg(null);
            setShowForm(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImg(file);
    };
    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    return (
        <div className="edit_menu_button_container">
            {!showForm ? (
                <div className="edit_menu_button" onClick={handleButtonClick}></div>

            ) : (
                <form className="form_modal" onSubmit={handleFormSubmit}>
                    <input
                        required
                        type="text"
                        value={name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
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

export default EditButtonMenu;