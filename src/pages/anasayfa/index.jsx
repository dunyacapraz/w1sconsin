import React from "react";
import { NavLink } from "react-router-dom";
import * as S from "./styles"; // Stillere ek olarak GlobalStyle'ı da import et
import {
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaBrain,
    FaChartLine,
    FaFlask
} from "react-icons/fa";

// --- Test Verileri (Aynı kalabilir) ---
const tests = [
    {
      name: "Wisconsin Kart Sınıflandırma Testi (WCST)",
      path: "/wcst-test",
      description: "Prefrontal korteks fonksiyonlarını ve yönetici işlevleri değerlendiren klinik altın standart",
      icon: <FaBrain />, // Size prop'u stil tarafına taşındı
      details: [
        "Frontal lob hasarı ve demans taramasında etkin",
        "Bilişsel esneklik ve perseverasyon ölçümü",
        "DSM-5 kriterlerine uygun standardizasyon",
        "6-85 yaş aralığı için norm değerleri",
        "Dikkat, hafıza ve soyut düşünme becerilerini test eder"
      ],
      info: "..."
    },
    {
      name: "Iowa Kumar Görevi Testi",
      path: "/iowa-kumar-test",
      description: "Risk değerlendirme ve uzun vadeli karar stratejilerinin nöral temellerini analiz eder",
      icon: <FaChartLine />,
      details: [
        "Ventromedial prefrontal korteks fonksiyon ölçümü",
        "Gerçek zamanlı somatik belirteç analizi",
        "Psikopati ve davranış bozukluklarında tanısal araç",
        "Finansal karar verme becerisi değerlendirmesi",
        "Nöropsikolojik araştırmalarda ve klinik değerlendirmelerde yaygın olarak uygulanır"
      ],
      info: "..."
    },
    {
      name: "D2 Dikkat Testi",
      path: "/d2-test-result",
      description: "Sürekli dikkat ve mental konsantrasyonun psikometrik ölçümü",
      icon: <FaFlask />,
      details: [
        "Görsel tarama hızı ve doğruluk analizi",
        "İşlevsel MR korelasyonlu performans metrikleri",
        "DEHB ve öğrenme güçlüğü tarama protokolü",
        "Genellikle dikkat eksikliğini tespit etmek için kullanılır.",
        "Zaman sınırlı bir test olup, hızlı ve doğru tepki verme yetisini ölçer"
      ],
      info: "..."
    },
];

function Anasayfa() {
  // Animasyon başlangıç gecikmesi (saniye cinsinden)
  const baseAnimationDelay = 0.6;

  return (
    <> {/* Fragment kullanarak GlobalStyle'ı Wrapper ile aynı seviyede ekleyin */}
      <S.GlobalStyle />
      <S.Wrapper>
        <S.Header>
          {/* Başlık ve Altbaşlık Header içinde stillendiriliyor */}
          <S.Title>CognitiveCheck</S.Title>
          <S.Subtitle>Nöropsikolojik Yeteneklerinizi Keşfedin ve Geliştirin</S.Subtitle>
        </S.Header>

        <S.Content>
          <S.TestSection>
            <h3>Klinik Testler</h3>
            <S.TestGrid>
              {tests.map((test, index) => (
                <S.TestCard
                  key={index}
                  // Kartların sıralı belirmesi için animasyon gecikmesi
                  style={{ animationDelay: `${baseAnimationDelay + index * 0.15}s` }}
                >
                  <S.TestIcon>{test.icon}</S.TestIcon>
                  <h4>{test.name}</h4>
                  <p>{test.description}</p>
                  <S.DetailList>
                    {test.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </S.DetailList>
                  <S.StartButton to={test.path}>
                    Teste Başla
                  </S.StartButton>
                </S.TestCard>
              ))}
            </S.TestGrid>
          </S.TestSection>

          <S.ContactSection>
            <h3>Bize Ulaşın</h3>
            <S.SocialLinks>
              <a href="https://facebook.com/cognitivecheck" target="_blank" rel="noreferrer" aria-label="CognitiveCheck Facebook Sayfası">
                <FaFacebook /> {/* Size prop'u stil tarafına taşındı */}
              </a>
              <a href="https://twitter.com/cognitivecheck" target="_blank" rel="noreferrer" aria-label="CognitiveCheck Twitter Profili">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com/company/cognitivecheck" target="_blank" rel="noreferrer" aria-label="CognitiveCheck LinkedIn Şirket Sayfası">
                <FaLinkedin />
              </a>
            </S.SocialLinks>
          </S.ContactSection>
        </S.Content>
        {/* Opsiyonel: Footer eklenebilir */}
        {/* <S.Footer>© 2025 CognitiveCheck. Tüm hakları saklıdır.</S.Footer> */}
      </S.Wrapper>
    </>
  );
}

export default Anasayfa;