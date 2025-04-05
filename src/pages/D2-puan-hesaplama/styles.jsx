import styled from 'styled-components';

export const AppContainer = styled.div`
  --body-bg: #101117;
  --primary: #6c5ce7;
  --primary-light: #8477e6;
  --secondary: #a8a5e6;
  --text: #e6e6fa;
  --text-light: rgba(230, 230, 250, 0.7);
  --card-bg: #1a1b26;
  --card-border: rgba(108, 92, 231, 0.1);
  --hover-effect: linear-gradient(145deg, #1f2029, #181920);

  background: var(--body-bg);
  min-height: 100vh;
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


export const TitleContainer = styled.div`
  text-align: center;
  margin: 1rem 0;
  padding: 0 1rem;
  
  h1 {
    font-size: 3rem;
    margin: 0;
    font-weight: 700;
    letter-spacing: -0.03em;
    background: linear-gradient(
      to right,
      var(--primary) 0%,
      var(--primary-light) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    display: inline-block;
    padding-bottom: 0.5rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 70%;
      height: 2px;
      background: linear-gradient(
        to right,
        transparent 0%,
        var(--primary) 20%,
        var(--primary-light) 50%,
        var(--primary) 80%,
        transparent 100%
      );
    }

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }
`;

export const InputContainer = styled.div`
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 4px 25px rgba(0,0,0,0.2);
  border: 1px solid var(--card-border);
  margin-bottom: 2rem;
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

export const Label = styled.label`
  color: var(--text-light);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

export const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 0.8rem;
  background: rgba(108, 92, 231, 0.05);
  border: 1px solid var(--card-border);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }

  &::placeholder {
    color: var(--text-light);
    opacity: 0.6;
  }
`;

export const Button = styled.button`
  background: linear-gradient(135deg, #6c5ce7 0%, #8477e6 100%);
  color: white !important;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.8rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1.5rem auto 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.2);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(108, 92, 231, 0.3);
    background: linear-gradient(135deg, #8477e6 0%, #6c5ce7 100%);
  }

  &:active {
    transform: translateY(0);
    background: #6c5ce7;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::after {
    left: 100%;
  }
`;

export const ResultContainer = styled.div`
  background: var(--card-bg);
  width: 100%;
  max-width: 1000px;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 25px rgba(0,0,0,0.15);
  border: 1px solid var(--card-border);
  margin: 1.5rem 0;

  .metric-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .metric-card {
    background: rgba(108, 92, 231, 0.05);
    border-radius: 0.8rem;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    border-left: 4px solid var(--primary);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-3px);
    }
  }

  .explanation {
    color: var(--text-light);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--card-border);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    
    .metric-card {
      padding: 1rem;
    }
    
    .explanation {
      font-size: 0.9rem;
    }
  }
`;