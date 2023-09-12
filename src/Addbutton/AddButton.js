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
    const [selectedImage, setSelectedImage] = useState(null);

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
        setSelectedImage(null);
        setShowForm(false);
    };

    const handleImageUpload = async (file) => {
        setSelectedImage(file);

        const formData = new FormData();
        const token = localStorage.getItem("token");
        formData.append("img", file);

        try {
            const response = await axios.post("http://192.168.10.109:8000/api/v1/images/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            const imageUrl = response.data.img;
            console.log("Image URL:", imageUrl);
        } catch (error) {
            console.log("Ошибка при загрузке изображения:", error);
        }
    };

    useEffect(() => {
        const rawContentState = JSON.parse(localStorage.getItem("content"));
        if (rawContentState) {
            const contentState = convertFromRaw(rawContentState);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, []);

    return (
        <div>
            <button onClick={handleButtonClick}>Add Article</button>

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <select value={sectionId} onChange={handleSectionChange}>
                        <option value="" disabled selected>Select a section</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>

                    <Editor
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                        toolbar={{
                            options: ["inline", "blockType", "list", "textAlign", "link", "embedded", "image"],
                            inline: { options: ["bold", "italic", "underline"] },
                            blockType: { options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"] },
                            list: { options: ["unordered", "ordered"] },
                            textAlign: { options: ["left", "center", "right"] },
                            link: { options: ["link"] },
                            embedded: { options: ["image"] },
                            image: {
                                uploadCallback: handleImageUpload,
                                uploadEnabled: true,
                                className: undefined,
                                component: undefined,
                                popupClassName: undefined,
                                urlEnabled: true,
                                uploadEnabled: true,
                                alignmentEnabled: true,

                                previewImage: true,
                                alt: { present: true, mandatory: true },
                                defaultSize: { width: 512, height: 512 },

                                inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                            },
                        }}
                    />

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default AddButton;