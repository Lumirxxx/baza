import React, { useState } from "react";
import axios from "axios";

const AddButtonMenu = () => {
    const [name, setName] = useState("");
    const [img, setImg] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleButtonClick = () => {
        setShowForm(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", name);
            formData.append("img", img);

            const response = await axios.post(
                "http://192.168.10.109:8000/api/v1/menu/",
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

    return (
        <div>
            {!showForm ? (
                <button onClick={handleButtonClick}>Добавить меню</button>
            ) : (
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button type="submit">Добавить</button>
                </form>
            )}
        </div>
    );
};

export default AddButtonMenu;