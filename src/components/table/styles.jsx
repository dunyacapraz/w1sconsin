import styled from "styled-components";

export const Div = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Table = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 20px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2px;
`;

export const Line = styled.div`
  display: flex;
  margin-bottom: 0;
`;

export const Box = styled.div`
  padding: 2px;
  border: 1px solid black;
  text-align: center;
  width: 30px;
  flex: 1;
  font-size: 1rem;
  
  /* Kutuların köşelerini yuvarlamak için border-radius ekledik */
  border-radius: 5px;  /* 5px ile hafif yuvarlama */

  /* Tablo içindeki doğru/yanlış renkler */
  ${({ isCorrect, isNumber, index }) => {
    if (isNumber) {
      // **Numara hücresindeki doğru ve yanlış renk**
      // Burada index (numara) hücresini kontrol ediyoruz
      // Eğer doğru ise #00a7cf mavi, yanlış ise kırmızı (red)
      return isCorrect === true
        ? `background-color: #00a7cf; color: white; margin-right: 5px;`  // Doğru seçim için #00a7cf mavi arka plan, sağa boşluk ekledik
        : isCorrect === false
        ? `background-color: #ff4d4d; color: white; margin-right: 5px;`   // Yanlış seçim için kırmızı arka plan, sağa boşluk ekledik
        : `margin-right: 5px;`;  // Eğer doğru/yanlış değilse, sadece sağa boşluk ekliyoruz
   } else {
      // **Diğer hücrelerdeki doğru ve yanlış renk**
      // Bu kısımda ise "R", "Ş", "M", "D" hücrelerine bakıyoruz
      return isCorrect === true
        ? `background-color: green; color: white;`
        : ``; // Boş ise varsayılan stil (arka plan rengi değişmez)
  }
}
    }
  }};
`;

export const Results = styled.div`
  margin-top: 30px;
  width: 44%;
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    background-color: transparent;
    overflow: visible;
  }

  thead {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(4px);
    color: #fff;
  }

  th {
    padding: 15px 20px;
    text-align: left;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  td {
    padding: 14px 20px;
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    backdrop-filter: blur(2px);
  }

  tbody tr:hover td {
    background-color: rgba(255, 255, 255, 0.08);
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 15px;
    td {
      padding: 12px 15px;
      font-size: 0.9rem;
    }
  }
`;

export const DetailedTable = styled.table`
  margin-top: 20px;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background-color: transparent;
  overflow: visible;
  th {
    padding: 12px 20px;
    text-align: left;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  td {
    padding: 10px 15px;
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    backdrop-filter: blur(2px);
  }

  tbody tr:hover td {
    background-color: rgba(255, 255, 255, 0.08);
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const Button = styled.button`
  background-color: #00a7cf;
  color: white;
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0077b3;
  }

  &:focus {
    outline: none;
  }
`;

