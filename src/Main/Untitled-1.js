import React, { useState } from "react";
import axios from "axios";

const Main = () => {
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleSectionButtonClick = async (menu_id) => {
    try {
      if (isSectionsOpen) {
        setSelectedMenuItemId(null);
        setSections([]);
        setIsSectionsOpen(false);
        setArticles([]);
      } else {
        const response = await axios.get(
          `http://192.168.10.109:8000/api/v1/sections/?menu_id=${menu_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const selectedMenuItem = menu.find((item) => item.id === menu_id);
        const menuName = selectedMenuItem ? selectedMenuItem.name : "";
        setMenuName(menuName);
        setMenuId(menu_id);
        setSections(response.data);
        setIsSectionsOpen(true);
        setSelectedSectionItemId(null);
        setSelectedMenuItemId(menu_id);
        setShowSubsections(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
        localStorage.removeItem("token");
      } else {
        console.log(error);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    setSelectedSectionId(sectionId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteSection = async () => {
    try {
      await axios.delete(
        `http://192.168.10.109:8000/api/v1/sections/${selectedSectionId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSections((prevSections) =>
        prevSections.filter((section) => section.id !== selectedSectionId)
      );
    } catch (error) {
      console.log(error);
    }
    setSelectedSectionId(null);
    setShowDeleteConfirmation(false);
  };

  const cancelDeleteSection = () => {
    setSelectedSectionId(null);
    setShowDeleteConfirmation(false);
  };

  return (
    <div>
      {/* Your existing code... */}
      {sections.map((section) => (
        <div key={section.id}>
          {/* Render the section content */}
          {(profile.is_staff || profile.is_moderate) && (
            <div className="button_delete-container">
              <div
                className="cl-btn-4 delete_button"
                onClick={() => handleDeleteSection(section.id)}
                title="Удалить"
              ></div>
            </div>
          )}
        </div>
      ))}

      {showDeleteConfirmation && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to delete this section?</p>
            <div className="modal-actions">
              <button onClick={confirmDeleteSection}>Yes</button>
              <button onClick={cancelDeleteSection}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
const handleDeleteSection = async (sectionId) => {
    try {
        await axios.delete(`http://192.168.10.109:8000/api/v1/sections/${sectionId}/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        setSections(sections.filter((section) => section.id !== sectionId));
    } catch (error) {
        console.log(error);
    }
};