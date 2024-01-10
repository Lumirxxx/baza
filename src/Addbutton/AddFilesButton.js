// Import necessary libraries
import React, { useState } from 'react';
import axios from 'axios';
const AddFilesButton = ({ articleId }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleButtonClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append('name', name);
            formData.append('file', file);
            formData.append('article_id', articleId);


            const response = await axios.post('http://192.168.10.109:8000/api/v1/files/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleButtonClick}>Загрузить файлы</button>
        </div>
    );
};

export default AddFilesButton;
