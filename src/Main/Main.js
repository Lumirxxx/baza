import React, { useState, useEffect } from "react";
import axios from "axios";
// import MainFunc from "../MainButton/MainFunc";
// import MainError from "../MainButton/MainError";
// import MainChange from "../MainButton/MainChange";

const Main = () => {
    const [menu, setMenu] = useState([]);
    const [sections, setSections] = useState([]);
    const [articles, setArticle] = useState([]);
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    const [articleButtonId, setArticleButtonId] = useState(null);
    // const [newMenuItem, setNewMenuItem] = useState({
    //     name: "",
    // });

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://192.168.10.109:8000/api/v1/menu/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // console.log(response.data);
                setMenu(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://192.168.10.109:8000/api/v1/sections/?menu_id=${selectedButtonId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                // console.log(response.data);
                setSections(response.data);
            })
            .catch((error) => {
                console.log(error);
                console.log('http://192.168.10.109:8000/api/v1/sections/?menu_id=' + selectedButtonId)
            });
    }, [selectedButtonId]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://192.168.10.109:8000/api/v1/articles/?section_id=${articleButtonId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response.data);
                setArticle(response.data);

            })
            .catch((error) => {
                console.log(error);
                console.log('http://192.168.10.109:8000/api/v1/articles/?section_id=' + articleButtonId)
            });
    }, [articleButtonId]);


    return (

        <div className="main_page_container">
            <div className="main_page">

                <div className="main_page_logo">
                    <img src="/Headerlogomain.svg"></img>
                </div>
                {menu.map((menuItem) => (
                    <button
                        className="button_body"
                        key={menuItem.id}
                        onClick={() => setSelectedButtonId(menuItem.id)}
                    >
                        <div className="button_text">{menuItem.name}</div>
                    </button>

                ))}

                {/* <MainFunc />
                <MainError />
                <MainChange /> */}
            </div>
            {/* Рендерим вывод меню 2го ряда */}
            <div className="sections_container">


                {sections.map((section) => (
                    <div className="section_button" key={section.id} onClick={() => setArticleButtonId(section.id)}>{section.name}</div>
                ))}



                {/* 
                {sections.map((section) => (
                    <div key={section.id}>

                        <div>
                            <h2>{section.name}</h2>
                            {section.items && (
                                <ul>
                                    {section.items.map((item) => (
                                        <li key={item.id} onClick={() => setArticleButtonId(item.id)}>{item.name}</li>


                                    ))}
                                </ul>
                            )}
                        </div>

                    </div>
                ))} */}
            </div>
            <div className="article_container">
                {articles.map((article) => (
                    <div key={article.id}>
                        <div>
                            <h2>{article.text}</h2>
                            {article.items && (
                                <ul>
                                    {article.items.map((item) => (
                                        <li key={item.id}>{item.text}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}

            </div>




            {/* <form onSubmit={handleSubmit}>
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
        </div >
    );
};

export default Main;
