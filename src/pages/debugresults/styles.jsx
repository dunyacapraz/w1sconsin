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

export const RightPanel = styled.div`
  display: flex;            // İç öğeleri flex düzenine sokar
  flex-direction: column;   // Öğeleri alt alta sıralar (Results, Demographic, Clinical, Perseverative)
  width: 100%;             // Genişliği %100 yapar (Div stretch yaptığı için)
  max-width: 550px;        // Sağ panel için maksimum genişlik (isteğe bağlı, ayarlayabilirsiniz)
  padding: 0 20px 20px 20px; // İç boşluklar (üstte 0, diğer yanlarda 20px)
  margin-left: auto;        // Ana Div içinde sağa yaslamak için (Table center olduğu için bu gerekli olmayabilir, duruma göre ayarlayın)
  margin-right: auto;       // Ortalamak için
  gap: 30px;               // Sağ panel içindeki bölümler (Results, Demographic vb.) arası boşluk
  box-sizing: border-box;   // Padding ve border'ı genişliğe dahil eder

  /* Eğer Div'in align-items: stretch; özelliği varsa ve RightPanel'in
     Table ile aynı hizada olmasını istiyorsanız, DebugResults JSX yapısını
     değiştirmeniz veya Div'e flex-direction: row vermeniz gerekebilir.
     Mevcut JSX yapısı (<Div><Table/><RightPanel/></Div>) ve Div'in stili
     ile RightPanel Table'ın ALTINDA yer alacaktır. */

  @media (min-width: 1024px) { // Daha geniş ekranlarda yan yana görünüm için
      /* Eğer ana S.Div'in flex-direction: row; olmasını isterseniz,
         bu genişlik ayarı anlamlı olur. */
      // width: 450px; // Sabit genişlik
      // max-width: 450px;
      // padding-left: 30px;
      // margin-left: 0; // Sola yaslamak için
      // margin-right: 0;
  }
`;

export const ClinicalSection = styled.div`
  width: 100%;
  max-width: none;
  padding: 25px;
  margin: 30px 0;
  box-shadow: 0 8px 32px rgba(0, 167, 207, 0.1);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  box-sizing: border-box;
  
  /* Yeni eklenen stiller */
  min-height: 200px; /* Minimum yükseklik */
  overflow: visible; /* Taşan içeriği kesme */
  display: flex;
  flex-direction: column;

  h3 {
    /* Mevcut stiller korundu */
  }

  .clinical-content {
    width: 100%;
    flex: 1; /* Kalan alanı doldur */
    
    > div { /* Ana içerik container'ı */
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Grid düzeni için responsive ayar */
    .css-1qzevvg {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      width: 100%;
    }
  }

`;

export const DemographicSection = styled.div`
  margin: 30px auto;
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 167, 207, 0.3); // Ana mavi tonunda border
  box-shadow: 0 8px 32px rgba(0, 167, 207, 0.1);
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 167, 207, 0.2);
  }

  h3 {
    color: #00a7cf; // Başlık rengi klinik yorumla aynı
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    margin: 0 0 2rem 0;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: #00a7cf;
      border-radius: 2px;
    }
  }

  .input-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .input-field {
    label {
      color: rgba(255, 255, 255, 0.9); // Klinik yorum metin rengiyle uyumlu
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
      display: block;
      padding-left: 8px;
    }

    input, select {
      width: 100%;
      padding: 0.875rem 1.25rem;
      border: 1px solid rgba(0, 167, 207, 0.3); // Ana mavi tonunda border
      border-radius: 8px;
      background: rgba(0, 167, 207, 0.05); // Hafif mavi arkaplan
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      &:focus {
        outline: none;
        border-color: #00a7cf;
        box-shadow: 0 0 0 3px rgba(0, 167, 207, 0.2);
        background: rgba(0, 167, 207, 0.1);
      }
    }

    select {
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300a7cf'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
    }
  }

  .download-section {
    text-align: center;
    margin-top: 2rem;

    button {
      background: linear-gradient(135deg, #00a7cf 0%, #0088cc 100%); // Klinik yorum gradienti
      color: white;
      padding: 1rem 2.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: transform 0.3s ease;
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
        &::before {
          left: 100%;
        }
      }

      &:disabled {
        background: #2d3b4d;
        color: rgba(255, 255, 255, 0.4);
        cursor: not-allowed;
      }
    }

    .download-note {
      color: rgba(255, 255, 255, 0.6); // Klinik yorum ikincil metin rengi
      font-size: 0.9rem;
      margin-top: 1rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

export const PerseverativeSection = styled.div`
  padding: 25px;
  width: 500px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 8px 32px rgba(0, 167, 207, 0.1);
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
  width: 100%; /* 44% yerine 100% */
  max-width: 1600px; /* İsteğe bağlı maksimum genişlik */
  margin-left: auto;
  box-shadow: 0 8px 32px rgba(0, 167, 207, 0.1);
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
