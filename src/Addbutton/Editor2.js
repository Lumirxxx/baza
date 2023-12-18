// import React, { useState, useRef } from 'react';

// import JoditEditor from 'jodit-react';

// const Editor2 = () => {
//     const editor = useRef(null);
//     const [content, setContent] = useState('');

//     const config = {
//         buttons: ['bold', 'italic', 'link', 'image', 'source'],
//         uploader: {
//             url: "http://192.168.10.109:8000/api/v1/images/",
//             format: 'json',
//             isSuccess: (response) => response.success, // Add this line
//             getMessage: (response) => response.message, // Add this line
//             process: (response) => {
//                 return {
//                     files: response.files,
//                     path: response.path,
//                 };
//             },
//         },
//         // Other jodit config options can go here
//     };

//     const handleImageInsertion = (event) => {
//         if (!editor.current || !editor.current.jodit) return;

//         const file = event.target.files[0];
//         const reader = new FileReader();

//         reader.onload = (e) => {
//             const img = `<img src="${e.target.result}" alt="image" />`;
//             const editorInstance = editor.current.jodit;
//             editorInstance.selection.insertHTML(img);
//         };

//         reader.readAsDataURL(file);
//     };

//     return (
//         <div>
//             <JoditEditor
//                 ref={editor}
//                 value={content}
//                 config={config}
//                 tabIndex={1}
//                 onBlur={newContent => setContent(newContent)}
//             />
//             <input type='file' onChange={handleImageInsertion} />
//         </div>
//     );
// };

// export default Editor2;
// import React, { useState, useRef } from 'react';

// const Edotor2 = () => {
//     const [content, setContent] = useState("");

//     const textAreaRef = useRef(null);

//     const insertImageAtCursor = (imageSrc) => {
//         const textarea = textAreaRef.current;
//         const startPos = textarea.selectionStart;
//         const endPos = textarea.selectionEnd;
//         const textBefore = content.substring(0, startPos);
//         const textAfter = content.substring(endPos, content.length);

//         const imgElement = `<img src="${imageSrc}" alt="image" />`;

//         textarea.focus();
//         textarea.setRangeText(imgElement, startPos, endPos, 'end');
//         setContent(textBefore + imgElement + textAfter);
//     };

//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         const formData = new FormData();
//         formData.append("img", file);

//         fetch("http://192.168.10.109:8000/api/v1/images/", {
//             method: "POST",
//             body: formData,
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         })
//             .then((response) => response.json())
//             .then((result) => {
//                 if (result && result.img) {
//                     const imageUrl = result.img;
//                     insertImageAtCursor(imageUrl);
//                 } else {
//                     console.log(result);
//                     alert("Загрузка не удалась");
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error:", error);
//             });
//     };

//     return (
//         <div>
//             <textarea
//                 ref={textAreaRef}
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 style={{ width: '100%', height: '300px' }}
//             />
//             <input type="file" accept="image/*" onChange={handleImageUpload} />
//             <div dangerouslySetInnerHTML={{ __html: content }}></div>
//         </div>
//     );
// };

// export default Edotor2;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';


import { Editor } from 'react-draft-wysiwyg';

import draftToHtml from 'draftjs-to-html';
import { EditorState, ContentState, convertToRaw, Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor2 = () => {
    const [editorHtml, setEditorHtml] = useState("");
    const [subsections, setSubsections] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [selectedSubsection, setSelectedSubsection] = useState('');
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const editorRef = useRef();
    useEffect(() => {
        fetchSubsections();
    }, []);

    const fetchSubsections = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://192.168.10.109:8000/api/v1/subsections/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setSubsections(response.data);
        } catch (error) {
            console.log('Error fetching subsections:', error);
        }
    };
    const handleSelectSubsection = (event) => {
        setSelectedSubsection(event.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        const articleData = {
            text: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            subsection_id: selectedSubsection,
        };

        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('text', content);
        formData.append('token', token);
        formData.append("image", selectedFile);

        try {
            await axios.post('http://192.168.10.109:8000/api/v1/articles/', articleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {

                const articleId = response.data.id;

                const fileFormData = new FormData();
                fileFormData.append("name", fileName);
                fileFormData.append("file", file);
                fileFormData.append("article_id", articleId);

                axios.post("http://192.168.10.109:8000/api/v1/files/", fileFormData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }).then((response) => {
                    const fileName = response.data.name;
                    const file = response.data.file;
                    const fileFormData = new FormData();
                    fileFormData.append("name", fileName);
                    fileFormData.append("file", file);
                    console.log("Файл загружен:", response.data);
                }).catch((error) => {
                    console.log("Ошибка при загрузке файла:", error);
                });
                console.log('Статья загружена:', response.data);
            }).catch((error) => {
                console.log('Ошибка при загрузке статьи или изображения:', error);
            });
        } catch (error) {
            console.log('Ошибка при загрузке статьи или изображения:', error);
        }
    };

    const uploadImageCallBack = (file) => {

        return new Promise((resolve, reject) => {

            const formData = new FormData();
            formData.append("img", file);
            fetch("http://192.168.10.109:8000/api/v1/images/", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data && data.img) {
                        resolve({ data: { link: data.img } });
                    } else {
                        reject(data);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    };

    const insertImage = (imageSrc) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity('IMAGE', 'MUTABLE', { src: imageSrc });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

        setEditorState(Modifier.insertText(newEditorState.getCurrentContent(), newEditorState.getSelection(), '', null, entityKey));
    };

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    return (
        <div>
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    image: {
                        uploadCallback: uploadImageCallBack,
                        previewImage: true,
                        alignmentEnabled: false,
                        urlEnabled: false,
                        alt: { present: false, mandatory: false },
                        defaultSize: {
                            height: 'auto',
                            width: '200px',
                        },
                        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                    }
                }}
                ref={editorRef}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                        uploadImageCallBack(file).then(({ data }) => {
                            insertImage(data.link);
                        }).catch(error => {
                            console.error('Error uploading image:', error);
                        });
                    }
                }}
            />

            <select value={selectedSubsection} onChange={handleSelectSubsection}>
                <option value="">Выбрать раздел</option>
                {subsections.map((subsection) => (
                    <option key={subsection.id} value={subsection.id}>{subsection.name}</option>
                ))}
            </select>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Editor2;
