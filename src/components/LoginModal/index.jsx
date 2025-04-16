import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as S from './styles';

function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // login fonksiyonunu context'ten al

  // Modal açıldığında input'u temizle ve hatayı sıfırla
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Önceki hataları temizle

    const success = login(username, password); // login fonksiyonunu çağır

    if (!success) {
      setError('Geçersiz kullanıcı adı veya şifre.');
    }
    // Başarılıysa login fonksiyonu zaten modalı kapatacak (bir sonraki adımda eklenecek)
  };

  // Modal kapalıysa render etme (performans için)
//   if (!isOpen) { // Bu kontrol yerine S.ModalOverlay'deki visibility/opacity kullanılıyor
//     return null;
//   }

  const handleOverlayClick = (e) => {
    // Eğer tıklama overlay üzerinde (modal content dışında) ise kapat
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  return (
    // isOpen prop'unu styled component'e geçiyoruz
    <S.ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      {/* Modal içeriğine tıklanınca kapanmasını engelle */}
      <S.ModalContent isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label="Kapat">&times;</S.CloseButton>
        <h2>Admin Girişi</h2>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <S.FormGroup>
            <label htmlFor="modal-username">Kullanıcı Adı:</label>
            <S.Input
              type="text"
              id="modal-username" // Farklı id
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin" // İpucu
              autoFocus // Modal açılınca odaklansın
            />
          </S.FormGroup>
          <S.FormGroup>
            <label htmlFor="modal-password">Şifre:</label>
            <S.Input
              type="password"
              id="modal-password" // Farklı id
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********" // Şifreyi gösterme
            />
          </S.FormGroup>
          <S.LoginButton type="submit">Giriş Yap</S.LoginButton>
        </form>
      </S.ModalContent>
    </S.ModalOverlay>
  );
}

export default LoginModal;