import React, { useState, useEffect } from "react";
import axios from "axios";

const AddButtonSections = () => {
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [menuId, setMenuId] = useState("");
    const [menus, setMenus] = useState([]);

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
        axios
            .post(
                "http://192.168.10.109:8000/api/v1/sections/",
                {
                    menu_id: menuId,
                    name: newSection.name
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then((response) => {
                console.log("New section added:", response.data);
                setSections([...sections, response.data]); //Обновление списка секций
            })
            .catch((error) => {
                console.log("Error adding new section:", error);
            });

        setMenuId("");
        setNewSection({
            name: ""
        });
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
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default AddButtonSections;
