import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import NavMenu from './components/NavMenu';
import Auth from './pages/Auth';
import AboutUs from './pages/AboutUs';
import MyChats from './pages/MyChats';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));

  useEffect(() => {
    const id = setInterval(() => {
      setToken(sessionStorage.getItem('token'));
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <BrowserRouter>
      {token && <NavMenu />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* optional extras */}
        <Route path="/about" element={token ? <AboutUs /> : <Navigate to="/" replace />} />
        <Route path="/chats" element={token ? <MyChats /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
