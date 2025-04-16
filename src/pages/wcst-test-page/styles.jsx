import styled, { keyframes } from "styled-components";
import { NavLink } from "react-router-dom";



// Aşağıdan yukarı animasyon
const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 3;
  }
`;

// Genel WCST penceresi stili
export const WcstWindow = styled.div`
  min-height: 95vh;
  margin: auto;
  color: white;
  border-radius: var(--border-radius);
  background: var(--test-zone); // Arka plan bu elemente ait ve sabit kalacak
  position: relative;
  padding-top: 4rem; // <-- DEĞİŞİKLİK BURADA: Üstten iç boşluk eklendi

  @media screen and (max-width: 700px) {
    font-size: var(--font-s);
    padding-top: 2rem; // <-- DEĞİŞİKLİK BURADA: Mobil için farklı iç boşluk
  }
`;

export const CompletedOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 117vw;
  position: fixed;
  top: 0;
  left: 0;
  
  /* Buton wrapper'ı */
  > div {
    text-align: center;
  }
`;

// Kartlar için genel stil
export const TargetCards = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  /* margin-top: 4rem; */ // <-- KALDIRILDI

  @media screen and (max-width: 700px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0 10px;
    /* margin-top: 2rem; */ // <-- KALDIRILDI
  }
`;


export const ResponseCards = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
`;


// Uyarı mesajı için stil (animasyonlu)
export const Warning = styled.div`
  position: relative;
  top: 1rem;
  margin-bottom: 1rem;
  font-size: var(--font-xl);
  text-align: center;
  left: 16px;
  opacity: 0;
  animation: ${slideUp} 0.5s ease-out forwards;

  @media screen and (max-width: 1000px) {
    top: 0.5rem;
    font-size: var(--font-s);
  }
`;

export const WarningButton = styled.div`
  position: relative;
  top: 23rem;
  margin-bottom: 1rem;
  font-size: var(--font-xl);
  text-align: center;
  opacity: 0;
  animation: ${slideUp} 0.5s ease-out forwards;

  @media screen and (max-width: 1000px) {
    top: 0.5rem;
    font-size: var(--font-s);
  }
`;

// NavLink buton stili
export const NavLinkButton = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin-top: 2rem;
  width: 100%;
  height: auto;

  @media screen and (max-width: 700px) {
    width: auto;
  }
`;

// Başlangıç butonu ve konumlandırma
export const Start = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    text-align: center;
  }

  img {
    width: 600px;
    margin: auto;

    @media screen and (max-width: 700px) {
      width: 235px;
      font-size: var(--font-s);
    }
  }
`;

// Modern buton stili
export const Button = styled.button`
  position: relative;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  margin-top: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 1) 0%,
    rgba(79, 70, 229, 1) 100%
  );
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  /* Hover efekti */
  &:hover {
    transform: translateY(-2px);
     box-shadow: 0 7px 14px rgba(106, 90, 205, 0.3);
    background: linear-gradient(135deg, #6a5acd 0%, #5a4aae 100%);
    &::after {
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
      animation: shine 1.5s;
    }
  }

  /* Aktif durum */
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(99, 102, 241, 0.25);
  }

  /* Devre dışı durum */
  &:disabled {
    background: #4a4866;
    cursor: not-allowed;
    opacity: 0.7;
  }

  /* Ikonlu butonlar için */
  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
    vertical-align: middle;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  @keyframes shine {
    0% { left: -50%; }
    100% { left: 150%; }
  }

  /* Responsive boyutlar */
  @media screen and (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    
    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  /* Özel varyantlar */
  &.secondary {
    background: linear-gradient(
      135deg,
      rgba(203, 213, 225, 1) 0%,
      rgba(148, 163, 184, 1) 100%
    );
    color: #1e293b;
    
    &:hover {
      box-shadow: 0 6px 12px rgba(148, 163, 184, 0.25);
    }
  }

  &.danger {
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, 1) 0%,
      rgba(185, 28, 28, 1) 100%
    );
    
    &:hover {
      box-shadow: 0 6px 12px rgba(239, 68, 68, 0.25);
    }
  }
`;

// Yükleniyor simgesi
export const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--text-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Sonuçlar için stil
export const ResultContainer = styled.div`
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  margin-top: 2rem;
  text-align: center;

  @media screen and (max-width: 700px) {
    padding: 1rem;
  }
`;

// Başlangıç metni ve buton stili
export const StartText = styled.div`
  font-size: var(--font-l);
  color: #ff9800;
  margin-bottom: 10px;
  font-weight: bold;

  @media screen and (max-width: 700px) {
    font-size: var(--font-s);
  }
`;


export const CardCounter = styled.div`
  /* Konumlandırma ve Boyut */
  display: block;
  max-width: 180px;
  padding: 0.6rem 1rem;

  /* Görünüm (aynı kalır) */
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;

  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1em;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: all 0.3s ease;

  /* --- YENİ KONUMLANDIRMA (WcstWindow'a Göre) --- */
  position: absolute; /* <-- Bu 'absolute' kalmalı */
  top: 58%;      /* <-- Pencerenin üstünden % kaç aşağıda olacağı (ayarlayın) */
  left: 68%;     /* <-- Pencerenin solundan % kaç içeride olacağı (ayarlayın) */
  /* transform: translateX(-50%); */ /* <-- İsterseniz yatayda tam ortalamak için kullanabilirsiniz */

  /* --- ESKİ KONUMLANDIRMA (Kaldırıldı) --- */
  /* bottom: 1rem; */
  /* left: 100%; */
  /* margin-left: 2rem; */


  /* Mobil uyumluluk (gerekirse ayarlanmalı) */
  @media screen and (max-width: 700px) {
    max-width: 150px;
    font-size: 0.9em;
    padding: 0.5rem 0.8rem;
    /* Mobil için top/left değerlerini veya farklı bir konumlandırmayı ayarlayın */
    /* Örneğin: */
    /* top: 85%; */
    /* left: 50%; */
    /* transform: translateX(-50%); */ /* Mobilde ortalamak için */
  }
`;

export const CategoryTracker = styled.div`
  border: 3px solid red; /* Kırmızı çerçeve */
  padding: 15px;
  margin: 20px auto; /* Ortala */
  background-color: yellow; /* Sarı arka plan */
  width: fit-content;
`;

export const CategoryItem = styled.span`
  border: 2px solid blue; /* Mavi çerçeve */
  margin: 5px;
  padding: 8px;
  background-color: lightgreen; /* Yeşil arka plan */
  color: black; /* Siyah yazı */
  font-size: 1.2em;
  font-weight: bold;
`;

export const GeneralMessage = styled.p`
  font-size: 1.2rem;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

export const ProgressIndicator = styled.div`
  color: #ccc;
  font-size: 0.9rem;    // Varsayılan yazı boyutu
  margin-top: 20px;     // Varsayılan üst boşluk
  text-align: center;
  width: 100%;
  padding: 10px 0;      // Biraz dikey iç boşluk ekleyelim

  @media screen and (max-width: 700px) {
    font-size: 0.8rem; // Mobil için biraz daha küçük yazı tipi
    margin-top: 15px;  // Mobil için biraz daha az üst boşluk
    // İsterseniz altına da boşluk ekleyebilirsiniz:
    // margin-bottom: 15px;
  }
`;