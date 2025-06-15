// ArticlesPanel.js
import React from "react";

const ArticlesPanel = ({ articles, selectedArticle, onSelectArticle }) => (
  <div className="articles_panel-container">

    {articles.length ? (
      articles.map((article) => (
        <div
          key={article.id}
          className={`article_item ${selectedArticle && selectedArticle.id === article.id ? "active" : ""}`}
          onClick={() => onSelectArticle(article)}
        >
          {article.name}
        </div>
      ))
    ) :null}
    
    {selectedArticle && (
  <div className="article_detail">
    <h4 dangerouslySetInnerHTML={{ __html: selectedArticle.name }} />
    <div
      dangerouslySetInnerHTML={{
        __html: selectedArticle.text.replace(/http:\/\/5\.182\.4\.206:8000/g, "https://ipm-portal.ru")
      }}
    />
  </div>
)}

  </div>
);

export default ArticlesPanel;
