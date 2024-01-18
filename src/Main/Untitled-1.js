import React, { useState, useEffect } from "react";
import axios from "axios";

const Main = () => {
  const [menu, setMenu] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://192.168.10.109:8000/api/v1/menu/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMenu(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteMenu = async (menuId) => {
    setSelectedMenuId(menuId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteMenu = async () => {
    try {
      await axios.delete(
        `http://192.168.10.109:8000/api/v1/menu/${selectedMenuId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMenu((prevMenu) =>
        prevMenu.filter((menu) => menu.id !== selectedMenuId)
      );
    } catch (error) {
      console.log(error);
    }
    setSelectedMenuId(null);
    setShowDeleteConfirmation(false);
  };

  const cancelDeleteMenu = () => {
    setSelectedMenuId(null);
    setShowDeleteConfirmation(false);
  };

  return (
    <div>
      {/* Your existing code... */}
      {menu.map((menuItem) => (
        <div key={menuItem.id}>
          {(profile.is_staff || profile.is_moderate) && (
            <div className="button_delete-container">
              <div
                className="cl-btn-4 delete_button"
                onClick={() => handleDeleteMenu(menuItem.id)}
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
            <p>Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <button onClick={confirmDeleteMenu}>Yes</button>
              <button onClick={cancelDeleteMenu}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;