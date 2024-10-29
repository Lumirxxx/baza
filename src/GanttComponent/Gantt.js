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
        const [day, month, year] = datePart.split('.');
        const parsedDate = new Date(year, month - 1, day); 
        return isNaN(parsedDate) ? null : parsedDate;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiserver}/projects/list/`);
                const projects = response.data;

                if (projects && Array.isArray(projects)) {
                    const filteredProjects = projects.filter(
                        (project) => project.contract_number === contractNumber
                    );

                    const convertedTasks = filteredProjects.map((project) => {
                        const startDate = parseDate(project.start_date);
                        const endDate = project.is_completed ? parseDate(project.actual_date) : parseDate(project.deadline);

                        const isOverdue = project.is_completed && parseDate(project.actual_date) > parseDate(project.deadline);

                        return startDate && endDate
                            ? {
                                start: startDate,
                                end: endDate,
                                name: project.name,
                                id: project.id || project.name,
                                project: project.name,
                                type: 'task',
                                isDisabled: true,
                                todayMarker: true,
                                isOverdue,
                                styles: { 
                                    backgroundColor: '#002072', 
                                    progressSelectedColor: '#ffff',
                                },
                            }
                            : null;
                    }).filter(task => task !== null);

                    setTasks(convertedTasks);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };
        
        fetchData();
    }, [contractNumber]);

    useEffect(() => {
        const headerObserver = new MutationObserver((mutations) => { 
            mutations.forEach(() => {
                const headers = ganttLocaleRef.current.querySelectorAll('._WuQ0f');
                if (headers.length >= 3) {
                    headers[0].textContent = 'Название';
                    headers[1].textContent = 'Начало';
                    headers[2].textContent = 'Окончание';
                }
            });
        });

        if (ganttLocaleRef.current) {
            headerObserver.observe(ganttLocaleRef.current, { childList: true, subtree: true });
        }

        return () => headerObserver.disconnect();
    }, []);

    useEffect(() => {
        const overdueObserver = new MutationObserver(() => {
            const overdueTasks = tasks.filter(task => task.isOverdue);
            overdueTasks.forEach((overdueTask) => {
                const taskElements = Array.from(ganttLocaleRef.current.querySelectorAll('g'));
                taskElements.forEach((gElement) => {
                    const textElement = gElement.querySelector('text');
                    if (textElement && textElement.textContent === overdueTask.name) {
                        const rectElement = gElement.querySelector('rect._31ERP');
                        if (rectElement) {
                            rectElement.style.fill = '#FF0000';
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
        <div ref={ganttLocaleRef} className='ganttlocale'>
            <div className='button-style-container'>
                <button onClick={() => handleViewModeChange('Day')} className={`button-style button-style-day ${viewMode === 'Day' ? 'active' : ''}`}>День</button>
                <button onClick={() => handleViewModeChange('Week')} className={`button-style ${viewMode === 'Week' ? 'active' : ''}`}>Неделя</button>
                <button onClick={() => handleViewModeChange('Month')} className={`button-style button-style-month ${viewMode === 'Month' ? 'active' : ''}`}>Месяц</button>
            </div>

            {tasks.length > 0 ? (
                <Gantt
                    fontSize='12px'
                    fontFamily='Nunito'
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
