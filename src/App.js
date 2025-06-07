import './App.css';
import LoginPage from './components/loginpage/login';
import SignUp from './components/loginpage/signup';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/pages/home';
import ProtectedRoute from './components/loginpage/Protected';
import { useState } from 'react';
import GetPatients from './components/Patient/GetPatients';
import axios from 'axios';
import HomePatient from './components/Patient/HomePatient';
import Apatient from './components/Patient/Apatient';
import SavePatient from './components/Patient/SavePAtient';
import Logout from './components/loginpage/Logout';
import UpdatePatient from './components/Patient/UpdatePatient';
import HomePersonnel from './components/Personnels/HomePersonnel';
import Apersonnel from './components/Personnels/Apersonnel';
import SavePersonnel from './components/Personnels/SavePersonnel';
import UpdatePersonnel from './components/Personnels/UpdatePersonnel';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Vérifie si un token existe au chargement
    return !!localStorage.getItem('authToken');
  });

  // Configuration de l'intercepteur axios
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Route racine */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        
        {/* Route patient */}
        <Route path="/patient" element={<GetPatients />} />
        
        {/* Routes protégées */}
        {/* <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}> */}

        {/* patients  */}

          <Route path="/home" element={<HomePage onLogout={handleLogout} />} />
          <Route path="/patient" element={<HomePatient onLogin={handleLogin} />} />
          <Route path="/patient/:id" element={<Apatient onLogin={handleLogin}/>} />
          <Route path="/patient/create" element={<SavePatient onLogin={handleLogin} />} />
          <Route path="/patient/edit/:id" element={<UpdatePatient onLogin={handleLogin} />} />
          <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />

          {/* personnels */}

          <Route path="/personnels" element={<HomePersonnel onLogin={handleLogin} />} />
          <Route path="/personnels/:id" element={<Apersonnel onLogin={handleLogin}/>} />
          <Route path="/personnels/create" element={<SavePersonnel onLogin={handleLogin} />} />
          <Route path="/personnels/edit/:id" element={<UpdatePersonnel onLogin={handleLogin} />} />


        {/* </Route> */}
        
        {/* Route inscription */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;