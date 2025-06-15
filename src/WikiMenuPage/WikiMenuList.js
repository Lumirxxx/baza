// WikiMenuList.js
import React from "react";

const WikiMenuList = ({
  menuItems,
  selectedMenuItemId,
  onSelectMenuItem,
  activeTab,
  onAddMenuClick,
  onEditMenu,
  onDeleteMenu
}) => {
  return (
    <div >
    
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectMenuItem(item.id)}
          className="wiki-item wiki-item-section"
        >
          <div className="wiki-details wiki-details-section">
            <div className="wiki_details_img" > <img src={item.img} alt="" /></div>
            <div className="wiki-name_section "> {item.name}</div>
          </div>
         
          {/* Если вкладка "sections", показываем ред/удал для "Разделов" */}
          {activeTab === "sections" && (
            <div className="wiki-actions wiki-actions-section"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="wiki-edit-btn" onClick={() => onEditMenu(item)}><img src="/edit.svg" alt="" /></button>
              <button className="wiki-edit-btn" onClick={() => onDeleteMenu(item)}><img src="/delete.svg" alt="" /></button>
            </div>
          )}
        </div>
      ))}

      {activeTab === "sections" && (
        <button onClick={onAddMenuClick} className="add-news-toggle-button">
          Добавить раздел
          <img className="add_news-icon" src="/add-icon.svg" alt="" />
        </button>
      )}
    </div>
  );
};

export default WikiMenuList;
