// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Main = () => {
//   const [menu, setMenu] = useState([]);
//   const [sections, setSections] = useState([]);
//   const [articles, setArticles] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://192.168.10.109:8000/api/v1/menu/', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setMenu(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSectionButtonClick = async (sectionId) => {
//     try {
//       const response = await axios.get(`http://192.168.10.109:8000/api/v1/sections/${sectionId}/articles/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setSections(response.data.sections);
//       setArticles(response.data.articles);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleArticleButtonClick = async (articleId) => {
//     try {
//       const response = await axios.get(`http://192.168.10.109:8000/api/v1/articles/${articleId}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       console.log(response.data);
//       // Добавьте код для отображения содержимого статьи
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDeleteSection = async (sectionId) => {
//     try {
//       await axios.delete(`http://192.168.10.109:8000/api/v1/sections/${sectionId}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setSections(sections.filter((section) => section.id !== sectionId));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDeleteArticle = async (articleId) => {
//     try {
//       await axios.delete(`http://192.168.10.109:8000/api/v1/articles/${articleId}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setArticles(articles.filter((article) => article.id !== articleId));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//  return (
//   <div className="main_container">
//     <div className="menu_container">
//       <div className="menu_container_left">
//         <div className="main_page_logo">
//           <img src="/Headerlogomain.svg" alt="Logo" />
//         </div>
//         {menu.map((menuItem) => (
//           <button
//             className="button_body"
//             key={menuItem.id}
//             onClick={() => handleSectionButtonClick(menuItem.id)}
//           >
//             <div className="button_text">{menuItem.name}</div>
//           </button>
//         ))}
//       </div>
//       <div className="menu_container_right">
//         {sections.length > 0 && (
//           <div className="sections_container">
//             {sections.map((section) => (
//               <div
//                 className="section_button"
//                 key={section.id}
//                 onClick={() => handleArticleButtonClick(section.id)}
//               >
//                 <div>
//                   <div>
//                     <img src={section.img} alt="Section Image" />
//                   </div>
//                   <div>{section.name}</div>
//                 </div>
//                 <button onClick={() => handleDeleteSection(section.id)}>Delete</button>
//               </div>
//             ))}
//           </div>
//         )}
//         {articles.length > 0 && (
//           <div className="article_container">
//             <div className="article_button_container">
//               {articles.map((article) => (
//                 <div key={article.id}>
//                   <div className="article_content">
//                     <div>{article.text}</div>
//                     {article.items && (
//                       <ul>
//                         {article.items.map((item) => (
//                           <li key={item.id}>{item.text}</li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                   <button onClick={() => handleDeleteArticle(article.id)}>Delete</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );

