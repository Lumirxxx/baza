// WikiArticlesList.js
import React from "react";

const WikiArticlesList = ({
  articles,
  selectedSectionId,
  activeTab,
  onRefreshArticles,
  onArticleFormOpen,
  sections,
  // Новые пропы:
  onEditArticle,
  onDeleteArticle,
}) => {
  if (!selectedSectionId) {
    return null;
  }

  return (
    <div>
      {!articles.length && <p>Нет статей</p>}

      {articles.map((article) => (
        <div
          key={article.id}
          className="wiki-item wiki-item-section wiki-item_subsection"
        >
          <div className="wiki-details wiki-details-section wiki-details-section_subsection">
            <div className="wiki-name_section wiki-name_subsection">
              {article.name}
            </div>
          </div>

          {activeTab === "articles" && (
            <div
              className="wiki-actions wiki-actions-section wiki-actions-section_subsection"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Редактирование статьи */}
              <button
                className="wiki-edit-btn wiki-edit-btn_subsection"
                onClick={() => onEditArticle(article)}
              >
                <img src="/edit.svg" alt="Edit" />
              </button>

              {/* Удаление статьи */}
              <button
                className="wiki-delete-btn wiki-delete-btn_subsection"
                onClick={() => {
                  if (window.confirm(`Удалить статью "${article.name}"?`)) {
                    onDeleteArticle(article);
                  }
                }}
              >
                <img src="/delete.svg" alt="Delete" />
              </button>
            </div>
          )}
        </div>
      ))}

      {activeTab === "articles" && (
        <button
          onClick={() => {
            // Открыть пустую форму для добавления новой статьи
            onArticleFormOpen(true);
          }}
          className="add-news-toggle-button"
        >
          Добавить статью
          <img className="add_news-icon" src="/add-icon.svg" alt="" />
        </button>
      )}
    </div>
  );
};

export default WikiArticlesList;
