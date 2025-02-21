import React, { useState, useEffect } from "react";
import axios from "axios";
import MainHeader from "../MainHeader/MainHeader";
import { apiserver } from "../config";
import ProjectStagesTable from "../ProjectStagesTable/ProjectStagesTable";
import GanttChart from "../GanttComponent/Gantt";
import { setupAxiosInterceptors } from "../authService";
import Documents from "../Documents/Documents"; // Import the new component

const MainProjects = () => {
    const [contracts, setContracts] = useState([]);
    const [selectedContractNumber, setSelectedContractNumber] = useState(null);
    const [isContractOpen, setIsContractOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stages, setStages] = useState([]);
    const [stagesLoading, setStagesLoading] = useState(false);
    const [hasDocuments, setHasDocuments] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Новое состояние для проверки администратора

    const fetchUserData = async () => {
        try {
            let token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен не найден в localStorage");
                return;
            }

            // Получаем информацию о текущем пользователе
            const userResponse = await axios.get(`${apiserver}/auth/users/`);
            const currentUser = userResponse.data[0];

            setIsAdmin(currentUser.is_staff); // Проверяем, является ли пользователь админом

            if (currentUser.is_staff) {
                //  Если админ, получаем все контракты
                const contractsResponse = await axios.get(`${apiserver}/projects/contracts/`);
                setContracts(contractsResponse.data);
                
                // Выбираем первый контракт по умолчанию (если есть)
                if (contractsResponse.data.length > 0) {
                    setSelectedContractNumber(contractsResponse.data[0].contract_number);
                }
            } else if (currentUser.is_client) {
                //  Если обычный клиент, получаем только его контракты
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

    const fetchProjectStages = async (contractNumber) => {
        setStagesLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен не найден в localStorage");
                return;
            }

            const response = await axios.get(`${apiserver}/projects/list/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const projectStages = response.data.filter(
                stage => stage.contract_number === contractNumber
            );

            setStages(projectStages);
        } catch (error) {
            console.error("Ошибка при получении этапов проекта:", error);
        } finally {
            setStagesLoading(false);
        }
    };

    const fetchDocuments = async (contractNumber) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен не найден в localStorage");
                return;
            }

            const response = await axios.get(`${apiserver}/projects/documents/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const documents = response.data.filter(
                doc => doc.contract_number === contractNumber
            );

            setHasDocuments(documents.length > 0);
        } catch (error) {
            console.error("Ошибка при получении документов:", error);
        }
    };

    useEffect(() => {
        setupAxiosInterceptors();
        fetchUserData();
    }, []);

    useEffect(() => {
        if (selectedContractNumber) {
            fetchProjectStages(selectedContractNumber);
            fetchDocuments(selectedContractNumber);
        }
    }, [selectedContractNumber]);

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
                                    {stagesLoading ? (
                                        <p>Загрузка этапов...</p>
                                    ) : stages.length > 0 ? (
                                        <>
                                            <GanttChart contractNumber={selectedContractNumber} />
                                            <ProjectStagesTable contractNumber={selectedContractNumber} />
                                        </>
                                    ) : hasDocuments ? (
                                        <div className="no-stages-found">В данном проекте нет этапов выполнения</div>
                                    ) : (
                                        <div className="no-stages-found">Ничего не найдено в Договоре №{selectedContractNumber}</div>
                                    )}

                                    {(stages.length > 0 || hasDocuments) && (
                                        <Documents contractNumber={selectedContractNumber} />
                                    )}
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
