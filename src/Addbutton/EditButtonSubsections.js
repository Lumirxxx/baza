import React, { useState } from "react";
import axios from "axios";

const EditButtonSubsection = ({ subsection, subsectionId, onUpdate }) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState(subsection.name);

    const handleButtonClick = () => {
        setShowForm(true);
        console.log(subsection.name)
    };

    const handleInputChange = (event) => {
        setName(event.target.value);

    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        axios
            .patch(
                `http://192.168.10.109:8000/api/v1/subsections/${subsectionId}/`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log(subsection.name)
                console.log(subsectionId)
                console.log("Раздел обновлен:", response.data);
                onUpdate(response.data);
                setShowForm(false);
            })
            .catch((error) => {
                console.log(subsectionId)
                console.log("Ошибка при обновлении раздела:", error);
            });
    };

    return (
        <div className="section_button-container">
            {!showForm ? (
                <div className="section_button section_button_edit" onClick={handleButtonClick}>
                    <div className="edit_menu_button edit_menu_button-black"></div>
                </div>
            ) : (
                <div className="modal-background">
                    <div className="modal">
                        <form className="form_edit form_modal" onSubmit={handleSubmit} action="http://192.168.10.109:8000/api/v1/subsections/">
                            <div className="form_menu_label">
                                <label className="form_menu_label_name" htmlFor="name">Название:</label>
                                <input
                                    className="form_menu_input"
                                    required
                                    type="text"
                                    value={name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="modal_form-button">
                                <div className="form_button_container">
                                    <button className="form_button" type="submit">Добавить</button>
                                </div>

                                <div className="form_button_container">
                                    <button className="form_button" type="button" onClick={() => setShowForm(false)}>Отмена</button>
                                </div>


                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditButtonSubsection;
// <EditButtonSubsection subsection={subsection} subsections={subsections} subsectionId={subsection.id} onUpdate={handleSubsectionUpdate} />
// const handleDeleteMenu = async (menuId) => {
//     try {
//         await axios.delete(`http://192.168.10.109:8000/api/v1/menu/${menuId}/`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//         });
//         setMenu(menu.filter((menu) => menu.id !== menuId));
//     } catch (error) {
//         console.log(error);
//     }
// };
// const handleDeleteSection = async (sectionId) => {
//     try {
//         await axios.delete(`http://192.168.10.109:8000/api/v1/sections/${sectionId}/`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//         });

//         setSections(sections.filter((section) => section.id !== sectionId));
//     } catch (error) {
//         console.log(error);
//     }
// };
// const handleDeleteSubsection = async (subsectionId) => {
//     try {
//         await axios.delete(`http://192.168.10.109:8000/api/v1/subsections/${subsectionId}/`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//         });
//         setSubsections(subsections.filter((subsection) => subsection.id !== subsectionId));
//     } catch (error) {
//         console.log(error);
//     }
// }

// const handleDeleteArticle = async (articleId) => {
//     try {
//         await axios.delete(`http://192.168.10.109:8000/api/v1/articles/${articleId}/`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//         });

//         setArticles(articles.filter((article) => article.id !== articleId));
//     } catch (error) {
//         console.log(error);
//     }
// };
// const handleSectionUpdate = (updatedSection) => {
//     setSections((prevSections) => {
//         const updatedSections = prevSections.map((section) => {
//             if (section.id === updatedSection.id) {
//                 return updatedSection;
//             }
//             return section;
//         });
//         return updatedSections;
//     });
// };
// const handleSubsectionUpdate = (updatedSubsection) => {
//     setSubsections((prevSubsections) => {
//         const updatedSubsections = prevSubsections.map((subsection) => {
//             if (subsection.id === updatedSubsection.id) {
//                 return updatedSubsection;
//             }
//             return subsection;
//         });
//         return updatedSubsections;
//     });
// }
