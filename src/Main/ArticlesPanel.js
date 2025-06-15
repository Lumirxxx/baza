// ArticlesPanel.js
import React from "react";
import ButtonArticleName from "../MainButton/ButtonArticleName";
import Editor2 from "../Addbutton/Editor2";
import Files from "../Files/Files";

const ArticlesPanel = ({
  articles,
  selectedArticle,
  handleSelectArticle,
  handleAddArticle,
  handleArticleUpdate,
  deleteArticleModal,
  cancelArticleModal
}) => {
  return (
    <div className="articles_panel">
      {articles.length > 0 && (
        <div className="sections_container sections_container-articles_name">
          {articles.map((article) => (
            <div key={article.id} onClick={() => handleSelectArticle(article)}>
              <ButtonArticleName article={article} selectedArticle={selectedArticle} />
            </div>
          ))}
        </div>
      )}
      <div>
        <Editor2 onUpdate={handleAddArticle} />
      </div>
      {selectedArticle && (
        <div className="article_container">
          <div className="article_button_container">
            <div key={selectedArticle.id}>
              <div className="article_content">
                <div className="article_service-buttons">
                  {/* Здесь можно разместить кнопки редактирования/удаления статьи */}
                </div>
                <div className="article_content_container-name">
                  <h1
                    className="article_content_name"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.name }}
                  />
                  <div
                    className="article_content_text"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.text }}
                  />
                </div>
              </div>
            </div>
            <Files articleId={selectedArticle.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPanel;
