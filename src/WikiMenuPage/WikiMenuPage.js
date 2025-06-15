// WikiMenuPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { apiserver } from "../config";
import { refreshAuthToken } from "../authService";

import WikiMenuList from "./WikiMenuList";
import WikiSectionsList from "./WikiSectionsList";
import WikiArticlesList from "./WikiArticlesList";
import AddEditForm from "./AddEditForm";
import AddArticleForm from "./AddArticleForm";

const WikiMenuPage = ({ wikiId }) => {
  const navigate = useNavigate();

  // ***** Разделы (колонка 1)
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);

  // ***** Дополнительно: имя выбранного Раздела
  const [selectedMenuName, setSelectedMenuName] = useState("");

  // ***** Подразделы (колонка 2)
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedSectionIcon, setSelectedSectionIcon] = useState("");
  // ***** Дополнительно: имя выбранного Подраздела
  const [selectedSectionName, setSelectedSectionName] = useState("");

  // ***** Статьи (колонка 3)
  const [articles, setArticles] = useState([]);

  // ***** Вкладка
  const [activeTab, setActiveTab] = useState("sections");

  // ***** Форма (AddEditForm) для «Раздел» / «Подраздел»
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // ***** Показывать / скрывать форму добавления статьи (AddArticleForm)
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editArticleData, setEditArticleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========== 1. Загрузка «Разделов» ==========
  const fetchWikiMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await axios.get(`${apiserver}/wiki/menu/?wiki_id=${wikiId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken(navigate);
        if (refreshed) fetchWikiMenu();
        else navigate("/");
      } else {
        console.error("Ошибка при загрузке меню:", error);
      }
    }
  };

  useEffect(() => {
    fetchWikiMenu();
  }, [wikiId, navigate]);

  const refreshMenus = () => {
    setLoading(true);
    fetchWikiMenu();
  };

  // ========== 2. Загрузка «Подразделов» ==========
  const loadSections = async (menuItemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await axios.get(`${apiserver}/wiki/sections/?menu_id=${menuItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSections(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken(navigate);
        if (refreshed) loadSections(menuItemId);
        else navigate("/");
      } else {
        console.error("Ошибка при загрузке секций:", error);
      }
    }
  };

  const refreshSections = () => {
    if (selectedMenuItemId) {
      loadSections(selectedMenuItemId);
    }
  };

  // ========== 3. Загрузка «Статей» ==========
  const loadArticles = async (sectionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await axios.get(`${apiserver}/wiki/articles/?section_id=${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken(navigate);
        if (refreshed) loadArticles(sectionId);
        else navigate("/");
      } else {
        console.error("Ошибка при загрузке статей:", error);
      }
    }
  };

  // ===================== Обработчики =====================
  // Выбор Раздела
  const handleSelectMenuItem = (menuItemId) => {
    setSelectedMenuItemId(menuItemId);

    // Находим объект меню, чтобы узнать название
    const foundMenu = menuItems.find((m) => m.id === menuItemId);
    setSelectedMenuName(foundMenu ? foundMenu.name : "");

    setSections([]);
    setSelectedSectionId(null);
    setSelectedSectionName("");
    setArticles([]);
    loadSections(menuItemId);
  };

  // Выбор Подраздела
  const handleSelectSection = (sectionId) => {
    setSelectedSectionId(sectionId);

    // Находим объект «подраздел», чтобы узнать название
    const foundSection = sections.find((s) => s.id === sectionId);
    setSelectedSectionName(foundSection ? foundSection.name : "");
    setSelectedSectionIcon(foundSection ? foundSection.img : "");
    setArticles([]);
    loadArticles(sectionId);
  };

  // Добавление / Редактирование «Раздел / Подраздел»
  const handleAddMenuClick = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleAddSectionClick = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleEditMenu = (menuItem) => {
    setEditData(menuItem);
    setShowForm(true);
  };
  const handleEditSection = (section) => {
    setEditData(section);
    setShowForm(true);
  };

  // Удаление «Раздел / Подраздел»
  const handleDeleteMenu = async (menuItem) => {
    if (!window.confirm(`Удалить раздел "${menuItem.name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiserver}/wiki/menu/${menuItem.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshMenus();
      if (selectedMenuItemId === menuItem.id) {
        setSelectedMenuItemId(null);
        setSelectedMenuName("");
        setSections([]);
        setArticles([]);
      }
    } catch (error) {
      console.error("Ошибка при удалении раздела:", error);
    }
  };
  const handleDeleteSection = async (section) => {
    if (!window.confirm(`Удалить подраздел "${section.name}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiserver}/wiki/sections/${section.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshSections();
      if (selectedSectionId === section.id) {
        setSelectedSectionId(null);
        setSelectedSectionName("");
        setArticles([]);
      }
    } catch (error) {
      console.error("Ошибка при удалении подраздела:", error);
    }
  };

  // Закрыть форму (AddEditForm)
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleEditArticle = (article) => {
    setEditArticleData(article);
    setShowArticleForm(true);
  };

  // колбэк для закрытия формы статьи
  const handleCloseArticleForm = () => {
    setShowArticleForm(false);
   setEditArticleData(null);
  };

  // ----- Управление формой добавления статьи -----

  const handleArticleFormOpen = (isOpen) => {
    setShowArticleForm(isOpen);
  };

  if (loading) {
    return <p>Загрузка меню для вики #{wikiId}...</p>;
  }

  // Если showArticleForm = true => показываем только AddArticleForm
  if (showArticleForm) {
    return (
      <div className="add-article-fullscreen">
        <AddArticleForm
          sectionId={selectedSectionId}
          menuName={selectedMenuName}
          sectionName={selectedSectionName}
         editData={editArticleData}
          onSuccess={(newArticle) => {
            loadArticles(selectedSectionId);
            setShowArticleForm(false);
           setEditArticleData(null);
          }}
          onClose={handleCloseArticleForm}
        />
      </div>
    );
  }

  // Иначе рендерим колонки
  const isEditingMenu = showForm && editData && activeTab === "sections";
  const isEditingSection = showForm && editData && activeTab === "subsections";

  return (
    <div className="wiki-menu-page-container" style={{ display: "flex", flexDirection: "column" }}>
      {/* Вкладки */}
      <div className="tabs-container" style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <button
          className={activeTab === "sections" ? "active-tab" : ""}
          onClick={() => setActiveTab("sections")}
        >
          Разделы
        </button>
        <button
          className={activeTab === "subsections" ? "active-tab" : ""}
          onClick={() => setActiveTab("subsections")}
        >
          Подразделы
        </button>
        <button
          className={activeTab === "articles" ? "active-tab" : ""}
          onClick={() => setActiveTab("articles")}
        >
          Статьи
        </button>
      </div>

      <div className="main-area-container" style={{ display: "flex", gap: "20px" }}>
        {/* Колонка 1: Разделы */}
        <WikiMenuList
          menuItems={menuItems}
          selectedMenuItemId={selectedMenuItemId}
          onSelectMenuItem={handleSelectMenuItem}
          activeTab={activeTab}
          onAddMenuClick={handleAddMenuClick}
          onEditMenu={handleEditMenu}
          onDeleteMenu={handleDeleteMenu}
        />

        {/* Колонка 2: Подразделы */}
        {!isEditingMenu && (
          <WikiSectionsList
            sections={sections}
            selectedMenuItemId={selectedMenuItemId}
            onSelectSection={handleSelectSection}
            activeTab={activeTab}
            onAddSectionClick={handleAddSectionClick}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
          />
        )}

        {/* Колонка 3: Статьи */}
        {(!isEditingSection && !isEditingMenu) && (
          <div className="wiki-articles-column" style={{ width: "300px", background: "#ddecf9" }}>
       <WikiArticlesList
  articles={articles}
  selectedSectionId={selectedSectionId}
  activeTab={activeTab}
  onRefreshArticles={() => loadArticles(selectedSectionId)}
  onArticleFormOpen={handleArticleFormOpen}
  onEditArticle={(article) => {
    // открыть AddArticleForm в режиме редактирования:
    setEditArticleData(article);
    setShowArticleForm(true);
  }}
  onDeleteArticle={async (article) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${apiserver}/wiki/articles/${article.id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadArticles(selectedSectionId);
  }}
/>
          </div>
        )}
          {/* Универсальная форма (AddEditForm) */}
      {showForm && (
        <AddEditForm
          activeTab={activeTab}
          wikiId={wikiId}
          selectedMenuItemId={selectedMenuItemId}
          editData={editData}
          onClose={handleCloseForm}
          onRefreshMenus={refreshMenus}
          onRefreshSections={refreshSections}
        />
      )}
      </div>

    
    </div>
  );
};

export default WikiMenuPage;
