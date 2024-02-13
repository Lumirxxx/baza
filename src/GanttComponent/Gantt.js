import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";



const GanttChart = () => {
    const data = [
        {
            start: new Date(2024, 1, 1), // February 1, 2024
            end: new Date(2024, 1, 30),

            // February 4, 2024
            project: 'Project 1',
            name: 'Тестовая задача',
            project: 'Project 1',
            id: 'Task 1',
            type: 'task',
            // progress: 
            isDisabled: true,
            todayMarker: true
        },
        {
            start: new Date(2024, 1, 15),
            end: new Date(2024, 2, 15),
            name: 'Тестовая задача фактическое время выполнения',
            project: 'Project 1',
            id: 'Task 1',
            type: 'task',
            progress: 100,
            isDisabled: true,
            todayMarker: true,
            hideChildren: true,
        }

    ];




    return (
        <Gantt tasks={data} />
    )
}

export default GanttChart