import React, { useEffect, useState } from "react";
import axios from "axios";
import MainHeader from "../MainHeader/MainHeader";
import { useNavigate } from "react-router-dom";
import { apiserver } from "../config";
import { refreshAuthToken } from "../authService";
const KnowledgeBase = () => {
    const navigate = useNavigate();
    const handleButtonWikiClick = (itemId) => {
        navigate('/main', { state: { wikiId: itemId } });
        console.log(itemId)
    };
    // Создаем состояние для хранения объектов
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get('http://192.168.10.109:8080/api/v1/wiki/list/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(response.data); // Предполагаем, что API возвращает массив объектов
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Попытка обновить токен
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        // Если токен успешно обновлён, повторяем запрос
                        fetchData();
                    } else {
                        console.error("Не удалось обновить токен.");

                        // Ошибка обновления токена или другие действия
                    }
                } else {
                    console.error("Ошибка при получении данных: ", error);
                }
            }
        };

        fetchData();
    }, [navigate]); // Пустой массив зависимостей, чтобы запрос выполнялся один раз при монтировании

    // const refreshAuthToken = async () => {
    //     const refreshToken = localStorage.getItem("refreshToken");
    //     try {
    //         const response = await axios.post('http://192.168.10.109:8080/api/v1/token/refresh/', {
    //             refresh: refreshToken // Используйте тот ключ, который ожидается вашим API. Возможно, здесь должно быть refreshToken
    //         }, {});
    //         // Сохраняем новый токен в localStorage
    //         localStorage.setItem("token", response.data.access);
    //         // localStorage.setItem("refreshToken", response.data.refresh);
    //         console.log(response.data.access)
    //         console.log(refreshToken)
    //         return true; // Возвращаем true, указывая на успешное обновление токена
    //     } catch (error) {
    //         console.error("Ошибка при обновлении токена:", error);
    //         localStorage.removeItem("token");
    //         localStorage.removeItem("refreshToken");
    //         console.log(refreshToken)
    //         // Здесь может быть редирект на страницу логина или показ сообщения пользователю
    //         return false; // В случае ошибки при обновлении токена возвращаем false
    //     }
    // };

    return (
        <div className="KnowledgeBase_page" style={{backgroundImage: "url(/bgknow.svg)"}}>
            <MainHeader />
            <div className="KnowledgeBase">

                <div>
                    <div className="KnowledgeBase_title">Функционал находится в разработке</div>
                    <div className="KnowledgeBase_line">База знаний ПО IPM_System. Полезные статьи для работы с ПО.</div>
                </div>
                {/* Отображаем полученные объекты */}
                {/* <div>
                    {items.map((item, index) => (
                        <div onClick={() => handleButtonWikiClick(item.id)} key={index}>{item.name}</div>

                    ))}
                </div> */}
            </div>
        </div>
    );
}

export default KnowledgeBase;
