import React, { useState } from "react";
import axios from "axios";
import DeleteSectionButton from "../DeleteButton/DeleteSectionButton";
import { apiserver } from "../config";
const EditButtonSection = ({ section, onUpdate }) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState(section.name);
    const [img, setImg] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    const handleButtonClick = () => {
        setShowForm(true);
    };
    const handleButtonCancel = () => {
        setShowForm(false);
        setName(section.name)
        setErrorMessage('')

    }

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("img", img);
        axios
            .patch(
                `${apiserver}/api/v1/sections/${section.id}/`,
                { name, img },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                console.log("Раздел обновлен:", response.data);
                onUpdate(response.data);
                setShowForm(false);
                setImg(null);
            })
            .catch((error) => {
                console.log("Ошибка при обновлении раздела:", error);
                setErrorMessage(error.response.data)

            });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImg(file);
    };

    return (
        <div className="section_button-container">
            {!showForm ? (
                <div className="section_button_edit" onClick={handleButtonClick}>
                    <div className="edit_menu_button edit_menu_button-black" title="Редактировать"></div>
                </div>
            ) : (
                <div className="modal-background">
                    <div className="modal">
                        <form className="form_edit form_modal" onSubmit={handleSubmit}>
                            <div className="delete_button_position_container">
                                <div className="form_menu_label">
                                    <label className="form_menu_label_name" htmlFor="name">Название:</label>
                                    <input
                                        className="form_menu_input"
                                        required
                                        type="text"
                                        value={name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <DeleteSectionButton />
                                <div className="form_menu_label form_menu_label_img-container">

                                    <label className="form_menu_label_img" htmlFor="image"><div className="form_menu_input-image"></div></label>
                                    <label className="form_menu_label_img-text" htmlFor="image" >Загрузить файл SVG</label>
                                    <input className="form_menu_input-image_add" type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />

                                </div>
                                {errorMessage && <div className="error-message">{errorMessage.img}</div>}
                                <div className="modal_form-button">
                                    <div className="form_button_container">
                                        <button className="form_button" type="submit">Добавить</button>
                                    </div>

                                    <div className="form_button_container">
                                        <button className="form_button" type="button" onClick={() => handleButtonCancel()}>Отмена</button>
                                    </div>


                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditButtonSection;