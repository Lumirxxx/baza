import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiserver } from "../config";
import { apiserverwiki } from "../config";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post(`${apiserver}/auth/token/`, {
                username,
                password,
            })
            .then((response) => {
                // Сохранение токена в локальном хранилище
                localStorage.setItem("token", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
                navigate("/MainNews");
                console.log("Вы успешно авторизовались!");
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Неверный логин или пароль");
            });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/MainNews");
        }
    }, [navigate]);

    const isFormValid = username && password;

    return (
        <div className="login_page">
            <div className="login_page_logo">
                <a href="#">
                    <img src="/logoww2.svg" alt="Logo" />
                </a>
            </div>
            <div className="login_form">
                <div className="login_form_title">Авторизация</div>
                <form onSubmit={handleSubmit}>
                    <div className="login_form_button-container">
                        <input
                            className="select_button"
                            placeholder="Номер проекта"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div className="login_form_button-container">
                        <input
                            className="select_button select_button_password_margin"
                            placeholder="Пароль"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="login_form_button-container-submit">
                        <button
                            className="form_button_submit form_button_submit-font_size"
                            type="submit"
                            style={{ backgroundColor: isFormValid ? "#022B94" : "#5F6982" }}
                            disabled={!isFormValid}
                        >
                            Войти
                        </button>
                    </div>
                    {errorMessage && <p className="error-message_login">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
