import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Wrapper = styled.div`
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
  padding: 2rem;
  line-height: 1.6;
`;
export const Header = styled.header`
  text-align: center;
  padding: 10rem 0; /* Yüksek padding ile genişletildi */
  border-radius: 1rem;
  margin-bottom: 6rem; /* Alt boşluk artırıldı */
  position: relative;
  overflow: hidden;
  color: white;
  
  /* Resim daha net gözükmesi için opaklık azaltıldı */
  background: url('/images/header-bg.jpg') center/cover no-repeat;
  background-color: var(--primary);
  

  /* Fallback gradient (resim yüklenmezse) */
  background-color: var(--primary);

  &::before {
    content: '';
    position: absolute;
    top: -3rem; /* Yukarı doğru uzatıldı */
    left: 0;
    width: 100%;
    height: calc(100% + 6rem); /* Yükseklik artırıldı */
    background: rgba(0, 0, 0, 0.2); /* Daha şeffaf bir overlay */
    z-index: 1;
  }

`;



export const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  background: linear-gradient(45deg, #fff 30%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
`;

export const Subtitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 300;
  opacity: 0.9;
  color: rgba(230, 230, 250, 0.8);
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 5rem;
  padding: 3rem;
  background: var(--card-bg);
  border-radius: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--card-border);

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  h2 {
    font-size: 2.8rem;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    background: linear-gradient(45deg, var(--text) 30%, var(--secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.2rem;
    color: var(--text-light);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const InfoGraphic = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(145deg, rgba(108, 92, 231, 0.2) 0%, rgba(26, 27, 38, 0.5) 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--primary);

  &::before {
    content: '📊';
    font-size: 4rem;
    opacity: 0.5;
  }
`;

export const DescriptionBox = styled.div`
  background: var(--card-bg);
  padding: 3rem;
  border-radius: 1.5rem;
  margin-bottom: 3rem;
  border: 1px solid var(--card-border);

  h3 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--text);
  }

  p {
    color: var(--text-light);
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

export const FeatureCard = styled.div`
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid var(--card-border);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  svg {
    color: var(--primary);
    margin-bottom: 1rem;
    font-size: 2.5rem;
  }

  h4 {
    color: var(--text);
    margin: 1rem 0;
    font-size: 1.3rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
    font-size: 1rem;
  }
`;

export const ProcedureSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(108, 92, 231, 0.05);
  border-radius: 1rem;
  border: 1px solid var(--card-border);

  h4 {
    color: var(--text);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  ol {
    padding-left: 1.5rem;
    
    li {
      color: var(--text-light);
      margin-bottom: 1rem;
      padding-left: 0.5rem;
      font-size: 1.1rem;
      
      &::marker {
        color: var(--primary);
        font-weight: bold;
      }
    }
  }
`;

export const TestSection = styled.section`
  margin: 4rem 0;
  
  h3 {
    color: var(--text);
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

export const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export const TestCard = styled.div`
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--card-border);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    
    &::before {
      opacity: 1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, rgba(108, 92, 231, 0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

export const TestIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
`;

export const DetailList = styled.ul`
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  
  li {
    color: var(--text-light);
    margin-bottom: 0.8rem;
    font-size: 1rem;
    position: relative;
    padding-left: 1.5rem;
    
    &::before {
      content: '✓';
      color: var(--primary);
      position: absolute;
      left: 0;
      font-weight: bold;
    }
  }
`;

export const StartButton = styled(NavLink)`
  display: inline-block;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white !important;
  padding: 0.8rem 1.8rem;
  border-radius: 0.7rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-size: 1rem;
  margin-top: 1rem;
  width: 100%;
  text-align: center;

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

  &:hover {
    box-shadow: 0 5px 20px rgba(108, 92, 231, 0.4);
    transform: translateY(-2px);
  }
`;

export const InfoLink = styled(NavLink)`
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 0.2rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--primary);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  &:hover {
    color: var(--secondary);
  }
`;

export const FaqSection = styled.section`
  background: var(--card-bg);
  padding: 1.5rem; /* Daha az padding */
  border-radius: 0.8rem; /* Daha küçük border-radius */
  margin-top: 2rem; /* Daha az üst boşluk */
  border: 1px solid var(--card-border);
  max-width: 500px; /* Sabit genişlik (opsiyonel) */
  margin-left: auto;
  margin-right: auto;
  
  h3 {
    color: var(--text);
    margin-bottom: 1.5rem; /* Başlık alt boşluğu azaltıldı */
    font-size: 1.5rem; /* Daha küçük font */
    text-align: center;
  }
`;

export const FaqItem = styled.div`
  padding: 1.5rem;
  background: rgba(108, 92, 231, 0.05);
  border-radius: 0.8rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }

  dt {
    color: var(--text);
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  dd {
    color: var(--text-light);
    line-height: 1.6;
    margin-left: 0;
    font-size: 1rem;
  }
`;

export const RunBox = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

export const RunLink = styled(NavLink)`
  text-decoration: none;
`;

export const Button = styled.button`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.7rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
  display: inline-block;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(108, 92, 231, 0.4);
  }
`;

export const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin: 2rem 0;
  border-radius: 0.8rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--card-border);
`;
// İletişim konteynırı
export const ContactContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

// İletişim öğesi
export const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(108, 92, 231, 0.05);
  border-radius: 0.8rem;
  border: 1px solid rgba(108, 92, 231, 0.1);

  svg {
    color: #6c5ce7;
    flex-shrink: 0;
  }

  h4 {
    color: #e6e6fa;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  p {
    color: rgba(230, 230, 250, 0.8);
    line-height: 1.6;
  }

  a {
    color: #8477e6;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #6c5ce7;
      text-decoration: underline;
    }
  }
`;

// Sosyal medya linkleri
export const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 3rem;

  a {
    color: #a8a5e6;
    transition: color 0.3s ease;

    &:hover {
      color: #6c5ce7;
    }
  }
`;