// AddArticleForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { apiserver } from "../config";
import { refreshAuthToken } from "../authService";
import { useNavigate } from "react-router-dom";

const AddArticleForm = ({
  sectionId,
  menuName,
  sectionName,
  editData,    // Если передан — режим редактирования
  onSuccess,
  onClose,
}) => {
  const navigate = useNavigate();

  // Локальные стейты — заполняются из editData, если редактируем
  const [articleName, setArticleName] = useState("");
  const [editorData, setEditorData] = useState("<p>Здесь текст статьи...</p>");

  // При монтировании/смене editData заполняем поля
  useEffect(() => {
    if (editData) {
      setArticleName(editData.name || "");
      setEditorData(editData.text || "<p>Здесь текст статьи...</p>");
    }
  }, [editData]);

  // Плагин для CKEditor по загрузке картинок
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
      new MyUploadAdapter(loader);
  }
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }
    async upload() {
      const file = await this.loader.file;
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return { default: "" };
      }
      const formData = new FormData();
      formData.append("img", file);
      const response = await axios.post(
        `${apiserver}/wiki/images/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { default: response.data.img };
    }
    abort() {}
  }

  const handleSubmit = async () => {
    if (!articleName.trim()) {
      alert("Укажите название статьи!");
      return;
    }
    if (!sectionId) {
      alert("Не выбран подраздел!");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const payload = {
      section_id: sectionId,
      name: articleName,
      text: editorData,
    };

    try {
      let response;
      if (editData) {
        // Редактируем
        response = await axios.put(
          `${apiserver}/wiki/articles/${editData.id}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Создаём новую
        response = await axios.post(
          `${apiserver}/wiki/articles/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSuccess && onSuccess(response.data);
      onClose && onClose();
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshAuthToken(navigate);
        if (refreshed) return handleSubmit();
        else navigate("/");
      } else {
        console.error("Ошибка при сохранении статьи:", error);
      }
    }
  };

  const isEditing = !!editData;
  const title = isEditing ? "Редактировать статью" : "Добавить статью";
  const submitLabel = isEditing ? "Сохранить" : "Создать";

  return (
    <div className="add-article-form">
      <h3>{title}</h3>

      <div className="form-group">
        <label>Раздел:</label>
        <input type="text" value={menuName} readOnly />
      </div>

      <div className="form-group">
        <label>Подраздел:</label>
        <input type="text" value={sectionName} readOnly />
      </div>

      <div className="form-group">
        <label>Название статьи:</label>
        <input
          type="text"
          value={articleName}
          onChange={(e) => setArticleName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Текст статьи:</label>
        <CKEditor
          editor={ClassicEditor}
          config={{ extraPlugins: [CustomUploadAdapterPlugin] }}
          data={editorData}
          onChange={(_, editor) => setEditorData(editor.getData())}
        />
      </div>

      <div className="form-buttons">
        <button onClick={handleSubmit}>{submitLabel}</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

export default AddArticleForm;
