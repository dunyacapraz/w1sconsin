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

  width: 100%;
  max-width: 800px;
  padding: 2.5rem; /* Biraz daha fazla boşluk */
  border-radius: 12px; /* Results ile aynı köşe yuvarlaklığı */
  background-color: rgba(40, 40, 60, 0.65); /* Results ile benzer koyu arka plan */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Mavi yerine ince beyaz/gri border */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Results ile benzer gölge */
  backdrop-filter: blur(10px); /* Blur efekti kalabilir, hoş durabilir */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Hover efekti kaldırıldı veya daha nötr hale getirildi */
  /* &:hover {
     box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25); // Hafifçe artan gölge
  } */

  h3 {
    color: #ffffff; /* Başlık rengi beyaz (Results gibi) */
    font-size: 1.6rem; /* Boyut Results ile tutarlı */
    font-weight: 500; /* Kalınlık Results ile tutarlı */
    text-align: center;
    margin: 0 0 2rem 0;
    position: relative;
    padding-bottom: 1rem; /* Alt çizgi için boşluk */

    &::after {
      content: '';
      position: absolute;
      bottom: 0px; /* Tam altına */
      left: 50%;
      transform: translateX(-50%);
      width: 50px; /* Genişlik biraz daha az */
      height: 1px; /* Daha ince çizgi */
      background: rgba(255, 255, 255, 0.2); /* Mavi yerine soluk beyaz/gri çizgi */
      border-radius: 1px;
    }
  }

  .input-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.75rem; /* Biraz daha fazla boşluk */
    margin-bottom: 2.5rem; /* Alt boşluk */
  }

  .input-field {
    label {
      color: rgba(255, 255, 255, 0.75); /* Results etiket rengiyle aynı */
      font-size: 0.9rem; /* Biraz daha küçük etiket */
      margin-bottom: 0.6rem;
      display: block;
      padding-left: 4px; /* Hafif iç boşluk */
      font-weight: 400;
    }

    input, select {
      width: 100%;
      padding: 0.875rem 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.15); /* İnce beyaz/gri border */
      border-radius: 8px; /* Daha yumuşak köşe */
      background: rgba(0, 0, 0, 0.2); /* Mavi yerine koyu transparan arka plan */
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4); /* Placeholder rengi iyi */
      }

      &:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.5); /* Odaklanınca border rengi hafif belirginleşir */
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05); /* Çok hafif beyaz/gri glow */
        background: rgba(0, 0, 0, 0.3); /* Odaklanınca arka plan hafif açılır */
      }
    }

    select {
        /* Ok ikonu rengini değiştir (örneğin açık gri #aaaaaa) */
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaaaaa'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
      appearance: none; /* Tarayıcı varsayılan okunu kaldır */
      padding-right: 2.5rem; /* Ok için yer aç */
    }
  }

  .download-section {
    text-align: center;
    margin-top: 2.5rem;

    button {
      /* Önceki mor buton stilini kullan */
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 1) 0%,
        rgba(79, 70, 229, 1) 100%
      );
       box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2); /* Mor tonunda hafif gölge */
      color: white;
      padding: 0.875rem 2.25rem; /* Biraz daha kompakt buton */
      border: none;
      border-radius: 8px;
      font-size: 1.05rem; /* Biraz daha küçük yazı */
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      /* Parlama efekti aynı kalabilir veya kaldırılabilir */
      /* &::before { ... } */

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 20px rgba(99, 102, 241, 0.3); /* Hover'da gölgeyi artır */
        /* &::before { left: 100%; } */
      }

       &:active {
         transform: translateY(0);
         box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
       }

      &:disabled {
        background: #4a4866; /* Önceki disabled rengi */
        color: rgba(255, 255, 255, 0.4);
        cursor: not-allowed;
        box-shadow: none;
      }
    }

    .download-note {
      color: rgba(255, 255, 255, 0.6); /* İkincil metin rengi iyi */
      font-size: 0.85rem; /* Biraz daha küçük not */
      margin-top: 1rem;
      max-width: 450px; /* Genişliği ayarlanabilir */
      margin-left: auto;
      margin-right: auto;
      line-height: 1.5; /* Okunabilirlik için satır yüksekliği */
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
  background-color: rgba(40, 40, 60, 0.6); /* Hafif yarı saydam koyu arka plan */
  border-radius: 12px; /* Modern yuvarlak köşeler */
  padding: 2rem 2.5rem; /* İç boşluk */
  margin: 3rem auto; /* Dikey boşluk ve yatay ortalama */
  max-width: 650px; /* Maksimum genişlik */
  width: 90%;       /* Duyarlı genişlik */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Daha belirgin gölge */
  color: #e0e0e0; /* Genel metin rengi (açık gri) */

  /* Başlık stili (h3) */
  h3 {
    text-align: center;
    margin-bottom: 2rem; /* Başlık altı boşluk */
    color: #ffffff; /* Saf beyaz başlık */
    font-size: 1.8rem; /* Daha büyük başlık */
    font-weight: 500; /* Orta kalınlık */
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15); /* Başlık altına ince çizgi */
    padding-bottom: 1rem; /* Çizgi ile başlık arasına boşluk */
  }

  /* Yükleniyor mesajı stili */
  .loading-message {
     text-align: center;
     color: rgba(255, 255, 255, 0.7); /* Biraz soluk */
     font-style: italic;
     padding: 3rem 0; /* Dikey boşluk */
     font-size: 1.1rem;
  }

  /* Mobil cihazlar için ayarlamalar */
  @media screen and (max-width: 700px) {
    padding: 1.5rem;
    max-width: 95%;
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .loading-message {
        font-size: 1rem;
    }
  }
