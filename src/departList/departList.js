import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DepartList = ({ profile }) => {
    const [departments, setDepartments] = useState([]);
    const [profileData, setProfileData] = useState(profile);
    useEffect(() => {
        setProfileData(profile);
    }, [profile]);
    useEffect(() => {
        const fetchDepartments = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get('http://192.168.10.109:8000/api/v1/departmens/', {
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
            `http://192.168.10.109:8000/api/v1/users/${profile.id}/`,
            { depart_id: departId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {
                console.log(profile.depart_id)
                console.log(profileData.depart_id)
                console.log("Подразделение обновлено:", response.data);
                // Обновление значения depart_id у текущего пользователя в состоянии profileData
                const updatedProfileData = { ...profileData, depart_id: departId };
                setProfileData(updatedProfileData);

            })
            .catch((error) => {
                console.log("Ошибка при обновлении подразделения:", error);
            });
    };

    const onChangeMenuItem = async (event) => {
        const token = localStorage.getItem("token");
        const selectedMenuItem = event.target.value;

        try {
            const response = await axios.get('http://192.168.10.109:8000/api/v1/menu/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
        
        } catch (error) {
            console.error('Ошибка при получении списка меню:', error);
        }
    };



    return (
        <div className='depart_list-block'>
            <select className='form_menu_input' value={profileData.depart_id} onChange={onChangeDepart}>
                <option value="" disabled>Отдел</option>
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