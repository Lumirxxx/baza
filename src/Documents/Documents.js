// Documents.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiserver } from "../config";

const Documents = ({ contractNumber }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${apiserver}/projects/documents/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // Фильтрация документов по `contract_number`
                const filteredDocuments = response.data.filter(
                    doc => doc.contract_number === contractNumber
                );
                setDocuments(filteredDocuments);
            } catch (error) {
                console.error("Ошибка при получении документов:", error);
            } finally {
                setLoading(false);
            }
        };

        if (contractNumber) fetchDocuments();
    }, [contractNumber]);

    const handleDownload = async (docId, docName) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiserver}/projects/documents/`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'  // Указываем тип ответа как blob для скачивания файла
            });

            // Создаем ссылку на скачивание файла
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", docName); // Указываем имя файла для скачивания
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Ошибка при скачивании документа:", error);
        }
    };

    if (loading) return <p>Загрузка документов...</p>;

    return (
        <div className="documents-list">
           
            {documents.length > 0 ? (
                
                <div className="document-list">
                     <div className="documents-title">Документы</div>
                    {documents.map((doc) => (
                        <div className="document-row" key={doc.id}>
                            <div className="document-name">
                            {doc.name}
                            </div>
                            <button onClick={() => handleDownload(doc.id, doc.name)} className="download-button">
                                Скачать
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="document-list">
                <div className="documents-title">Документы</div>
              
                 
                     <div className="document-not-found">
                     В данном проекте нет добавленных документов
                     </div>
                   </div>
            
   
            )}
        </div>
    );
};

export default Documents;
