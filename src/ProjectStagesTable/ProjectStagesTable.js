import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";
import AdjustmentsList from "../AdjustmentsList/AdjustmentsList"; // Импортируем компонент списка согласований

const ProjectStagesTable = ({ contractNumber }) => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdjustments, setShowAdjustments] = useState(false); // Состояние для управления отображением согласований
    const [activeStageId, setActiveStageId] = useState(null); // Для отслеживания активного этапа

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
        if (isCompleted) {
            return {
                text: "Выполнен",
                color: "#0A9B19",
                paddingTop: "16.5px",
                paddingBottom: "16.5px",
            }; // Пример padding для выполненного статуса
        } else {
            return {
                text: "Ожидает выполнения",
                color: "#959595",
                paddingTop: "5px",
                paddingBottom: "5px",
            }; // padding для ожидающего статуса
        }
    };

    const toggleAdjustments = (stageId) => {
        if (activeStageId === stageId) {
            // Если этот этап уже активен, закрываем список
            setShowAdjustments(!showAdjustments);
            setActiveStageId(null);
        } else {
            // Иначе, открываем список для нового этапа
            setActiveStageId(stageId);
            setShowAdjustments(true);
        }
    };

    return (
        <div>
            <div className="project-stages-table_title">Этапы вополнения проекта</div>
            {loading ? (
                <p>Загрузка этапов...</p>
            ) : (
                
                <table className="table-project">
                    <thead className="table-header_project">
                        <tr>
                            <th className="table-header_item-none-project" style={{ width: "4%" }}></th>
                            <th className="table-header_item-index">Номер</th>
                            <th className="table-header_item-name">Наименование</th>
                            <th className="table-header_item-date-start">Дата начала</th>
                            <th className="table-header_item-date-end">Срок выполнения</th>
                            <th>Статус</th>
                            <th className="table-header_item-date-fact">Дата фактического выполнения</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.length > 0 ? (
                            stages.map((stage, index) => {
                                const { text, color } = getStatus(stage.is_completed);
                                const isDesignApproval = stage.name === "Согласование чертежей с заказчиком";
                                const isActive = activeStageId === stage.id && showAdjustments; // Проверяем активный статус

                                return (
                                    <React.Fragment key={stage.id}>
                                        <tr
                                            className={`table-header_item-tr ${isActive ? 'soglas-active' : ''}`} // Добавляем класс soglas-active только если список открыт
                                            onClick={isDesignApproval ? () => toggleAdjustments(stage.id) : null}
                                            style={{ cursor: isDesignApproval ? "pointer" : "default" }}
                                        >
                                            <td>
                                                {/* SVG-иконка только для этапа "Согласование чертежей с заказчиком" */}
                                                {isDesignApproval && (
                                                    <img
                                                        className={`toggle-icon ${showAdjustments && isActive ? "rotate-180" : ""}`} // Применяем класс для поворота
                                                        src="/chevron-right1.svg" // Указываем путь к файлу
                                                        alt="Folder Icon"
                                                        width="30" // Ширина иконки
                                                        height="30" // Высота иконки
                                                        style={{ cursor: "pointer" }}
                                                        onClick={e => { e.stopPropagation(); toggleAdjustments(stage.id); }} // Переключение списка
                                                    />
                                                )}
                                            </td>
                                            <td className="table-header_item-index">{index + 1}</td>
                                            <td className="table-header_item-name">
                                                {stage.name}
                                            </td>
                                            <td className="table-header_item-date">
  {stage.start_date ? stage.start_date.split(" ")[0] : ""}
</td>
<td className="table-header_item-date">
  {stage.deadline ? stage.deadline.split(" ")[0] : ""}
</td>
                                            <td
                                                className="table-header_item-status"
                                                style={{
                                                    color,
                                                    paddingTop: getStatus(stage.is_completed).paddingTop,
                                                    paddingBottom: getStatus(stage.is_completed).paddingBottom,
                                                }}
                                            >
                                                {text}
                                            </td>
                                            <td className="table-header_item-date">
  {stage.actual_date ? stage.actual_date.split(" ")[0] : ""}
</td>
                                        </tr>
                                        {/* Если этап - "Согласование чертежей с заказчиком", отображаем список согласований */}
                                        {isDesignApproval && isActive && (
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