`;

export const DetailedTable = styled.table`
  width: 100%;
  border-collapse: collapse; /* Hücre aralıklarını kaldır */
  border-spacing: 0;

  tbody tr {
    /* Satırları ayıran ince çizgiler */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: background-color 0.2s ease-in-out; /* Hover efekti için geçiş */

    &:last-child {
      border-bottom: none; /* Son satırda çizgi olmasın */
    }

    /* Satır üzerine gelince hafif vurgu */
    &:hover {
       background-color: rgba(255, 255, 255, 0.05);
    }
  }

  td {
    padding: 1rem 0.75rem; /* Hücre içi boşluk (dikey daha fazla) */
    vertical-align: middle; /* Dikey ortalama */
    font-size: 1rem; /* Standart yazı boyutu */

    /* Etiket sütunu (ilk hücre) */
    &:first-child {
      text-align: left;
      color: rgba(255, 255, 255, 0.75); /* Etiketler biraz daha soluk */
      padding-right: 1.5rem; /* Etiket ve değer arasına boşluk */
      font-weight: 400; /* Normal kalınlık */
    }

    /* Değer sütunu (son hücre) */
    &:last-child {
      text-align: right;
      font-weight: 600; /* Değerler daha kalın */
      color: #ffffff; /* Değerler tam beyaz */
      font-feature-settings: 'tnum'; /* Sayıların hizalı görünmesini sağlar (tabular nums) */
      letter-spacing: 0.5px; /* Hafif harf aralığı */
    }
  }

  /* Küçük ekranlarda tablo hücreleri için ayarlama */
  @media screen and (max-width: 480px) {
     td {
       padding: 0.8rem 0.4rem;
       font-size: 0.9rem; /* Daha küçük yazı */

       /* İsteğe bağlı: Etiketleri değerlerin üstüne yığma */
       /*
       display: block; // Blok element yap
       text-align: left !important; // Hizalamayı sola zorla
       width: 100%;

       &:first-child {
         padding-bottom: 0.1rem; // Etiket altı minik boşluk
         color: rgba(255, 255, 255, 0.6);
         font-weight: 500;
         font-size: 0.8rem; // Etiketi daha küçük yap
       }
        &:last-child {
          padding-left: 0; // Sol boşluğu sıfırla
          font-weight: 600;
       }
       */
     }
     /* Küçük ekranda satır çizgilerini kaldırıp boşluk bırakma */
     /*
     tbody tr {
        border-bottom: none;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        display: block;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1); // Bloklar arasına çizgi
     }
     */
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
