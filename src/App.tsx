import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UserPage from './components/UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/user' element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
