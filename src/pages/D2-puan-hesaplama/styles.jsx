import styled from "styled-components";

// Renk değişkenleri aynı kalıyor
export const AppContainer = styled.div`
  --body-bg: #101117;
  --primary: #6c5ce7;
  --primary-light: #8477e6;
  --secondary: #a8a5e6;
  --text: #e6e6fa;
  --text-light: rgba(230, 230, 250, 0.7);
  --card-bg: #1a1b26; // Kart arka planı
  --card-bg-alt: #212330; // Alternatif kart arka planı (isteğe bağlı)
  --card-border: rgba(108, 92, 231, 0.1);
  --input-bg: rgba(108, 92, 231, 0.05);
  --hover-effect: linear-gradient(145deg, #1f2029, #181920);
  --shadow-color: rgba(0, 0, 0, 0.2); // Gölge rengi
  --shadow-color-primary: rgba(108, 92, 231, 0.2); // Vurgu gölge rengi

  background: var(--body-bg);
  min-height: 100vh;
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  padding: 2rem; // Kenar boşlukları eklendi
  display: flex;
  flex-direction: column;
  align-items: center; // İçeriği yatayda ortala
`;

// Başlık alanı stilinde küçük ayarlamalar
export const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 3rem; // Alt boşluk artırıldı
  padding: 0 1rem;

  h1 {
    font-size: 2.8rem; // Boyut biraz ayarlandı
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
    padding-bottom: 0.75rem; // Alt çizgi için boşluk

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%; // Çizgi genişliği ayarlandı
      height: 3px; // Çizgi kalınlığı artırıldı
      background: linear-gradient(
        to right,
        transparent 0%,
        var(--primary) 30%,
        var(--primary-light) 50%,
        var(--primary) 70%,
        transparent 100%
      );
      border-radius: 2px; // Çizgi köşeleri yuvarlatıldı
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`;

// Girdi Alanı Kart Stili
export const InputContainer = styled.div`
  background: var(--card-bg);
  padding: 2.5rem; // İç boşluk artırıldı
  border-radius: 12px; // Yuvarlatma artırıldı
  width: 100%;
  max-width: 650px; // Genişlik ayarlandı
  box-shadow: 0 8px 30px var(--shadow-color); // Daha belirgin gölge
  border: 1px solid var(--card-border);
  margin-bottom: 2.5rem; // Alt boşluk
  display: flex; // Flex container yapıldı
  flex-direction: column; // Öğeler alt alta
  gap: 1.5rem; // Satırlar arası boşluk (InputRow marjini yerine)
`;

// Girdi Satırı Stili (Etiket üste alındı)
export const InputRow = styled.div`
  display: flex;
  flex-direction: column; // Etiket ve input alt alta
  gap: 0.5rem; // Etiket ve input arası boşluk
  margin-bottom: 0; // InputContainer'daki gap kullanıldığı için kaldırıldı
`;

// Etiket Stili
export const Label = styled.label`
  color: var(--text-light);
  font-size: 0.9rem; // Biraz küçültüldü
  font-weight: 500;
  padding-left: 0.25rem; // Hafif iç boşluk
`;

// Girdi Kutusu Stili
export const Input = styled.input`
  padding: 0.9rem 1.1rem; // İç boşluk ayarlandı
  border-radius: 8px; // Yuvarlatma ayarlandı
  background: var(--input-bg); // Arka plan rengi
  border: 1px solid var(--card-border);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%; // Tam genişlik
  box-sizing: border-box; // Padding ve border'ı dahil et

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--shadow-color-primary); // Vurgu rengiyle gölge
    background: var(--card-bg); // Odaklanınca arka planı biraz değiştir
  }

  &::placeholder {
    color: var(--text-light);
    opacity: 0.5; // Opaklık ayarlandı
  }
`;

// Buton Stili (Aynı kalabilir veya küçük ayarlamalar yapılabilir)
export const Button = styled.button`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white !important;
  padding: 0.9rem 2rem; // Padding ayarlandı
  border: none;
  border-radius: 8px; // Yuvarlatma ayarlandı
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem auto 0; // Üst boşluk ayarlandı
  display: block; // Blok element yapıldı (InputContainer içinde ortalamak için)
  width: fit-content; // İçeriğe göre genişlik
  box-shadow: 0 4px 15px var(--shadow-color-primary); // Vurgu rengiyle gölge
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px); // Hover efekti artırıldı
    box-shadow: 0 7px 25px var(--shadow-color-primary);
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
  }

  &:active {
    transform: translateY(0);
    background: var(--primary);
    box-shadow: 0 3px 10px var(--shadow-color-primary);
  }

  // Hover animasyonu (isteğe bağlı, aynı kalabilir)
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
      rgba(255, 255, 255, 0.15), // Işık efekti biraz daha belirgin
      transparent
    );
    transition: 0.6s; // Animasyon süresi ayarlandı
  }

  &:hover::after {
    left: 100%;
  }
