import React, { useState } from "react";
import axios from "axios";

const AddButtonMenu = () => {
    const [name, setName] = useState("");
    const [img, setImg] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState([]);

    const handleButtonClick = () => {
        setShowForm(true);
    };

 
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", name);

            if (img) {
                formData.append("img", img);
            }

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
            setError(error.response.data.img);
            console.log(error.response.data);
            console.log(img)
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImg(file);
    };

    return (
        <div>
            {!showForm ? (
                <div className="button_body" onClick={handleButtonClick}>
                    <div className="section_plus"></div>
                    <div className="button_text">Добавить меню</div> </div>
            ) : (
                <div className="modal-background">
                    <div className="modal">
                        <form className="form_modal" onSubmit={handleFormSubmit}>
                            {error && <div className="error_message" >{error}</div>}
                            <div className="form_title">
                                <div className="form_title_text">Создание раздела</div>
                                <div className="depart_name">
                                    <div className="depart_name_text">
                                        Подразделение:Отдел IT
                                    </div>
                                </div>
                            </div>
                            <div className="form_menu_label">
                                <label className="form_menu_label_name" htmlFor="name">Название:</label>
                                <input
                                    required
                                    className="form_menu_input"
                                    type="text"
                                    placeholder="Название"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form_menu_label form_menu_label_img-container">

                                <label className="form_menu_label_img" htmlFor="image"><div className="form_menu_input-image"></div></label>
                                <label className="form_menu_label_img-text" htmlFor="image" >Загрузить файл SVG</label>
                                <input className="form_menu_input-image_add" type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
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

export default AddButtonMenu;