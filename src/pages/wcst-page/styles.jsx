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
  font-size: var(--font-m);
  color: var(--text-color);
  margin-top: 2%;
  padding: 5px;
  border-radius: var(--border-radius);
  border: solid 1px;
  width: 100%; /* Buton genişliği */
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--text-color);
    color: var(--sidebar-color);
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