`;

// Sonuç Alanı Kart Stili (InputContainer'a benzer ama farklı olabilir)
export const ResultContainer = styled.div`
  // ... (Mevcut ResultContainer stilleri burada kalacak) ...

  .klinik-yorum-baslik { // Bu stil aynı kalabilir
    color: var(--secondary);
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 2rem;
  }

  .metric-grid { // Bu stil aynı kalabilir
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .metric-card { // Bu stil aynı kalabilir
    background: var(--card-bg);
    border-radius: 12px;
    padding: 1.75rem;
    border: 1px solid var(--card-border);
    box-shadow: 0 6px 20px var(--shadow-color);
    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px var(--shadow-color);
    }

    .metric-card-title { // Bu stil aynı kalabilir
        margin: 0 0 1.25rem 0;
        color: var(--primary-light);
        font-size: 1.1rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid var(--card-border);
        padding-bottom: 0.75rem;
        text-align: left;
    }

    .metric-items-container { // Bu stil aynı kalabilir
      display: flex;
      flex-direction: column;
      gap: 1rem; // Satırlar arası boşluk (arka plan eklendiği için azaltıldı)
      margin-top: 1rem;
    }

    // --- METRIC ROW GÜNCELLEMESİ ---
    .metric-row {
      background-color: var(--card-bg-alt); // **** YENİ: Arka plan eklendi ****
      padding: 1rem; // **** YENİ: İç boşluk eklendi ****
      border-radius: 8px; // **** YENİ: Köşeler yuvarlatıldı ****
      /* border-bottom: 1px solid var(--card-border); // KALDIRILDI */
      display: flex;
      flex-direction: column;
      gap: 0.6rem; // Etiket/Detay ile Açıklama arası boşluk ayarlandı
    }
    // --- METRIC ROW GÜNCELLEMESİ SONU ---

    .metric-label { // Bu stil aynı kalabilir
      font-size: 1rem;
      color: var(--text);
      font-weight: 500;
      margin-bottom: 0.25rem; // Boşluk ayarlandı
    }

    .metric-details { // Bu stil aynı kalabilir
      display: flex;
      align-items: center;
      gap: 0.8rem;
      flex-wrap: wrap;
    }

    .metric-interpretation-tag { // Bu stil aynı kalabilir
      font-weight: 600;
      font-size: 0.8rem;
      padding: 0.3rem 0.8rem;
      border-radius: 12px;
      text-align: center;
      min-width: 90px;
      border: 1px solid transparent;
    }

    .metric-value-badge { // Bu stil aynı kalabilir
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text);
      background-color: var(--input-bg);
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      border: 1px solid var(--card-border);
      min-width: 45px;
      text-align: right;
    }

    // --- METRIC EXPLANATION GÜNCELLEMESİ ---
    .metric-explanation-text {
      color: var(--text-light);
      font-size: 0.8rem;
      line-height: 1.4;
      padding-top: 0.6rem; // Üstten ayırmak için padding
      margin-top: 0.6rem; // Üstten ayırmak için margin
      border-top: 1px dashed rgba(108, 92, 231, 0.15); // Üst kenarlık eklendi
      /* border-left: 2px solid var(--card-border); // KALDIRILDI */
      opacity: 0.9;
    }
    // --- METRIC EXPLANATION GÜNCELLEMESİ SONU ---
  } // .metric-card sonu

  .konsantrasyon-analizi { // Bu stil aynı kalabilir
     background: var(--card-bg-alt);
     border-radius: 10px;
     padding: 1.5rem;
     margin-top: 2rem;
     border: 1px solid var(--card-border);

     // ... (konsantrasyon iç stilleri aynı kalabilir) ...
      .konsantrasyon-title { margin: 0 0 1rem 0; color: var(--primary-light); font-size: 1.1rem; font-weight: 600; text-align: center; border-bottom: 1px solid var(--card-border); padding-bottom: 0.75rem; }
      .konsantrasyon-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; margin-bottom: 1rem; }
      .konsantrasyon-item-label { font-size: 0.8rem; color: var(--text-light); margin-bottom: 0.25rem; }
      .konsantrasyon-item-value { font-size: 1.5rem; font-weight: 700; color: var(--text); }
      .konsantrasyon-yorum { margin-top: 1rem; font-size: 0.9rem; color: var(--secondary); text-align: center; font-weight: 500; }
  }

   @media (max-width: 768px) { // Bu bölüm aynı kalabilir
     .metric-grid { gap: 1.25rem; }
     .metric-card, .konsantrasyon-analizi { padding: 1.25rem; }
     .metric-items-container { gap: 1rem; }
     .metric-row { padding: 0.8rem; gap: 0.4rem; }
     .metric-label { font-size: 0.9rem; }
     .metric-details { gap: 0.5rem; }
     .metric-interpretation-tag { font-size: 0.75rem; padding: 0.25rem 0.6rem; }
     .metric-value-badge { font-size: 0.85rem; padding: 0.25rem 0.5rem; }
     .metric-explanation-text { font-size: 0.8rem; margin-top: 0.4rem; padding-top: 0.4rem; }
     .konsantrasyon-analizi { padding: 1rem; }
     .konsantrasyon-grid { grid-template-columns: 1fr; gap: 0.8rem; }
     .konsantrasyon-item-value { font-size: 1.3rem; }
     .konsantrasyon-yorum { font-size: 0.85rem; }
   }

`;

