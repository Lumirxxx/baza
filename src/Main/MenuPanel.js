// MenuPanel.js
import React from "react";
import ButtonMenu from "../MainButton/ButtonMenu";
import EditButtonMenu from "../Addbutton/EditButtonMenu";
import DeleteMenuButton from "../DeleteButton/DeleteMenuButton";
import AddButtonMenu from "../Addbutton/AddButtonMenu";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";
import { ButtonMenuContext } from "./Main";


const MenuPanel = ({
  menu,
  selectedMenuItemId,
  menu_id,
  handleSectionButtonClick,
  handleMenuUpdate,
  handleDeleteMenu,
  handleMenuAdd,
  profile
}) => {
  return (
    <div className="menu_container_left">
      {menu.map((menuItem) => (
        <div key={menuItem.id} title={menuItem.name} className="menu_item">
          {/* Оборачиваем ButtonMenu в Provider */}
          <ButtonMenuContext.Provider value={{ menuItem, handleSectionButtonClick, menu_id }}>
            <ButtonMenu />
          </ButtonMenuContext.Provider>
          <EditButtonMenu
            menuItem={menuItem}
            menuId={menuItem.id}
            onUpdate={handleMenuUpdate}
            deleteMenuButtonComponent={
              <DeleteMenuButton
                handleSectionButtonClick={handleSectionButtonClick}
                handleDeleteMenu={handleDeleteMenu}
                profile={profile}
                menu_id={menu_id}
                menuItem={menuItem}
                selectedMenuId={selectedMenuItemId}
                menuId={menuItem.id}
                onUpdate={handleMenuUpdate}
              />
            }
          />
        </div>
      ))}
      {profile && (
        <div>
          <AddButtonMenu onUpdate={handleMenuAdd} />
        </div>
      )}
      <div>
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default MenuPanel;
