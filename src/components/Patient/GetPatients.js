import React, { useEffect, useState } from "react";
import axios from "axios";

const fallbackAvatar = (name) => (
    <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-24 h-24 text-4xl font-bold">
        {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
);

const PatientCard = ({ patient }) => (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <div className="flex items-center px-6 py-4">
            {patient.image ? (
                <img
                    src={patient.image}
                    alt={patient.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
                />
            ) : (
                fallbackAvatar(patient.name)
            )}
            <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {patient.name} {patient.lastname}
                </h2>
                <p className="text-gray-600 mt-1">Téléphone: {patient.tel}</p>
                <p className="text-gray-600 mt-1">Adresse: {patient.adresse}</p>
                <p className="text-gray-600 mt-1">Groupe sanguin: {patient.groupesanguin}</p>
            </div>
        </div>
    </div>
);

const GetPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/patient")
            .then((response) => {
                const data = response.data;
                setPatients(Array.isArray(data) ? data : [data]);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des patients:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    return (
        <div className="p-4">
            {patients.length === 0 ? (
                <div className="text-center text-gray-500">Aucun patient trouvé.</div>
            ) : (
                patients.map((patient, idx) => (
                    <PatientCard key={patient.idPat || idx} patient={patient} />
                ))
            )}
        </div>
    );
};

export default GetPatients;