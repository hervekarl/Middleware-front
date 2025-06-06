import React, { useEffect, useState } from "react";
import axios from "axios";
import GetPatients from "./GetPatients";


const HomePatient = () => {
    
    return (
        <div className="p-4">
           <GetPatients />
            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold">Bienvenue sur la page d'accueil des patients</h1>
                <p className="mt-4 text-gray-600">Ici, vous pouvez consulter les informations de vos patients.</p>
            </div>
        </div>
    );
};

export default HomePatient;