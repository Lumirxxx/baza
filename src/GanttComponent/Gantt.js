import React, { useEffect, useRef, useState } from 'react';
import { Gantt } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { ru } from 'date-fns/locale';
import axios from 'axios';
import { apiserver } from "../config";

const GanttChart = ({ contractNumber }) => {
    const ganttLocaleRef = useRef(null);
    const [tasks, setTasks] = useState([]);
    const [viewMode, setViewMode] = useState('Day'); // Режим просмотра (Day, Week, Month)

    const parseDate = (dateString) => {
        // 1. Проверяем, что dateString вообще есть и что это строка
        if (typeof dateString !== 'string' || !dateString.trim()) {
            return null; // Сразу выходим, не логируем
        }

        // 2. Получаем часть "dd.mm.yyyy"
        const [datePart] = dateString.trim().split(' ');
        if (!datePart) {
            return null;
        }

        // 3. Разделяем по точке
        const parts = datePart.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const [day, month, year] = parts;
        const parsedDate = new Date(year, month - 1, day);

        // 4. Проверяем корректность
        if (isNaN(parsedDate.getTime())) {
            return null;
        }

        return parsedDate;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiserver}/projects/list/`);
                const projects = response.data;

                if (Array.isArray(projects)) {
                    const filteredProjects = projects.filter(
                        (project) => project.contract_number === contractNumber
                    );

                    const convertedTasks = filteredProjects.map((project) => {
                        const startDate = parseDate(project.start_date);
                        const actualDate = parseDate(project.actual_date);
                        const deadlineDate = parseDate(project.deadline);

                        // Если проект завершён, берём actualDate как конец, иначе deadline
                        const endDate = project.is_completed ? actualDate : deadlineDate;

                        // Если нет дат или они некорректны — пропускаем
                        if (!startDate || !endDate || startDate >= endDate) {
                            return null;
                        }

                        // Проверяем просрочку (только если обе даты есть и is_completed true)
                        const isOverdue = project.is_completed &&
                                          actualDate !== null &&
                                          deadlineDate !== null &&
                                          actualDate > deadlineDate;

                        return {
                            id: project.id || project.name,
                            name: project.name,
                            start: startDate,
                            end: endDate,
                            type: "task",
                            project: project.name,      // Можно не задавать, если нет иерархий
                            progress: 0,                // По умолчанию 0 (или другое число)
                            isDisabled: true,
                            isOverdue,
                            todayMarker: true,
                            styles: {
                                backgroundColor: "#002072",
                                progressSelectedColor: "#ffff",
                            },
                        };
                    }).filter(Boolean); // убираем null

                    setTasks(convertedTasks);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };
        fetchData();
    }, [contractNumber]);

    // Автоматическая локализация заголовков и замена "W" -> "Н"
    useEffect(() => {
        const headerObserver = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                // Заголовки
                const headers = ganttLocaleRef.current?.querySelectorAll('._WuQ0f');
                if (headers?.length >= 3) {
                    headers[0].textContent = 'Название';
                    headers[1].textContent = 'Начало';
                    headers[2].textContent = 'Окончание';
                }

                // Замена W -> Н
                const targetBlocks = ganttLocaleRef.current?.querySelectorAll('._9w8d5');
                targetBlocks?.forEach((block) => {
                    if (block.textContent.includes('W')) {
                        block.textContent = block.textContent.replace(/W/g, 'Н');
                    }
                });
            });
        });

        if (ganttLocaleRef.current) {
            headerObserver.observe(ganttLocaleRef.current, { childList: true, subtree: true });
        }

        return () => headerObserver.disconnect();
    }, []);

    // Подсвечивание просроченных задач
    useEffect(() => {
        const overdueObserver = new MutationObserver(() => {
            const overdueTasks = tasks.filter(task => task.isOverdue);
            overdueTasks.forEach((overdueTask) => {
                const taskElements = Array.from(
                    ganttLocaleRef.current?.querySelectorAll('g') ?? []
                );
                taskElements.forEach((gElement) => {
                    const textElement = gElement.querySelector('text');
                    if (textElement?.textContent === overdueTask.name) {
                        const rectElement = gElement.querySelector('rect._31ERP');
                        if (rectElement) {
                            rectElement.style.fill = '#FF0000'; // Красим задачу в красный
                        }
                    }
                });
            });
        });

        if (ganttLocaleRef.current) {
            overdueObserver.observe(ganttLocaleRef.current, { childList: true, subtree: true });
        }

        return () => overdueObserver.disconnect();
    }, [tasks]);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    return (
        <div ref={ganttLocaleRef} className="ganttlocale">
            <div className="button-style-container">
                <button
                  onClick={() => handleViewModeChange('Day')}
                  className={`button-style button-style-day ${viewMode === 'Day' ? 'active' : ''}`}
                >
                  День
                </button>
                <button
                  onClick={() => handleViewModeChange('Week')}
                  className={`button-style ${viewMode === 'Week' ? 'active' : ''}`}
                >
                  Неделя
                </button>
                <button
                  onClick={() => handleViewModeChange('Month')}
                  className={`button-style button-style-month ${viewMode === 'Month' ? 'active' : ''}`}
                >
                  Месяц
                </button>
            </div>

            {tasks.length > 0 ? (
                <Gantt
                    fontSize="12px"
                    fontFamily="Nunito"
                    tasks={tasks}
                    locale={ru}
                    viewMode={viewMode}
                />
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default GanttChart;
