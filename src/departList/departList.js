import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";
const DepartList = ({ profile }) => {
    const [departments, setDepartments] = useState([]);
    const [profileData, setProfileData] = useState(profile);

    const refresh = () => {

        window.location.reload();
        console.log("страница обновлена")
    }
    useEffect(() => {
        setProfileData(profile);
    }, [profile]);
    useEffect(() => {
        const fetchDepartments = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${apiserver}/api/v1/departmens/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(profile)

                setDepartments(response.data);
            } catch (error) {
                console.error('Ошибка при получении списка отделов:', error);
            }
        };

        fetchDepartments();
    }, []);

    const onChangeDepart = (event) => {
        const token = localStorage.getItem("token");
        const departId = event.target.value;

        axios.patch(
            `${apiserver}/api/v1/users/${profile.id}/`,
            { depart_id: departId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {
                // onChangeMenuItem(event);
                console.log(profile.depart_id)
                console.log(profileData.depart_id)
                console.log("Подразделение обновлено:", response.data);
                // Обновление значения depart_id у текущего пользователя в состоянии profileData
                const updatedProfileData = { ...profileData, depart_id: departId };
                setProfileData(updatedProfileData);
                refresh();

            })
            .catch((error) => {
                console.log("Ошибка при обновлении подразделения:", error);
            });
    };




    return (
        <div className='depart_list-block'>
            <select className='form_menu_input form_menu_input-depart' value={profileData.depart_id} onChange={onChangeDepart}>

                {departments.map((depart) => (
                    <option key={depart.id} value={depart.id}>
                        {depart.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DepartList;