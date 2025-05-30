import React, { useState } from 'react';
import imglogin from "../../images/imgloginpage.png";
import logologin from "../../images/loginlogo.png";
import { Avatar } from '@mui/material';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useEffect } from "react";


const LoginPage = () => {
    const [theme, setTheme] = useState("light");

    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Simulation de vérification des identifiants
            // En réalité, vous feriez une requête API ici
            if (formData.username === "admin" && formData.password === "password") {
                // setShowModal(true);
                // Redirection après 2 secondes (pour voir le message de succès)
                setTimeout(() => {
                    navigate('/home'); // Redirection vers la page d'accueil
                }, 1000);
            } else {
                setErrors({
                    username: 'Invalid credentials',
                    password: 'Invalid credentials'
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer l'erreur quand l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <button onClick={toggleTheme} className="btn btn-primary fixed top-4 right-4 z-50">
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            {/* Titre fixe en haut */}
            <div className="bg-blue-800 w-full py-3 text-white font-bold text-center sticky top-0 z-10">
                <h1>Login here</h1>
            </div>


            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto h-full w-full">
                <section className="flex flex-col md:flex-row h-full">
                    {/* Partie formulaire */}
                    <div className="w-full md:w-1/2 flex justify-center items-start p-4">
                        <form onSubmit={handleSubmit} className="w-full max-w-md my-8">
                            <div className="flex justify-center items-center mb-4">
                                <Avatar src={logologin} sx={{ width: 100, height: 100 }} />
                            </div>

                            <label className="block w-full text-gray-700 mb-1 font-bold">Username</label>
                            <input
                                name="username"
                                type="text"
                                className={`mb-1 h-10 border-2 ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {errors.username && <p className="text-red-500 text-sm mb-3">{errors.username}</p>}

                            <label className="block w-full text-gray-700 mb-1 font-bold mt-6">Password</label>
                            <input
                                name="password"
                                type="password"
                                className={`mb-1 h-10 border-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="text-red-500 text-sm mb-3">{errors.password}</p>}

                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition-colors mt-4">
                                Login
                            </button>

                            <div className="text-black mt-5">
                                <p>
                                    Don't you have an account? <Link to="/signup" className="text-blue-600">Create account</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Partie image */}
                    <div className="hidden md:block md:w-1/2 bg-gray-100 h-full">
                        <img src={imglogin} alt="Login" className="h-full w-full object-cover" />
                    </div>
                </section>
            </div>

            {/* Modal - Version React contrôlée */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-4">Connexion réussie !</h3>
                        <p className="mb-6">Bienvenue, {formData.username}!</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;