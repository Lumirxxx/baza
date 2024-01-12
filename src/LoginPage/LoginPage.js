import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    // const [isStaff, setIsStaff] = useState(false);//Стейт для отслеживания состояния админа
    // // Функция для обновления состояния isStaff
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     axios.get("http://192.168.10.109:8000/api/v1/profile/", {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //         .then((response) => {
    //             const userData = response.data;
    //             setIsStaff(userData.is_staff);

    //             // Сохранение данных о пользователе в localStorage
    //             localStorage.setItem("username", userData.username);
    //             localStorage.setItem("admin", userData.is_staff);
    //             localStorage.setItem("moderator", userData.is_moderate);
    //             console.log(userData.is_staff);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);

    // console.log("isStaff:", isStaff);
    // console.log("admin:", localStorage.getItem("admin"));
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
                navigate("/main");
                console.log("Вы успешно авторизовались!");
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Неправильный логин или пароль");
            });
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/main");
        }
    }, []);

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
