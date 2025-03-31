import styled from 'styled-components';

export const AppContainer = styled.div`
  padding: 40px 60px;
  min-height: 100vh;
  background-color: #0A0E14;
  color: #E6EDF3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Yatayda ve dikeyde ortalama */
`;

export const TitleContainer = styled.div`
  text-align: center;
 margin-top: -135px;
`;

export const InputContainer = styled.div`
  background-color: #161B22;
  padding: 20px;
  border-radius: 12px;
  margin-top: 4px; /* Başlık ile giriş alanı arasına mesafe ekledik */
  width: 100%;
  max-width: 500px; /* Genişliği sınırlıyoruz */
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center; /* Dikeyde ortalamak için */
  margin-bottom: 10px; /* Input'lar arasında mesafe */
  justify-content: space-between; /* Etiket ve input arasına mesafe bırakır */
  width: 90%; /* Genişliği %100 olarak ayarladım */
  max-width: 500px; /* İsterseniz bir üst sınır da koyabilirsiniz */
`;

export const Label = styled.label`
  color: #E6EDF3;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  display: block;
  text-align: center; /* Etiketi sola hizalar */
  width: 100%; /* Yüzde genişlik belirleyebiliriz */
  position: relative;
  transition: all 0.2s ease;

  /* Input ile yan yana olması durumu için */
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
`;

export const Input = styled.input`
  width: 55%; /* Genişliği etiketle uyumlu olacak şekilde ayarladım */
  padding: 10px;
  border-radius: 8px;
  background-color: #161B22;
  border: 1px solid white;
  color: #E6EDF3;
  margin-left: 10px; /* Label ile input arasında mesafe */
`;

export const Button = styled.button`
  background-color: #00C1FF;
  color: #0A0E14;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  display: block;
  margin: 40px auto; /* Butonu ortalamak için margin auto */
  &:hover {
    background-color: #0099CC;
  }
`;

export const ResultContainer = styled.div`
  margin-top: 20px;
  background-color: #161B22;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 1000px; /* Genişliği sınırlıyoruz */
`;

export const ResultText = styled.p`
  color: #E6EDF3;
  font-size: 16px;
  white-space: pre-line;
`;
