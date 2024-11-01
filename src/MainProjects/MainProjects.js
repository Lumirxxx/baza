import React, { useState, useEffect } from "react";
import axios from "axios";
import MainHeader from "../MainHeader/MainHeader";
import { apiserver } from "../config";
import ProjectStagesTable from "../ProjectStagesTable/ProjectStagesTable";
import GanttChart from "../GanttComponent/Gantt";
import { setupAxiosInterceptors } from "../authService";
import Documents from "../Documents/Documents"; // Импортируем новый компонент

const MainProjects = () => {
    const [contracts, setContracts] = useState([]);
    const [selectedContractNumber, setSelectedContractNumber] = useState(null);
    const [isContractOpen, setIsContractOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            let token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен не найден в localStorage");
                return;
            }

            const userResponse = await axios.get(`${apiserver}/auth/users/`);
            const currentUser = userResponse.data[0];

            if (currentUser.is_client) {
                const clientsResponse = await axios.get(`${apiserver}/auth/clients/`);
                const client = clientsResponse.data.find(c => c.user_id === currentUser.id);
                if (client) {
                    const contractsResponse = await axios.get(`${apiserver}/projects/contracts/`);
                    const clientContracts = contractsResponse.data.filter(
                        contract => contract.client_id === client.id
                    );

                    setContracts(clientContracts);
                    if (clientContracts.length > 0) {
                        setSelectedContractNumber(clientContracts[0].contract_number);
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
        setupAxiosInterceptors();
        fetchUserData();
    }, []);

    const handleOptionClick = (contractNumber) => {
        setSelectedContractNumber(contractNumber);
        setIsContractOpen(false);
    };

    return (
        <div className="main_news_container">
            <MainHeader />
            <div className="main_project_container">
                <div className="main_project_col">
           
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <>
                            <label>
                              
                                <div
                                    className={`custom-select custom-select-project ${isContractOpen ? "open" : ""}`}
                                    onClick={() => setIsContractOpen(!isContractOpen)}
                                >
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

                            {selectedContractNumber && (
                                <div>
                                    <GanttChart contractNumber={selectedContractNumber} />
                                    <ProjectStagesTable contractNumber={selectedContractNumber} />
                                    <Documents contractNumber={selectedContractNumber} /> {/* Подключаем компонент "Документы" */}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainProjects;
