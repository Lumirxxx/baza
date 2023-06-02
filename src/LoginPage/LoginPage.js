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
        fetch("http://192.168.10.109:8000/users/")
            .then((response) => response.json())
            .then((data) => {
                // Проверка на наличие пользователя с таким логином и паролем
                const users = data.find(
                    (users) => users.username === username && users.password === password
                );

                if (users) {
                    navigate("/main");
                    console.log("Вы успешно авторизовались!");
                } else {
                    setErrorMessage("Неправильный логин или пароль");
                }
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Ошибка при получении данных пользователя");
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

                        <select className="select_button" value={selectedOption} onChange={handleSelectOption}>
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
