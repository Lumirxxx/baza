import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

const ArticleEditForm = ({ article }) => {
    const [editedArticle, setEditedArticle] = useState(article);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        if (article) {
            setEditedArticle(article);
            if (article.content) {
                const contentState = convertFromRaw(JSON.parse(article.content));
                const newEditorState = EditorState.createWithContent(contentState);
                setEditorState(newEditorState);
            } else {
                setEditorState(EditorState.createEmpty());
            }
        }
    }, [article]);

    const handleInputChange = (e) => {
        setEditedArticle({ ...editedArticle, [e.target.name]: e.target.value });
    };

    const handleEditorStateChange = (state) => {
        setEditorState(state);
        setEditedArticle({ ...editedArticle, content: convertToRaw(state.getCurrentContent()) });
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

    const initialContentState = convertFromRaw({
        entityMap: {},
        blocks: [
            {
                text: article.text,
                type: "unstyled",
                key: "abcde"
            }
        ]
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        axios
            .patch(`http://192.168.10.109:8000/api/v1/articles/${editedArticle.id}/`, { "text": String(editedArticle.content?.blocks[0]?.text) }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(article.text);
                console.log(editorState._imm)
                // console.log(response.data);
                console.log(response.data.content);
                console.log(editedArticle.text)
                console.log(response.data.content)
                console.log("Статья успешно отредактирована:", response.data);
                setEditedArticle(response.data);
                // Обновление состояния редактора

                if (response.data.content) {
                    const contentState = convertFromRaw(JSON.parse(response.data.content));
                    setEditorState(EditorState.createWithContent(contentState));
                } else {
                    setEditorState(EditorState.createEmpty());
                }
            })
            .catch((error) => {
                console.error("Ошибка при редактировании статьи:", error);
            });

    };


    return (
        <div>
            <h2>Редактировать статью</h2>
            <form onSubmit={handleSubmit}>
                <br />
                <label>
                    <Editor

                        defaultEditorState={editedArticle}
                        editorState={EditorState.createWithContent(initialContentState)}
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
                </label>
                <br />
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default ArticleEditForm;