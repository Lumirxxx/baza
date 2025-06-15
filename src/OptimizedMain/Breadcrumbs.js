// Breadcrumbs.js
import React from "react";

const Breadcrumbs = ({ menuName, sectionName, articleName }) => {
  return (
    <nav className="breadcrumbs">
      {menuName && <span className="breadcrumb-item">{menuName}</span>}
      {sectionName && (
        <>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-item">{sectionName}</span>
        </>
      )}
      {articleName && (
        <>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-item">{articleName}</span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
