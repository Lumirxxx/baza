// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Main from "../Main/Main";

// const AddButtonSectionsMain = (props) => {
//     // const { menuId } = props;
//     const [sections, setSections] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [menuId, setMenuId] = useState("");
//     const [menus, setMenus] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [newSection, setNewSection] = useState({
//         name: ""
//     });
//     const [selectedImage, setSelectedImage] = useState("");
//     // useEffect(() => {
//     //     if (menus.length > 0) {
//     //         const selectedMenu = menus[0];
//     //         handleMenuChange({ target: { value: selectedMenu.id } });
//     //     }
//     // }, [menus]);
//     const fetchMenus = () => {
//         const token = localStorage.getItem("token");
//         axios
//             .get("http://192.168.10.109:8000/api/v1/menu/", {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             .then((response) => {
//                 setMenus(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };


//     // useEffect(() => {
//     //     fetchMenus();
//     // }, []);

//     const handleButtonClick = (section) => {
//         setShowModal(true);
//         if (typeof section.id === "number") {
//             setMenuId(section.id);
//         } else {
//             // Обработка ошибки или установка значения по умолчанию
//             console.error("Некорректное значение section.id");

//         }
//         const token = localStorage.getItem("token");
//         axios

//             .get("http://192.168.10.109:8000/api/v1/menu/", {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             .then((response) => {
//                 setMenus(response.data);
//                 fetchMenus();
//                 console.log(menuId);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };
//     const handleMenuChange = (event) => {
//         const menu = event.target.value;
//         setMenuId(parseInt(menu));
//     };


//     const handleInputChange = (event) => {
//         setNewSection({
//             ...newSection,
//             [event.target.name]: event.target.value
//         });
//     };

//     const handleImageChange = (event) => {
//         setSelectedImage(event.target.files[0]);
//     };


//     const handleSubmit = (event) => {
//         event.preventDefault();

//         const selectedMenuId = parseInt(menuId, 10);
//         if (isNaN(selectedMenuId)) {
//             console.log("Ошибка: menuId не является числом");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("menu_id", selectedMenuId);
//         formData.append("name", newSection.name);
//         formData.append("img", selectedImage);

//         const token = localStorage.getItem("token");

//         axios
//             .post(
//                 "http://192.168.10.109:8000/api/v1/sections/",
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "multipart/form-data"
//                     }
//                 }
//             )
//             .then((response) => {
//                 console.log(selectedMenuId)
//                 console.log(menuId)
//                 console.log("Новая секция добавлена:", response.data);
//                 setSections((prevSections) => [...prevSections, response.data]);
//             })
//             .catch((error) => {
//                 console.log(selectedMenuId)
//                 console.log(menuId)
//                 console.log("Ошибка при добавлении новой секции:", error);
//             });

//         // setMenuId(selectedMenuId);
//         setNewSection({
//             name: ""
//         });
//         setSelectedImage("");
//         setShowForm(false);
//     };

//     return (
//         <div>
//             {!showModal ? (
//                 <div value={menuId} className="section_button section_button_add" onClick={handleButtonClick} >
//                     <div className="section_name">Добавить раздел</div>
//                 </div>
//             ) : (
//                 <div className="modal-background">
//                     <div className="modal">
//                         <form className="form_modal"
//                             onSubmit={handleSubmit}
//                             action="http://192.168.10.109:8000/api/v1/sections/"
//                             encType="multipart/form-data"
//                         >
//                             <div>
//                                 <label htmlFor="menu">Меню:</label>
//                                 <select required id="menu" name="menu_id" value={menuId} onChange={handleMenuChange}>
//                                     {menus.map((menu) => (
//                                         <option
//                                             value={parseInt(menu.id)}
//                                             key={menu.id}
//                                         >
//                                             {menu.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label htmlFor="name">Название:</label>
//                                 <input required type="text" id="name" name="name" value={newSection.name} onChange={handleInputChange} />
//                             </div>

//                             <div>
//                                 <label htmlFor="image">Изображение:</label>
//                                 <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
//                             </div>

//                             <button type="submit">Отправить</button>
//                             <button type="button" onClick={() => setShowModal(false)}>Отмена</button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AddButtonSectionsMain;
