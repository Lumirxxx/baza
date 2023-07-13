import React, { useState, useEffect } from "react";
import axios from "axios";

const AddButtonSections = () => {
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [menuId, setMenuId] = useState("");
    const [menus, setMenus] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);


    const [newSection, setNewSection] = useState({
        name: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://192.168.10.109:8000/api/v1/menu/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setMenus(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleButtonClick = () => {
        setShowForm(true);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("menu_id", menuId);
        formData.append("name", newSection.name);
        formData.append("img", selectedImage);

        axios
            .post(
                "http://192.168.10.109:8000/api/v1/sections/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                 console.log("Новая секция добавлена:", response.data);
                setSections([...sections, response.data]);
            })
            .catch((error) => {
                console.log("Error adding new section:", error);
            });

        setMenuId("");
        setNewSection({ name: "" });
        setSelectedImage(null);
        setShowForm(false);
    };



    return (
        <div>
            {!showForm ? (
                <button onClick={handleButtonClick}>Add Section</button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="menu">Menu:</label>
                        <select
                            id="menu"
                            name="menu"
                            value={menuId}
                            onChange={handleMenuChange}
                        >
                            <option value="" disabled>
                                Select a menu
                            </option>
                            {menus.map((menu) => (
                                <option key={menu.id} value={menu.id}>
                                    {menu.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newSection.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="image">Изображение:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={(event) => setSelectedImage(event.target.files[0])}
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default AddButtonSections;
