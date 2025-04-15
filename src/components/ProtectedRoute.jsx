// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    // Kullanıcı admin değilse, giriş sayfasına yönlendir
    // Yönlendirme sırasında mevcut konumu state olarak saklayabiliriz (isteğe bağlı)
    // <Navigate to="/login" replace state={{ from: location }} />
    console.log('Yetkisiz erişim denemesi, giriş sayfasına yönlendiriliyor.');
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı admin ise, istenen içeriği (children veya Outlet) göster
  return children ? children : <Outlet />;
};

export default ProtectedRoute;