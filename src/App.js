import './App.css';
import LoginPage from './components/loginpage/login';
import SignUp from './components/loginpage/signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeToggle from './components/Theme/darkLight';
import HomePage from './components/pages/home';

function App() {
  // Détermine si on est en production (GitHub Pages)
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <Router >
      <Routes>
        {/* Route racine */}
        <Route path="" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Route /signup */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;