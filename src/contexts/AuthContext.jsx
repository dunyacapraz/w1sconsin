// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // import kalsın


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); // <--- HOOK'U TEKRAR BURAYA ALIN

  const login = (username, password) => {
    // const navigate = useNavigate(); // <-- Buradan silin
    const ADMIN_USERNAME = 'betulhoca';
    const ADMIN_PASSWORD = 'betbah';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      console.log('Admin girişi başarılı!');
      navigate('/anasayfa');
      return true;
    } else {
      console.error('Geçersiz kullanıcı adı veya şifre.');
      setIsAdmin(false);
      return false;
    }
  };

  const logout = () => {
    // const navigate = useNavigate(); // <-- Buradan silin
    setIsAdmin(false);
    console.log('Çıkış yapıldı.');
    navigate('/anasayfa'); // <--- DEĞİŞİKLİK BURADA
  };

  const value = {
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};