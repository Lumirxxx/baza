import React, { useState, useEffect } from "react";
import axios from "axios";

const Main = () => {
    const [menu, setMenu] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({
        name: "",
        img: "",
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
                console.log(response.data);
                setMenu(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewMenuItem({ ...newMenuItem, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        axios
            .post(
                "http://192.168.10.109:8000/api/v1/menu/",
                {
                    name: newMenuItem.name,
                    img: newMenuItem.img,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                setMenu([...menu, response.data]);
                setNewMenuItem({ name: "", img: "" });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            {menu.map((menuItem) => (
                <div key={menuItem.id}>
                    <h2>{menuItem.name}</h2>
                    <img src={menuItem.img} alt={menuItem.name} />
                </div>
            ))}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newMenuItem.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="img">Image URL</label>
                    <input
                        type="text"
                        id="img"
                        name="img"
                        value={newMenuItem.img}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default Main;
