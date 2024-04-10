import React, { useEffect, useState } from "react";
import axios from "axios";
import MainHeader from "../MainHeader/MainHeader";
import { useNavigate } from "react-router-dom";
const KnowledgeBase = () => {
    const navigate = useNavigate();
    const handleButtonWikiClick = (itemId) => {
        navigate('/main', { state: { wikiId: itemId } });
        console.log(itemId)
    };
    // Создаем состояние для хранения объектов
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Функция для загрузки данных
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://192.168.10.109:8080/api/v1/wiki/main/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(response.data); // Предполагаем, что API возвращает массив объектов
            } catch (error) {
                console.error("Ошибка при получении данных: ", error);
            }
        };

        fetchData();
    }, []); // Пустой массив зависимостей, чтобы запрос выполнялся один раз при монтировании

    return (
        <div className="KnowledgeBase">
            <MainHeader />
            <h1>Тут отображается список доступны БЗ</h1>
            {/* Отображаем полученные объекты */}
            <div>
                {items.map((item, index) => (
                    <div onClick={() => handleButtonWikiClick(item.id)} key={index}>{item.name}</div>

                ))}
            </div>
        </div>
    );
}

export default KnowledgeBase;
