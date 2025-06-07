import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Apersonnel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [personnel, setPersonnel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const response = await axios.get(`http://192.168.1.186:8080/rh/employe/${id}`);
                if (response.data) {
                    setPersonnel(response.data);
                } else {
                    setErrorMessage(`Aucun personnel trouvé avec l'ID ${id}`);
                    setShowModal(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setErrorMessage(`Aucun personnel trouvé avec l'ID ${id}`);
                } else {
                    setErrorMessage('Erreur de connexion au serveur');
                }
                setShowModal(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonnel();
    }, [id]);

    const closeModal = () => {
        setShowModal(false);
        navigate('/personnel');
    };

    const handleEdit = () => {
        navigate(`/personnel/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://192.168.1.186:8080/rh/employe/delete/${id}`);
            navigate('/personnel');
        } catch (error) {
            setErrorMessage("Erreur lors de la suppression du personnel");
            setShowModal(true);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            {/* Modal pour les erreurs */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Erreur</h3>
                                <button 
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-gray-700">{errorMessage}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                >
                                    Retour à la liste
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmation suppression */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmer la suppression</h3>
                            <p className="mb-6 text-gray-700">Êtes-vous sûr de vouloir supprimer ce personnel ? Cette action est irréversible.</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenu principal */}
            {personnel ? (
                <div className="flex justify-center items-start min-h-screen pt-10">
                    <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Détails du Personnel</h1>
                        
                        <div className="space-y-4">
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Nom:</span>
                                <span className="w-2/3 text-gray-800">{personnel.nom || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Prénom:</span>
                                <span className="w-2/3 text-gray-800">{personnel.prenom || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Sexe:</span>
                                <span className="w-2/3 text-gray-800">{personnel.sexe || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Date de naissance:</span>
                                <span className="w-2/3 text-gray-800">{personnel.dateNaissance || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Adresse:</span>
                                <span className="w-2/3 text-gray-800">{personnel.adresse || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Téléphone:</span>
                                <span className="w-2/3 text-gray-800">{personnel.telephone || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Email:</span>
                                <span className="w-2/3 text-gray-800">{personnel.email || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Date d'embauche:</span>
                                <span className="w-2/3 text-gray-800">{personnel.dateEmbauche || 'Non spécifié'}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-2">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                            >
                                Supprimer
                            </button>
                            <button
                                onClick={() => navigate('/personnel')}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                            >
                                Retour à la liste
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                !showModal && (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="text-gray-500">Chargement des données...</div>
                    </div>
                )
            )}
        </>
    );
};

export default Apersonnel;