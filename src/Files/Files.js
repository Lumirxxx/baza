import React, { useEffect, useState } from "react";
import axios from "axios";

const Files = ({ articleId }) => {
    const [files, setFiles] = useState([]);

    const fetchFiles = () => {
        const token = localStorage.getItem("token");
        axios
            .get(`http://192.168.10.109:8000/api/v1/files/?article_id=${articleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setFiles(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchFiles();
    }, [articleId]);
    const handleDownload = (fileUrl) => {
        window.open(fileUrl, "_blank");
        console.log("Файл успешно скачен")
    };

    return (
        <>
            {files.map((file) => (
                <div key={file.id}>
                    <a href={file.file} target="_blank" rel="noopener noreferrer" download>{file.name}</a>
                    <button onClick={() => handleDownload(file.file)} download>Скачать</button>
                </div>
            ))}
        </>
    );
};

export default Files;