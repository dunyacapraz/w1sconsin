import styled from 'styled-components';
// Mevcut LoginPage stillerini temel alabiliriz
import {
  FormGroup as OriginalFormGroup,
  Input as OriginalInput,
  LoginButton as OriginalLoginButton,
  ErrorMessage as OriginalErrorMessage
} from '../../pages/LoginPage/styles';

export const ModalOverlay = styled.div`
  position: fixed; /* Sayfayı kaplar */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65); /* Yarı saydam arka plan */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* Diğer elemanların üzerinde olmalı */
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

export const ModalContent = styled.div`
  background: var(--card-bg, #1F1C2E); /* Koyu tema için uygun bir renk */
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--card-border, rgba(108, 92, 231, 0.1));
  width: 90%;
  max-width: 420px; /* Modal için uygun bir genişlik */
  position: relative; /* Kapatma butonu için */
  text-align: center;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-20px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;

  h2 {
    color: var(--primary-light,rgba(255, 255, 255, 0.49)); /* Başlık rengi */
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
  }

   @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    max-width: 95%;
     h2 {
       font-size: 1.6rem;
     }
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 2.2rem; /* Biraz daha büyük */
  color: var(--text-light, rgba(220, 209, 245, 0.7));
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text, #DCD1F5);
  }
`;

// LoginPage'den stilleri yeniden kullanma veya uyarlama
export const FormGroup = styled(OriginalFormGroup)``;
export const Input = styled(OriginalInput)``;
export const LoginButton = styled(OriginalLoginButton)`
  width: 100%; /* Modal içinde tam genişlik yapabiliriz */
  margin-top: 1rem;
`;
export const ErrorMessage = styled(OriginalErrorMessage)``;