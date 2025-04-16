// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    const storedIsAdmin = localStorage.getItem('isAdmin');
    return storedIsAdmin === 'true';
  });
  // ---> YENİ STATE: Modal'ın görünürlük durumu <---
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  // ---> YENİ FONKSİYONLAR: Modal'ı açma/kapama <---
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);


  const login = (username, password) => {
    const ADMIN_USERNAME = 'betulhoca';
    const ADMIN_PASSWORD = 'betbah';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      console.log('Admin girişi başarılı ve localStorage güncellendi!');
      closeLoginModal(); // ---> Başarılı girişte modalı kapat <---
      // navigate('/anasayfa'); // Modal'dan sonra yönlendirmeye gerek olmayabilir, kullanıcı zaten sayfadadır.
      return true;
    } else {
      console.error('Geçersiz kullanıcı adı veya şifre.');
      setIsAdmin(false);
      localStorage.removeItem('isAdmin');
      // Hatalı girişte modal açık kalır, hata mesajı gösterilir.
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    console.log('Çıkış yapıldı ve localStorage temizlendi.');
    // Çıkış yapınca modal açık kalmamalı (genelde gerekmez ama kontrol)
    closeLoginModal();
    navigate('/anasayfa');
  };

  // localStorage dinleyicisi (aynı kalır)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'isAdmin') {
        setIsAdmin(event.newValue === 'true');
        // Eğer başka sekmede çıkış yapıldıysa ve modal açıksa kapat
        if (event.newValue !== 'true') {
           closeLoginModal();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const value = {
    isAdmin,
    login,
    logout,
    // ---> Context değerine modal state ve fonksiyonlarını ekle <---
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};