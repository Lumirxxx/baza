import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

const ArticleEditForm = ({ article }) => {
    const [editedArticle, setEditedArticle] = useState(article);
    const [editorState, setEditorState] = useState(() => {
        if (article.content) {
            const contentState = convertFromRaw(JSON.parse(article.content));
            return EditorState.createWithContent(contentState);
        } else {
            return EditorState.createEmpty();
        }
    });

    useEffect(() => {
        setEditedArticle(article);
        if (article.content) {
            const contentState = convertFromRaw(JSON.parse(article.content));
            setEditorState(EditorState.createWithContent(contentState));
        } else {
            setEditorState(EditorState.createEmpty());
        }
    }, [article]);

    const handleInputChange = (e) => {
        setEditedArticle({ ...editedArticle, [e.target.name]: e.target.value });
    };

    const handleEditorStateChange = (state) => {
        setEditorState(state);
        setEditedArticle({ ...editedArticle, content: convertToRaw(state.getCurrentContent()) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        axios
            .patch(`http://192.168.10.109:8000/api/v1/articles/${editedArticle.id}/`, { "text": String(editedArticle.content.blocks[0].text) }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log()
                console.log(editedArticle)
                console.log(response.data.content)
                console.log("Статья успешно отредактирована:", response.data);
                setEditedArticle(response.data);
                // Обновление состояния редактора
                if (response.data.content) {

                    // const contentState = convertFromRaw(JSON.parse(response.data.content));
                    // setEditorState(EditorState.createWithContent(contentState));
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
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                    />
                </label>
                <br />
                <button type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default ArticleEditForm;
