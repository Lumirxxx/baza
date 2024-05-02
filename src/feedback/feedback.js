import React, { useState } from "react";

const FeedBack = ({ toggleFeedback, feedbackVisible }) => {
    const [feedbackText, setFeedbackText] = useState("");
    const [isMessageSent, setIsMessageSent] = useState(false);

    const handleInputChange = (e) => {
        setFeedbackText(e.target.value);
    };

    const handleSubmit = () => {
        console.log("Отправлено:", feedbackText);
        // Логика для отправки сообщения здесь

        setIsMessageSent(true); // Предположим, что сообщение успешно отправлено
        setFeedbackText("");
    };

    return (
        <div  className={`feedback_form-modal ${feedbackVisible ? 'visible_form' : 'hidden'}`}>
            <div className="feedback_form-close" onClick={toggleFeedback}>
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