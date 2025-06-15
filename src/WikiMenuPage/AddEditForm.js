// AddEditForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";
import { useNavigate } from "react-router-dom";
import { refreshAuthToken } from "../authService";

/*
  Пропсы:
    - activeTab: "sections" или "subsections"
    - wikiId: id базы знаний (для "Раздела" / menu)
    - selectedMenuItemId: id пункта меню (для "Подраздела" / sections)
    - editData: объект (редактирование) или null (добавление)
    - onClose: функция закрытия формы
    - onRefreshMenus: пересчитать "Разделы"
    - onRefreshSections: пересчитать "Подразделы"
*/
const AddEditForm = ({
  activeTab,
  wikiId,
  selectedMenuItemId,
  editData,
  onClose,
  onRefreshMenus,
  onRefreshSections
}) => {
  const navigate = useNavigate();

  // Проверяем, создаём или редактируем
  const isEditing = !!editData;
  // Проверяем, для какого типа: "Раздел" (menu) или "Подраздел" (sections)
  const isMenu = activeTab === "sections";
  const isSection = activeTab === "subsections";

  // Локальные поля формы
  const [itemName, setItemName] = useState("");
  const [itemIcon, setItemIcon] = useState(null); // для файла
  // можно хранить путь к иконке (editData.img), если нужно отобразить текущее изображение

  // При монтировании, если editData не null, заполняем поле name
  useEffect(() => {
    if (editData) {
      setItemName(editData.name || "");
    }
  }, [editData]);

  // Заголовок формы
  const formTitle = isEditing
    ? (isMenu ? "Редактирование раздела" : "Редактирование подраздела")
    : (isMenu ? "Добавить раздел" : "Добавить подраздел");

  // Проверка на пустое имя, чтобы кнопка «Сохранить» могла быть заблокирована
  const isNameEmpty = !itemName.trim();

  // Обработчик изменения файла (иконки)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setItemIcon(e.target.files[0]);
    }
  };

  // Сабмит формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем токен
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      // Формируем formData
      const formData = new FormData();
      formData.append("name", itemName);

      if (itemIcon) {
        formData.append("img", itemIcon);
      }

      // Создаём vs. редактируем
      const isCreate = !isEditing;

      // -------------------
      // 1) Добавляем РАЗДЕЛ (menu)
      if (isMenu && isCreate) {
        // POST /wiki/menu/
        formData.append("wiki_id", wikiId);
        await axios.post(`${apiserver}/wiki/menu/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        onRefreshMenus?.();
        onClose();
        return;
      }

      // 2) Добавляем ПОДРАЗДЕЛ (section)
      if (isSection && isCreate) {
        // POST /wiki/sections/
        if (!selectedMenuItemId) {
          alert("Не выбран Раздел (menu_id) для добавления подраздела!");
          return;
        }
        formData.append("menu_id", selectedMenuItemId);
        await axios.post(`${apiserver}/wiki/sections/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        onRefreshSections?.();
        onClose();
        return;
      }

      // -------------------
      // 3) Редактируем РАЗДЕЛ (menu)
      if (isMenu && isEditing) {
        // PUT /wiki/menu/{id}/
        const effectiveWikiId = editData.wiki_id || wikiId;
        formData.append("wiki_id", effectiveWikiId);

        await axios.put(`${apiserver}/wiki/menu/${editData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        onRefreshMenus?.();
        onClose();
        return;
      }

      // 4) Редактируем ПОДРАЗДЕЛ (section)
      if (isSection && isEditing) {
        // PUT /wiki/sections/{id}/
        const effectiveMenuId = editData.menu_id || selectedMenuItemId;
        formData.append("menu_id", effectiveMenuId);

        await axios.put(`${apiserver}/wiki/sections/${editData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        onRefreshSections?.();
        onClose();
        return;
      }

    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken(navigate);
        if (refreshed) handleSubmit(e);
        else navigate("/");
      } else {
        console.error("Ошибка при добавлении/редактировании:", error);
      }
    }
  };

  // Текст для кнопки Сохранить / Создать
  const submitButtonText = isEditing ? "Сохранить" : "Создать";

  return (
    <div className="edit-sidebar edit-sidebar_add-edit-form">
      <h3 className="edit-title">{formTitle}</h3>

      <div className="edit-form">
        <div className="form-group">
          <label className="add_news_label">Название:</label>
          <input
            type="text"
            className="add_news_textarea"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>

        <div className="file-input-wrapper form-group">
          <label className="custom-file-label">Иконка</label>
          <input type="file" accept=".svg" onChange={handleFileChange} />
          <button className="custom-file-button" type="button">
            <img src="/filedownload.svg" alt="Загрузить файл SVG" />
            Загрузить файл SVG
          </button>
        </div>

        <div className="form-buttons">
          <button
            onClick={handleSubmit}
            className={`save-button ${isNameEmpty ? "save-button-disabled" : ""}`}
            disabled={isNameEmpty}
          >
            {submitButtonText}
          </button>
          <button
            onClick={onClose}
            className="wiki_cancel-button close-btn close-btn_user-form"
          >
            <img src="./close-circle.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditForm;
