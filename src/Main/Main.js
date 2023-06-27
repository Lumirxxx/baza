import React, { useState, useEffect } from "react";
import axios from "axios";
import MainFunc from "../MainButton/MainFunc";
import MainError from "../MainButton/MainError";
import MainChange from "../MainButton/MainChange";

const Main = () => {
    const [menu, setMenu] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({
        name: "",
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
        const newMenu = {
            name: newMenuItem.name,
        };
        axios
            .post("http://192.168.10.109:8000/api/v1/menu/", newMenu, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setMenu([...menu, newMenu]);
                setNewMenuItem({ name: "" });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (

        <div className="main_page_container">
            <div className="main_page">

                <div className="main_page_logo">
                    <img src="/Headerlogomain.svg"></img>
                </div>

                <MainFunc />
                <MainError />
                <MainChange />
            </div>
            {/* {menu.map((menuItem) => (
                <button key={menuItem.id}>
                    <h2>{menuItem.name}</h2>
                </button>
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
                <button type="submit">Add</button>
            </form> */}
        </div>
    );
};

export default Main;
