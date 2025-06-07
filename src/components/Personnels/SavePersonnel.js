import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SavePersonnel = () => {
    const [personnelData, setPersonnelData] = useState({
        nom: "",
        prenom: "",
        sexe: "",
        dateNaissance: "",
        adresse: "",
        telephone: "",
        email: "",
        dateEmbauche: ""
    });
    const [errors, setErrors] = useState({});
    const [dialog, setDialog] = useState({ open: false, message: "", type: "" });
    const navigate = useNavigate();

    // Convertit jj/mm/aaaa en aaaa-mm-jj
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

    const validateForm = () => {
        const newErrors = {};
        if (!personnelData.nom.trim()) newErrors.nom = "Nom requis";
        if (!personnelData.prenom.trim()) newErrors.prenom = "Prénom requis";
        if (!personnelData.sexe) newErrors.sexe = "Sexe requis";
        if (!personnelData.telephone.trim()) newErrors.telephone = "Téléphone requis";
        if (!personnelData.adresse.trim()) newErrors.adresse = "Adresse requise";
        if (!personnelData.dateNaissance) newErrors.dateNaissance = "Date de naissance requise";
        if (!personnelData.dateEmbauche) newErrors.dateEmbauche = "Date d'embauche requise";
        if (!personnelData.email.trim()) {
            newErrors.email = "Email requis";
        } else if (!/^\S+@\S+\.\S+$/.test(personnelData.email)) {
            newErrors.email = "Email invalide";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonnelData((prev) => ({
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
                ...personnelData,
                dateNaissance: convertDateFormat(personnelData.dateNaissance),
                dateEmbauche: convertDateFormat(personnelData.dateEmbauche)
            };
            await axios.post("http://192.168.1.186:8080/rh/employe/create", dataToSend, {
                headers: { 'Content-Type': 'application/json' }
            });
            setDialog({
                open: true,
                message: "Personnel enregistré avec succès !",
                type: "success"
            });
        } catch (error) {
            setDialog({
                open: true,
                message: error.response?.data?.message || "Erreur lors de l'enregistrement",
                type: "error"
            });
        }
    };

    const handleReset = () => {
        setPersonnelData({
            nom: "",
            prenom: "",
            sexe: "",
            dateNaissance: "",
            adresse: "",
            telephone: "",
            email: "",
            dateEmbauche: ""
        });
        setErrors({});
    };

    const closeDialog = () => {
        setDialog({ open: false, message: "", type: "" });
        if (dialog.type === "success") {
            navigate("/personnels");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
                <h2 className="text-2xl font-bold mb-6 text-center">Enregistrer un personnel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                        <input
                            name="nom"
                            value={personnelData.nom}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.nom ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom*</label>
                        <input
                            name="prenom"
                            value={personnelData.prenom}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.prenom ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sexe*</label>
                        <select
                            name="sexe"
                            value={personnelData.sexe}
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
                            name="dateNaissance"
                            value={personnelData.dateNaissance}
                            onChange={handleChange}
                            placeholder="jj/mm/aaaa"
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.dateNaissance ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.dateNaissance && <p className="mt-1 text-sm text-red-600">{errors.dateNaissance}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse*</label>
                        <input
                            name="adresse"
                            value={personnelData.adresse}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.adresse ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone*</label>
                        <input
                            name="telephone"
                            value={personnelData.telephone}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.telephone ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={personnelData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche*</label>
                        <input
                            type="text"
                            name="dateEmbauche"
                            value={personnelData.dateEmbauche}
                            onChange={handleChange}
                            placeholder="jj/mm/aaaa"
                            className={`w-full px-3 py-2 border rounded-md ${
                                errors.dateEmbauche ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.dateEmbauche && <p className="mt-1 text-sm text-red-600">{errors.dateEmbauche}</p>}
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

export default SavePersonnel;