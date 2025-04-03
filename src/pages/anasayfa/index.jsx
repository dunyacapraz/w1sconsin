import React from "react";
import { NavLink } from "react-router-dom";
import * as S from "./styles";
import {  FaMapMarkerAlt, 
    FaPhone, 
    FaEnvelope, 
    FaClock,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaBrain,
    FaChartLine,
    FaFlask
} from "react-icons/fa";


function Anasayfa() {

   const tests = [
  {
    name: "Wisconsin Kart Sınıflandırma Testi (WCST)",
    path: "/wcst-test",
    description: "Prefrontal korteks fonksiyonlarını ve yönetici işlevleri değerlendiren klinik altın standart",
    icon: <FaBrain size={40} />,
    details: [
      " Frontal lob hasarı ve demans taramasında etkin",
      " Bilişsel esneklik ve perseverasyon ölçümü",
      " DSM-5 kriterlerine uygun standardizasyon",
      " 6-85 yaş aralığı için norm değerleri",
      "Dikkat, hafıza ve soyut düşünme becerilerini test eder"
    ],
    info: "Kartların soyut kategorilerle eşleştirilmesi prensibine dayanan test, hastanın değişen kurallara uyum sağlama yeteneğini ölçer. Yönetici işlev bozukluklarının erken teşhisinde kritik rol oynar."
  },
  {
    name: "Iowa Kumar Görevi Testi",
    path: "/iowa-kumar-test",
    description: "Risk değerlendirme ve uzun vadeli karar stratejilerinin nöral temellerini analiz eder",
    icon: <FaChartLine size={40} />,
    details: [
      " Ventromedial prefrontal korteks fonksiyon ölçümü",
      " Gerçek zamanlı somatik belirteç analizi",
      " Psikopati ve davranış bozukluklarında tanısal araç",
      " Finansal karar verme becerisi değerlendirmesi",
      "Nöropsikolojik araştırmalarda ve klinik değerlendirmelerde yaygın olarak uygulanır"
    ],
    info: "Simüle edilmiş kumar ortamında yapılan seçimlerle, hastaların gelecek sonuçları tahmin ve yönetme kapasitesini ölçer. Özellikle orbitofrontal sendrom tanısında kritik öneme sahiptir."
  },
  {
    name: "D2 Dikkat Testi",
    path: "/d2-test-result",
    description: "Sürekli dikkat ve mental konsantrasyonun psikometrik ölçümü",
    icon: <FaFlask size={40} />,
    details: [
      " Görsel tarama hızı ve doğruluk analizi",
      " İşlevsel MR korelasyonlu performans metrikleri",
      " DEHB ve öğrenme güçlüğü tarama protokolü",
      " Genellikle dikkat eksikliğini tespit etmek için kullanılır.",
      " Zaman sınırlı bir test olup, hızlı ve doğru tepki verme yetisini ölçer"
    ],
    info: "Sembolik uyaranların hızlı işlenmesini gerektiren test, seçici dikkatin niceliksel olarak ölçülmesini sağlar. Özellikle akademik performans ve mesleki yeterlilik değerlendirmelerinde referans alınır."
  },
   
];
  const features = [
    {
      title: "Bilimsel Geçerlilik",
      content: "Tüm testler DSM-5 ve ICD-11 kriterlerine uygun olarak standardize edilmiştir"
    },
    {
      title: "Güvenli Veri Saklama",
      content: "HIPAA uyumlu sunucularda şifrelenmiş veri depolama"
    },
    {
      title: "Uzman Desteği",
      content: "Nöropsikologlar tarafından hazırlanmış yorumlu sonuç raporları"
    }
  ];

  return (
    <S.Wrapper>
      <S.Header>
      </S.Header>

      <S.Content>

        <S.TestSection>
          <h3>Test Bataryamız</h3>
          <S.TestGrid>
            {tests.map((test, index) => (
              <S.TestCard key={index}>
                <S.TestIcon>{test.icon}</S.TestIcon>
                <h4>{test.name}</h4>
                <p>{test.description}</p>
                <S.DetailList>
                  {test.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </S.DetailList>
                <NavLink to={test.path}>
                <S.StartButton 
                        as={NavLink}
                        to={test.path}
                        style={({ isActive }) => ({ 
                         background: isActive ? '#4b3f9e' : '#6c5ce7' 
                            })}
                            >
                              Teste Başla
                            </S.StartButton>
                </NavLink>
                
              </S.TestCard>
            ))}
          </S.TestGrid>
        </S.TestSection>

        <S.FaqSection>
  <h3>İletişim</h3>
  

  <S.SocialLinks>
    <a href="https://facebook.com/cognitivecheck" target="_blank" rel="noreferrer">
      <FaFacebook size={25} />
    </a>
    <a href="https://twitter.com/cognitivecheck" target="_blank" rel="noreferrer">
      <FaTwitter size={25} />
    </a>
    <a href="https://linkedin.com/company/cognitivecheck" target="_blank" rel="noreferrer">
      <FaLinkedin size={25} />
    </a>
  </S.SocialLinks>
</S.FaqSection>
      </S.Content>
    </S.Wrapper>
  );
}

export default Anasayfa;