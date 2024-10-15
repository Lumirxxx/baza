import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";

const AdjustmentsList = ({ contractNumber }) => {
    const [adjustments, setAdjustments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdjustments = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("Токен не найден в localStorage");
                    return;
                }

                // Запрашиваем согласования для выбранного контракта
                const response = await axios.get(`${apiserver}/projects/adjust/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Фильтруем согласования по contract_number
                const contractAdjustments = response.data.filter(
                    adjust => adjust.contract_number === contractNumber
                );
                setAdjustments(contractAdjustments);
            } catch (error) {
                console.error("Ошибка при получении согласований:", error);
            } finally {
                setLoading(false);
            }
        };

        if (contractNumber) {
            fetchAdjustments();
        }
    }, [contractNumber]);

    const getStatus = (isAgreed) => {
        return isAgreed
            ? { text: "Выполнен", color: "#0A9B19" }
            : { text: "Ожидает выполнения", color: "#959595" };
    };

    return (
        <div>
            {loading ? (
                <p>Загрузка согласований...</p>
            ) : adjustments.length > 0 ? (
                <table className="table-adjustments">
                    <thead className="table-header_adjustments">
                        <tr>
                            <th>Наименование</th>
                            <th>Дата</th>
                            {/* <th></th> */}
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adjustments.map(adjust => {
                            const { text, color } = getStatus(adjust.is_agreed);
                            return (
                                <tr key={adjust.id}>
                                    <td className="table-header_adjustments-name">{adjust.subject}</td>
                                    <td className="table-header_adjustments-date">
                                        {adjust.sent_date ? adjust.sent_date.split(' ')[0] : ''} {/* Проверка на null */}
                                    </td>
                                    {/* <td></td> */}
                                    <td className="table-header_adjustments-status" style={{ color }}>{text}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>Согласования не найдены</p>
            )}
        </div>
    );
};

export default AdjustmentsList;
