import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "../Addbutton/AddButton";
import AddButtonSections from "../Addbutton/AddButtonSections";
import axios from "axios";
import AddButtonSubsections from "../Addbutton/AddButtonSubsections";
import AddButtonCustom from "../ArticleEditForm/ArticleEditCustom"
import ArticleEditor from "../Addbutton/ArticleEditor";

import Editor from "../Addbutton/Editor";

const AdminPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://192.168.10.109:8000/api/v1/sections/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                // Handle successful authentication check
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate("/");
                } else {
                    console.log(error);
                }
            }
        };

        checkAuth();
    }, []);

    return (
        <div>
            <h1>Адмика Е*ать</h1>
            {/* <AddButton /> */}
            <AddButtonSections />
            <AddButtonSubsections />
            <ArticleEditor />
            <Editor />
            {/* <AddButtonCustom /> */}
        </div>
    );
};

export default AdminPage;
