import styled from "styled-components";

export const Div = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* ÖNEMLİ: center yerine stretch */
  width: 100%;
  max-width: none; /* Maksimum genişlik sınırını kaldır */
`;
export const Table = styled.div`
  display: flex;
  justify-content: center; /* flex-start yerine center */
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
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
  ${({ isCorrect, isNumber }) => {
    if (isNumber) {
      // **Numara hücresindeki doğru ve yanlış renk**
      // Burada index (numara) hücresini kontrol ediyoruz
      return isCorrect === true
        ? `background-color: #00a7cf; color: white; margin-right: 5px;`  // Doğru seçim için #00a7cf mavi arka plan, sağa boşluk ekledik
        : isCorrect === false
        ? `background-color: #ff4d4d; color: white; margin-right: 5px;`   // Yanlış seçim için kırmızı arka plan, sağa boşluk ekledik
        : `margin-right: 5px;`;  // Eğer doğru/yanlış değilse, sadece sağa boşluk ekliyoruz
    } else {
      // **Diğer hücrelerdeki doğru ve yanlış renk**
      return isCorrect === true
        ? `background-color: green; color: white;`
        : ``; // Boş ise varsayılan stil (arka plan rengi değişmez)
    }
  }}
`;

export const ClinicalSection = styled.div`
  width: 100%;
  max-width: none; /* Maksimum genişlik sınırını kaldır */
  padding: 25px;
  margin: 30px 0; /* Üst ve alt boşluk */
  background: rgba(255, 255, 255, 0.05);
  
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;
  
  h3 {
    color: #00a7cf;
    margin: 0 0 20px 0;
    font-size: 1.5rem;
    border-bottom: 1px dashed rgba(0, 167, 207, 0.5);
    padding-bottom: 10px;
  }

  .clinical-content {
    width: 100%;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);
    font-size: 1rem;
    
    p {
      margin-bottom: 15px;
      width: 100%;
    }
    
    strong {
      color: #00a7cf;
    }
    
    ul, ol {
      padding-left: 25px;
      margin-bottom: 15px;
    }
    
    li {
      margin-bottom: 8px;
    }
  }
`;

export const DemographicSection = styled.div`
  margin-bottom: 30px;
  width: 500px;
  padding: 25px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: auto;
  margin-right: auto;
  
  h3 {
    margin-top: 0;
    color: #fff;
    font-size: 1.25rem;
    margin-bottom: 20px;
  }

  .input-group {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .input-field {
    flex: 1;
    min-width: 200px;
    
    label {
      display: block;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      font-size: 0.9rem;
    }

    input, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.2);
      color: white;
      font-size: 0.95rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #00a7cf;
        box-shadow: 0 0 0 2px rgba(0, 167, 207, 0.2);
      }
    }
  }
`;

export const PerseverativeSection = styled.div`
  padding: 25px;
  width: 500px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;
    margin-left: auto;
  margin-right: auto;
  
  h3 {
    margin-top: 0;
    color: #fff;
    margin-bottom: 20px;
  }

  .info-text {
    margin-bottom: 20px;
    
    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 10px;
    }
    
    ul {
      padding-left: 20px;
      margin: 10px 0;
      
      li {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 5px;
      }
    }
    
    .rule-explanation {
      background: rgba(0, 167, 207, 0.1);
      padding: 12px;
      border-radius: 6px;
      border-left: 3px solid #00a7cf;
    }
  }

  .explanation-list {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 167, 207, 0.5);
      border-radius: 3px;
    }
  }

  .explanation-item {
    padding: 15px;
    margin-bottom: 15px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    border-left: 3px solid rgba(0, 167, 207, 0.5);
    
    .response-header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 8px;
      
      .response-number {
        font-weight: bold;
        color: #00a7cf;
      }
      
      .response-categories {
        color: rgba(255, 255, 255, 0.9);
      }
      
      .correct-category {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
      }
      
      .error-tag {
        background: rgba(255, 77, 77, 0.2);
        color: #ff4d4d;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
      }
      
      .correct-tag {
        background: rgba(0, 167, 207, 0.2);
        color: #00a7cf;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
      }
    }
    
    .explanation-text {
      color: rgba(255, 255, 255, 0.8);
      margin-top: 8px;
      padding-left: 15px;
      border-left: 2px solid rgba(0, 167, 207, 0.5);
    }
    
    .debug-info {
      margin-top: 10px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      overflow-x: auto;
    }
  }
`;

export const Results = styled.div`
  margin-top: 30px;
  width: 44%; /* 44% yerine 100% */
  max-width: 1600px; /* İsteğe bağlı maksimum genişlik */
  margin-left: auto;
  margin-right: auto;
  
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
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
    border-bottom: ${(props) => (props.isSelected ? '2px solid #00a7cf' : 'none')}; /* Kategori seçildiğinde altına çizik ekle */
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
