import React, { useState } from "react";
import axios from "axios"; // Импортируем axios для отправки запросов

const FeedBack = ({ toggleFeedback, feedbackVisible }) => {
    const [feedbackText, setFeedbackText] = useState("");
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Для отображения ошибок при отправке

    const handleInputChange = (e) => {
        setFeedbackText(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token'); // Предположим, что токен находится в localStorage

            const response = await axios.post(
                '/api/v1/auth/report/', // Указываем URL API
                { text: feedbackText }, // Отправляем объект с текстом сообщения
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Добавляем токен авторизации, если он нужен
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Отправлено:', response.data);

            // Если сообщение успешно отправлено:
            setIsMessageSent(true);
            setFeedbackText("");
            setErrorMessage(""); // Сброс ошибки, если она была
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            setErrorMessage("Не удалось отправить сообщение. Попробуйте снова.");
        }
    };

    const handleToggleFeedback = () => {
        if (feedbackVisible) {
            // Если форма была видимой, и мы ее закрываем, сбросим состояние
            setIsMessageSent(false);
            setFeedbackText("");
            setErrorMessage(""); // Сброс ошибок при закрытии формы
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
