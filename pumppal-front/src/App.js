import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import NavMenu from './components/NavMenu';
import Auth from './pages/Auth';
import AboutUs from './pages/AboutUs';

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
        {/* optional extras */}
        <Route path="/about" element={token ? <AboutUs /> : <Navigate to="/" replace />} />
        <Route path="/chats" element={token ? <div /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
