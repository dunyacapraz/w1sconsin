// src/pages/LoginPage/styles.jsx (Örnek Stiller)
import styled from "styled-components";

export const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; // Ekranı kaplaması için
  padding: 2rem;
`;

export const LoginForm = styled.form`
  background: var(--card-bg, #1a1b26); // Değişken veya varsayılan renk
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--card-border, rgba(108, 92, 231, 0.1));
  width: 100%;
  max-width: 400px;
  text-align: center;

  h2 {
    color: var(--primary-light, #8477e6);
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-light, rgba(230, 230, 250, 0.7));
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1.1rem;
  border-radius: 8px;
  background: var(--input-bg, rgba(108, 92, 231, 0.05));
  border: 1px solid var(--card-border, rgba(108, 92, 231, 0.1));
  color: var(--text, #e6e6fa);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary, #6c5ce7);
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
    background: var(--card-bg, #1a1b26);
  }

   &::placeholder {
    color: var(--text-light, rgba(230, 230, 250, 0.7));
    opacity: 0.5;
  }
`;

export const LoginButton = styled.button`
  /* Temel Stil */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: min(90%, 200px);
  padding: 14px 24px;
  margin: 20px 20px auto;
  position: relative; /* Shine efekti için gerekli */
  overflow: hidden; /* Fazla taşan efektleri keser */
  
  /* Gradient Arkaplan */
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 1) 0%,
    rgba(79, 70, 229, 1) 100%
  );
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.15);

  /* Hover Efekti */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.9) 0%,
      rgba(79, 70, 229, 0.9) 100%
    );

    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -60%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: rotate(30deg);
      animation: shine 1.5s infinite;
    }
  }

  /* Aktif Durum */
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(79, 70, 229, 0.3);
    transition: all 0.1s ease;
  }

  /* Shine Animasyonu */
  @keyframes shine {
    0% { left: -60%; }
    20% { left: 100%; }
    100% { left: 100%; }
  }

  /* Mobil Uyumluluk */
  @media (max-width: 768px) {
    padding: 12px 20px;
    margin: 15px auto;
    width: 85%;

    &:hover {
      transform: none;
      box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
    }
  }
`;

export const ErrorMessage = styled.p`
  color: #e74c3c; // Kırmızı renk
  background-color: rgba(231, 76, 60, 0.1);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;