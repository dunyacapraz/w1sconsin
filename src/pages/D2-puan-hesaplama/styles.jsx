import styled from 'styled-components';

export const AppContainer = styled.div`
  padding: 30px 20px;
  min-height: 100vh;
  
  color: #E6EDF3;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
`;

export const TitleContainer = styled.div`
  text-align: center;
  margin: 20px 0 40px 0;

  h1 {
    color: #00C7FF;
    font-size: 2rem;
    margin: 0;
    text-shadow: 0 2px 8px rgba(0, 199, 255, 0.2);
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
`;

export const InputContainer = styled.div`
  background: rgba(16, 32, 45, 0.50);
  padding: 25px;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 1px solid rgba(0, 199, 255, 0.1);
  margin-bottom: 30px;
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const Label = styled.label`
  color: #8A9BA8;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-align: left;
`;

export const Input = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  background: rgba(0, 199, 255, 0.05);
  border: 1px solid rgba(0, 199, 255, 0.2);
  color: #E6EDF3;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00C7FF;
    box-shadow: 0 0 0 2px rgba(0, 199, 255, 0.2);
  }

  &::placeholder {
    color: #5C6975;
  }
`;

export const Button = styled.button`
background-color: #238636; 
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 25px auto 0;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 199, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 199, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ResultContainer = styled.div`
  background: rgba(16, 32, 45, 0.50);
  width: 100%;
  max-width: 1000px;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border: 1px solid rgba(0, 199, 255, 0.1);
  margin: 20px 0;

  .metric-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .metric-card {
    background: rgba(0, 167, 207, 0.05);
    border-radius: 8px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    border-left: 4px solid #00C7FF;
  }

  .explanation {
    color: #8a9ba8;
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
    hyphens: auto;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed rgba(138, 155, 168, 0.2);
  }

  @media (max-width: 768px) {
    padding: 15px;
    
    .metric-card {
      padding: 15px;
    }
    
    .explanation {
      font-size: 13px;
    }
  }
`;

export const ResultText = styled.p`
  color: #E6EDF3;
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-line;
  word-break: break-word;
`;