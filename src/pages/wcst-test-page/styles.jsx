import styled, { keyframes } from "styled-components";
import { NavLink } from "react-router-dom";

// Animasyonlar
const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Ana container
export const WcstWindow = styled.div`
  min-height: 95vh;
  margin: auto;
  color: white;
  border-radius: var(--border-radius);
  background: var(--test-zone);
  padding: 1rem;
  box-sizing: border-box;

  @media screen and (max-width: 700px) {
    font-size: var(--font-s);
    padding: 0.5rem;
  }
`;

export const CompletedOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: 70vh;
`;

// Target kartları için container
export const TargetCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem;

  @media screen and (max-width: 700px) {
    gap: 0.5rem;
    padding: 0.5rem;
    
    > div {
      flex: 1 0 calc(50% - 1rem);
      min-width: calc(50% - 1rem);
      max-width: calc(50% - 1rem);
      display: flex;
      justify-content: center;
    }
  }

  @media screen and (max-width: 400px) {
    > div {
      flex: 1 0 calc(100% - 1rem);
      min-width: calc(100% - 1rem);
      max-width: calc(100% - 1rem);
    }
  }
`;

// Response kartı container
export const ResponseCards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  @media screen and (max-width: 700px) {
    padding: 0.5rem;
  }
`;

// Kart bileşeni için temel stil
export const Card = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Bilgisayar boyutları */
  height: var(--card-l);
  width: var(--card-l);
  margin: 1rem;

  @media screen and (max-width: 1000px) {
    height: var(--card-s);
    width: var(--card-s);
    margin: 0.5rem;
  }

  @media screen and (max-width: 700px) {
    height: auto;
    aspect-ratio: 1/1;
    width: 100%;
    margin: 0.25rem;
  }
`;

// Uyarı mesajları
export const Warning = styled.div`
  margin: 1rem 0;
  font-size: var(--font-l);
  text-align: center;
  opacity: 0;
  animation: ${slideUp} 0.5s ease-out forwards;

  @media screen and (max-width: 700px) {
    font-size: var(--font-m);
    margin: 0.5rem 0;
  }
`;

export const WarningButton = styled.div`
  font-size: var(--font-l);
  text-align: center;
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${slideUp} 0.5s ease-out forwards;

  @media screen and (max-width: 700px) {
    font-size: var(--font-m);
    position: static;
    margin-top: 1rem;
  }
`;

// Butonlar
export const Button = styled.button`
  font-size: var(--font-l);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  border: none;
  background-color: #6200ea;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  margin: 1rem auto;

  @media screen and (max-width: 700px) {
    font-size: var(--font-m);
    padding: 0.6rem 1.2rem;
    max-width: 200px;
    margin-top: 1rem;
  }

  &:hover {
    background-color: #3700b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Başlangıç ekranı
export const Start = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;

  div {
    text-align: center;
    width: 100%;
  }

  @media screen and (max-width: 700px) {
    height: auto;
    padding: 2rem 0;
  }
`;

// NavLink butonu
export const NavLinkButton = styled(NavLink)`
  display: inline-block;
  text-decoration: none;
  width: auto;

  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;

// Yükleniyor spinner
export const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--text-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media screen and (max-width: 700px) {
    width: 30px;
    height: 30px;
    border-width: 3px;
  }
`;

// Sonuç container
export const ResultContainer = styled.div`
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  margin: 1rem 0;

  @media screen and (max-width: 700px) {
    padding: 1rem;
  }
`;

// Başlangıç metni
export const StartText = styled.div`
  font-size: var(--font-l);
  color: #ff9800;
  margin-bottom: 1.5rem;
  font-weight: bold;

  @media screen and (max-width: 700px) {
    font-size: var(--font-m);
    margin-bottom: 1rem;
  }
`;