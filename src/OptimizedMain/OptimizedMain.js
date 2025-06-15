// OptimizedMainContainer.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { apiserver, apiserverwiki } from "../config";
import { refreshAuthToken } from "../authService";

import MainHeader from "../MainHeader/MainHeader";
import MenuPanel from "./MenuPanel";
import SectionsPanel from "./SectionsPanel";
import ArticlesPanel from "./ArticlesPanel";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs"; // импортируем компонент хлебных крошек

const OptimizedMainContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const wikiId = location.state?.wikiId;

  // Profile state
  const [profile, setProfile] = useState(null);

  // Menu state
  const [menu, setMenu] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuName, setMenuName] = useState("");

  // Sections state
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // Articles state
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Error state
  const [errorMessage, setErrorMessage] = useState("");

  // ---------------------------
  // Load user profile
  // ---------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const { data } = await axios.get(`${apiserver}/auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data[0]);
      } catch (error) {
        if (error.response?.status === 401) {
          const refreshed = await refreshAuthToken(navigate);
          if (refreshed) fetchProfile();
        } else {
          console.error("Profile error:", error);
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  // ---------------------------
  // Load menu for wiki
  // ---------------------------
  useEffect(() => {
    const fetchMenu = async () => {
      const token = localStorage.getItem("token");
      if (!token || !wikiId) {
        navigate("/");
        return;
      }
      try {
        const { data } = await axios.get(`${apiserverwiki}/menu/?wiki_id=${wikiId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenu(data);
      } catch (error) {
        if (error.response?.status === 401) {
          const refreshed = await refreshAuthToken(navigate);
          if (refreshed) fetchMenu();
        } else {
          console.error("Menu error:", error);
        }
      }
    };
    fetchMenu();
  }, [wikiId, navigate]);

  // ---------------------------
  // Load sections when a menu is selected
  // ---------------------------
  const loadSections = async (menuId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const { data } = await axios.get(`${apiserverwiki}/sections/?menu_id=${menuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSections(data);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken(navigate);
        if (refreshed) loadSections(menuId);
      } else {
        console.error("Sections error:", error);
      }
    }
  };

  // ---------------------------
  // Load articles when a section is selected
  // ---------------------------
  const loadArticles = async (sectionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const { data } = await axios.get(`${apiserverwiki}/articles/?section_id=${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(data);
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken(navigate);
        if (refreshed) loadArticles(sectionId);
      } else {
        console.error("Articles error:", error);
      }
    }
  };

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleMenuSelect = (menuItem) => {
    setSelectedMenuId(menuItem.id);
    setMenuName(menuItem.name);
    setSections([]);
    setArticles([]);
    setSelectedSectionId(null);
    setSelectedArticle(null);
    loadSections(menuItem.id);
  };

  const handleSectionSelect = (section) => {
    const id = section.id || section._id;
    setSelectedSectionId(id);
    setArticles([]);
    setSelectedArticle(null);
    loadArticles(id);
  };

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  // Пример удаления меню
  const handleDeleteMenu = async (menuId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiserverwiki}/menu/${menuId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu((prev) => prev.filter((item) => item.id !== menuId));
      if (selectedMenuId === menuId) {
        setSelectedMenuId(null);
        setMenuName("");
        setSections([]);
        setArticles([]);
      }
    } catch (error) {
      console.error("Delete menu error:", error);
    }
  };

  // ---------------------------
  // Формирование хлебных крошек
  // ---------------------------
  // Избранное имя секции получаем из списка секций или, если статья выбрана – из объекта статьи.
  // Формирование хлебных крошек
const selectedSectionName = (() => {
    const section = sections.find((sec) => (sec.id || sec._id) === selectedSectionId);
    return section ? section.name : "";
  })();
  const selectedArticleName = selectedArticle ? selectedArticle.name : "";
  

  // ---------------------------
  // Рендеринг с фильтрацией выбранных пунктов (если статья открыта, показываются только выбранные пункты)
  // ---------------------------
  const isArticleOpen = Boolean(selectedArticle);

  return (
    <div className="optimized-main-container">
      <MainHeader />
      {/* Хлебные крошки */}
      <div className="breadcrumbs_container">
        <Breadcrumbs
          menuName={menuName}
          sectionName={selectedSectionName}
          articleName={selectedArticleName}
        />
      </div>
      <div className="base_content_container">
        <MenuPanel 
          menu={isArticleOpen ? menu.filter(item => item.id === selectedMenuId) : menu} 
          selectedMenuId={selectedMenuId} 
          onSelectMenu={handleMenuSelect} 
          onDeleteMenu={handleDeleteMenu} 
        />
        <section className="sections_articles_panel">
          <div className="sections_panel">
            <SectionsPanel 
              sections={isArticleOpen ? sections.filter(section => (section.id || section._id) === selectedSectionId) : sections} 
              selectedSectionId={selectedSectionId} 
              onSelectSection={handleSectionSelect} 
            />
          </div>
          <div className="articles_panel">
            <ArticlesPanel 
              articles={isArticleOpen ? articles.filter(article => article.id === selectedArticle?.id) : articles} 
              selectedArticle={selectedArticle} 
              onSelectArticle={handleArticleSelect} 
            />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default OptimizedMainContainer;
