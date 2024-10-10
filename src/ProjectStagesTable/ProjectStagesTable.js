import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";

const ProjectStagesTable = ({ contractNumber }) => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectStages = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Токен не найден в localStorage");
                    return;
                }

                // Запрашиваем список этапов для выбранного контракта
                const response = await axios.get(`${apiserver}/projects/list/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Фильтруем этапы по contract_number
                const projectStages = response.data.filter(
                    stage => stage.contract_number === contractNumber
                );
                setStages(projectStages);
            } catch (error) {
                console.error("Ошибка при получении этапов проектов:", error);
            } finally {
                setLoading(false);
            }
        };

        if (contractNumber) {
            fetchProjectStages();
        }
    }, [contractNumber]);

    return (
        <div>
            {loading ? (
                <p>Загрузка этапов...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Номер</th>
                            <th>Наименование</th>
                            <th>Дата начала</th>
                            <th>Срок выполнения</th>
                            <th>Статус</th>
                            <th>Дата фактического выполнения</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.length > 0 ? (
                            stages.map((stage, index) => (
                                <tr key={stage.id}>
                                    <td>{index + 1}</td>
                                    <td>{stage.name}</td>
                                    <td>{stage.start_date.split(' ')[0]}</td>
                                    <td>{stage.deadline.split(' ')[0]}</td>
                                    <td></td>
                                    <td>{stage.actual_date ? stage.actual_date.split(' ')[0] : ''}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">Этапы проекта не найдены</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProjectStagesTable;
