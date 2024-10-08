import React, { useEffect, useState } from "react";
import axios from "axios";
import MainHeader from "../MainHeader/MainHeader";
import ProjectStagesTable from "../ProjectStagesTable/ProjectStagesTable"; // Импортируем компонент таблицы
import { apiserver } from "../config"; // apiserver предполагает URL вашего API

const MainProjects = () => {
    const [contracts, setContracts] = useState([]); // Состояние для хранения договоров
    const [selectedContractNumber, setSelectedContractNumber] = useState(null); // Состояние для выбранного contract_number
    const [loading, setLoading] = useState(true); // Состояние для отображения загрузки

    useEffect(() => {
        // Функция для получения данных о пользователе
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Предположим, что токен хранится в localStorage
                if (!token) {
                    console.error("Токен не найден в localStorage");
                    return;
                }

                // Отправляем запрос к API для получения данных о пользователе
                const response = await axios.get(`${apiserver}/auth/users/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Проверяем, что поле data существует и содержит объект пользователя
                if (response && response.data) {
                    const currentUser = response.data;

                    // Проверяем и выводим значение is_client
                    if (currentUser[0].is_client) {
                        // Если пользователь является клиентом, запрашиваем данные клиента
                        const clientsResponse = await axios.get(`${apiserver}/auth/clients/`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        // Находим клиента, соответствующего текущему пользователю
                        const client = clientsResponse.data.find(client => client.user_id === currentUser[0].id);
                        if (client) {
                            // Теперь запрашиваем список договоров для текущего клиента
                            const contractsResponse = await axios.get(`${apiserver}/projects/contracts/`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            // Фильтруем договоры по client_id
                            const clientContracts = contractsResponse.data.filter(contract => contract.client_id === client.id);
                            console.log("Договоры клиента:", clientContracts); // Выводим договоры клиента

                            // Сохраняем договоры в состояние
                            setContracts(clientContracts);
                        }
                    }
                }
            } catch (error) {
                console.error("Ошибка при получении данных о пользователе:", error);
            } finally {
                setLoading(false); // Завершаем загрузку
            }
        };

        fetchUserData(); // Вызываем функцию для получения данных при загрузке компонента
    }, []);

    return (
        <div className="main_news_container">
            <MainHeader />
            <div className="main_news-row">
                <h1>Страница с проектами</h1>
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <>
                        <select
                            onChange={e => setSelectedContractNumber(e.target.value)} // Передаем contract_number
                            defaultValue=""
                        >
                            <option value="" disabled>Выберите договор</option>
                            {contracts.length > 0 ? (
                                contracts.map(contract => (
                                    <option key={contract.contract_number} value={contract.contract_number}>
                                        Договор ID: {contract.contract_number}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Нет доступных договоров</option>
                            )}
                        </select>

                        {/* Отображаем таблицу с этапами для выбранного контракта */}
                        {selectedContractNumber && <ProjectStagesTable contractNumber={selectedContractNumber} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default MainProjects;
