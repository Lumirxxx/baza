// LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiserver } from "../config";
import RegistrationForm from "../RegistrationForm/RegistrationForm";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 1) Получаем токены
      const tokenRes = await axios.post(`${apiserver}/auth/token/`, {
        username,
        password,
      });
      const { access, refresh } = tokenRes.data;
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", username);

      // 2) Получаем список пользователей и находим текущего по username
      const usersRes = await axios.get(`${apiserver}/auth/users/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      const me = usersRes.data.find((u) => u.username === username);
      // Если нашли, сохраняем флаг is_staff
      localStorage.setItem("isStaff", me?.is_staff ? "true" : "false");
      localStorage.setItem("isManager", me?.is_manager ? "true" : "false");

      // 3) Переходим дальше
      navigate("/MainNews");
    } catch (error) {
      setErrorMessage("Неверный логин или пароль. Проверьте ввод данных.");
      setIsErrorVisible(true);
      setTimeout(() => setIsErrorVisible(false), 5000);
    }
  };

  useEffect(() => {
    // Если уже есть валидный токен — сразу на MainNews
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/MainNews");
    }
  }, [navigate]);

  const isFormValid = username.trim() !== "" && password.trim() !== "";
  const backgroundImage = isRegistrationVisible ? "/bgreg.svg" : "/bgLoginPage3.svg";

  return (
    <div
      className="login_page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: "#002456",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {isRegistrationVisible ? (
        <RegistrationForm onCancel={() => setIsRegistrationVisible(false)} />
      ) : (
        <>
          <div className="login_page_logo">
            <a href="#">
              <img src="/logoww2.svg" alt="Logo" />
            </a>
          </div>
          <div className="login_form">
            <div className="login_form_title">Авторизация</div>
            <form className="login_form-body" onSubmit={handleSubmit}>
              <div className="login_form_button-container">
                <input
                  className="select_button"
                  placeholder="Логин"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="login_form_button-container">
                <div className="password-input-wrapper">
                  <input
                    className="select_button select_button_password_margin"
                    placeholder="Пароль"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <div className="icon-container" onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <img className="show-password" src="/eye-on-icon.svg" alt="Скрыть пароль" />
                      ) : (
                        <img className="show-password" src="/eye-off-icon.svg" alt="Показать пароль" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="login_form_button-container-submit">
                <button
                  className="form_button_submit form_button_submit-font_size"
                  type="submit"
                  style={{ backgroundColor: isFormValid ? "#022B94" : "#5F6982" }}
                  disabled={!isFormValid}
                >
                  Войти
                </button>
              </div>
              <div className="registration-link">
                <a href="#registration" onClick={() => setIsRegistrationVisible(true)}>
                  Регистрация
                </a>
              </div>
            </form>
          </div>
          {errorMessage && (
            <div className={`error-popup ${isErrorVisible ? "show" : "hide"}`}>
              <div onClick={() => setIsErrorVisible(false)} className="error-icon">
                <img src="/error-icon.svg" alt="Error" />
              </div>
              <div className="error-text">{errorMessage}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoginPage;
