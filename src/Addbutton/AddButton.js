import React, { useState, useEffect } from "react";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const AddButton = () => {
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [sectionId, setSectionId] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [contentHtml, setContentHtml] = useState("");

    const handleButtonClick = () => {
        fetchSections();
        setShowForm(true);
    };

    const handleSectionChange = (event) => {
        const sectionId = event.target.value;
        setSectionId(sectionId);
    };

    const handleEditorStateChange = (state) => {
        setEditorState(state);
        const contentState = state.getCurrentContent();
        const contentHtml = draftToHtml(convertToRaw(contentState));
        const cleanedContentHtml = contentHtml.replace(/"|\\n/g, "");
        setContentHtml(cleanedContentHtml);
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

    const handleSubmit = (event) => {
        event.preventDefault();

        if (sectionId !== null) {
            const token = localStorage.getItem("token");
            const contentState = editorState.getCurrentContent();
            const rawContentState = convertToRaw(contentState);

            const formData = new FormData();
            formData.append("section_id", sectionId);
            formData.append("text", contentHtml);


            selectedImages.forEach((image, index) => {
                formData.append(`image_${index}`, image);
            });

            axios
                .post("http://192.168.10.109:8000/api/v1/articles/", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    console.log("New article added:", response.data);
                })
                .catch((error) => {
                    console.log("Error adding new article:", error);
                });
        } else {
            console.log("sectionId is null");
        }

        setSectionId(null);
        setEditorState(EditorState.createEmpty());
        setSelectedImages([]);
        setShowForm(false);
    };


    useEffect(() => {
        const rawContentState = JSON.parse(localStorage.getItem("content"));
        if (rawContentState) {
            const contentState = convertFromRaw(rawContentState);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, []);
    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        localStorage.setItem("content", JSON.stringify(rawContentState));
    }, [editorState]);
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
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={handleEditorStateChange}
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
