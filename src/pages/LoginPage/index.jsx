// src/pages/LoginPage/index.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // AuthContext'ten hook'u import et
import { useNavigate } from 'react-router-dom';
import * as S from './styles';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // login fonksiyonunu context'ten al
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Formun varsayılan gönderimini engelle
    setError(''); // Önceki hataları temizle

    const success = login(username, password); // login fonksiyonunu çağır

    if (!success) {
      setError('Geçersiz kullanıcı adı veya şifre.');
    }
    // Başarılıysa yönlendirme login fonksiyonu içinde yapılıyor
  };

  return (
    <S.LoginPageContainer>
      <S.LoginForm onSubmit={handleSubmit}>
        <h2>Admin Girişi</h2>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        <S.FormGroup>
          <label htmlFor="username">Kullanıcı Adı:</label>
          <S.Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="admin" // İpucu
          />
        </S.FormGroup>
        <S.FormGroup>
          <label htmlFor="password">Şifre:</label>
          <S.Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="password123" // İpucu (Güvenlik için gerçek şifreyi göstermeyin)
          />
        </S.FormGroup>
        <S.LoginButton type="submit">Giriş Yap</S.LoginButton>
      </S.LoginForm>
    </S.LoginPageContainer>
  );
}

export default LoginPage;