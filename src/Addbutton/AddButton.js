import React, { useState, useEffect } from "react";
import axios from "axios";

const AddButton = () => {
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [sectionId, setSectionId] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);


    const [newArticle, setNewArticle] = useState({

        text: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get("http://192.168.10.109:8000/api/v1/sections", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setSections(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleButtonClick = () => {
        setShowForm(true);
    };

    const handleSectionChange = (event) => {
        setSectionId(event.target.value);
    };

    const handleInputChange = (event) => {
        setNewArticle({
            ...newArticle,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("section_id", sectionId);
        formData.append("text", newArticle.text);

        // Добавить все выбранные изображения в FormData
        for (let i = 0; i < selectedImages.length; i++) {
            formData.append("images", selectedImages[i]);
        }

        const token = localStorage.getItem("token");
        axios
            .post(
                "http://192.168.10.109:8000/api/v1/articles/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                console.log("New article added:", response.data);
                setNewArticle(response.data);
            })
            .catch((error) => {
                console.log("Error adding new article:", error);
            });

        setSectionId(null);
        setNewArticle({
            text: ""
        });
        setSelectedImages([]);
        setShowForm(false);
    };



    return (
        <div>
            {!showForm ? (
                <button onClick={handleButtonClick}>Add</button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="section">Section:</label>
                        <select
                            id="section"
                            name="section"
                            value={sectionId}
                            onChange={handleSectionChange}
                        >
                            <option value="" disabled>
                                Select a section
                            </option>
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="text">Text:</label>
                        <textarea
                            id="text"
                            name="text"
                            value={newArticle.text}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="images">Изображения:</label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            multiple
                            onChange={(event) => setSelectedImages([...event.target.files])}
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default AddButton;
