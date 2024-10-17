import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";

const RegistrationForm = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        organizationName: "",
        organizationINN: "",
        industry: "",
        industryId: null,  // Сохраняем id выбранной отрасли
        region: "",
        regionId: null,  // Сохраняем id выбранного региона
        email: "",
    });

    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isBranchOpen, setIsBranchOpen] = useState(false);
    const [isDistrictOpen, setIsDistrictOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Функция для загрузки отраслей
    const fetchBranches = async () => {
        try {
            const response = await axios.get(`${apiserver}/auth/branches/`);
            setBranches(response.data);  // Данные будут содержать name и id
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    // Функция для загрузки регионов
    const fetchDistricts = async () => {
        try {
            const response = await axios.get(`${apiserver}/auth/districts/`);
            setDistricts(response.data);  // Данные будут содержать name и id
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    useEffect(() => {
        fetchBranches();
        fetchDistricts();
    }, []);

    const handleOptionClick = (value, id, setFieldValue, setFieldId, setOpen) => {
        setFieldValue(value);
        setFieldId(id);
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

        // Подготовка данных для отправки
        const registrationData = {
            organization: formData.organizationName,
            inn: formData.organizationINN,
            branch: formData.industryId,  // Отправляем id отрасли
            district: formData.regionId,  // Отправляем id региона
            email: formData.email,
        };

        axios
            .post(`${apiserver}/auth/reg_request/`, registrationData)
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
            {formData.industry || "Отрасль"}
        </div>
        <div className="custom-select-options">
            {branches.map((branch) => (
                <div
                    key={branch.id}
                    className="custom-option"
                    onClick={() => {
                        // Объединяем обновления в одном вызове setFormData
                        setFormData((prevData) => ({
                            ...prevData,
                            industry: branch.name,
                            industryId: branch.id
                        }));
                        setIsBranchOpen(false);
                    }}
                >
                    {branch.name}
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
            {districts.map((district) => (
                <div
                    key={district.id}
                    className="custom-option"
                    onClick={() => {
                        // Объединяем обновления в одном вызове setFormData
                        setFormData((prevData) => ({
                            ...prevData,
                            region: district.name,
                            regionId: district.id
                        }));
                        setIsDistrictOpen(false);
                    }}
                >
                    {district.name}
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
