import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePatient = () => {
    const [patientData, setPatientData] = useState({
        name: "",
        prenom: "",
        tel: "",
        addr: "",
        sexe: "",
        dateN: "",
        email: "",
        groupeSanguin: ""
    });

    const { id } = useParams();
    const [errors, setErrors] = useState({});
    const [dialog, setDialog] = useState({ open: false, message: "", type: "" });
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fonction pour convertir la date de jj/mm/aaaa en aaaa-mm-jj
    const convertDateFormat = (dateString) => {
        if (!dateString) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateString;
    };

    // Charger les données du patient à modifier
    useEffect(() => {
        const fetchPatient = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://192.168.1.186:8080/patient/${id}`);
                if (!res.data) {
                    setErrorMessage(`Aucun patient trouvé avec l'ID ${id}`);
                    setShowModal(true);
                } else {
                    setPatientData({
                        ...res.data,
                        dateN: res.data.dateN
                            ? res.data.dateN.split("-").reverse().join("/")
                            : ""
                    });
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setErrorMessage(`Aucun patient trouvé avec l'ID ${id}`);
                } else {
                    setErrorMessage("Erreur de connexion au serveur");
                }
                setShowModal(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const validateForm = () => {
        const newErrors = {};
        if (!patientData.name.trim()) newErrors.name = "Nom requis";
        if (!patientData.prenom.trim()) newErrors.prenom = "Prénom requis";
        if (!patientData.sexe) newErrors.sexe = "Sexe requis";
        if (!patientData.tel.trim()) newErrors.tel = "Téléphone requis";
        if (!patientData.addr.trim()) newErrors.addr = "Adresse requise";
        if (!patientData.dateN) newErrors.dateN = "Date de naissance requise";
        if (!patientData.email.trim()) {
            newErrors.email = "Email requis";
        } else if (!/^\S+@\S+\.\S+$/.test(patientData.email)) {
            newErrors.email = "Email invalide";
        }
        if (!patientData.groupeSanguin.trim()) newErrors.groupeSanguin = "Groupe sanguin requis";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const dataToSend = {
                ...patientData,
                dateN: convertDateFormat(patientData.dateN)
            };
            await axios.put(`http://192.168.1.186:8080/patient/update/${id}`, dataToSend, {
                headers: {'Content-Type': 'application/json'}
            });
            setDialog({
                open: true,
                message: "Patient modifié avec succès !",
                type: "success"
            });
        } catch (error) {
            setDialog({
                open: true,
                message: error.response?.data?.message || "Erreur lors de la modification",
                type: "error"
            });
        }
    };

    const handleReset = () => {
        setPatientData({
            name: "",
            prenom: "",
            tel: "",
            addr: "",
            sexe: "",
            dateN: "",
            email: "",
            groupeSanguin: ""
        });
        setErrors({});
    };

    const closeDialog = () => {
        setDialog({ open: false, message: "", type: "" });
        if (dialog.type === "success") {
            navigate("/patient");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate("/patient");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Modal d'erreur connexion ou patient non trouvé */}
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

            {/* Dialog succès/erreur modification */}
            {dialog.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-semibold ${
                                dialog.type === "success" ? "text-green-600" : "text-red-600"
                            }`}>
                                {dialog.type === "success" ? "Succès" : "Erreur"}
                            </h3>
                            <button onClick={closeDialog} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <p className="mb-4">{dialog.message}</p>
                        <button
                            onClick={closeDialog}
                            className={`w-full py-2 rounded text-white ${
                                dialog.type === "success" 
                                    ? "bg-green-600 hover:bg-green-700" 
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Formulaire de modification */}
            {!showModal && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded shadow-md w-full max-w-2xl"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Modifier un patient</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ... (tous les champs du formulaire comme avant) ... */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                            <input
                                name="name"
                                value={patientData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom*</label>
                            <input
                                name="prenom"
                                value={patientData.prenom}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.prenom ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                            <input
                                name="tel"
                                value={patientData.tel}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.tel ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.tel && <p className="mt-1 text-sm text-red-600">{errors.tel}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse*</label>
                            <input
                                name="addr"
                                value={patientData.addr}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.addr ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.addr && <p className="mt-1 text-sm text-red-600">{errors.addr}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sexe*</label>
                            <select
                                name="sexe"
                                value={patientData.sexe}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.sexe ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Sélectionnez...</option>
                                <option value="M">Masculin</option>
                                <option value="F">Féminin</option>
                            </select>
                            {errors.sexe && <p className="mt-1 text-sm text-red-600">{errors.sexe}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance*</label>
                            <input
                                type="text"
                                name="dateN"
                                value={patientData.dateN}
                                onChange={handleChange}
                                placeholder="jj/mm/aaaa"
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.dateN ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.dateN && <p className="mt-1 text-sm text-red-600">{errors.dateN}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                            <input
                                type="email"
                                name="email"
                                value={patientData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin*</label>
                            <select
                                name="groupeSanguin"
                                value={patientData.groupeSanguin}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.groupeSanguin ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Sélectionnez...</option>
                                <option value="A_POSITIF">A+</option>
                                <option value="A_NEGATIF">A-</option>
                                <option value="B_POSITIF">B+</option>
                                <option value="B_NEGATIF">B-</option>
                                <option value="AB_POSITIF">AB+</option>
                                <option value="AB_NEGATIF">AB-</option>
                                <option value="O_POSITIF">O+</option>
                                <option value="O_NEGATIF">O-</option>
                            </select>
                            {errors.groupeSanguin && <p className="mt-1 text-sm text-red-600">{errors.groupeSanguin}</p>}
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Modifier
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-400 transition"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdatePatient;