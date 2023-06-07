import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post("http://192.168.10.109:8000/api/v1/token/", {
                username,
                password,
            })
            .then((response) => {
                // Сохранение токена в локальном хранилище
                localStorage.setItem("token", response.data.access);
                console.log("Токен получен", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                console.log("Токен получен рефреш", response.data.refresh);
                // Отправка GET-запроса с токеном
                const token = localStorage.getItem("token");
                // const refresh = localStorage.getItem("refresh");



                axios
                    .get("http://192.168.10.109:8000/api/v1/srv_releases", {
                        headers: {
                            Authorization: `Bearer ${token}`,

                        },
                    })
                    .then((response) => {
                        console.log("Релизы получены", response.data);
                        // Обработка полученных данных
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                navigate("/release");
                console.log("Вы успешно авторизовались!");
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Неправильный логин или пароль");
            });
    };

    const handleSelectOption = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className="login_page">
            <div className="login_page_logo">
                <a href="#">
                    <img src="/logo.svg" />
                </a>
            </div>
            <div className="login_form">
                <div className="login_form_title">Авторизация</div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            className="select_button"
                            placeholder="Логин"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            className="select_button select_button_password_margin"
                            placeholder="Пароль"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="select_button select_button_custom"
                            value={selectedOption}
                            onChange={handleSelectOption}
                        >
                            <option value="">
                                <div className="select_button_option">Отдел сотрудника</div>
                            </option>
                            <option value="option1">
                                <div className="select_button_option">IT - Отдел</div>
                            </option>
                            <option value="option2">
                                <div className="select_button_option">Отдел АСУ ТП</div>
                            </option>
                        </select>
                    </div>
                    <button className="form_button_submit" type="submit">
                        Войти
                    </button>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
