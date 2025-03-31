import styled, { keyframes } from "styled-components";
import { NavLink } from "react-router-dom";

// Animasyon
const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Ana Container
export const WcstWindow = styled.div`
  min-height: 95vh;
  margin: auto;
  color: white;
  background: var(--test-zone);
  padding: 1rem;
  box-sizing: border-box;
`;

// Target Kartları Container
export const TargetCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;

  @media screen and (max-width: 700px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    padding: 0.5rem;
    width: 100%;
    
    > div {
      display: flex;
      justify-content: center;
    }
  }
`;

// Kart Stili
export const Card = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Bilgisayar */
  height: var(--card-l);
  width: var(--card-l);
  margin: 0.5rem;

  /* Mobil */
  @media screen and (max-width: 700px) {
    height: auto;
    aspect-ratio: 1/1;
    width: 100%;
    margin: 0;
  }
`;

// Diğer stiller aynı kalabilir
export const ResponseCards = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

export const Warning = styled.div`
  font-size: var(--font-l);
  text-align: center;
  margin: 1rem 0;
`;

export const Button = styled.button`
  font-size: var(--font-l);
  padding: 12px 24px;
  border-radius: 50px;
  background-color: #6200ea;
  color: white;
  border: none;
  cursor: pointer;
  margin: 1rem auto;
  display: block;
`;