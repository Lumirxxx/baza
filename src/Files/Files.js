import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

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

    const handleDownload = (fileUrl, fileName) => {
        axios
            .get(fileUrl, {
                responseType: "blob" // указываем, что ожидаем в ответе файловый объект blob
            })
            .then((response) => {
                const blob = new Blob([response.data], { type: "application/octet-stream" });
                saveAs(blob, fileName); // используем функцию saveAs из библиотеки file-saver для скачивания файла
                console.log("Файл успешно скачен");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            {files.map((file) => (
                <div key={file.id}>
                    <a href={file.file} target="_blank" rel="noopener noreferrer" download>{file.name}</a>
                    <button onClick={() => handleDownload(file.file, file.name)}>Скачать</button>
                </div>
            ))}
        </>
    );
};

export default Files;