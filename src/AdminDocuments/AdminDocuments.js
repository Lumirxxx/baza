import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiserver } from "../config";
import DocumentDeleteConfirmationModal from '../DocumentDeleteConfirmationModal/DocumentDeleteConfirmationModal';
import SnackBarDocuments from '../SnackBar/SnackBarDocuments';

const AdminDocuments = () => {
    const [contracts, setContracts] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [snackBarType, setSnackBarType] = useState('');

    useEffect(() => {
        const fetchContractsAndDocuments = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const contractsResponse = await axios.get(`${apiserver}/projects/contracts/`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setContracts(contractsResponse.data);

                const documentsResponse = await axios.get(`${apiserver}/projects/documents/`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setDocuments(documentsResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchContractsAndDocuments();
    }, []);

    const openDeleteModal = (document) => {
        setSelectedDocument(document);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedDocument) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiserver}/projects/documents/${selectedDocument.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setDocuments(documents.filter((doc) => doc.id !== selectedDocument.id));
            setShowDeleteModal(false);
            setSelectedDocument(null);
            
            setSnackBarMessage('Данные успешно удалены');
            setSnackBarType('delete');
            setIsSnackBarOpen(true);
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedDocument(null);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFileSelect = async (event, contractId) => {
        const files = event.target.files;

        if (files.length) {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();

                for (let i = 0; i < files.length; i++) {
                    formData.append('file', files[i]);
                    formData.append('name', files[i].name);
                }

                formData.append('contract_id', contractId);

                await axios.post(`${apiserver}/projects/documents/`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const updatedDocumentsResponse = await axios.get(`${apiserver}/projects/documents/`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setDocuments(updatedDocumentsResponse.data);

                setSnackBarMessage('Данные успешно сохранены');
                setSnackBarType('upload');
                setIsSnackBarOpen(true);
            } catch (error) {
                console.error('Error uploading documents:', error);
            }
        }
    };

    const handleUploadClick = (contractId) => {
        document.getElementById(`file-input-${contractId}`).click();
    };

    const filteredContracts = contracts.filter(contract =>
        contract.contract_number.includes(searchTerm)
    );

    const groupedDocuments = filteredContracts.map(contract => ({
        contract_id: contract.id,
        contract_number: contract.contract_number,
        documents: documents.filter(doc => doc.contract_id === contract.id),
    }));

    return (
        <div className="documents">
            <div className='documents_container'>
            <div className='documents_table-title'>Список договоров</div>
            <div className='search-container'>
                <input
                    type="text"
                    placeholder="Найти по номеру договора"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
    
            <div className='documents-table-container'>
                <table className="documents-table">
                    <thead>
                        <tr>
                            <th className='contract_header-number'>№ Договора</th>
                            <th>Список прикрепленных документов</th>
                            <th className='document_header-upload'></th>
                        </tr>
                    </thead>
                    <tbody className='documents_table-body'>
                        {groupedDocuments.map(group => (
                            <React.Fragment key={group.contract_id}>
                                <tr>
                                    <td className='contract-number'>{group.contract_number}</td>
                                    <td className='document-name'>
                                        {group.documents.map((doc) => (
                                            <div key={doc.id} className="document-item">
                                                {doc.name}
                                                <button
                                                    className="delete-button_documents"
                                                    onClick={() => openDeleteModal({ ...doc, contractNumber: group.contract_number })}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        ))}
                                    </td>
                                    <td className='upload-button-container'>
                                        <div className='upload-button-container_background'>
                                            <div className='upload-icon'>
                                                <img src="/uploadsvg.svg" alt="" />
                                            </div>
                                            <button
                                                className="upload-button upload-button_background"
                                                onClick={() => handleUploadClick(group.contract_id)}
                                            >
                                                Загрузить документ
                                            </button>
                                            <input
                                                type="file"
                                                id={`file-input-${group.contract_id}`}
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileSelect(e, group.contract_id)}
                                                multiple
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
             
            </div>
            {showDeleteModal && (
                <DocumentDeleteConfirmationModal
                    documentName={selectedDocument.name}
                    contractInfo={`Договор №${selectedDocument.contractNumber}`}
                    onDelete={handleDelete}
                    onCancel={handleCancelDelete}
                />
            )}
               <SnackBarDocuments
                    message={snackBarMessage}
                    isOpen={isSnackBarOpen}
                    onClose={() => setIsSnackBarOpen(false)}
                    type={snackBarType}
                />
                </div>
        </div>
    );
};

export default AdminDocuments;
