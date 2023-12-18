// import React, { useState, useRef } from "react";
// import ReactQuill, { Quill } from "react-quill";
// import ImageUploader from "quill-image-uploader";

// Quill.register("modules/imageUploader", ImageUploader);

// const Editor = () => {
//   const [editorHtml, setEditorHtml] = useState("");
//   const reactQuillRef = useRef(null);

//   const handleChange = (html) => {
//     setEditorHtml(html);
//   };

//   const handleSubmit = () => {
//     const editor = reactQuillRef.current.getEditor();
//     setEditorHtml(editor);
//   };

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" }
//       ],
//       ["link", "image"],
//       ["clean"]
//     ],
//     imageUploader: {
//       upload: (file) => {
//         return new Promise((resolve, reject) => {
//           const formData = new FormData();
//           formData.append("image", file);

//           fetch(
//             "https://api.imgbb.com/1/upload?key=334ecea9ec1213784db5cb9a14dac265",
//             {
//               method: "POST",
//               body: formData
//             }
//           )
//             .then((response) => response.json())
//             .then((result) => {
//               console.log(result);
//               resolve(result.data.url);
//             })
//             .catch((error) => {
//               reject("Upload failed");
//               console.error("Error:", error);
//             });
//         });
//       }
//     }
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "indent",
//     "link",
//     "image",
//     "imageBlot"
//   ];

//   return (
//     <>
//       {<div dangerouslySetInnerHTML={{ __html: editorHtml }} />}

//       <ReactQuill
//         onChange={handleChange}
//         theme="snow"
//         style={{
//           minHeight: "25vh"
//         }}
//         modules={modules}
//         formats={formats}
//         value={editorHtml}
//         ref={reactQuillRef}
//       />
//     </>
//   );
// };

// export default Editor;




import React, { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import "quill-image-uploader/src/quill.imageUploader.css";
Quill.register("modules/imageUploader", ImageUploader);;
const Editor = () => {
  const [editorHtml, setEditorHtml] = useState("<p></p>");
  const reactQuillRef = useRef();
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [subsections, setSubsections] = useState([]);
  const [selectedSubsection, setSelectedSubsection] = useState('');
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);


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
  const handleSelectFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleChange = (html) => {
    setEditorHtml(html);
    setContent(html);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const articleData = {
      text: editorHtml,
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
        // Вызов метода upload
        // handlers.imageUploader.upload(selectedFile)
        //     .then((imageUrl) => {
        //         // Делайте что-то с полученным URL изображения
        //     })
        //     .catch((error) => {
        //         console.log('Ошибка при загрузке изображения:', error);
        //     });

        console.log('Статья загружена:', response.data);
      }).catch((error) => {
        console.log('Ошибка при загрузке статьи или изображения:', error);
      });
    } catch (error) {
      console.log('Ошибка при загрузке статьи или изображения:', error);
    }
  };

  const imageUploader = {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        const token = localStorage.getItem('token');

        formData.append('token', token);
        formData.append("img", file);
        console.log('ljikj n')
        fetch(
          "http://192.168.10.109:8000/api/v1/images/",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            const editor = reactQuillRef.current.getEditor();
            const uploadedImageUrl = result.img;
            const images = editor.root.querySelectorAll("img");
            images.forEach((image) => {
              image.src = uploadedImageUrl;

              // Создаем новый элемент изображения
              const newImage = document.createElement("img");
              newImage.src = uploadedImageUrl;

              // Добавляем новое изображение в редактор
              const editorWrapper = editor.root.querySelector(".ql-editor");
              editorWrapper.appendChild(newImage);
            });
            setEditorHtml(editor.root.innerHTML);
            resolve(result.img);
          })
          .catch((error) => {
            reject("Upload failed");
            console.error("Error:", error);
          });
      });
    },
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    imageUploader: imageUploader,
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "imageBlot",
  ];

  return (
    <>
      {/* <div dangerouslySetInnerHTML={{ __html: editorHtml }} /> */}

      <ReactQuill
        onChange={handleChange}
        theme="snow"
        style={{
          minHeight: "25vh",
        }}
        modules={modules}
        formats={formats}
        value={editorHtml}
        ref={reactQuillRef}
        saveWhitespace={true}
      />

      <select value={selectedSubsection} onChange={handleSelectSubsection}>
        <option value="">Выбрать раздел</option>
        {subsections.map((subsection) => (
          <option key={subsection.id} value={subsection.id}>{subsection.name}</option>
        ))}
      </select>
      <div>
        <label htmlFor="name">Имя файла:</label>
        <input type="text" id="name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
      </div>

      <div>
        <label htmlFor="file">Выберите файл:</label>
        <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button onClick={handleSubmit}>Submit</button>

    </>
  );
};

export default Editor;





