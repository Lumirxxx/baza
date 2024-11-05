import React, { useState } from "react";
import axios from "axios";
import { apiserver } from "../config";
import { refreshAuthToken } from "../authService"; // Импортируем функцию обновления токена

const FeedBack = ({ toggleFeedback, feedbackVisible }) => {
    const [feedbackText, setFeedbackText] = useState("");
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        setFeedbackText(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            await sendFeedback(); 
            setIsMessageSent(true);
            setFeedbackText("");
            setErrorMessage("");
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
            setErrorMessage("Не удалось отправить сообщение. Попробуйте снова.");
        }
    };

    const sendFeedback = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `${apiserver}/auth/report/`,
                { text: feedbackText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("Отправлено:", response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Если ошибка 401 (Unauthorized), пробуем обновить токен
                const refreshTokenSuccess = await refreshAuthToken();
                if (refreshTokenSuccess) {
                    return await sendFeedback(); // Повторный запрос после успешного обновления токена
                } else {
                    throw new Error("Не удалось обновить токен.");
                }
            } else {
                throw error;
            }
        }
    };

    const handleToggleFeedback = () => {
        if (feedbackVisible) {
            setIsMessageSent(false);
            setFeedbackText("");
            setErrorMessage("");
        }
        toggleFeedback();
    };

    return (
        <div className={`feedback_form-modal ${feedbackVisible ? 'visible_form' : 'hidden'}`}>
            <div className="feedback_form-close" onClick={handleToggleFeedback}>
                <img src="/close.svg" alt="Feedback" />
            </div>
            <div className="feedback_form">
                <div className="feedback_form-container">
                    {!isMessageSent ? (
                        <>
                            <div className="feedback_form-title">Текст сообщения</div>
                            <textarea
                                className="feedback_form-textarea"
                                value={feedbackText}
                                onChange={handleInputChange}
                                placeholder=""
                            />
                            <button className="feedback_form-btn" onClick={handleSubmit}>
                                Отправить
                            </button>
                            {errorMessage && (
                                <div className="feedback_form-error">
                                    {errorMessage}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="feedback_success-message">
                            Ваше письмо было успешно отправлено. Мы ответим Вам в ближайшее время.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedBack;
