import styled, { keyframes, createGlobalStyle } from "styled-components";
import { NavLink } from "react-router-dom";

// Global Stiller (Aynı kalıyor)
export const GlobalStyle = createGlobalStyle`
  /* @import url(...); */

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--body-bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
    color: var(--text-heading);
  }

  a {
    color: var(--accent); // Ana vurgu rengini kullanalım
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
        color: var(--primary-light); // Hover'da biraz daha açık mor
    }
  }

  ul, ol {
    list-style: none;
  }
`;

// --- Animasyonlar ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Glow animasyonu (Renkler ve yoğunluk güncellendi)
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 4px var(--accent-glow-faded), 0 0 8px var(--accent-glow-faded); }
  50% { box-shadow: 0 0 10px var(--accent-glow), 0 0 18px var(--accent-glow); } // Daha az yayılma
  100% { box-shadow: 0 0 4px var(--accent-glow-faded), 0 0 8px var(--accent-glow-faded); }
`;

// Buton Hover Parlama Animasyonu (Artık kullanılmıyor, kaldırılabilir)
// const shine = keyframes`
//   0% { left: -50%; }
//   100% { left: 150%; }
// `;


// --- Ana Stiller ---
export const Wrapper = styled.div`
  // --- Daha AZ NEON MOR ODAKLI Renk Paleti ---
  --body-bg: #12101E; // Biraz daha derin arka plan
  --primary-deep: #4A148C; // Daha Koyu Mor
  --primary: #7B1FA2; // Ana Mor (Biraz daha koyu ve az doygun)
  --primary-light: #9C27B0; // Açık Mor (Biraz daha koyu)
  /* Yeni Vurgu Rengi: Daha sakin bir lavanta/mor */
  --accent: #B39DDB; // ESKİ #DA70D6 YERİNE (Material Design Deep Purple 200)
  --accent-glow: rgba(179, 157, 219, 0.6); // Daha az opak glow
  --accent-glow-faded: rgba(179, 157, 219, 0.3); // Daha da az opak faded glow

  --text: #DCD1F5; // Hafif leylak tonlu metin
  --text-light: rgba(220, 209, 245, 0.7);
  --text-heading: #F5F0FF; // Neredeyse beyaz başlık

  --card-bg: linear-gradient(145deg, #1F1C2E, #1A1828); // Hafif güncellenmiş gradyan
  --card-border: rgba(67, 18, 77, 0.2); // --primary-light tonlu border
  --card-hover-border: var(--accent); // Hover'da yeni vurgu rengi border
  --card-shadow: rgba(0, 0, 0, 0.45); // Biraz daha belirgin gölge
  /* Yeni vurgu rengi ile daha hafif hover gölgesi */
  --card-hover-shadow: rgba(179, 157, 219, 0.18);

  min-height: 100vh;
  padding: 0;
  position: relative;
  overflow: hidden;

  // Arka Plan Gradyanları (Renkler ve yoğunluk güncellendi)
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(74, 20, 140, 0.08) 0%, transparent 70%); // --primary-deep tonu, daha az opak
    filter: blur(110px); // Biraz daha fazla blur
    z-index: 0;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, var(--accent-glow-faded) 0%, transparent 70%); // Yeni --accent tonu, faded
    filter: blur(110px); // Biraz daha fazla blur
    z-index: 0;
    pointer-events: none;
  }
`;

// Header (Yükseklik, padding ve margin azaltıldı)
export const Header = styled.header`
  min-height: 35vh; /* Önceki 60vh'den azaltıldı */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1.5rem; /* Üst/alt padding 4rem'den 2rem'e düşürüldü */
  position: relative;
  z-index: 1;
  margin-bottom: 2rem; /* Alt boşluk 4rem'den 2rem'e düşürüldü */
`;

// Başlık (Gradyan ve gölge güncellendi)
export const Title = styled.h1`
  font-size: clamp(3rem, 8vw, 5rem); /* Max boyutu biraz küçülttük */
  font-weight: 700;
  letter-spacing: -0.04em;
  /* Beyaz -> Yeni, daha sakin vurgu rengi gradyanı */
  background: linear-gradient(90deg, var(--text-heading) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  animation: ${fadeIn} 1s ease-out;
  /* Daha hafif gölge */
  text-shadow: 0 0 12px var(--accent-glow-faded);
`;

// Altbaşlık (Renk aynı kalabilir)
export const Subtitle = styled.h2`
  font-size: clamp(1.1rem, 2.5vw, 1.5rem); /* Max boyutu biraz küçülttük */
  font-weight: 300;
  color: var(--text-light);
  max-width: 700px;
  margin: 0 auto 1.5rem auto; /* Alt boşluk biraz azaltıldı */
  animation: ${fadeInUp} 0.8s 0.3s ease-out backwards;
`;

// Content (Aynı)
export const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem 2rem;
  position: relative;
  z-index: 1;
