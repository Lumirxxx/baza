import React, { useState } from "react";
import axios from "axios";
import { apiserver } from "../config";
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
                `${apiserver}/api/v1/subsections/${subsectionId}/`,
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
                    <div className="edit_menu_button edit_menu_button-black"></div>
                </div>
            ) : (
                <div className="modal-background">
                    <div className="modal">
                        <form className="form_edit form_modal" onSubmit={handleSubmit} action={`${apiserver}/api/v1/subsections/`}>
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
                            <div className="modal_form-button">
                                <div className="form_button_container">
                                    <button className="form_button" type="submit">Добавить</button>
                                </div>

                                <div className="form_button_container">
                                    <button className="form_button" type="button" onClick={() => setShowForm(false)}>Отмена</button>
                                </div>


                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditButtonSubsection;
