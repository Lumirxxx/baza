// SectionsPanel.js
import React from "react";

const SectionsPanel = ({ sections, selectedSectionId, onSelectSection }) => (
  <div className="sections_panel-container">

    {sections.length ? (
      sections.map((section) => {
        // Используем section.id или section._id, если нужно
        const id = section.id || section._id;
        return (
          <div
            key={id}
            className={`base_section_item ${selectedSectionId === id ? "active" : ""}`}
            onClick={() => onSelectSection(section)}
          >
            <div className="base_section_img_container">
              {section.img && <img className="base_section_img" src={section.img} alt="Section Image" />}
            </div>
           <div className="base_section_name" > {section.name}</div>
          </div>
        );
      })
    )  : null}
  </div>
);

export default SectionsPanel;
