import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SavePatient = () => {
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
    const [errors, setErrors] = useState({});
    const [dialog, setDialog] = useState({ open: false, message: "", type: "" });
    const navigate = useNavigate();

    // Fonction pour convertir la date de jj/mm/aaaa en aaaa-mm-jj
    const convertDateFormat = (dateString) => {
        if (!dateString) return "";
        
        // Si le format est déjà en aaaa-mm-jj (input type="date")
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        
        // Conversion depuis jj/mm/aaaa
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateString; // Retourne la valeur originale si le format n'est pas reconnu
    };

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
        // Clear error when user starts typing
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
            // Créer une copie des données et convertir la date
            const dataToSend = {
                ...patientData,
                dateN: convertDateFormat(patientData.dateN)
            };

            await axios.post("http://192.168.1.186:8080/patient/create", dataToSend, {
                headers: {'Content-Type': 'application/json'}
            });
            
            setDialog({
                open: true,
                message: "Patient enregistré avec succès !",
                type: "success"
            });
            
        } catch (error) {
            console.error("Erreur:", error);
            setDialog({
                open: true,
                message: error.response?.data?.message || "Erreur lors de l'enregistrement",
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
            navigate("/patients");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Success/Error Dialog */}
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

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-2xl"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Enregistrer un patient</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nom Field */}
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

                    {/* Prénom Field */}
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

                    {/* Téléphone Field */}
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

                    {/* Adresse Field */}
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

                    {/* Sexe Field */}
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

                    {/* Date de naissance Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance*</label>
                        <input
                            type="text"  // Changé de type="date" à type="text"
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

                    {/* Email Field */}
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

                    {/* Groupe Sanguin Field */}
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
                        Enregistrer
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
        </div>
    );
};

export default SavePatient;