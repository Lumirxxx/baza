import React, { useState, useEffect } from "react";
import axios from "axios";
import MainHeader from "../MainHeader/MainHeader";
import { apiserver } from "../config";
import ProjectStagesTable from "../ProjectStagesTable/ProjectStagesTable"; // Подключаем таблицу
import { setupAxiosInterceptors } from "../authService"; // Импортируем функцию перехватчиков

const MainProjects = () => {
    const [contracts, setContracts] = useState([]);
    const [selectedContractNumber, setSelectedContractNumber] = useState(null); // Для хранения выбранного контракта
    const [isContractOpen, setIsContractOpen] = useState(false); // Состояние открытия выпадающего списка
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            let token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен не найден в localStorage");
                return;
            }

            // Запрашиваем данные о пользователе
            const userResponse = await axios.get(`${apiserver}/auth/users/`);

            const currentUser = userResponse.data[0];

            if (currentUser.is_client) {
                // Запрашиваем список клиентов
                const clientsResponse = await axios.get(`${apiserver}/auth/clients/`);

                const client = clientsResponse.data.find(c => c.user_id === currentUser.id);
                if (client) {
                    // Запрашиваем список контрактов
                    const contractsResponse = await axios.get(`${apiserver}/projects/contracts/`);

                    const clientContracts = contractsResponse.data.filter(
                        contract => contract.client_id === client.id
                    );

                    // Сохраняем контракты и устанавливаем первый контракт по умолчанию
                    setContracts(clientContracts);
                    if (clientContracts.length > 0) {
                        setSelectedContractNumber(clientContracts[0].contract_number); // Устанавливаем первый контракт
                    }
                } else {
                    console.error("Клиент не найден для текущего пользователя.");
                }
            }
        } catch (error) {
            console.error("Ошибка при получении данных о пользователе:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Настраиваем перехватчики axios для автоматического обновления токена
        setupAxiosInterceptors();

        fetchUserData();
    }, []);

    // Обработчик для выбора контракта
    const handleOptionClick = (contractNumber) => {
        setSelectedContractNumber(contractNumber);
        setIsContractOpen(false); // Закрываем выпадающий список после выбора
    };

    return (
        <div className="main_news_container">
            <MainHeader />
            <div className="main_project_container">
                <div className="main_project_col">
                    <h1>Страница с проектами</h1>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <>
                            {/* Кастомный выпадающий список для выбора контракта */}
                            <label>
                                Контракты
                                <div
                                    className={`custom-select custom-select-project ${isContractOpen ? "open" : ""}`}
                                    onClick={() => setIsContractOpen(!isContractOpen)}
                                >
                                    {/* Добавляем класс с условием для изменения радиусов при открытии списка */}
                                    <div className={`selected-value custom-select-value ${isContractOpen ? "open-radius" : ""}`}>
                                        {selectedContractNumber
                                            ? contracts.find(c => c.contract_number === selectedContractNumber)?.contract_number
                                            : "Выберите контракт"}
                                    </div>
                                    {isContractOpen && (
                                        <div className="custom-select-options custom-select-options-project">
                                            {contracts.map(contract => (
                                                <div
                                                    key={contract.contract_number}
                                                    className="custom-option"
                                                    onClick={() => handleOptionClick(contract.contract_number)}
                                                >
                                                    {contract.contract_number}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </label>

                            {/* Отображаем таблицу этапов проектов для выбранного контракта */}
                            {selectedContractNumber && (
                                <ProjectStagesTable contractNumber={selectedContractNumber} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainProjects;
