import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";

const EditUserForm = ({ onUserEdited, editingUserId, isEditing, onClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [inn, setInn] = useState('');
    const [organization, setOrganization] = useState('');
    const [branchId, setBranchId] = useState('');
    const [districtId, setDistrictId] = useState('');
    const [contracts, setContracts] = useState([]); 
    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [password, setPassword] = useState('');
    const [isBranchOpen, setIsBranchOpen] = useState(false);
    const [isDistrictOpen, setIsDistrictOpen] = useState(false);

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
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const clientsResponse = await axios.get(`${apiserver}/auth/clients/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const contractsResponse = await axios.get(`${apiserver}/projects/contracts/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const userData = userResponse.data;
            const client = clientsResponse.data.find(client => client.user_id === userData.id);

            if (client) {
                setClientId(client.id);
                const clientContracts = contractsResponse.data.filter(contract => contract.client_id === client.id);
                setContracts(clientContracts);
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
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBranches(branchesResponse.data);

            const districtsResponse = await axios.get(`${apiserver}/auth/districts/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDistricts(districtsResponse.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных отраслей и регионов:', error);
        }
    };

    const handleOptionClick = (id, setFunction, setOpen) => {
        setFunction(id);
        setOpen(false);
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
    
            // Создаем объект для отправки данных
            let userData = {
                username: username || '',
                email: email || '',
            };
    
            // Добавляем пароль, только если он не пустой
            if (password) {
                userData.password = password;
            }
    
            let updatedUser;
            if (editingUserId) {
                // Обновляем существующего пользователя
                updatedUser = await axios.patch(`${apiserver}/auth/users/${editingUserId}/`, userData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                // Создаем нового пользователя
                updatedUser = await axios.post(`${apiserver}/auth/users/`, userData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
    
            const userId = updatedUser.data.id;
    
            // 2. Обновляем или создаем клиента
            let currentClientId = clientId;
            if (clientId) {
                // Обновляем клиента
                await axios.patch(`${apiserver}/auth/clients/${clientId}/`, {
                    inn: inn || '',
                    organization: organization || '',
                    branch_id: branchId || '',
                    district_id: districtId || ''
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                // Создаем нового клиента
                const newClientResponse = await axios.post(`${apiserver}/auth/clients/`, {
                    user_id: userId,
                    inn: inn || '',
                    organization: organization || '',
                    branch_id: branchId || '',
                    district_id: districtId || ''
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
    
                currentClientId = newClientResponse.data.id;
                setClientId(currentClientId);
            }
    
            // 3. Обрабатываем договоры
            for (const contract of contracts) {
                if (contract.id) {
                    // Обновляем существующий договор
                    await axios.patch(`${apiserver}/projects/contracts/${contract.id}/`, {
                        contract_number: contract.contract_number
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } else {
                    // Создаем новый договор
                    await axios.post(`${apiserver}/projects/contracts/`, {
                        client_id: currentClientId,
                        contract_number: contract.contract_number
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            }
    
            onUserEdited();
        } catch (error) {
            console.error("Ошибка при редактировании пользователя:", error);
        }
    };
    

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
            <div className='form-title'>Редактирование пользователя</div>
            <div type="button" className="close-btn" onClick={onClose}>
                <img src='./close-circle.svg' alt="close"></img>
            </div>
            <label>
                Логин
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
    Пароль
    <div className="password-container">
        <input 
            className='add-contract-input' 
            type="text" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} // Обработчик изменения
        />
        <div className='pass-gen' type="button" onClick={generatePassword}>
            <div className='pass-gen_txt'>Сгенерировать пароль</div>
        </div>
    </div>
</label>
            <div className='add_contracts'>
                <div className='add_contracts_label-col'>
                    № Договора
                    {contracts.map((contract, index) => (
                        <label key={index}>
                            <input className='add-contract-input' type="text" value={contract.contract_number} onChange={(e) => handleContractChange(index, e.target.value)} />
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
                <div 
                    className={`custom-select ${isBranchOpen ? 'open' : ''}`} 
                    onClick={() => setIsBranchOpen(!isBranchOpen)}
                >
                    <div className="selected-value">
                        {branchId ? branches.find(b => b.id === branchId)?.name : 'Выберите отрасль'}
                    </div>
                    {isBranchOpen && (
                        <div className="custom-select-options">
                            {branches.map(branch => (
                                <div
                                    key={branch.id}
                                    className="custom-option"
                                    onClick={() => handleOptionClick(branch.id, setBranchId, setIsBranchOpen)}
                                >
                                    {branch.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </label>
            <label>
                Регион
                <div 
                    className={`custom-select ${isDistrictOpen ? 'open' : ''}`} 
                    onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                >
                    <div className="selected-value">
                        {districtId ? districts.find(d => d.id === districtId)?.name : 'Выберите регион'}
                    </div>
                    {isDistrictOpen && (
                        <div className="custom-select-options">
                            {districts.map(district => (
                                <div
                                    key={district.id}
                                    className="custom-option"
                                    onClick={() => handleOptionClick(district.id, setDistrictId, setIsDistrictOpen)}
                                >
                                    {district.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </label>
            <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button type="submit" className="save-btn">Сохранить</button>
        </form>
    );
};

export default EditUserForm;
