import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiserver } from "../config";
import { useNavigate } from 'react-router-dom';
import AddUserForm from '../AddUserForm/AddUserForm';
import EditUserForm from '../EditUserForm/EditUserForm';
import UserSearch from '../UserSearch/UserSearch';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isEditingUser, setIsEditingUser] = useState(null); // ID пользователя, которого редактируем
    const [searchQuery, setSearchQuery] = useState(''); // Строка поиска
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');

            const usersResponse = await axios.get(`${apiserver}/auth/users/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const clientsResponse = await axios.get(`${apiserver}/auth/clients/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const contractsResponse = await axios.get(`${apiserver}/projects/contracts/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const districtsResponse = await axios.get(`${apiserver}/auth/districts/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const branchesResponse = await axios.get(`${apiserver}/auth/branches/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const clientsData = clientsResponse.data;
            const contractsData = contractsResponse.data;
            const districtsData = districtsResponse.data;
            const branchesData = branchesResponse.data;

            const enrichedUsers = usersResponse.data.map(user => {
                const client = clientsData.find(client => client.user_id === user.id);
                
                // Находим все контракты для данного клиента
                const contracts = client ? contractsData.filter(contract => contract.client_id === client.id) : [];

                // Находим регион по district_id клиента
                const district = client ? districtsData.find(district => district.id === client.district_id) : null;
                const regionName = district ? district.name : '';

                // Находим отрасль по branch_id клиента
                const branch = client ? branchesData.find(branch => branch.id === client.branch_id) : null;
                const branchName = branch ? branch.name : '';

                return {
                    id: user.id, // Добавляем ID пользователя для редактирования и удаления
                    username: user.username,
                    email: user.email,
                    inn: client ? client.inn : '',
                    organization: client ? client.organization : '',
                    industry: branchName, // Используем name отрасли
                    region: regionName,   // Используем name региона
                    contract_numbers: contracts.map(contract => contract.contract_number), // Массив номеров договоров
                };
            });

            setUsers(enrichedUsers);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 401) {
                console.log('error.response =', error.response);
            } else {
                console.error("Ошибка при получении данных:", error.message);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [navigate]);

    const handleUserAddedOrEdited = () => {
        setIsAddingUser(false);
        setIsEditingUser(null);
        fetchUsers(); // Обновляем список пользователей после добавления/редактирования
    };

    const handleEditUser = (userId) => {
        setIsEditingUser(userId);
        setIsAddingUser(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');

            // Удаляем пользователя
            await axios.delete(`${apiserver}/auth/users/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            fetchUsers(); // Обновляем список пользователей после удаления
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error.message);
        }
    };

    // Фильтрация пользователей на основе строки поиска
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='users_position-button'>
            <div className="users-title">Список пользователей</div>
            
            {/* Добавляем компонент поиска */}
            <UserSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            
            <div className="users-container">
                <div className={`users-table_container ${isAddingUser ? 'compressed' : ''}`}>
                    <div className="users-table">
                        
                        {/* Заголовок таблицы */}
                        <div className='table-header-container'>
                            <div className='table-header'>
                                <div className='table-header_item'>Логин</div>
                                <div className='table-header_item'>Договора</div>
                                <div className='table-header_item'>ИНН</div>
                                <div className='table-header_item'>Наименование организации</div>
                                <div className='table-header_item'>Отрасль</div>
                                <div className='table-header_item region_margin'>Регион</div>
                                <div className='table-header_item'>Email</div>
                                <div className='table-header_item'></div>
                            </div>
                        </div>
    
                        {/* Тело таблицы */}
                        <div className='table-body-container'>
                            {filteredUsers.map((user, index) => (
                                <div className='table-body' key={index}>
                                    <div className='table-body_item'>{user.username}</div>
                                    <div className='table-body_item'>
                                        {user.contract_numbers.map((contract_number, idx) => (
                                            <div key={idx}>{contract_number}</div>
                                        ))}
                                    </div>
                                    <div className='table-body_item'>{user.inn}</div>
                                    <div className='table-body_item'>{user.organization}</div>
                                    <div className='table-body_item'>{user.industry}</div>
                                    <div className='table-body_item'>{user.region}</div>
                                    <div className='table-body_item'>{user.email}office@promreshenie.ru</div>
                                    <div className='table-body_item actions'>
                                        <img src='./edit-icon.svg' className='edit-icon' onClick={() => handleEditUser(user.id)} />
                                        <img src='./delete-icon.svg' onClick={() => handleDeleteUser(user.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Формы добавления и редактирования пользователей */}
                <div className="user-form-container">
                    {isAddingUser && (
                        isEditingUser !== null ? (
                            <EditUserForm
                                onUserEdited={handleUserAddedOrEdited}
                                editingUserId={isEditingUser}
                                isEditing={isEditingUser !== null}
                                onClose={() => setIsAddingUser(false)}
                            />
                        ) : (
                            <AddUserForm
                                onUserAdded={handleUserAddedOrEdited}
                                onClose={() => setIsAddingUser(false)}
                            />
                        )
                    )}
                </div>
            </div>
    
            {/* Кнопка добавления пользователя */}
            <button className="add-user-button" onClick={() => { setIsAddingUser(true); setIsEditingUser(null); }}>
                Добавить пользователя
            </button>
        </div>
    );
    
};

export default Users;
