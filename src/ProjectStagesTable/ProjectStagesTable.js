import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";
import AdjustmentsList from "../AdjustmentsList/AdjustmentsList"; // Импортируем компонент согласований

const ProjectStagesTable = ({ contractNumber }) => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdjustments, setShowAdjustments] = useState(false); // Управление состоянием выпадающего списка

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

    const getStatus = (isCompleted) => {
        return isCompleted
            ? { text: "Выполнен", color: "#0A9B19" }
            : { text: "Ожидает выполнения", color: "#959595" };
    };

    const toggleAdjustments = () => {
        setShowAdjustments(!showAdjustments); // Переключаем состояние выпадающего списка
    };

    return (
        <div>
            {loading ? (
                <p>Загрузка этапов...</p>
            ) : (
                <table className="table-project">
                    <thead className="table-header_project">
                        <tr>
                            <th style={{ width: "50px" }}></th>
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
                            stages.map((stage, index) => {
                                const { text, color } = getStatus(stage.is_completed);
                                return (
                                    <React.Fragment key={stage.id}>
                                        <tr className="table-header_item-tr">
                                            <td></td>
                                            <td className="table-header_item-index">{index + 1}</td>
                                            <td
                                                className="table-header_item-name"
                                                onClick={stage.name === "Согласование чертежей с заказчиком" ? toggleAdjustments : null}
                                                style={{ cursor: stage.name === "Согласование чертежей с заказчиком" ? "pointer" : "default" }}
                                            >
                                                {stage.name}
                                            </td>
                                            <td className="table-header_item-date">{stage.start_date.split(" ")[0]}</td>
                                            <td className="table-header_item-date">{stage.deadline.split(" ")[0]}</td>
                                            <td className="table-header_item-status" style={{ color }}>
                                                {text}
                                            </td>
                                            <td className="table-header_item-date">
                                                {stage.actual_date ? stage.actual_date.split(" ")[0] : ""}
                                            </td>
                                        </tr>
                                        {/* Если этап - "Согласование чертежей с заказчиком", отображаем список согласований */}
                                        {stage.name === "Согласование чертежей с заказчиком" && showAdjustments && (
                                            <tr>
                                                <td colSpan="7">
                                                    <AdjustmentsList contractNumber={contractNumber} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7">Этапы проекта не найдены</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProjectStagesTable;
