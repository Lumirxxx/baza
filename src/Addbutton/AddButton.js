import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import sanitizeHtml from "sanitize-html";

const AddButton = () => {
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [sectionId, setSectionId] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [editorValue, setEditorValue] = useState("");
    const [newArticle, setNewArticle] = useState({
        text: ""
    });

    const handleButtonClick = () => {
        fetchSections();
        setShowForm(true);
    };

    const handleSectionChange = (event) => {
        const sectionId = event.target.value;
        setSectionId(sectionId);
        setNewArticle({
            ...newArticle,
            section_id: sectionId
        });
    };

    const fetchSections = () => {
        const token = localStorage.getItem("token");
        axios
            .get("http://192.168.10.109:8000/api/v1/sections/", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setSections(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleInputChange = (event) => {
        setNewArticle({
            ...newArticle,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (sectionId !== null) {
            const token = localStorage.getItem("token");
            const formattedText = sanitizeHtml(editorValue, {
                allowedTags: ["p", "strong", "em", "ul", "li", "link"],
                allowedAttributes: {
                    a: ["href"]
                }
            });

            const formData = new FormData();
            formData.append("section_id", sectionId);
            formData.append("text", formattedText);

            selectedImages.forEach((image, index) => {
                formData.append(`image_${index}`, image);
            });

            axios
                .post("http://192.168.10.109:8000/api/v1/articles/", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((response) => {
                    console.log("New article added:", response.data);
                    setNewArticle(response.data);
                })
                .catch((error) => {
                    console.log("Error adding new article:", error);
                });
        } else {
            console.log("sectionId is null");
        }

        setSectionId(null);
        setEditorValue("");
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
                            required
                            id="section"
                            name="section"
                            value={sectionId}
                            onChange={handleSectionChange}
                        >
                            <option value="" disabled selected>
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
                        <ReactQuill
                            required
                            id="text"
                            name="text"
                            value={editorValue}
                            onChange={setEditorValue}
                            


                        />
                    </div>

                    <div>
                        <label htmlFor="images">Images:</label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            multiple
                            onChange={(event) =>
                                setSelectedImages([...event.target.files])
                            }
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default AddButton;

