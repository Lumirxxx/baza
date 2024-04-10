import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale'; // Импорт русской локали
import { apiserver } from "../config";
import { apiserverwiki } from "../config";
const GanttChart = () => {
    const ganttLocaleRef = useRef(null); // Создаем ref для блока ganttlocale
    // const [viewMode, setViewMode] = useState("Day");
    // const zoomIn = () => {
    //     if (viewMode === "Month") {
    //         setViewMode("Week");
    //     } else if (viewMode === "Week") {
    //         setViewMode("Day");
    //     }
    // };

    // const zoomOut = () => {
    //     if (viewMode === "Day") {
    //         setViewMode("Week");
    //     } else if (viewMode === "Week") {
    //         setViewMode("Month");
    //     }
    // };
    useEffect(() => {
        const changeColumnTitles = () => {
            const headers = ganttLocaleRef.current.querySelectorAll('div._WuQ0f');
            const titlesMapping = {
                'Name': 'Название',
                'From': 'Начало',
                'To': 'Окончание',
            };
            headers.forEach(header => {
                const headerText = header.textContent.trim();
                if (titlesMapping[headerText]) {
                    header.textContent = titlesMapping[headerText];
                }
            });
        };

        const removePrefixFromElements = () => {
            const elements = ganttLocaleRef.current.querySelectorAll('div._3lLk3');
            const regex = /^[А-Яа-яЁё]{2},/;

            elements.forEach(element => {
                const text = element.textContent.trim();
                if (regex.test(text)) {
                    element.textContent = text.replace(regex, '').trim();
                }
            });
        };

        // Добавляем наблюдателя за изменениями в DOM
        const observer = new MutationObserver(() => {
            changeColumnTitles();
            removePrefixFromElements(); // Убедитесь, что функция вызывается тут
        });

        // Настройка и запуск наблюдателя
        if (ganttLocaleRef.current) {
            observer.observe(ganttLocaleRef.current, { childList: true, subtree: true });
        }

        // Отключение наблюдателя при размонтировании компонента
        return () => observer.disconnect();

    }, []);
    // Форматируем столбцы с датами
    // const columns = [
    //     { name: 'name', label: 'Название', width: '40%' },
    //     { name: 'start', label: 'Начало', width: '30%', format: (startDate) => format(startDate, 'dd.MM.yy', { locale: ru }) },
    //     { name: 'end', label: 'Окончание', width: '30%', format: (endDate) => format(endDate, 'dd.MM.yy', { locale: ru }) }
    // ];

    const data = [
        {
            start: new Date(2024, 2, 1), // February 1, 2024
            end: new Date(2024, 2, 13),
            todayColor: 'red',
            project: 'Project 1',
            name: 'Предварительное проектирование КО',
            project: 'Project 1',
            id: 'Task 1',
            type: 'task',
            // progress: 
            isDisabled: true,
            todayMarker: true, styles: { backgroundColor: '#002072', progressSelectedColor: '#ffff' },
            // progress: 45,



        },
        {
            start: new Date(2024, 2, 14),
            end: new Date(2024, 2, 21),
            name: 'Согласование чертежей с заказчиком',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            styles: { backgroundColor: '#5585FF', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 2, 22),
            end: new Date(2024, 2, 27),
            name: 'Выдача чертежей на производство КО',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#B1C6FC', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 2, 27),
            end: new Date(2024, 3, 2),
            name: 'Предварительное проектирование АСУТП',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#66B9E8', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 3, 2),
            end: new Date(2024, 3, 6),
            name: 'Согласование АСУТП с заказчиком',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#5585FF', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 3, 8),
            end: new Date(2024, 3, 17),
            name: 'Сборка системы управления',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#146FA3', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 3, 18),
            end: new Date(2024, 3, 23),
            name: 'Резка + Гибка',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#09202E', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 3, 24),
            end: new Date(2024, 3, 27),
            name: 'Токарные работы',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#3E5968', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 3, 29),
            end: new Date(2024, 4, 3),
            name: 'Подготовка заявки в снабжение КО',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#9CA0A3', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 4, 3),
            end: new Date(2024, 4, 7),
            name: 'Подготовка заявки в снабжение АСУТП',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#065887', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 4, 7),
            end: new Date(2024, 4, 20),
            name: 'Программирование IT',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#0060F1', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 4, 21),
            end: new Date(2024, 4, 25),
            name: 'Сборочне работы',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#6087C0', progressSelectedColor: '#ffff' },
        },
        {
            start: new Date(2024, 4, 27),
            end: new Date(2024, 4, 31),
            name: 'Покраска',
            project: 'Project 1',
            id: 'Task 2',
            type: 'task',

            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
            todayMarker: true, styles: { backgroundColor: '#7EB2FF', progressSelectedColor: '#ffff' },
        },

    ];
    const currentDate = new Date();

    // Модифицируем задачи, добавляя кастомные стили для шкалы выполнения
    const modifiedTasks = data.map(task => {
        const isOverdue = new Date(task.end) < currentDate; // Проверяем, просрочена ли задача
        return {
            ...task,
            styles: {
                ...task.styles,
                progressColor: task.progress === 100 ? 'green' : (isOverdue ? 'red' : 'rgba(0, 0, 255, 0.5)'), // Если задача просрочена и не выполнена полностью, прогресс будет красным
                // backgroundColor: 'rgba(0, 0, 255, 0.1)', // Цвет фона задачи, можно настроить по своему усмотрению
            },
        };
    });




    return (
        <div ref={ganttLocaleRef} className='ganttlocale'>
            {/* <div>
                <button onClick={zoomOut}>-</button>
                <button onClick={zoomIn}>+</button>
            </div> */}
            <Gantt
                // viewMode={viewMode}
                fontSize='12px'
                fontFamily='Nunito'
                tasks={modifiedTasks}
                // columns={columns}
                locale={ru} // Установка локали для диаграммы
            // Дополнительные параметры конфигурации...
            // ganttStylingOptions={ganttStylingOptions}
            />

        </div>
    )
}

export default GanttChart