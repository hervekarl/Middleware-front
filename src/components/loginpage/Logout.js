import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = () => {
            // Supprime le token
            localStorage.removeItem('authToken');
            // Supprime aussi la date d'expiration
            localStorage.removeItem('tokenExpiration');
            // Met à jour l'état d'authentification
            if (setIsAuthenticated) setIsAuthenticated(false);
            // Redirige vers la page de login
            navigate('/login');
        };

        handleLogout();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold">Logging out...</h1>
        </div>
    );
};

export default Logout;