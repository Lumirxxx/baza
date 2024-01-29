import React, { useState, useEffect } from "react";
import axios from "axios";

const AddButtonSubsections = (props) => {

    const { sectionId } = props
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [menuId, setMenuId] = useState(sectionId);
    const [menus, setMenus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSection, setNewSection] = useState({
        name: ""
    });
    const [selectedImage, setSelectedImage] = useState("");

    const fetchMenus = () => {
        const token = localStorage.getItem("token");
        axios
            .get("http://192.168.10.109:8000/api/v1/sections/", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setMenus(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // useEffect(() => {
    //     fetchMenus();
    // }, []);

    const handleButtonClick = () => {
        setShowModal(true);
        fetchMenus();
        console.log(menuId)
    };

    const handleMenuChange = (event) => {
        setMenuId(event.target.value);
    };

    const handleInputChange = (event) => {
        setNewSection({
            ...newSection,
            [event.target.name]: event.target.value
        });
    };

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("section_id", sectionId);
        formData.append("name", newSection.name);
        formData.append("img", selectedImage);

        const token = localStorage.getItem("token");

        axios
            .post(
                "http://192.168.10.109:8000/api/v1/subsections/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            .then((response) => {
                console.log("Новая секция добавлена:", response.data);
                setSections((prevSections) => [...prevSections, response.data]);
            })
            .catch((error) => {
                console.log("Ошибка при добавлении новой секции:", error);
            });

        setMenuId("");
        setNewSection({
            name: ""
        });
        setSelectedImage("");
        setShowForm(false);
    };

    return (
        <div>
            {!showModal ? (
                <div className="section_button section_button_add" onClick={handleButtonClick}>
                    <div className="section_name">Добавить раздел</div>
                </div>
            ) : (
                <div className="modal-background">
                    <div className="modal">
                        <form
                            onSubmit={handleSubmit}
                            action="http://192.168.10.109:8000/api/v1/subsections/"
                            encType="multipart/form-data"
                            className="form_modal"
                        >
                            <div className="form_title">
                                <div className="form_title_text">Создание раздела</div>
                                <div className="depart_name">
                                    <div className="depart_name_text">
                                        Подразделение:Отдел IT
                                    </div>
                                </div>
                            </div>
                            <div className="form_menu_label">
                                <label className="form_menu_label_name" htmlFor="menu">Меню:</label>
                                <select className="form_menu_input" required id="menu" name="menu" value={sectionId} onChange={handleMenuChange}>
                                    <option value="" disabled selected>
                                        Выберите меню
                                    </option>
                                    {menus.map((menu) => (
                                        <option key={menu.id} value={menu.id} selected>
                                            {menu.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form_menu_label">
                                <label className="form_menu_label_name" htmlFor="name">Название:</label>
                                <input className="form_menu_input" placeholder="Наименование раздела" required type="text" id="name" name="name" value={newSection.name} onChange={handleInputChange} />
                            </div>
                            <div className="form_menu_label form_menu_label_img-container">

                                <label className="form_menu_label_img" htmlFor="image"><div className="form_menu_input-image"></div></label>
                                <label className="form_menu_label_img-text" htmlFor="image" >Загрузить файл SVG</label>
                                <input className="form_menu_input-image_add" type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
                            </div>
                            <div className="modal_form-button">
                                <div className="form_button_container">
                                    <button className="form_button" type="submit">
                                        Отправить</button>
                                </div>
                                <div className="form_button_container">
                                    <div className="form_button" onClick={() => setShowModal(false)}>Отмена</div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddButtonSubsections;
