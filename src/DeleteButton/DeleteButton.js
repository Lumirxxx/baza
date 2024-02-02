// import React, { useState, useEffect } from "react";
// import axios from 'axios';

// const DeleteMenuButton = ({ menuItem, selectedMenuId }) => {
//     // const [selectedMenuId, setSelectedMenuId] = useState(null);
//     const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
//     const [menuName, setMenuName] = useState('');
//     const [menu, setMenu] = useState([]);
//     const [errorMessage, setErrorMessage] = useState("");
//     const [profile, setProfile] = useState(false);
//     const handleDeleteMenu = async ({ menuId }) => {
//         setSelectedMenuId(menuId);
//         setShowDeleteConfirmation(true);
//         setMenuName()
//         console.log(menuName)
//     };

//     const confirmDeleteMenu = async () => {
//         try {
//             await axios.delete(
//                 `http://192.168.10.109:8000/api/v1/menu/${selectedMenuId}/`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             setShowDeleteConfirmation(false);
//             setMenu((prevMenu) =>
//                 prevMenu.filter((menu) => menu.id !== selectedMenuId)
//             );
//         } catch (error) {
//             if (error.request.status === 500) {
//                 setErrorMessage('Невозможно удалить так как имеются дочерние элементы');
//             }
//             console.log(error);
//         }
//         setSelectedMenuId(null);

//     };
//     const cancelDeleteMenu = () => {
//         setSelectedMenuId(null);
//         setShowDeleteConfirmation(false);
//     };


//     return (
//         <div className="123">
//             {/* {(profile.is_staff || profile.is_moderate) && ( */}


//             <div className="button_delete-container">
//                 <div
//                     className="cl-btn-4 delete_button"
//                     onClick={() => handleDeleteMenu(menuItem.id)}
//                     title="Удалить"
//                 ></div>
//             </div>

//             // )}
//             {showDeleteConfirmation && (
//                 <div className="modal">
//                     <div className="modal_alert-content">

//                         <div className="modal_alert-text">Вы уверены, что хотите удалить пункт меню?</div>
//                         {errorMessage && <p className="error-message_login">{errorMessage}</p>}
//                         <div className="modal-actions">
//                             <div className="modal-actions_buttons modal-actions_buttons_red" onClick={confirmDeleteMenu}>Удалить</div>
//                             <div className="modal-actions_buttons" onClick={cancelDeleteMenu}>Отмена</div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );

// }

// export default DeleteMenuButton
const DeleteMenuButton = ({ menuItem, handleSectionButtonClick, handleDeleteMenu, profile, menu_id }) => {
    
    return (
        <div title={menuItem.name} className="menu_item">
            <button
                className={`button_body ${(menu_id == menuItem.id) ? 'active' : ''}`}
                key={menuItem.id}
                onClick={() => handleSectionButtonClick(menuItem.id)}
            >
                <img className="menu_img" src={menuItem.img} alt="" />
                <div className="button_text">{menuItem.name}</div>
            </button>
            {(profile.is_staff || profile.is_moderate) && (
                <div className="button_delete-container">
                    <div
                        className="cl-btn-4 delete_button"
                        onClick={() => handleDeleteMenu(menuItem.id)}
                        title="Удалить"
                    ></div>
                </div>
            )}
        </div>
    );
};
export default DeleteMenuButton