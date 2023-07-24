// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ReleasePage = () => {
//     const [releases, setReleases] = useState([]);

//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         axios
//             .get("http://192.168.10.109:8000/api/v1/srv_releases/", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//             .then((response) => {
//                 console.log(response.data);
//                 setReleases(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }, []);

//     return (
//         <div className="releases_page">
//             <div className="releases_page_title">Список релизов</div>
//             <div className="releases_list">
//                 {releases.map((release) => (
//                     <div key={release.id} className="release_item">
//                         <div className="release_item_title">{release.id}</div>
//                         <div className="release_item_date">{release.versions}</div>

//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ReleasePage;
