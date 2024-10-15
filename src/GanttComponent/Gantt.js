import React, { useEffect, useRef, useState } from 'react';
import { Gantt } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { ru } from 'date-fns/locale';
import axios from 'axios';
import { apiserver } from "../config";

const GanttChart = ({ contractNumber }) => {
    const ganttLocaleRef = useRef(null);
    const [tasks, setTasks] = useState([]);
    const [viewMode, setViewMode] = useState('Day'); // Состояние для режима просмотра (день, неделя, месяц)

    const parseDate = (dateString) => {
        if (!dateString) {
            console.error('Date string is undefined or empty:', dateString);
            return null;
        }

        const [datePart] = dateString.split(' ');

        if (!/^\d{2}\.\d{2}\.\d{4}$/.test(datePart)) {
            console.error('Invalid date format:', dateString);
            return null;
        }

        const [day, month, year] = datePart.split('.');
        const parsedDate = new Date(year, month - 1, day); 
        if (isNaN(parsedDate)) {
            console.error('Invalid date value after parsing:', dateString);
            return null;
        }

        return parsedDate;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiserver}/projects/list/`);
                const projects = response.data;

                if (projects && Array.isArray(projects)) {
                    const filteredProjects = projects.filter(
                        (project) => project.contract_number === contractNumber
                    ); // Фильтруем проекты по номеру контракта

                    const convertedTasks = filteredProjects.map((project) => {
                        const startDate = parseDate(project.start_date);
                        const deadline = parseDate(project.deadline);

                        if (startDate && deadline && !isNaN(startDate) && !isNaN(deadline)) {
                            return {
                                start: startDate,
                                end: deadline,
                                name: project.name,
                                id: project.id || project.name, 
                                project: project.name,
                                type: 'task',
                                isDisabled: true,
                                todayMarker: true,
                                styles: { backgroundColor: '#002072', progressSelectedColor: '#ffff' },
                            };
                        } else {
                            console.warn("Project data is missing some fields or has invalid date:", project);
                            return null;
                        }
                    }).filter(task => task !== null);

                    setTasks(convertedTasks);
                } else {
                    console.error("Unexpected projects data:", projects);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        fetchData();

        const observer = new MutationObserver(() => {});

        if (ganttLocaleRef.current) {
            observer.observe(ganttLocaleRef.current, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [contractNumber]);

    // Проверка на наличие задач перед рендером
    if (tasks.length === 0) {
        console.error("No tasks to display or tasks contain invalid data.");
    }

    // Обработка смены режима отображения
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    return (
        <div ref={ganttLocaleRef} className='ganttlocale'>
            {/* Добавляем кнопки переключения режимов */}
            <div>
                <button onClick={() => handleViewModeChange('Day')} className={viewMode === 'Day' ? 'active' : ''}>
                    День
                </button>
                <button onClick={() => handleViewModeChange('Week')} className={viewMode === 'Week' ? 'active' : ''}>
                    Неделя
                </button>
                <button onClick={() => handleViewModeChange('Month')} className={viewMode === 'Month' ? 'active' : ''}>
                    Месяц
                </button>
            </div>

            {/* Отображаем диаграмму Ганта */}
            {tasks.length > 0 ? (
                <Gantt
                    fontSize='12px'
                    fontFamily='Nunito'
                    tasks={tasks}
                    locale={ru}
                    viewMode={viewMode} // Передаем выбранный режим отображения
                />
            ) : (
                <p>Loading tasks...</p>
            )}
        </div>
    );
};

export default GanttChart;
