// ProfileMenu.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("Пользователь");
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  const toggleMenu = () => setMenuOpen((o) => !o);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("isStaff");
    localStorage.removeItem("isManager");
    navigate("/");
  };

  const handleNameClick = () => {
    const isStaff   = localStorage.getItem("isStaff")   === "true";
    const isManager = localStorage.getItem("isManager") === "true";
    if (isStaff || isManager) {
      navigate("/admin");
    }
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button className="profile-button" onClick={toggleMenu}>
        <div className="heder_menu-object_form-feedback profile-icon" />
      </button>

      {menuOpen && (
        <div className="profile-dropdown">
          <img className="dropdown-toggle" src="/dropdown_toggle.svg" alt="" />
          <div className="profile-info">
            <img src="/user.svg" alt="Профиль" className="user-icon" />
            <div
              className="profile-username"
              style={{ cursor: "pointer" }}
              onClick={handleNameClick}
            >
              {username}
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Выйти из профиля
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
