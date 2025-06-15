// SectionsPanel.js
import React from "react";
import ButtonSection from "../MainButton/ButtonSection";
import EditButtonSection from "../Addbutton/EditButtonSection";
import { ButtonSectionContext } from "./Main";


const SectionsPanel = ({
  sections,
  handleArticleButtonClick,
  handleSectionUpdate,
  deleteSectionModal,
  profile,
  sectionId
}) => {
  return (
    <div className="sections_container">
      {sections.map((section) => (
        <div key={section.id} className="section_item_container">
          <div>
            <ButtonSectionContext.Provider value={{ sectionId, handleArticleButtonClick }}>
              <ButtonSection section={section} />
            </ButtonSectionContext.Provider>
          </div>
          <div>
            <EditButtonSection
              section={section}
              onUpdate={handleSectionUpdate}
              onDelete={() => deleteSectionModal(section.id)}
            />
          </div>
        </div>
      ))}
      {/* Здесь можно разместить модальное окно для подтверждения удаления секции */}
    </div>
  );
};

export default SectionsPanel;

