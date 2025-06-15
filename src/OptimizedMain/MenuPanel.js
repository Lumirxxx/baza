// MenuPanel.js
import React from "react";

const MenuPanel = ({ menu, selectedMenuId, onSelectMenu, onDeleteMenu }) => (
  <aside className="menu_panel">
    <div className="menu_title" >Основные разделы</div>
    {menu.length ? (
      menu.map((item) => (
        <div
          key={item.id}
          className={`base_menu_item ${selectedMenuId === item.id ? "active" : ""}`}
          onClick={() => onSelectMenu(item)}
        >
            <div className="menu_img_container">
                {item.img && <img className="menu_img" src={item.img} alt="Menu Image" />}
            </div>
         <div className="base_menu_name">{item.name}</div> 
         <div className="base_menu_arrow">
            <img src="/base_row.svg" alt="" />
         </div>
        </div>
      ))
    ) : (
      <p>Меню не найдено</p>
    )}
    {/* {selectedMenuId && (
      <button onClick={() => onDeleteMenu(selectedMenuId)}>
        Удалить выбранное меню
      </button>
    )} */}
  </aside>
);

export default MenuPanel;
