import React from "react";

const FormattedText = ({ html }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default FormattedText;