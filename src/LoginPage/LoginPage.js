import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const navigate = useNavigate();



    const handleSubmit = (event) => {
        event.preventDefault();

        // Получение данных пользователя из JSON
        fetch("http://192.168.10.109:8000/api/v1/api-token-auth/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Не удалось получить токен");
                }
            })
            .then((data) => {
                // Сохранение токена в локальном хранилище
                localStorage.setItem("token", data.token);
                console.log("Токен получен", data.token);

                // Отправка GET-запроса с токеном
                const token = localStorage.getItem("token");
                console.log("Токен получен", data.token);
                fetch("http://192.168.10.109:8000/api/v1/srv_releases", {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    
                })
                    .then((response) => {
                        console.log(response.headers);
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Request failed");
                        }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // Обработка полученных данных
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                navigate("/main");
                console.log("Вы успешно авторизовались!");
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Неправильный логин или пароль");
            });
    };
    const handleSelectOption = (event) => {
        setSelectedOption(event.target.value);
    }

    return (
        <div className="login_page">
            <div className="login_page_logo">
                <a href="#"><img src="/logo.svg" /></a>
            </div>
            <div className="login_form">
                <div className="login_form_title">Авторизация</div>
                <form onSubmit={handleSubmit}>
                    <div>

                        <input className="select_button"
                            placeholder="Логин"
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>
                    <div>

                        <input className="select_button select_button_password_margin"
                            placeholder="Пароль"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <div>

                        <select className="select_button select_button_custom" value={selectedOption} onChange={handleSelectOption}>
                            <option value=""> <div className="select_button_option">Отдел сотрудника</div> </option>
                            <option value="option1"><div className="select_button_option">IT - Отдел</div></option>
                            <option value="option2"><div className="select_button_option">Отдел АСУ ТП</div></option>

                        </select>
                    </div>

                    <button className="form_button_submit" type="submit">Войти</button>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
