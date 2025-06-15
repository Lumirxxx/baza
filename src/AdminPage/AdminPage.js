// AdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Sidebar from '../Sidebar/Sidebar';
import AddNews from '../AddNews/AddNews';
import NewsSearch from '../NewsSearch/NewsSearch';
import NewsList from '../NewsList/NewsList';
import Users from '../Users/Users';
import AdminDocuments from '../AdminDocuments/AdminDocuments';
import KnowledgeBasePage from '../KnowledgeBasePage/KnowledgeBasePage';
import WikiMenuPage from '../WikiMenuPage/WikiMenuPage'; // Новый компонент для отображения меню выбранной вики

import { apiserver, apiserverwiki } from "../config";
import { setupAxiosInterceptors, refreshAuthToken } from "../authService";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('news');
  const [news, setNews] = useState([]);
  const [searchParams, setSearchParams] = useState({ date: '', title: '' });
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  
  // Список доступных баз знаний
  const [wikis, setWikis] = useState([]);

  // ID выбранной базы знаний
  const [selectedWikiId, setSelectedWikiId] = useState(null);

  const navigate = useNavigate();

  // Interceptor
  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  // Проверка админа
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Отсутствует токен. Перенаправление на главную.");
          navigate("/");
          return;
        }

        const userResponse = await axios.get(`${apiserver}/auth/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data.length > 0 && userResponse.data[0].is_staff) {
          setIsAdmin(true);
        } else {
          console.warn("Доступ запрещён: не администратор.");
          navigate("/");
        }
      } catch (error) {
        console.error("Ошибка при проверке прав админа:", error);
        navigate("/");
      }
    };
    checkAdminAccess();
  }, [navigate]);

  // Загрузка новостей
  useEffect(() => {
    if (isAdmin) {
      const fetchNews = async () => {
        try {
          const resp = await axios.get(`${apiserver}/news/list-admin/`);
          setNews(resp.data);
        } catch (error) {
          console.error("Ошибка при получении новостей:", error);
        }
      };
      fetchNews();
    }
  }, [isAdmin]);

  // Загрузка списка всех баз знаний
  useEffect(() => {
    if (isAdmin) {
      const fetchWikis = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            navigate("/");
            return;
          }
          const resp = await axios.get(`${apiserver}/wiki/list/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWikis(resp.data);
        } catch (error) {
          if (error.response?.status === 401) {
            const refreshed = await refreshAuthToken(navigate);
            if (refreshed) {
              fetchWikis();
            } else {
              console.error("Не удалось обновить токен для баз знаний.");
              navigate("/");
            }
          } else {
            console.error("Ошибка при загрузке баз знаний:", error);
          }
        }
      };
      fetchWikis();
    }
  }, [isAdmin, navigate]);

  if (isAdmin === null) {
    return <p>Проверка доступа...</p>;
  }

  // Обработчики для новостей
  const handleUpdateNews = (updatedNews) => {
    setNews(news.map(item => item.id === updatedNews.id ? updatedNews : item));
  };

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const handleToggleAddNewsForm = () => {
    setShowAddNewsForm(!showAddNewsForm);
  };

  const handleEditToggle = (isEditMode) => {
    setIsEditing(isEditMode);
  };

  // При выборе конкретной вики
  const handleSelectWiki = (wikiId) => {
    setSelectedWikiId(wikiId);
    // Это переключит нас на case 'ipmwiki', если не сделано, 
    // или можно оставаться в ipmwiki, но показывать WikiMenuPage
    setSelectedSection('ipmwiki');
  };

  // Основная логика рендера
  const renderSection = () => {
    switch (selectedSection) {

      case 'users':
        return <Users />;

      case 'news':
        return (
          <div>
            {!showAddNewsForm && !isEditing && (
              <>
                <div className='add_news_title'>Список новостей</div>
                <NewsSearch onSearch={handleSearch} />
              </>
            )}
            <button
              className="add-news-toggle-button"
              onClick={handleToggleAddNewsForm}
            >
              {showAddNewsForm ? (
                <>
                  <span style={{ color: '#022B94' }}>Вернуться к списку новостей</span>
                  <img
                    className="return-news-icon"
                    src="/arrow-left.svg"
                    alt="Return Icon"
                  />
                </>
              ) : (
                <>
                  Добавить новость
                  <img className='add_news-icon' src="/add-icon.svg" alt="Add Icon" />
                </>
              )}
            </button>
            {showAddNewsForm ? (
              <AddNews onSuccess={handleToggleAddNewsForm} />
            ) : (
              <NewsList
                news={news}
                searchParams={searchParams}
                onEditToggle={handleEditToggle}
              />
            )}
          </div>
        );

      case 'ipmwiki':
        // Если выбрана конкретная вики -> отображаем WikiMenuPage
        // иначе -> общий список (KnowledgeBasePage)
        if (selectedWikiId) {
          return (
            <WikiMenuPage wikiId={selectedWikiId} />
          );
        } else {
          return (
            <div>
              <KnowledgeBasePage wikis={wikis} />
            </div>
          );
        }

      case 'contracts':
        return <AdminDocuments />;

      default:
        return <div>Новости</div>;
    }
  };

  return (
    <div className="admin-page">
      <Sidebar
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        wikis={wikis}
        onSelectWiki={handleSelectWiki} // передаём колбэк выбора вики
      />
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;
