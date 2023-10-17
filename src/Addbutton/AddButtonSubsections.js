import React, { useState, useEffect } from "react";
import axios from "axios";

const AddButtonSubsections = () => {
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [menuId, setMenuId] = useState("");
    const [menus, setMenus] = useState([]);
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
        setShowForm(true);
        fetchMenus();
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
        formData.append("section_id", menuId);
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
            {!showForm ? (
                <div className="section_button section_button_add" onClick={handleButtonClick}>
                    <div className="section_name">Добавить раздел</div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    action="http://192.168.10.109:8000/api/v1/subsections/"
                    enctype="multipart/form-data"
                >
                    <div>
                        <label htmlFor="menu">Меню:</label>
                        <select required id="menu" name="menu" value={menuId} onChange={handleMenuChange} >
                            <option value="" disabled selected>
                                Выберите меню
                            </option>
                            {menus.map((menu) => (
                                <option key={menu.id} value={menu.id}>
                                    {menu.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="name">Название:</label>
                        <input required type="text" id="name" name="name" value={newSection.name} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label htmlFor="image">Изображение:</label>
                        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
                    </div>

                    <button type="submit">
                        Отправить</button>
                </form>
            )}
        </div>
    );
};

export default AddButtonSubsections;
