import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const SideBar = styled.div`
  width: 250px;
  height: 100%;
  overflow: auto;
  position: fixed;

  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  background-color: var(--sidebar-color);

  @media screen and (max-width: 700px) {
    width: 100%;
    height: auto;
    position: relative;
    display: flex;          // <-- EKLENDİ: Flex container yap
    flex-wrap: wrap;        // <-- EKLENDİ: Sığmazsa alt satıra at
    justify-content: center; // <-- EKLENDİ: Öğeleri yatayda ortala
    align-items: center;    // <-- EKLENDİ: Öğeleri dikeyde ortala (çok satırlı olursa)
    padding: 10px 5px;      // <-- EKLENDİ: Üst/alt ve yan boşluklar
  }
`;

export const Logo = styled(NavLink)`
  display: block; // Kendi başına bir satır kaplaması için (veya flex order ile yönet)
  text-align: center; // İçindeki resmi ortalamak için
  width: 100%; // Flex container içinde tam genişlik alabilir
  order: -1; // Flex sıralamasında en başa alabilir (isteğe bağlı)
  margin-bottom: 5px; // Altına biraz boşluk

  img {
    opacity: 0.5;
    height: 100px; // <-- Mobil için boyutu küçültüldü
    margin: auto; // text-align ile zaten ortalanmalı ama garanti olsun
    display: inline-block; // text-align'ın çalışması için

    &:hover {
      opacity: 1;
      transition: var(--transition);
    }
  }

   @media screen and (max-width: 700px) {
      width: auto; // Ya da otomatik genişlik, flex zaten ortalayacak
      margin-bottom: 10px; // Mobil için boşluk
      order: 0; // Mobil için sıralama (isteğe bağlı)
   }
`;

export const Menu = styled(NavLink)`
  display: block; // Veya inline-block flex item gibi davranması için
  text-align: center;
  text-decoration: none;
  margin-top: 20px; // Masaüstü boşluğu
  padding: 16px;   // Masaüstü padding
  color: var(--text-color);
  flex-shrink: 0; // Küçülmesini engelle (özellikle az sayıda öğe varsa)

  &:hover {
    color: var(--title-color);
  }

  @media screen and (max-width: 700px) {
    float: none;          // <-- KALDIRILDI: Float artık yok
    padding: 10px 15px; // Mobil için padding ayarı
    margin: 5px;        // <-- DEĞİŞTİ: float yerine margin ile boşluk
    display: inline-block; // Yan yana durmaları için
  }
`;


export const IconDiv = styled.div`
  display: block;
  margin-left: 2rem;
  text-decoration: none;
  margin-top: 600px;
  padding: 16px;
  color: var(--text-color);

  &:hover {
    color: var(--title-color);
  }

   @media screen and (max-width: 700px) {
    float: none; // <-- KALDIRILDI
    margin: 5px 10px; // <-- Margin ayarı
    padding: 10px;  // <-- Padding ayarı
    // order: 5; // <-- Gerekirse flex sıralamasını ayarlayın
  }
`;

export const Icon = styled(NavLink)`
  text-align: center;
  text-decoration: none;
  margin-left: 2rem;
  font-size: var(--font-xl);

  color: var(--text-color);

  &:hover {
    color: var(--title-color);
  }

  @media screen and (max-width: 700px) {
    font-size: var(--font-m);
    margin-left: 1rem;
  }
`;

export const LogoutButton = styled.button`
  /* Temel Stil */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: min(90%, 200px);
  padding: 14px 24px;
   margin: 20px 20px auto; /* Üst | Sağ | Alt | Sol */
  
  /* Renk & Tipografi */
  background-color: var(--red-500, #ef4444);
  color: var(--white, #ffffff);
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: -0.16px;
  
  /* Kenarlık & Efektler */
  border: none;
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Hover & Active States */
  &:hover:not(:disabled) {
    background-color: var(--red-600, #dc2626);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.12);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 3px rgba(0,0,0,0.1);
  }

  /* Responsive */
  @media (max-width: 640px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 0.875rem;
  }

  /* İkonlu Versiyon */
  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5px;
  }

  /* Disabled State */
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    filter: grayscale(0.4);
  }

  /* Focus State */
  &:focus-visible {
    outline: 2px solid var(--red-300, #fca5a5);
    outline-offset: 2px;
  }

  @media screen and (max-width: 700px) { // <-- Breakpoint'i 700px yapalım tutarlılık için
    // width: 100%; // Eğer ayrı bir satırda olmasını istiyorsanız kalsın
    width: auto; // Diğer öğelerle yan yana ortalanacaksa auto yapın
    padding: 10px 20px; // Padding ayarı
    font-size: 0.875rem;
    margin: 5px; // Margin ayarı
    // order: 10; // Sıralama ayarı
  }
`;

export const FooterText = styled.p`
  font-size: 0.8rem; /* Küçük font boyutu */
  color: var(--text-light, rgba(230, 230, 250, 0.6)); /* Soluk renk */
  text-align: center; /* Ortala */
  padding: 15px 0; /* Üst/alt boşluk */
  margin-top: 20px; /* Üstündeki elemandan (muhtemelen buton) boşluk bırak */
  /* Mobil görünümde gerekirse ek ayar yapılabilir */
   @media screen and (max-width: 700px) {
     margin-top: 15px; /* Üst boşluk */
     padding: 10px 0;
     clear: none; /* <-- KALDIRILDI: float yoksa clear gerekmez */
     width: 100%; /* Tam genişlik */
     order: 99; /* Flex sıralamasında en sona koy */
     text-align: center; /* Metni ortala */
  }
`;

export const LoginButton = styled.button`
  /* Temel Stil */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: min(90%, 200px);
  padding: 14px 24px;
  margin: 20px 20px auto;
  position: relative; /* Shine efekti için gerekli */
  overflow: hidden; /* Fazla taşan efektleri keser */
  
  /* Gradient Arkaplan */
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 1) 0%,
    rgba(79, 70, 229, 1) 100%
  );
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.15);

  /* Hover Efekti */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.9) 0%,
      rgba(79, 70, 229, 0.9) 100%
    );

    &::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -60%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: rotate(30deg);
      animation: shine 1.5s infinite;
    }
  }

  /* Aktif Durum */
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(79, 70, 229, 0.3);
    transition: all 0.1s ease;
  }

  /* Shine Animasyonu */
  @keyframes shine {
    0% { left: -60%; }
    20% { left: 100%; }
    100% { left: 100%; }
  }

   @media screen and (max-width: 700px) { // <-- Breakpoint'i 700px yapalım
    // width: 100%; // Ayrı satırda olacaksa kalsın
    width: auto; // Diğerleriyle ortalanacaksa auto
    padding: 10px 20px;
    margin: 5px; // Margin ayarı
    // order: 10; // Sıralama ayarı

    &:hover {
      transform: none;
      box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
    }
  }
`;