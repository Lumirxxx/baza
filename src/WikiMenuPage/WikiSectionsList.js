// WikiSectionsList.js
import React from "react";

const WikiSectionsList = ({
  sections,
  selectedMenuItemId,
  onSelectSection,
  activeTab,
  onAddSectionClick,
  onEditSection,
  onDeleteSection
}) => {
  return (
    <div style={{ marginTop: "4px" }} >
    
      {selectedMenuItemId ? (
        <>
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => onSelectSection(section.id)}
             className="wiki-item wiki-item-section wiki-item_subsection"
            >
              <div className="wiki-details wiki-details-section wiki-details-section_subsection " >
                <div className="wiki_details_img wiki_details_img_subsection" > <img src={section.img} alt="" /></div>
                <div className="wiki-name_section wiki-name_subsection " >{section.name}</div>
              </div>
              

              {activeTab === "subsections" && (
                <div className="wiki-actions wiki-actions-section wiki-actions-section_subsection"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="wiki-edit-btn wiki-edit-btn_subsection" onClick={() => onEditSection(section)}><img src="/edit.svg" alt="" /></button>
                  <button className="wiki-edit-btn wiki-edit-btn_subsection" onClick={() => onDeleteSection(section)}><img src="/delete.svg" alt="" /></button>
                </div>
              )}
            </div>
          ))}
          {activeTab === "subsections" && (
            <button onClick={onAddSectionClick} className="add-news-toggle-button">
              Добавить подраздел
              <img className="add_news-icon" src="/add-icon.svg" alt="" />
            </button>
          )}
        </>
      ) : (
       <></>
      )}
    </div>
  );
};

export default WikiSectionsList;
