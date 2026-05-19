import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider'
import Login from './component/auth-page/login'
import Register from './component/auth-page/register';
import Home from './component/home';
import Profile from './component/auth-page/profile'
import Verification from './component/auth-page/verification';
import Cards from './component/cards';

import './App.css'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/cards" element={<Cards />} />   
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
