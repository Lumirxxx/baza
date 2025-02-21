import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";

const RegistrationForm = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        organizationName: "",
        organizationINN: "",
        industry: "",
        industryId: null,
        region: "",
        regionId: null,
        email: "",
    });

    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isBranchOpen, setIsBranchOpen] = useState(false);
    const [isDistrictOpen, setIsDistrictOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // Состояние для проверки валидности формы

    // Функция для загрузки отраслей
    const fetchBranches = async () => {
        try {
            const response = await axios.get(`${apiserver}/auth/branches/`);
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    // Функция для загрузки регионов
    const fetchDistricts = async () => {
        try {
            const response = await axios.get(`${apiserver}/auth/districts/`);
            setDistricts(response.data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    useEffect(() => {
        fetchBranches();
        fetchDistricts();
    }, []);

    useEffect(() => {
        // Проверка, заполнены ли все поля формы
        const isValid =
            formData.organizationName &&
            formData.organizationINN &&
            formData.industry &&
            formData.region &&
            formData.email;
        setIsFormValid(isValid);
    }, [formData]);

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

        const registrationData = {
            organization: formData.organizationName,
            inn: formData.organizationINN,
            branch: formData.industryId,
            district: formData.regionId,
            email: formData.email,
        };

        axios
            .post(`${apiserver}/auth/reg_request/`, registrationData)
            .then((response) => {
                setSuccessMessage("Анкета отправлена. Ожидайте письмо на указанную Вами почту.");
                setIsSubmitted(true);
            })
            .catch((error) => {
                setErrorMessage("Ошибка при регистрации. Пожалуйста, попробуйте снова.");
            });
    };

    return (
        <div className="registration_page">
             
            <div className="registration_form">
            <button
            className="add-news-toggle-button return-login-button"
            onClick={onCancel}
        >
            <>
                <span >Вернуться на страницу входа</span>
                <img
                    className="return-news-icon return-icon-login-page"
                    src="/arrow-left-black.svg"
                    alt="Return Icon"
                />
            </>
        </button>
                <div className="registration_form-header">
                    <div className="registration_form_title">Регистрационная анкета</div>
                    <div className="registration_form_info">
                        {isSubmitted
                            ? successMessage
                            : "Для регистрации необходимо заполнить анкету. После отправки анкеты, на указанный Email будет направлено письмо с логином и паролем для входа."}
                    </div>
                </div>
                
                {!isSubmitted ? (
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
                                <div 
                                    className={`selected-value selected-value-regform registration_form_group-input registration_form_group-input_hiegth  ${formData.industry ? 'filled' : ''}`}
                                >
                                    {formData.industry || "Отрасль"}
                                </div>
                                <div className="custom-select-options">
                                    {branches.map((branch) => (
                                        <div
                                            key={branch.id}
                                            className="custom-option custom-option_reg"
                                            onClick={() => {
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
                                <div 
                                    className={`selected-value selected-value-regform registration_form_group-input registration_form_group-input_hiegth  ${formData.region ? 'filled' : ''}`}
                                >
                                    {formData.region || "Регион"}
                                </div>
                                <div className="custom-select-options">
                                    {districts.map((district) => (
                                        <div
                                            key={district.id}
                                            className="custom-option custom-option_reg"
                                            onClick={() => {
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
                            <button
                                className="form_button_submit form_button_submit_reg"
                                type="submit"
                                disabled={!isFormValid}
                                style={{
                                    backgroundColor: isFormValid ? "#002072" : "#5F6982",
                                }}
                            >
                                Отправить
                            </button>
                        </div>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </form>
                ) : (
                    <div className="registration_form_info">
                        <button onClick={onCancel} className="form_button_submit_reg-toback ">
                            Вернуться к авторизации
                        </button>
                    </div>
                )}
               
            </div>
        </div>
    );
};

export default RegistrationForm;
