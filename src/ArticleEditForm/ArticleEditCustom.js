// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState, convertToRaw, ContentState, convertFromRaw } from "draft-js";
// import createImagePlugin from '@draft-js-plugins/image';
// import draftToHtml from "draftjs-to-html";

// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// const ArticleEditCustom = () => {
//     const [sections, setSections] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [subsectionId, setSectionId] = useState(null);

//     const [selectedImages, setSelectedImages] = useState([]);
//     const [editorState, setEditorState] = useState(EditorState.createEmpty());
//     const [contentHtml, setContentHtml] = useState("");
//     const [selectedImage, setSelectedImage] = useState(null);
//     const { ImagePlugin } = createImagePlugin();

//     const handleButtonClick = () => {
//         fetchSections();
//         setShowForm(true);
//     };

//     const handleSectionChange = (event) => {
//         const subsectionId = event.target.value;
//         setSectionId(subsectionId);
//     };

//     const handleEditorStateChange = (state) => {
//         setEditorState(state);
//         const contentState = state.getCurrentContent();
//         const contentHtml = draftToHtml(convertToRaw(contentState));
//         const cleanedContentHtml = contentHtml.replace(/"|\\n/g, "");
//         setContentHtml(cleanedContentHtml);
//     };

//     const fetchSections = () => {
//         const token = localStorage.getItem("token");
//         axios
//             .get("http://192.168.10.109:8000/api/v1/subsections/", {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             .then((response) => {
//                 setSections(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();

//         if (subsectionId !== null) {
//             const token = localStorage.getItem("token");

//             const formData = new FormData();
//             formData.append("subsection_id", subsectionId);
//             formData.append("text", contentHtml);

//             selectedImages.forEach((image, index) => {
//                 formData.append(`image_${index}`, image);
//             });

//             axios
//                 .post("http://192.168.10.109:8000/api/v1/articles/", formData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data",
//                     },
//                 })
//                 .then((response) => {
//                     console.log("New article added:", response.data);
//                 })
//                 .catch((error) => {
//                     console.log("Error adding new article:", error);
//                 });
//         } else {
//             console.log("subsectionId is null");
//         }

//         setSectionId(null);
//         setEditorState(EditorState.createEmpty());
//         setSelectedImages([]);
//         setSelectedImage(null);
//         setShowForm(false);
//     };

//     const handleImageUpload = (file) => {
//         const imagePlugin = editorState.getPlugin(ImagePlugin.name);
//         const newEditorState = imagePlugin.addNewImage(editorState, file);
//         setEditorState(newEditorState);
//     };

//     useEffect(() => {
//         const rawContentState = JSON.parse(localStorage.getItem("content"));
//         if (rawContentState) {
//             const contentState = convertFromRaw(rawContentState);
//             const editorState = EditorState.createWithContent(contentState);
//             setEditorState(editorState);
//         }
//     }, []);

//     return (
//         <div>
//             <button onClick={handleButtonClick}>Add Article</button>

//             {showForm && (
//                 <form onSubmit={handleSubmit}>
//                     <select value={subsectionId} onChange={handleSectionChange}>
//                         <option value="" disabled selected>Select a section</option>
//                         {sections.map((section) => (
//                             <option key={section.id} value={section.id}>
//                                 {section && section.name}
//                             </option>
//                         ))}
//                     </select>
//                     <Editor
//                         editorState={editorState}
//                         onEditorStateChange={handleEditorStateChange}
//                         plugins={[ImagePlugin]}
//                         toolbar={{
//                             // other toolbar options...
//                             image: {
//                                 uploadCallback: handleImageUpload,
//                                 uploadEnabled: true,
//                                 alignmentEnabled: true,
//                                 previewImage: true,
//                                 alt: { present: true, mandatory: true },
//                                 defaultSize: { width: 512, height: 512 },
//                                 inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
//                             },
//                         }}
//                     />

//                     <button type="submit">Submit</button>
//                 </form>
//             )}
//         </div>
//     );
// };

// export default ArticleEditCustom;