`;

// Test Bölümü (Aynı)
export const TestSection = styled.section`
  margin-bottom: 5rem;

  h3 {
    color: var(--text-heading);
    font-size: clamp(2rem, 5vw, 2.8rem);
    margin-bottom: 3rem;
    text-align: center;
    font-weight: 600;
    animation: ${fadeInUp} 0.8s 0.5s ease-out backwards;
  }
`;

// TestGrid (Aynı)
export const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  align-items: stretch; /* Grid öğelerinin dikeyde esnemesini sağlar (genelde varsayılan) */
`;

// Kart (Flexbox eklendi)
export const TestCard = styled.div`
  /* ====> YENİ: Flexbox Ayarları <==== */
  display: flex;
  flex-direction: column;
  height: 100%; /* Grid'in stretch özelliğinden tam faydalanmak için */

  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--card-border);
  box-shadow: 0 8px 30px var(--card-shadow);
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
              box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
              border-color 0.4s ease;
  position: relative;
  overflow: hidden;
  opacity: 0;
  /* Kartların animasyon gecikmesi index.jsx'te veriliyor */
  animation: ${fadeInUp} 0.6s ease-out forwards;

  // Glow efekti (Renk ve opaklık güncellendi)
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(145deg, var(--accent-glow), transparent 70%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 40px var(--card-hover-shadow);
    border-color: var(--card-hover-border);

    &::before {
      opacity: 0.8;
    }
  }

  h4 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-heading);
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    color: var(--text-light);
    margin-bottom: 1.5rem;
    min-height: 4.8em;
    /* flex-grow: 1; */
  }
`;

// İkon (Aynı)
export const TestIcon = styled.div`
  margin-bottom: 1.5rem;
  color: var(--accent); // Yeni vurgu rengi
  svg {
      width: 40px;
      height: 40px;
      /* Daha hafif glow */
      filter: drop-shadow(0 0 8px var(--accent-glow-faded));
  }
`;

// Detay Listesi (Aynı)
export const DetailList = styled.ul`
  margin: 1.5rem 0;

  li {
    color: var(--text-light);
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    position: relative;
    padding-left: 1.8rem;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 4px;
      width: 8px;
      height: 8px;
      background-color: var(--accent); // Yeni vurgu rengi
      border-radius: 50%;
      /* Daha hafif glow */
      box-shadow: 0 0 6px var(--accent-glow-faded);
    }
  }
`;

// Buton (margin-top: auto eklendi)
export const StartButton = styled(NavLink)`
  display: block;
  position: relative;
  padding: 1rem 2.5rem;
  font-size: 0.79rem;
  font-weight: 300;
  color: rgb(255, 255, 255) !important;
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.75rem;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 1) 0%,
    rgba(79, 70, 229, 1) 100%
  );
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.08);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;

  /* Hover efekti */
  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(
      135deg,
      rgba(129, 132, 251, 1) 0%,
      rgba(99, 90, 239, 1) 100%
    );
    border-color: rgba(79, 70, 229, 0.5);
    box-shadow: 0 5px 10px rgba(106, 90, 205, 0.15);
  }

  /* Aktif durum */
  &:active {
    transform: translateY(0);
    background: linear-gradient(
      135deg,
      rgba(79, 70, 229, 1) 0%,
      rgba(59, 50, 209, 1) 100%
    );
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.15);
  }
`;
// İletişim Bölümü (Animasyon eklendi)
export const ContactSection = styled.section`
  margin: 6rem auto 4rem auto;
  max-width: 500px;
  text-align: center;
  position: relative;
  z-index: 1;
  /* Bölümün kendisi için hafif bir gecikme */
  /* animation: ${fadeInUp} 0.8s 0.8s ease-out backwards; */
  /* Opacity'yi 0 yapalım ki çocuklar animasyonla gelsin */
  /* opacity: 0; */

  h3 {
    color: var(--text-heading);
    margin-bottom: 2rem;
    font-size: clamp(1.8rem, 4vw, 2.2rem);
    font-weight: 600;
    /* ====> YENİ: Başlık Animasyonu <==== */
    opacity: 0; /* Başlangıçta gizle */
    animation: ${fadeInUp} 0.6s 1.0s ease-out forwards; /* Kartlardan sonra başlasın */
  }
`;

// Sosyal Medya Linkleri (Animasyon eklendi)
export const SocialLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  /* ====> YENİ: Link Grubu Animasyonu <==== */
  opacity: 0; /* Başlangıçta gizle */
  animation: ${fadeInUp} 0.6s 1.1s ease-out forwards; /* Başlıktan biraz sonra başlasın */


  a {
    color: var(--text-light);
    transition: color 0.3s ease, transform 0.3s ease, filter 0.3s ease;
    display: inline-block;

    &:hover {
      color: var(--accent); // Yeni vurgu rengi
      transform: scale(1.2);
      /* Daha hafif hover glow */
      filter: drop-shadow(0 0 4px var(--accent-glow-faded));
    }

    svg {
      width: 26px;
      height: 26px;
    }
  }
`;
