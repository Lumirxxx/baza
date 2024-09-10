import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const AddUserForm = ({ onUserAdded, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [contracts, setContracts] = useState(['']);
    const [inn, setInn] = useState('');
    const [organization, setOrganization] = useState('');
    const [branchId, setBranchId] = useState('');
    const [districtId, setDistrictId] = useState('');
    const [email, setEmail] = useState('');

    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        const fetchBranchesAndDistricts = async () => {
            try {
                const token = localStorage.getItem('token');

                const branchesResponse = await axios.get(`${apiserver}/auth/branches/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBranches(branchesResponse.data);

                const districtsResponse = await axios.get(`${apiserver}/auth/districts/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDistricts(districtsResponse.data);

            } catch (error) {
                console.error('Ошибка при загрузке данных отраслей и регионов:', error);
            }
        };

        fetchBranchesAndDistricts();
    }, []);

    const handleAddContract = () => {
        setContracts([...contracts, '']);
    };

    const handleContractChange = (index, value) => {
        const updatedContracts = [...contracts];
        updatedContracts[index] = value;
        setContracts(updatedContracts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            const userResponse = await axios.post(`${apiserver}/auth/users/`, {
                username,
                password,
                email,
                is_client: true
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const userId = userResponse.data.id;

            const clientResponse = await axios.post(`${apiserver}/auth/clients/`, {
                user_id: userId,
                inn,
                organization,
                branch_id: branchId,
                district_id: districtId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const clientId = clientResponse.data.id;

            for (const contractNumber of contracts) {
                await axios.post(`${apiserver}/projects/contracts/`, {
                    client_id: clientId,
                    contract_number: contractNumber
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            onUserAdded();

        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-user-form">
            <div className='form-title'>
            Добавление пользователя   
            </div>
            <div type="button" className="close-btn" onClick={onClose}>
               <img src='./close-circle.svg'></img>
            </div>
            <label>
                Логин
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Пароль
                <div className="password-container">
                    <input className='add-contract-input' type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className='pass-gen' type="button" onClick={() => setPassword(generatePassword())}>
                        <div className='pass-gen_txt'>
                            
                        Сгенерировать пароль
                        </div>
                        </div>
                </div>
            </label>
            <div className='add_contracts'>
                <div className='add_contracts_label-col'>
                № Договора
            {contracts.map((contract, index) => (
                
                <label key={index}>
                   
                    <input className='add-contract-input'
                        type="text"
                        value={contract}
                        onChange={(e) => handleContractChange(index, e.target.value)}
                    />
                </label>
            ))}
            </div>
            <button type="button" className="add-contract-btn" onClick={handleAddContract}>Добавить договор</button>
            </div>
            <label>
                ИНН
                <input  type="text" value={inn} onChange={(e) => setInn(e.target.value)} />
            </label>
            <label>
                Наименование организации
                <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} />
            </label>
            <label>
                Отрасль
                <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                    <option value=""></option>
                    {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Регион
                <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
                    <option value=""></option>
                    {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button 
    type="submit" 
    className="save-btn"
    disabled={!username || !password || !inn || !organization || !branchId || !districtId || !email}
>
    Сохранить
</button>
        </form>
    );
};

const generatePassword = () => {
    return Math.random().toString(36).slice(-10);
};

export default AddUserForm;
