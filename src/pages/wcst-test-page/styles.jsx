import styled, { keyframes } from "styled-components";
import { NavLink } from "react-router-dom";

// Aşağıdan yukarı animasyon
const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 3;
  }
`;

// Genel WCST penceresi stili
export const WcstWindow = styled.div`
  min-height: 95vh;
  margin: auto;
  color: white;
  border-radius: var(--border-radius);
  background: var(--test-zone);

  @media screen and (max-width: 700px) {
    font-size: var(--font-s);
    padding: 10px;
  }
`;

// Kartlar için genel stil
export const TargetCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media screen and (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ResponseCards = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;

  @media screen and (max-width: 700px) {
    margin-top: 1rem;
    padding: 0.5rem;
  }
`;

// Uyarı mesajı için stil (animasyonlu)
export const Warning = styled.div`
  position: relative;
  top: 1rem;
  margin-bottom: 1rem;
  font-size: var(--font-xl);
  text-align: center;
  opacity: 0;
  animation: ${slideUp} 0.5s ease-out forwards;

  @media screen and (max-width: 1000px) {
    top: 0.5rem;
    font-size: var(--font-s);
  }

  @media screen and (max-width: 700px) {
    font-size: var(--font-xs);
  }
`;

export const WarningButton = styled.div`
  position: relative;
  top: 23rem;
  margin-bottom: 1rem;
  font-size: var(--font-xl);
  text-align: center;
  opacity: 0;
  animation: ${slideUp} 0.5s ease-out forwards;

  @media screen and (max-width: 1000px) {
    top: 0.5rem;
    font-size: var(--font-s);
  }

  @media screen and (max-width: 700px) {
    font-size: var(--font-xs);
  }
`;

// NavLink buton stili
export const NavLinkButton = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin-top: 2rem;
  width: 100%;
  height: auto;

  @media screen and (max-width: 700px) {
    width: auto;
  }
`;

// Başlangıç butonu ve konumlandırma
export const Start = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    text-align: center;
  }

  img {
    width: 600px;
    margin: auto;

    @media screen and (max-width: 700px) {
      width: 235px;
    }
  }
`;

// Modern buton stili
export const Button = styled.button`
  font-size: var(--font-l);
  color: white;
  margin-top: 400px;
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  background-color: #6200ea;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  transition: all 0.3s ease-in-out;

  @media screen and (max-width: 700px) {
    padding: 10px 20px;
    font-size: var(--font-s);
    margin-top: 250px;
  }

  &:hover {
    background-color: #3700b3;
    color: white;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #03dac5;
    color: #3700b3;
    transform: translateY(0);
  }

  &:focus {
    outline: none;
  }
`;

// Yükleniyor simgesi
export const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--text-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media screen and (max-width: 700px) {
    width: 30px;
    height: 30px;
  }
`;

// Sonuçlar için stil
export const ResultContainer = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  margin-top: 2rem;
  text-align: center;

  @media screen and (max-width: 700px) {
    padding: 1rem;
  }
`;

// Başlangıç metni ve buton stili
export const StartText = styled.div`
  font-size: var(--font-l);
  color: #ff9800;
  margin-bottom: 10px;
  font-weight: bold;

  @media screen and (max-width: 700px) {
    font-size: var(--font-s);
  }
`;
