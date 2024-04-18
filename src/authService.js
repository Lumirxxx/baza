import axios from 'axios';
import { apiserver } from './config'; // Импортируем конфигурационный файл
import { useNavigate } from "react-router-dom";
// Добавляем параметр `navigate` в функцию
export const refreshAuthToken = async (navigate) => {
 
    const refreshToken = localStorage.getItem("refreshToken");
    try {
        const response = await axios.post(`${apiserver}/auth/token/refresh/`, {
            refresh: refreshToken // Используйте тот ключ, который ожидается вашим API
        });

        // Сохраняем новый токен в localStorage
        localStorage.setItem("token", response.data.access);
        // По желанию обновите refresh token, если API его предоставляет
        // localStorage.setItem("refreshToken", response.data.refresh);
        return true; // Возвращаем true, указывая на успешное обновление токена
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Проверяем статус ошибки и перенаправляем пользователя
        if (error.response && error.response.status === 401) {
            navigate("/");
        }

        return false; // В случае ошибки при обновлении токена возвращаем false
    }
};