// import React, { useState, useRef, useEffect } from "react";
// import ReactQuill, { Quill } from "react-quill";
// import ImageUploader from "quill-image-uploader";
// import axios from "axios";
// import "react-quill/dist/quill.snow.css";
// import "quill-image-uploader/src/quill.imageUploader.css";
// Quill.register("modules/imageUploader", ImageUploader);;
// const Editor = () => {
//   const [editorHtml, setEditorHtml] = useState("");
//   const reactQuillRef = useRef();
//   const [content, setContent] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [subsections, setSubsections] = useState([]);
//   const [selectedSubsection, setSelectedSubsection] = useState('');
//   const [fileName, setFileName] = useState("");
//   const [file, setFile] = useState(null);


//   useEffect(() => {
//     fetchSubsections();
//   }, []);

//   const fetchSubsections = async () => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await axios.get('http://192.168.10.109:8000/api/v1/subsections/',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       setSubsections(response.data);
//     } catch (error) {
//       console.log('Error fetching subsections:', error);
//     }
//   };

//   const handleSelectSubsection = (event) => {
//     setSelectedSubsection(event.target.value);
//   };
//   const handleSelectFile = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleChange = (html) => {
//     setEditorHtml(html);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const articleData = {
//       text: editorHtml,
//       subsection_id: selectedSubsection,
//     };

//     const formData = new FormData();
//     const token = localStorage.getItem('token');
//     formData.append('text', content);
//     formData.append('token', token);
//     formData.append("image", selectedFile);

//     try {
//       const response = await axios.post('http://192.168.10.109:8000/api/v1/articles/', articleData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const articleId = response.data.id;

//       const fileFormData = new FormData();
//       fileFormData.append("name", fileName);
//       fileFormData.append("file", file);
//       fileFormData.append("article_id", articleId);

//       await axios.post("http://192.168.10.109:8000/api/v1/files/", fileFormData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log('Статья и файл загружены:', response.data);
//     } catch (error) {
//       console.log('Ошибка при загрузке статьи или файла:', error);
//     }
//   };

//   const imageUploader = {
//     upload: (file) => {
//       return new Promise((resolve, reject) => {
//         const formData = new FormData();
//         const token = localStorage.getItem('token');

//         formData.append('token', token);
//         formData.append("img", file);

//         fetch(
//           "http://192.168.10.109:8000/api/v1/images/",
//           {
//             method: "POST",
//             body: formData,
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         )
//           .then((response) => response.json())
//           .then((result) => {
//             const editor = reactQuillRef.current.getEditor();
//             const range = editor.getSelection(true);
//             const imageUrl = result.img; // Используйте свойство, которое содержит URL изображения
//             const imageHtml = `<img src="${imageUrl}" alt="Image" />`; // Сгенерируйте HTML для изображения
//             editor.clipboard.dangerouslyPasteHTML(range.index, imageHtml); // Вставьте изображение в виде HTML
//             resolve(imageUrl);
//             console.log(imageUrl);

//             removeImageDataImages(); // Удаление второго изображения
//           })
//           .catch((error) => {
//             reject("Ошибка загрузки");
//             console.error("Ошибка:", error);
//           });
//       });
//     },
//   };
//   //Кастыль для удаления второго изображения
//   function removeImageDataImages() {
//     const editorWrapper = document.querySelector(".ql-snow .ql-editor");
//     const dataImages = editorWrapper.querySelectorAll('img[src^="data:image/"]');

//     dataImages.forEach((dataImage) => {
//       dataImage.remove();
//     });
//   }


//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike", "blockquote"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" },
//       ],
//       ["link", "image"],
//       ["clean"],
//     ],
//     imageUploader: imageUploader,
//   };
//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "indent",
//     "link",
//     "image",
//     "imageBlot",
//   ];

//   return (
//     <>
//       {/* <div dangerouslySetInnerHTML={{ __html: editorHtml }} /> */}

//       <ReactQuill
//         onChange={handleChange}
//         theme="snow"
//         style={{
//           minHeight: "25vh",
//         }}
//         modules={modules}
//         formats={formats}
//         value={editorHtml}
//         ref={reactQuillRef}

//       />

//       <select value={selectedSubsection} onChange={handleSelectSubsection}>
//         <option value="">Выбрать раздел</option>
//         {subsections.map((subsection) => (
//           <option key={subsection.id} value={subsection.id}>{subsection.name}</option>
//         ))}
//       </select>
//       <div>
//         <label htmlFor="name">Имя файла:</label>
//         <input type="text" id="name" value={fileName} onChange={(e) => setFileName(e.target.value)} />
//       </div>

//       <div>
//         <label htmlFor="file">Выберите файл:</label>
//         <input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
//       </div>
//       <button onClick={handleSubmit}>Submit</button>

//     </>
//   );
// };

// export default Editor;