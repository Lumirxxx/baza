import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import AddNews from '../AddNews/AddNews';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiserver } from "../config";
import { refreshAuthToken } from "../authService";
const AdminPage = () => {
    const [selectedSection, setSelectedSection] = useState('news');
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    useEffect(() => {
        const fetchNews = async () => {
            const token = localStorage.getItem("token");
            try {
                const newsResponse = await axios.get(`${apiserver}/news/list-admin/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNews(newsResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    const refreshTokenSuccess = await refreshAuthToken(navigate);
                    if (refreshTokenSuccess) {
                        fetchNews();
                    } else {
                        console.error("Не удалось обновить токен.");
                    }
                } else {
                    console.error("Ошибка при получении данных: ", error);
                }
            }
        };

        fetchNews();
    }, [navigate]);
    const renderSection = () => {
        switch (selectedSection) {
            case 'users':
                return <div>Пользователи</div>;
            case 'news':
                return <AddNews />;
            case 'ipmwiki':
                return <div>IPM Wiki</div>;
            default:
                return <div>Новости</div>;
        }
    };

    return (
        <div className="admin-page">
            <Sidebar selectedSection={selectedSection} onSelectSection={setSelectedSection} />
            <div className="content">
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminPage;
