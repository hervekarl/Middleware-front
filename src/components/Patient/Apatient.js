import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Apatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/patient/${id}`);
                if (response.data) {
                    setPatient(response.data);
                } else {
                    setErrorMessage(`Aucun patient trouvé avec l'ID ${id}`);
                    setShowModal(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setErrorMessage(`Aucun patient trouvé avec l'ID ${id}`);
                } else {
                    setErrorMessage('Erreur de connexion au serveur');
                }
                setShowModal(true);
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    const closeModal = () => {
        setShowModal(false);
        navigate('/patient'); // Redirection vers la liste après fermeture
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

            {/* Contenu principal */}
            {patient ? (
                <div className="flex justify-center items-start min-h-screen pt-10">
                    <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Détails du Patient</h1>
                        
                        <div className="space-y-4">
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">ID:</span>
                                <span className="w-2/3 text-gray-800">{patient._id || patient.id}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Nom:</span>
                                <span className="w-2/3 text-gray-800">{patient.name || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Prénom:</span>
                                <span className="w-2/3 text-gray-800">{patient.lastname || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Email:</span>
                                <span className="w-2/3 text-gray-800">{patient.email || 'Non spécifié'}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <span className="w-1/3 font-semibold text-gray-600">Téléphone:</span>
                                <span className="w-2/3 text-gray-800">{patient.phone || patient.tel || 'Non spécifié'}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => navigate('/patient')}
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

export default Apatient;