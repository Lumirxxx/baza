// import React from "react";
// import axios from "axios";



// const DeleteButton = () => {
//     const handleDeleteSection = (sectionId) => {
//         const token = localStorage.getItem("token");
//         axios
//             .delete(`http://192.168.10.109:8000/api/v1/sections/${sectionId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//             .then((response) => {
//                 console.log("Section deleted successfully");
//             })
//             .catch((error) => {
//                 console.log("Error deleting section:", error);
//             });
//     };

//     const handleDeleteArticle = (articleId) => {
//         const token = localStorage.getItem("token");
//         axios
//             .delete(`http://192.168.10.109:8000/api/v1/articles/${articleId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//             .then((response) => {
//                 console.log("Article deleted successfully");
//             })
//             .catch((error) => {
//                 console.log("Error deleting article:", error);
//             });
//     };


//     return (
//         {sections.length > 0 && (
//             <div className="sections_container">
//                 {sections.map((section) => (
//                     <div
//                         className="section_button"
//                         key={section.id}
//                         onClick={() => setArticleButtonId(section.id)}
//                     >
//                         {section.name}
//                         <DeleteButton sectionId={section.id} />
//                         {/* <button onClick={() => handleDeleteSection(section.id)}>Delete</button> */}
//                     </div>
//                 ))}
//             </div>
//         )}
//     )
// }


// export default DeleteButton