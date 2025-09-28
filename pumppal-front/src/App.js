// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';

export default function App() {
 const [token, setToken] = useState(sessionStorage.getItem('token'));

  useEffect(() => {
    // check sessionStorage every second
    const interval = setInterval(() => {
      const newToken = sessionStorage.getItem('token');
      setToken(newToken);
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}