import React, { useState } from 'react';
import createimg from "../../images/create.png";
import { Avatar } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        birthDate: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const phoneRegex = /^(?:\+|00)\s?[1-9]\d{6,14}$/;

        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'First name is required';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
        else if (formData.phone.length < 6) newErrors.phone = 'Phone number must be at least 6 digits';
        else if (formData.phone.length > 15) newErrors.phone = 'Phone number must be at most 15 digits';
        if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8004/auth/signup', formData);
            setShowSuccessModal(true);
            handleReset();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred during registration');
            setShowErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            lastname: '',
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            phone: '',
            birthDate: '',
            acceptTerms: false
        });
        setErrors({});
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 w-full object-cover">
            {/* Header */}
            <div className="bg-blue-600 w-full py-3 text-white font-bold text-center sticky top-0 z-10 shadow-md">
                <h1 className="text-xl">Create Account</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto h-full w-full">
                <section className="flex flex-col md:flex-row h-full">
                    {/* Form Section */}
                    <div className="w-full md:w-1/2 flex justify-center items-start p-4 object-cover  h-full">
                        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-5 rounded-lg h-full">
                            <div className="flex justify-center items-center mb-6">
                                <Avatar
                                    src={createimg}
                                    sx={{ width: 100, height: 100 }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.lastname ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                            placeholder="Enter your last name"
                                        />
                                        {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
                                    </div>
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">First Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                            placeholder="Enter your first name"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                            placeholder="Enter your username"
                                        />
                                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                                    </div>
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                            placeholder="Enter your email"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">Birth Date</label>
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.birthDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                        />
                                        {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                                    </div>
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                            placeholder="Enter your password"
                                        />
                                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                            placeholder="Confirm your password"
                                        />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                    <div>
                                        <label className="block w-full text-gray-700 mb-1 font-bold">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`h-10 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 w-full`}
                                            placeholder="Enter your phone number"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-gray-700">I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a></span>
                                </label>
                                {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
                            </div>

                            {/* Buttons */}
                            <div className='flex gap-4 justify-between pt-8'>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : 'Submit'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition-colors"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/" className="text-blue-600 hover:underline">
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Image Section */}
                    <div className="hidden md:block md:w-1/2 bg-gray-100 h-full">
                        <img
                            src={createimg}
                            alt="Sign up illustration"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </section>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-4 text-green-600">Success!</h3>
                        <p className="mb-6">Your account has been created successfully.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-4 text-red-600">Error</h3>
                        <p className="mb-6">{errorMessage}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;