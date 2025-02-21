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
    const [isBranchOpen, setIsBranchOpen] = useState(false);
    const [isDistrictOpen, setIsDistrictOpen] = useState(false);

    // Проверка на заполненность полей формы
    const isFormValid = username && password && inn && organization && branchId && districtId && email && contracts.every(contract => contract);

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

    const handleOptionClick = (id, setter, toggle) => {
        setter(id);
        toggle(false);
    };

    const handleAddContract = () => {
        setContracts([...contracts, '']);
    };

    const handleContractChange = (index, value) => {
        const updatedContracts = [...contracts];
        updatedContracts[index] = value;
        setContracts(updatedContracts);
    };
    const handleDeleteContract = (index) => {
        setContracts(contracts.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
    
        axios.post(`${apiserver}/auth/users/`, {
            username,
            password,
            email,
            is_client: true
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(userResponse => {
            const userId = userResponse.data.id;
    
            return axios.post(`${apiserver}/auth/clients/`, {
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
        })
        .then(clientResponse => {
            const clientId = clientResponse.data.id;
    
            const contractPromises = contracts
                .filter(contractNumber => contractNumber)
                .map(contractNumber => {
                    return axios.post(`${apiserver}/projects/contracts/`, {
                        client_id: clientId,
                        contract_number: contractNumber
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(contractResponse => {
                        console.log('Contract added:', contractResponse.data);
                    });
                });

            return Promise.all(contractPromises);
        })
        .then(() => {
            onUserAdded();
        })
        .catch(error => {
            if (error.response) {
                console.error('Ошибка с ответом от сервера:', error.response.data);
            } else if (error.request) {
                console.error('Ошибка с запросом:', error.request);
            } else {
                console.error('Другая ошибка:', error.message);
            }
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="add-user-form">
            <div className='form-title'>
                Добавление пользователя   
            </div>
            <div type="button" className="close-btn close-btn_user-form" onClick={onClose}>
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
                        <div className='pass-gen_txt'>Сгенерировать пароль</div>
                    </div>
                </div>
            </label>
            <div className='add_contracts'>
                <div className='add_contracts_label-col'>
                    № Договора
                    {contracts.map((contract, index) => (
                        <label key={index} className='add-contract-label-position-button'>
                            <input className='add-contract-input'
                                type="text"
                                value={contract}
                                onChange={(e) => handleContractChange(index, e.target.value)}
                            />
                               <button type="button" className="delete-contract-btn" onClick={() => handleDeleteContract(index)}>
                                
                            </button>
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
                <div 
                    className={`custom-select ${isBranchOpen ? 'open' : ''}`} 
                    onClick={() => setIsBranchOpen(!isBranchOpen)}
                >
                    <div className="selected-value">
                        {branchId ? branches.find(b => b.id === branchId)?.name : ''}
                    </div>
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
                </div>
            </label>
            <label>
                Регион
                <div 
                    className={`custom-select ${isDistrictOpen ? 'open' : ''}`} 
                    onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                >
                    <div className="selected-value">
                        {districtId ? districts.find(d => d.id === districtId)?.name : ''}
                    </div>
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
                </div>
            </label>
            <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button type="submit" className="save-btn" disabled={!isFormValid}>Сохранить</button>
        </form>
    );
};

const generatePassword = () => {
    return Math.random().toString(36).slice(-10);
};

export default AddUserForm;
