import React, { useState } from 'react';
import axios from 'axios';

const AddFilesButton = ({ articleId }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [showInputs, setShowInputs] = useState(false); // Добавленное состояние для открытия/закрытия элементов

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const fileName = selectedFile.name;
            setName(fileName);
        }
    };

    const handleButtonClick = async () => {
        try {
            const token = localStorage.getItem('token');
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
            {showInputs ? ( // Показывать элементы только если showInputs равен true
                <div className='modal'>
                    <div className='form_modal' >
                        <div className='form_modal-buttons_container'>
                            <input className='form_menu_input' placeholder='введите название файла' required type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            <div className='form_menu_input-download_file'>
                                <label className='form_menu_label_img' for="image">
                                    <div className='form_menu_input-image'></div>

                                    <input id='image' name='image' accept="image/*" className='form_menu_input-image_add' type="file" onChange={handleFileChange} />
                                </label>
                                <label className='form_menu_label_img-text' for="image">Загрузить файл</label>
                            </div>
                            <div className='modal_form-button'>
                                <div className='form_button_container'>
                                    <button className='form_button' onClick={handleButtonClick}>Отправить</button>
                                </div>
                                <div className='form_button_container'>
                                    <button className='form_button' onClick={() => setShowInputs(false)}> Закрыть </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <div className='add_files' title='Добавить файл'>
                    <div className='edit_menu_button add_files-button' onClick={() => setShowInputs(true)}></div>
                </div>
            )}
        </div>
    );
};

export default AddFilesButton;