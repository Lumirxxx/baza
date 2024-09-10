import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const EditUserForm = ({ onUserEdited, editingUserId, isEditing,onClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [inn, setInn] = useState('');
    const [organization, setOrganization] = useState('');
    const [branchId, setBranchId] = useState('');
    const [districtId, setDistrictId] = useState('');
    const [contracts, setContracts] = useState([]); // Contracts now hold id and contract_number
    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [password, setPassword] = useState(''); // State for password

    useEffect(() => {
        if (isEditing && editingUserId) {
            fetchUserData(editingUserId);
        }
        fetchBranchesAndDistricts();
    }, [isEditing, editingUserId]);

    const fetchUserData = async (userId) => {
        try {
            const token = localStorage.getItem('token');

            const userResponse = await axios.get(`${apiserver}/auth/users/${userId}/`, {
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

            const userData = userResponse.data;
            const client = clientsResponse.data.find(client => client.user_id === userData.id);

            if (client) {
                setClientId(client.id);
                const clientContracts = contractsResponse.data.filter(contract => contract.client_id === client.id);
                setContracts(clientContracts); // Save the full contract objects with id and contract_number
            }

            setUsername(userData.username);
            setEmail(userData.email);
            setInn(client ? client.inn : '');
            setOrganization(client ? client.organization : '');
            setBranchId(client ? client.branch_id : '');
            setDistrictId(client ? client.district_id : '');

        } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error.message);
        }
    };

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

    const handleContractChange = (index, value) => {
        const newContracts = [...contracts];
        newContracts[index].contract_number = value;
        setContracts(newContracts);
    };

    const handleAddContract = () => {
        setContracts([...contracts, { id: null, contract_number: '' }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // Update user details
            await axios.patch(`${apiserver}/auth/users/${editingUserId}/`, {
                username: username || '',
                email: email || '',
                password: password || '',  // Include the password in the update
                inn: inn || '',
                organization: organization || '',
                branch_id: branchId || '', 
                district_id: districtId || '', 
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Update contracts
            for (const contract of contracts) {
                if (contract.id) {
                    // Update existing contract
                    await axios.patch(`${apiserver}/projects/contracts/${contract.id}/`, {
                        contract_number: contract.contract_number
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } else {
                    // Add new contract
                    await axios.post(`${apiserver}/projects/contracts/`, {
                        client_id: clientId,
                        contract_number: contract.contract_number
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            }

            onUserEdited();
        } catch (error) {
            console.error("Ошибка при редактировании пользователя:", error);
        }
    };

    // Password generation function
    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let newPassword = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            newPassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setPassword(newPassword);
    };

    return (
        
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className='form-title'>
          Редактирование пользователя     
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
                    <input className='add-contract-input' type="text" value={password}  />
                    <div className='pass-gen' type="button" onClick={   generatePassword}>
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
                        value={contract.contract_number}
                        onChange={(e) => handleContractChange(index, e.target.value)}
                    />
                </label>
            ))}
            </div>
            <button type="button" className="add-contract-btn" onClick={handleAddContract}>Добавить договор</button>
            </div>
               <label>
                ИНН
                <input type="text" value={inn} onChange={(e) => setInn(e.target.value)} />
            </label>
          
         
            <label>
                Наименование организации
                <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} />
            </label>
            <label>
                Отрасль
                <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                    <option value="">Выберите отрасль</option>
                    {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Регион
                <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
                    <option value="">Выберите регион</option>
                    {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                </select>
            </label>
            <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          
         
            {/* <button type="button" className="add-contract-btn" onClick={handleAddContract}>Добавить договор</button> */}
            <button type="submit" className="save-btn">Сохранить</button>
        </form>
    );
};

export default EditUserForm;
