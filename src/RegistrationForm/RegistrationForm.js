import React, { useState } from "react";
import axios from "axios";
import { apiserver } from "../config";

const RegistrationForm = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        organizationName: "",
        organizationINN: "",
        industry: "",
        region: "",
        email: "",
    });
    const [isBranchOpen, setIsBranchOpen] = useState(false);
    const [isDistrictOpen, setIsDistrictOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const branches = [
        "Алкогольные и безалкогольные напитки",
        "Джемы",
        "Молоко",
        "Мясо",
        "Не сладкие соусы к мясу, птице, рыбе",
        "Пищевое (сыпучее)",
        "Плодоовощные консервы",
        "Птица",
        "Рыба",
        "Сиропы (топинги для кофе, выпечки)",
        "Сладкие соусы",
        "Табак",
        "Химическая промышленность",
    ];

    const districts = [
        "Дальневосточный федеральный округ (ДФО)",
        "Приволжский федеральный округ (ПФО)",
        "Северо-Западный федеральный округ (СЗФО)",
        "Северо-кавказский федеральный округ (СКФО)",
        "Сибирский федеральный округ (СФО)",
        "Уральский федеральный округ (УрФО)",
        "Центральный федеральный округ (ЦФО)",
        "Южный федеральный округ (ЮФО)",
    ];

    const handleOptionClick = (value, setValue, setOpen) => {
        setValue(value);
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(`${apiserver}/register/`, formData)
            .then((response) => {
                setSuccessMessage("Регистрация прошла успешно. Проверьте вашу почту.");
            })
            .catch((error) => {
                setErrorMessage("Ошибка при регистрации. Пожалуйста, попробуйте снова.");
            });
    };

    return (
        <div className="registration_page">
            <div className="registration_form">
                <div className="registration_form-header">
                    <div className="registration_form_title">Регистрационная анкета</div>
                    <div className="registration_form_info">
                        Для регистрации необходимо заполнить анкету. После отправки анкеты, на указанный Email будет напрвлено письмо с логином и паролем для входа.
                    </div>
                </div>
                <form className="registration_form-body" onSubmit={handleSubmit}>
                    <div className="registration_form_group">
                        <div className="registration_form_group-title">Наименование организации</div>
                        <input
                            className="registration_form_group-input"
                            type="text"
                            name="organizationName"
                            placeholder="Ответ"
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="registration_form_group">
                        <div className="registration_form_group-title">ИНН организации</div>
                        <input
                            type="text"
                            className="registration_form_group-input"
                            name="organizationINN"
                            placeholder="Ответ"
                            value={formData.organizationINN}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="registration_form_group">
                      <div className="registration_form_group-title">Отрасль</div> 
                        <div 
                            className={`custom-select ${isBranchOpen ? 'open' : ''}`} 
                            onClick={() => setIsBranchOpen(!isBranchOpen)}
                        >
                            <div className="selected-value registration_form_group-input">
                                {formData.industry || "Оытрасль"}
                            </div>
                            <div className="custom-select-options">
                                {branches.map((branch, index) => (
                                    <div
                                        key={index}
                                        className="custom-option"
                                        onClick={() => handleOptionClick(branch, (value) => setFormData({ ...formData, industry: value }), setIsBranchOpen)}
                                    >
                                        {branch}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="registration_form_group">
                        <div className="registration_form_group-title">Регион</div> 
                        <div 
                            className={`custom-select ${isDistrictOpen ? 'open' : ''}`} 
                            onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                        >
                            <div className="selected-value registration_form_group-input">
                                {formData.region || "Регион"}
                            </div>
                            <div className="custom-select-options">
                                {districts.map((district, index) => (
                                    <div
                                        key={index}
                                        className="custom-option"
                                        onClick={() => handleOptionClick(district, (value) => setFormData({ ...formData, region: value }), setIsDistrictOpen)}
                                    >
                                        {district}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="registration_form_group">
                        <div className="registration_form_group-title">Email</div>
                        <input
                            className="registration_form_group-input"
                            type="email"
                            name="email"
                            placeholder="Ответ"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="registration_form_buttons">
                        <button className="form_button_submit" type="submit">
                            Отправить
                        </button>
                        <button className="form_button_cancel" onClick={onCancel}>
                            Отмена
                        </button>
                    </div>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
