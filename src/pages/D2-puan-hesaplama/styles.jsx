import styled from 'styled-components';

export const AppContainer = styled.div`
  padding: 40px 60px;
  min-height: 100vh;
  background-color: #0A0E14;
  color: #E6EDF3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 20px 30px;
  }
`;

export const TitleContainer = styled.div`
  text-align: center;
  margin-top: -135px;

  @media (max-width: 768px) {
    margin-top: -100px;
  }
`;

export const InputContainer = styled.div`
  background-color: #161B22;
  padding: 20px;
  border-radius: 12px;
  margin-top: 4px;
  width: 100%;
  max-width: 500px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  width: 90%;
  max-width: 500px;

  @media (max-width: 768px) {
    flex-direction: column; /* Mobilde inputları alt alta yerleştirir */
    align-items: flex-start;
  }
`;

export const Label = styled.label`
  color: #E6EDF3;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  display: block;
  text-align: center;
  width: 100%;
  position: relative;
  transition: all 0.2s ease;

  & + input, & + select {
    margin-top: 4px;
  }

  &:hover {
    color: #58A6FF;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #58A6FF;
    transition: width 0.3s ease;
  }

  &:focus-within::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem; /* Mobilde daha küçük font boyutu */
  }
`;

export const Input = styled.input`
  width: 55%;
  padding: 10px;
  border-radius: 8px;
  background-color: #161B22;
  border: 1px solid white;
  color: #E6EDF3;
  margin-left: 10px;

  @media (max-width: 768px) {
    width: 100%; /* Mobilde input genişliği %100 olacak */
    margin-left: 0;
    margin-top: 10px;
  }
`;

export const Button = styled.button`
  background-color: #00C1FF;
  color: #0A0E14;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  display: block;
  margin: 40px auto;

  &:hover {
    background-color: #0099CC;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 0.9rem; /* Buton font boyutunu küçük cihazlar için küçültme */
  }
`;

export const ResultContainer = styled.div`
  margin-top: 20px;
  background-color: #161B22;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }
`;

export const ResultText = styled.p`
  color: #E6EDF3;
  font-size: 16px;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 14px; /* Mobilde font boyutunu küçültme */
  }
`;
