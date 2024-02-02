import React, { useState } from "react";
import axios from "axios";

const EditButtonMenu = ({ menuItem, menuId, onUpdate, deleteMenuButtonComponent }) => {
    const [name, setName] = useState(menuItem.name);
    const [img, setImg] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleButtonClick = () => {
        setShowForm(true);
        console.log(menuItem.name);
    };
    const handleButtonCancel = () => {
        setShowForm(false);
        setName(menuItem.name)
    }
    const refresh = () => {

        window.location.reload();
        console.log("страница обновлена")
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", name);

            if (img) { // Проверяем, выбрано ли изображение
                formData.append("img", img);
            }

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
            // handleMenuUpdate(response.data);
            // Сброс значений формы

            // refresh();
            // setName("");
            setImg(null);
            setShowForm(false);
            onUpdate(response.data);

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
                <div className="edit_menu_button" onClick={handleButtonClick} title="Редактировать"></div>

            ) : (
                <div className="modal-background">
                    <div className="modal">
                        <form className="form_modal" onSubmit={handleFormSubmit}>
                            <div className="form_menu_label">
                                <label className="form_menu_label_name" htmlFor="name">Название:</label>
                                <input className="form_menu_input"
                                    required
                                    type="text"
                                    value={name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form_menu_label form_menu_label_img-container">
                            {deleteMenuButtonComponent}
                                <label className="form_menu_label_img" htmlFor="image"><div className="form_menu_input-image"></div></label>
                                <label className="form_menu_label_img-text" htmlFor="image" >Загрузить файл SVG</label>
                                <input className="form_menu_input-image_add" type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
                            
                            </div>
                            <div className="modal_form-button">
                                <div className="form_button_container">
                                    <button className="form_button" type="submit">Добавить</button>
                                </div>

                                <div className="form_button_container">
                                    <button className="form_button" type="button" onClick={() => handleButtonCancel()}>Отмена</button>
                                </div>


                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditButtonMenu;