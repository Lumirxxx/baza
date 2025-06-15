import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const KnowledgeBasePage = () => {
  const [wikis, setWikis] = useState([]);
  const [editingWiki, setEditingWiki] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', logo: null });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    loadWikis();
  }, []);

  const loadWikis = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiserver}/wiki/list/`);
      setWikis(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (wiki) => {
    setEditingWiki(wiki.id);
    setFormData({ name: wiki.name, logo: null });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleSubmit = async (id) => {
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      if (formData.logo) formPayload.append('logo', formData.logo);

      await axios.patch(`${apiserver}/wiki/list/${id}/`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      loadWikis();
      setEditingWiki(null);
    } catch (error) {
      alert('Ошибка обновления');
    }
  };

  const deleteWiki = async (id) => {
    if (!window.confirm('Удалить базу знаний?')) return;
    try {
      await axios.delete(`${apiserver}/wiki/list/${id}/`);
      loadWikis();
    } catch (error) {
      alert('Ошибка удаления');
    }
  };
  const handleAddClick = () => {
    setIsAdding(true);
    setEditingWiki(null);
    setFormData({ name: '', logo: null });
  };

  const handleCreate = async () => {
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      if (formData.logo) formPayload.append('logo', formData.logo);

      await axios.post(`${apiserver}/wiki/list/`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      loadWikis();
      setIsAdding(false);
    } catch (error) {
      alert('Ошибка создания');
    }
  };
  return (
    <div className="knowledge-base-page">
        
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="wiki-container">
          <div className="wiki-list">
            {wikis.map((wiki) => (
              <div key={wiki.id} className="wiki-item">
                {/* <img src={wiki.logo} alt={wiki.name} className="wiki-logo" /> */}
                <div className="wiki-details">
                    <div className='wiki_details_img'></div>
                  <div className="wiki-name" >{wiki.name}</div>
                </div>
                <div className="wiki-actions">
                  <button 
                    onClick={() => {
                      setEditingWiki(wiki.id);
                      setFormData({ name: wiki.name, logo: null });
                    }}
                    className="wiki-edit-btn "
                  >
                    <img  src="/edit.svg" alt="" />
                  </button>
                  <button 
                    onClick={() => deleteWiki(wiki.id)} 
                    className="wiki-delete-btn"
                  >
                    <img src="/delete.svg" alt="" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {(editingWiki || isAdding) && (
            <div className="edit-sidebar ">
              <h3 className="edit-title">{isAdding ? 'Добавить Базу знаний' : 'Редактирование'}</h3>
              <div className="edit-form">
                <div className='form-group'>
                <label className="add_news_label">
                  Название:
                  </label>
                  <input
                    type="text"
                    сlassName="add_news_textarea"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
          
                </div>
           
                <div className="file-input-wrapper form-group">
                    <label className="custom-file-label">Иконка</label>
                    <input type="file"      onChange={handleFileChange}  />
                    <button className="custom-file-button">
                        <img src="/filedownload.svg" alt="Загрузить файл SVG" />
                        Загрузить файл SVG
                    </button>
                </div>

                <div className="form-buttons">
                <button 
  onClick={isAdding ? handleCreate : () => handleSubmit(editingWiki)}
  className={`save-button ${!formData.name.trim() ? 'save-button-disabled' : ''}`}
  disabled={!formData.name.trim()}
>
  {isAdding ? 'Создать' : 'Сохранить'}
</button>
                  <button 
                    onClick={() => {
                      setEditingWiki(null);
                      setIsAdding(false);
                    }}
                    className="wiki_cancel-button close-btn close-btn_user-form"
                  >
                   <img src="./close-circle.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
       <div className="page-header">

<button 
  onClick={handleAddClick}
  className="add-news-toggle-button"
>Добавить базу знаний
    <img className='add_news-icon' src="/add-icon.svg" alt="" />
 
</button>
</div>
    </div>
  );
};

export default KnowledgeBasePage;