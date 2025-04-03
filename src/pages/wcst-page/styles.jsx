import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Div = styled.div`
  height: 100%;
  max-width: 1000px;
  margin: auto;
  margin-bottom: 3rem;

  @media screen and (max-width: 700px) {
    font-size: var(--font-s);
  }
`;

export const RunBox = styled.div`
  display: flex;
  flex-direction: column; /* Butonları dikey hizalamak için */
  max-width: 200px;
  margin: auto;
  margin-top: 1rem;
  align-items: center;
  gap: 10px; /* Butonlar arası boşluk */
`;

export const Image = styled.img`
  width: 600px;
  margin: auto;
  opacity: 0.7;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  &:hover {
    opacity: 1;
    transition: var(--transition);
  }
`;

export const RunLink = styled(NavLink)`
  display: flex;
  justify-content: center;
  width: 100%; /* Butonların genişliğini tam kaplaması için */
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #7b68ee 0%, #6a5acd 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    transform: rotate(45deg);
    transition: all 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(123, 104, 238, 0.25);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(123, 104, 238, 0.25);
  }

  &:disabled {
    background: #4a4866;
    color: rgba(255, 255, 255, 0.6);
    cursor: not-allowed;
    opacity: 0.8;
  }

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  @media screen and (max-width: 700px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

/* Yeni eklenen Debug butonu stilleri */
export const DebugButton = styled(Button)`
  background-color: #6a5acd;
  border-color: #6a5acd;
  color: white;

  &:hover {
    background-color: #7b68ee;
    border-color: #7b68ee;
    color: white;
  }
`;

/* Responsive düzenlemeler */
export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
`;