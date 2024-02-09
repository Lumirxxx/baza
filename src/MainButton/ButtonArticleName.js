import React, { useContext } from "react";
import { ButtonArticleNameContext } from '../Main/Main.js';
const ButtonArticleName = () => {
    const { handleSelectArticle, selectedArticle, article } = useContext(ButtonArticleNameContext);
    return (
        <div>
            <div
                title={article.name}
                onClick={() => handleSelectArticle(article)}
                key={article.id}
                className={`section_button ${selectedArticle && selectedArticle.id === article.id ? 'active' : ''}`}
            >
                <div className="subsection_button_content" >
                    <div className="section_img_container section_img_container-articles">
                        {article.img && <img className="section_img" src={article.img} alt="Subsection Image" />}
                    </div>
                    <div className="subsection_name">{article.name}</div>
                </div>
                <div className="button_update-container">
                    <div className="section_button-container">
                        <div className="section_button_edit">
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ButtonArticleName