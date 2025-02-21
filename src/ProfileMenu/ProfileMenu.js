import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiserver } from "../config";

const ProfileMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("Пользователь"); // Имя по умолчанию
    const navigate = useNavigate();
    const menuRef = useRef(null); // Ссылка на контейнер меню

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Токен отсутствует");
                    return;
                }

                const response = await axios.get(`${apiserver}/auth/users/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.length > 0) {
                    setUsername(response.data[0].username); // Устанавливаем имя пользователя из API
                    localStorage.setItem("username", response.data[0].username); // Сохраняем в localStorage
                }
            } catch (error) {
                console.error("Ошибка при получении информации о пользователе:", error);
                const storedUsername = localStorage.getItem("username");
                if (storedUsername) {
                    setUsername(storedUsername); // Используем сохраненное имя, если есть
                }
            }
        };

        fetchUsername();
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Удаляем токен
        localStorage.removeItem("username"); // Очищаем имя пользователя
        navigate("/"); // Перенаправляем на страницу входа
    };

    // Закрытие меню при клике за его пределами
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="profile-menu-container" ref={menuRef}>
            <button className="profile-button" onClick={toggleMenu}>
                <div className="heder_menu-object_form-feedback profile-icon"></div>
            </button>

            {menuOpen && (
                <div className="profile-dropdown">
                    <img className="dropdown-toggle" src="/dropdown_toggle.svg" alt="" />
                    <div className="profile-info">
                        <div>
                            <img src="/user.svg" alt="Профиль" className="user-icon" />
                        </div>
                        <div className="profile-username">{username}</div>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>Выйти из профиля</button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
