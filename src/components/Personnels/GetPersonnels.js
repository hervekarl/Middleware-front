import React, { useEffect, useState } from "react";
import axios from "axios";

const fallbackAvatar = (name) => (
    <div className="flex items-center justify-center bg-green-500 text-white rounded-full w-24 h-24 text-4xl font-bold">
        {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
);

const EmployeCard = ({ employe }) => (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <div className="flex items-center px-6 py-4">
            {employe.image ? (
                <img
                    src={employe.image}
                    alt={employe.nom}
                    className="w-24 h-24 rounded-full object-cover border-2 border-green-400"
                />
            ) : (
                fallbackAvatar(employe.nom)
            )}
            <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {employe.nom} {employe.prenom}
                </h2>
                <p className="text-gray-600 mt-1">Adresse: {employe.adresse}</p>
                <p className="text-gray-600 mt-1">Téléphone: {employe.telephone}</p>
                <p className="text-gray-600 mt-1">Sexe: {employe.sexe}</p>
            </div>
        </div>
    </div>
);

const GetPersonnels = () => {
    const [employes, setEmployes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://192.168.1.186:8080/rh/emplye")
            .then((response) => {
                const data = response.data;
                setEmployes(Array.isArray(data) ? data : [data]);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des employés:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    return (
        <div className="p-4">
            {employes.length === 0 ? (
                <div className="text-center text-gray-500">Aucun employé trouvé.</div>
            ) : (
                employes.map((employe, idx) => (
                    <EmployeCard key={employe.id || idx} employe={employe} />
                ))
            )}
        </div>
    );
};

export default GetPersonnels;