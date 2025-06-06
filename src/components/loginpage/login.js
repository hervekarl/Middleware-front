import React, { useState } from 'react';
import imglogin from "../../images/imgloginpage.png";
import logologin from "../../images/loginlogo.png";
import { Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [theme, setTheme] = useState("light");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

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
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
        const response = await axios.post(
            'http://192.168.1.186:8004/auth/login', 
            {
                username: formData.username,
                password: formData.password
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );

        console.log('Login response:', response.data); // Debug log

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            console.log('Token stored:', localStorage.getItem('authToken')); // Debug log
            localStorage.setItem('tokenExpiration', Date.now() + response.data.expiresIn);
            
            // Vérifiez que la navigation est déclenchée
            console.log('Navigating to /home'); // Debug log
            navigate('/home', { replace: true }); // Utilisez replace pour empêcher le retour
        }
    } catch (error) {
        console.error('Login error:', error);
        setLoginError(
            error.response?.data?.message || 
            error.response?.data?.error || 
            'Login failed. Please try again.'
        );
    } finally {
        setIsLoading(false);
    }
};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <button onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
                className="btn btn-primary fixed top-4 right-4 z-50">
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>

            <div className="bg-blue-800 w-full py-3 text-white font-bold text-center sticky top-0 z-10">
                <h1>Login here</h1>
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full">
                <section className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-1/2 flex justify-center items-start p-4">
                        <form onSubmit={handleSubmit} className="w-full max-w-md my-8">
                            <div className="flex justify-center items-center mb-4">
                                <Avatar src={logologin} sx={{ width: 100, height: 100 }} />
                            </div>

                            {loginError && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                    {loginError}
                                </div>
                            )}

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

                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition-colors mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="text-black mt-5">
                                <p>
                                    Don't you have an account? <Link to="/signup" className="text-blue-600">Create account</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="hidden md:block md:w-1/2 bg-gray-100 h-full">
                        <img src={imglogin} alt="Login" className="h-full w-full object-cover" />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default LoginPage;