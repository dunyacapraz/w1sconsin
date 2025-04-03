import React, { useState } from "react";
import {
  AppContainer,
  TitleContainer,
  InputContainer,
  InputRow,
  Label,
  Input,
  Button,
  ResultContainer,
} from "./styles";

// Norm tablosu verileri
const TN_NORM = [
  { min: 165, max: 171, percentile: 0.1 }, { min: 172, max: 178, percentile: 0.2 },
  { min: 179, max: 186, percentile: 0.3 }, { min: 187, max: 193, percentile: 0.4 },
  { min: 194, max: 200, percentile: 0.5 }, { min: 201, max: 207, percentile: 0.6 },
  { min: 208, max: 214, percentile: 0.8 }, { min: 215, max: 222, percentile: 1.1 },
  { min: 223, max: 229, percentile: 1.4 }, { min: 230, max: 236, percentile: 1.8 },
  { min: 237, max: 243, percentile: 2.3 }, { min: 244, max: 250, percentile: 2.9 },
  { min: 251, max: 258, percentile: 3.5 }, { min: 259, max: 265, percentile: 4.5 },
  { min: 266, max: 272, percentile: 5.5 }, { min: 273, max: 279, percentile: 6.7 },
  { min: 280, max: 286, percentile: 8.1 }, { min: 287, max: 294, percentile: 9.7 },
  { min: 295, max: 301, percentile: 11.5 }, { min: 302, max: 308, percentile: 13.6 },
  { min: 309, max: 315, percentile: 15.9 }, { min: 316, max: 322, percentile: 18.4 },
  { min: 323, max: 330, percentile: 21.2 }, { min: 331, max: 337, percentile: 24.2 },
  { min: 338, max: 344, percentile: 27.4 }, { min: 345, max: 351, percentile: 30.9 },
  { min: 352, max: 358, percentile: 34.5 }, { min: 359, max: 366, percentile: 38.2 },
  { min: 367, max: 373, percentile: 42.1 }, { min: 374, max: 380, percentile: 46.0 },
  { min: 381, max: 387, percentile: 50.0 }, { min: 388, max: 394, percentile: 54.0 },
  { min: 395, max: 401, percentile: 57.9 }, { min: 402, max: 409, percentile: 61.8 },
  { min: 410, max: 416, percentile: 65.5 }, { min: 417, max: 423, percentile: 69.2 },
  { min: 424, max: 430, percentile: 72.6 }, { min: 431, max: 437, percentile: 75.8 },
  { min: 438, max: 445, percentile: 78.8 }, { min: 446, max: 452, percentile: 81.6 },
  { min: 453, max: 459, percentile: 84.1 }, { min: 460, max: 466, percentile: 86.4 },
  { min: 467, max: 473, percentile: 88.5 }, { min: 474, max: 481, percentile: 90.3 },
  { min: 482, max: 488, percentile: 91.9 }, { min: 489, max: 495, percentile: 93.3 },
  { min: 496, max: 502, percentile: 94.5 }, { min: 503, max: 509, percentile: 95.5 },
  { min: 510, max: 517, percentile: 96.4 }, { min: 518, max: 524, percentile: 97.1 },
  { min: 525, max: 531, percentile: 97.7 }, { min: 532, max: 538, percentile: 98.2 },
  { min: 539, max: 545, percentile: 98.6 }, { min: 546, max: 553, percentile: 98.9 },
  { min: 554, max: 560, percentile: 99.2 }, { min: 561, max: 567, percentile: 99.4 },
  { min: 568, max: 574, percentile: 99.5 }, { min: 575, max: 581, percentile: 99.6 },
  { min: 582, max: 589, percentile: 99.7 }, { min: 590, max: 596, percentile: 99.8 },
  { min: 597, max: 603, percentile: 99.9 }
];

const TN_E_NORM = [
  { min: 155, max: 161, percentile: 0.1 }, { min: 162, max: 168, percentile: 0.2 },
  { min: 169, max: 175, percentile: 0.3 }, { min: 176, max: 181, percentile: 0.4 },
  { min: 182, max: 188, percentile: 0.5 }, { min: 189, max: 195, percentile: 0.6 },
  { min: 196, max: 202, percentile: 0.8 }, { min: 203, max: 209, percentile: 1.1 },
  { min: 210, max: 215, percentile: 1.4 }, { min: 216, max: 222, percentile: 1.8 },
  { min: 223, max: 229, percentile: 2.3 }, { min: 230, max: 236, percentile: 2.9 },
  { min: 237, max: 243, percentile: 3.5 }, { min: 244, max: 249, percentile: 4.5 },
  { min: 250, max: 256, percentile: 5.5 }, { min: 257, max: 263, percentile: 6.7 },
  { min: 264, max: 270, percentile: 8.1 }, { min: 271, max: 277, percentile: 9.7 },
  { min: 278, max: 283, percentile: 11.5 }, { min: 284, max: 290, percentile: 13.6 },
  { min: 291, max: 297, percentile: 15.9 }, { min: 298, max: 304, percentile: 18.4 },
  { min: 305, max: 311, percentile: 21.2 }, { min: 312, max: 317, percentile: 24.2 },
  { min: 318, max: 324, percentile: 27.4 }, { min: 325, max: 331, percentile: 30.9 },
  { min: 332, max: 338, percentile: 34.5 }, { min: 339, max: 345, percentile: 38.2 },
  { min: 346, max: 351, percentile: 42.1 }, { min: 352, max: 358, percentile: 46.0 },
  { min: 359, max: 365, percentile: 50.0 }, { min: 366, max: 372, percentile: 54.0 },
  { min: 373, max: 378, percentile: 57.9 }, { min: 379, max: 385, percentile: 61.8 },
  { min: 386, max: 392, percentile: 65.5 }, { min: 393, max: 399, percentile: 69.2 },
  { min: 400, max: 406, percentile: 72.6 }, { min: 407, max: 412, percentile: 75.8 },
  { min: 413, max: 419, percentile: 78.8 }, { min: 420, max: 426, percentile: 81.6 },
  { min: 427, max: 433, percentile: 84.1 }, { min: 434, max: 440, percentile: 86.4 },
  { min: 441, max: 446, percentile: 88.5 }, { min: 447, max: 453, percentile: 90.3 },
  { min: 454, max: 460, percentile: 91.9 }, { min: 461, max: 467, percentile: 93.3 },
  { min: 468, max: 474, percentile: 94.5 }, { min: 475, max: 480, percentile: 95.5 },
  { min: 481, max: 487, percentile: 96.4 }, { min: 488, max: 494, percentile: 97.1 },
  { min: 495, max: 501, percentile: 97.7 }, { min: 502, max: 508, percentile: 98.2 },
  { min: 509, max: 514, percentile: 98.6 }, { min: 515, max: 521, percentile: 98.9 },
  { min: 522, max: 528, percentile: 99.2 }, { min: 529, max: 535, percentile: 99.4 },
  { min: 536, max: 542, percentile: 99.5 }, { min: 543, max: 548, percentile: 99.6 },
  { min: 549, max: 555, percentile: 99.7 }, { min: 556, max: 562, percentile: 99.8 },
  { min: 563, max: 569, percentile: 99.9 }
];

const HATA_YUZDESI_NORM = [
  { value: 13.5, percentile: 10 }, { value: 7.1, percentile: 25 },
  { value: 4.4, percentile: 50 }, { value: 2.6, percentile: 75 },
  { value: 1.4, percentile: 90 }
];

const FR_NORM = [
  { value: 21, percentile: 10 },
  { value: 16, percentile: 25 },
  { value: 11, percentile: 50 },
  { value: 10, percentile: 75 },
  { value: 7, percentile: 90 }
];

const D2PuanHesaplama = () => {
  const [TM, setTM] = useState("");
  const [H1, setH1] = useState("");
  const [H2, setH2] = useState("");
  const [ilk4, setIlk4] = useState("");
  const [orta6, setOrta6] = useState("");
  const [son4, setSon4] = useState("");
  const [maxTM, setMaxTM] = useState("");
  const [minTM, setMinTM] = useState("");
  const [result, setResult] = useState(null);
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const getPercentile = (value, type) => { 
    if (type === 'TN') {
      const entry = TN_NORM.find(e => value >= e.min && value <= e.max);
      return entry ? entry.percentile * 100 : 0;
    }
    if (type === 'TN-E') {
      const entry = TN_E_NORM.find(e => value >= e.min && value <= e.max);
      return entry ? entry.percentile * 100 : 0;
    }
    if (type === 'HataYuzdesi') {
      const entry = HATA_YUZDESI_NORM.find(e => value >= e.value);
      return entry ? entry.percentile : 100;
    }
    if (type === 'FR') {
      const entry = FR_NORM.find(e => value >= e.value);
      return entry ? entry.percentile : 100;
    }
    return 0;
  };

  const getInterpretation = (percentile, type) => {
    let interpretation = "";
    let color = "";
    let explanation = "";

    if (type === 'TN') {
      if (percentile < 10) {
        interpretation = "Kritik Sorun";
        color = "#e74c3c";
        explanation = "Psikomotor hızda ciddi düşüklük! Algı-kavrama ve motor tepki arasındaki uyum bozulmuş. Zihinsel işlemleme ve fiziksel yanıt arasında belirgin kopukluk.";
      } else if (percentile <= 25) {
        interpretation = "Sınırda";
        color = "#f39c12";
        explanation = "Psikomotor hız beklenenin altında: Algı-hareket koordinasyonunda tutarsızlık mevcut. Tepki sürelerinde dalgalanmalar gözleniyor.";
      } else if (percentile <= 75) {
        interpretation = "Normal";
        color = "#3498db";
        explanation = "Normal psikomotor hız: Algıladığını harekete dökme becerisi beklentilerle uyumlu. Zihinsel işlemleme ve motor yanıt dengeli.";
      } else if (percentile <= 90) {
        interpretation = "İyi";
        color = "#2ecc71";
        explanation = "Yüksek psikomotor performans: Hızlı kavrama ve etkin motor yanıt kombinasyonu mevcut.";
      } else if (percentile <= 97.1) {
        interpretation = "Yüksek";
        color = "#2980b9";
        explanation = "Üstün bilişsel-motor entegrasyon: Algı-hareket döngüsünde olağanüstü hız ve doğruluk.";
      } else {
        interpretation = "Çok Yüksek";
        color = "#9b59b6";
        explanation = "Mükemmel psikomotor senkronizasyon: Görsel algı ile motor tepki arasında minimal gecikme.";
      }
    } else if (type === 'TN-E') {
      if (percentile < 10) {
        interpretation = "Kritik Sorun";
        color = "#e74c3c";
        explanation = "Test performansı çok düşük: Psikomotor hız ile dikkat arasındaki denge bozulmuş. Dikkat eksikliği belirgin.";
      } else if (percentile <= 25) {
        interpretation = "Sınırda";
        color = "#f39c12";
        explanation = "Dengesiz performans: Motor hızda dalgalanmalar ve seçici dikkatte zayıflık kombinasyonu.";
      } else if (percentile <= 75) {
        interpretation = "Normal";
        color = "#3498db";
        explanation = "Optimal denge: Psikomotor hız ile seçici dikkat arasında beklenen uyum mevcut. Temel performans kriterleri karşılanıyor.";
      } else if (percentile <= 90) {
        interpretation = "İyi";
        color = "#2ecc71";
        explanation = "Kaliteli performans: Hız-dikkat dengesi ideal seviyede. Zorlu koşullarda bile tutarlılık gösteriyor.";
      } else if (percentile <= 97.1) {
        interpretation = "Yüksek";
        color = "#2980b9";
        explanation = "Üstün bütünleşik performans: Motor beceri ve odaklanma kapasitesi mükemmel uyumlu.";
      } else {
        interpretation = "Çok Yüksek";
        color = "#9b59b6";
        explanation = "Sıra dışı performans: Uzun süreli dikkat ve yüksek hız kombinasyonuyla maksimum verimlilik.";
      }
    } else if (type === 'HataYuzdesi') {
      if (percentile < 10) {
        interpretation = "Sorun";
        color = "#e74c3c";
        explanation = "Yüksek hata oranı: Dikkat dağınıklığı ve odaklanma sorunları belirgin. Çalışma kalitesi düşük.";
      } else if (percentile <= 25) {
        interpretation = "Sınırda";
        color = "#f39c12";
        explanation = "Sınırda hata yüzdesi: Dikkatte hafif dalgalanmalar ve konsantrasyon zorlukları mevcut.";
      } else if (percentile <= 75) {
        interpretation = "Normal";
        color = "#3498db";
        explanation = "Kabul edilebilir hata aralığı: Beklenen düzeyde odaklanma ve dikkat sürekliliği.";
      } else if (percentile <= 90) {
        interpretation = "İyi";
        color = "#2ecc71";
        explanation = "Düşük hata oranı: İstikrarlı dikkat performansı ve yüksek çalışma kalitesi.";
      } else if (percentile <= 97.1) {
        interpretation = "Yüksek";
        color = "#2980b9";
        explanation = "Minimum hata: Üstün odaklanma becerisi ve olağanüstü detay algısı.";
      } else {
        interpretation = "Çok Yüksek";
        color = "#9b59b6";
        explanation = "Neredeyse kusursuz performans: Maksimum dikkat kontrolü ve hatasız işlemleme.";
      }
    } else if (type === 'FR') {
      if (percentile < 10) {
        interpretation = "Kritik İstikrarsızlık";
        color = "#e74c3c";
        explanation = "Aşırı performans farkı: Motivasyon kaybı ve dikkat sürekliliğinde ciddi sorunlar. İşlevsel bozulma mevcut.";
      } else if (percentile <= 25) {
        interpretation = "Riskli Dağılım";
        color = "#f39c12";
        explanation = "Belirgin performans dalgalanmaları: Dikkat yönetiminde zorluklar ve istikrarsız motivasyon.";
      } else if (percentile <= 75) {
        interpretation = "Normal Varyasyon";
        color = "#3498db";
        explanation = "Beklenen performans değişkenliği: Doğal konsantrasyon dalgalanmalarıyla uyumlu.";
      } else if (percentile <= 90) {
        interpretation = "İstikrarlı Performans";
        color = "#2ecc71";
        explanation = "Düşük performans farkı: Tutarlı dikkat sürekliliği ve sağlam motivasyon düzeyi.";
      } else if (percentile <= 97.1) {
        interpretation = "Üstün Tutarlılık";
        color = "#2980b9";
        explanation = "Minimum performans değişkenliği: Yüksek seviyede zihinsel dayanıklılık ve odaklanma becerisi.";
      } else {
        interpretation = "Çok iyi";
        color = "#9b59b6";
        explanation = "Maksimum istikrar: Tepki sürelerinde neredeyse hiç değişkenlik yok. Sürekli optimal performans.";
      }
    } else if (type === 'E1') {
      const deger = parseInt(H1);
      if (deger >= 30) {
        interpretation = "Ciddi Seçici Dikkat Sorunu";
        color = "#e74c3c";
        explanation = "İleri düzey dikkat eksikliği: Hedef uyaranları ayırt etmede belirgin güçlük. Görsel tarama ve odaklanma yeteneği bozulmuş.";
      } else if (deger >= 20) {
        interpretation = "Orta Derecede Dikkat Eksikliği";
        color = "#f39c12";
        explanation = "Seçici dikkatte bozulma: Görsel dikkat dağıtıcıları filtrelemede zorlanma. Yanıt inhibisyonu zayıf.";
      } else if (deger >= 15) {
        interpretation = "Hafif Seçici Dikkat Problemi";
        color = "#3498db";
        explanation = "Sınırda dikkat performansı: Zaman zaman hedef dışı uyaranlara yanıt verme eğilimi mevcut.";
      } else {
        interpretation = "İdeal Seçici Dikkat";
        color = "#2ecc71";
        explanation = "Hedef odaklı performans: Görsel dikkat dağıtıcıları etkin şekilde filtreleme becerisi gelişmiş.";
      }
    } else if (type === 'E2') {
      const deger = parseInt(H2);
      if (deger >= 30) {
        interpretation = "Ciddi Öğrenme Güçlüğü";
        color = "#e74c3c";
        explanation = "Nörobilişsel fonksiyonlarda bozulma: Görsel ayrımlaştırma ve yönerge takibinde ciddi eksiklikler. Özgül öğrenme güçlüğü işaretleri mevcut.";
      } else if (deger >= 20) {
        interpretation = "Orta Derecede Öğrenme Zorluğu";
        color = "#f39c12";
        explanation = "Bilişsel işlemleme sorunları: Görsel-motor entegrasyon ve kural uygulamada tutarsızlıklar.";
      } else if (deger >= 15) {
        interpretation = "Hafif Öğrenme Güçlüğü";
        color = "#3498db";
        explanation = "Sınırda performans: Yeni beceri edinme ve görsel desenleri öğrenmede hafif gecikmeler.";
      } else {
        interpretation = "Normal Öğrenme Kapasitesi";
        color = "#2ecc71";
        explanation = "Etkin öğrenme becerisi: Görsel ayrımlaştırma ve kural internalizasyonu başarılı.";
      }
    }

    return { interpretation, color, explanation };
  };

  const handleCalculate = () => {
    const H = parseInt(H1) + parseInt(H2);
    const hataYuzdesi = (H / parseInt(TM)) * 100;
    const TM_H = parseInt(TM) - H;
    const KP = (parseInt(ilk4) / 4) + (parseInt(orta6) / 6) + (parseInt(son4) / 4);
    const DO = parseInt(maxTM) - parseInt(minTM);
    
    const ilk4Sonuc = parseInt(ilk4) / 4;
    const orta6Sonuc = parseInt(orta6) / 6;
    const son4Sonuc = parseInt(son4) / 4;
    
    setResult({
      TM,
      TM_percentile: getPercentile(TM, 'TN'),
      H,
      hataYuzdesi,
      hataYuzdesi_percentile: getPercentile(hataYuzdesi, 'HataYuzdesi'),
      TM_H,
      TM_H_percentile: getPercentile(TM_H, 'TN-E'),
      H1,
      H2,
      DO,
      DO_percentile: getPercentile(DO, 'FR'),
      KP,
      ilk4Sonuc,
      orta6Sonuc,
      son4Sonuc
    });
  };

  const generateClinicalComment = () => {
    if (!result) return null;
  
    const comparisons = {
      Dikkat: [
        { 
          label: "Toplam Hata (E)", 
          value: result.H,
          ...getInterpretation(result.H, 'E1') 
        },
        { 
          label: "Hata Yüzdesi (%E)", 
          value: result.hataYuzdesi.toFixed(2),
          ...getInterpretation(result.hataYuzdesi_percentile, 'HataYuzdesi') 
        },
      ],
      motor: [
        { 
          label: "Toplam Madde (TN)", 
          value: result.TM,
          ...getInterpretation(result.TM_percentile, 'TN') 
        },
        { 
          label: "TN-E Değeri", 
          value: result.TM_H,
          ...getInterpretation(result.TM_H_percentile, 'TN-E') 
        },
      ],
      istikrar: [
        { 
          label: "FR (Performans Farkı)", 
          value: result.DO,
          ...getInterpretation(result.DO_percentile, 'FR') 
        },
      ],
      öğrenme: [
        { 
          label: "E1 (Seçici Dikkat)", 
          value: result.H1,
          ...getInterpretation(result.H1, 'E1') 
        },
        { 
          label: "E2 (Öğrenme Güçlüğü)", 
          value: result.H2,
          ...getInterpretation(result.H2, 'E2') 
        },
      ]
    };
  
    const specialLabels = [
      "Hata Yüzdesi (%E)", 
      "TN-E Değeri", 
      "FR (Performans Farkı)",
      "Toplam Hata (E)",
      "Toplam Madde (TN)",
      "E1 (Seçici Dikkat)",
      "E2 (Öğrenme Güçlüğü)"
    ];
  
    return (
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        {/* Dikey Sıralı Kart Düzeni */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          padding: '15px 0'
        }}>
          {Object.entries(comparisons).map(([category, metrics]) => (
            <div key={category} style={{
              background: 'rgba(16, 32, 45, 0.95)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {/* Kategori Başlığı */}
              <div style={{
                borderLeft: '4px solid #00c7ff',
                paddingLeft: '12px',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: 0,
                  color: '#00c7ff',
                  fontSize: '16px',
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
              </div>
  
              {/* Metric Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {metrics.map((metric, index) => (
                  <div key={index} style={{
                    background: 'rgba(0, 167, 207, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Sol Kenar Çizgisi */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: metric.color
                    }} />
  
                    {/* İçerik */}
                    <div style={{ marginLeft: '12px' }}>
                      {/* Üst Satır */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#e6edf3',
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                          flex: '1 1 200px'
                        }}>
                          {metric.label}
                        </span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            color: metric.color,
                            fontWeight: 600,
                            fontSize: '13px',
                            whiteSpace: 'nowrap'
                          }}>
                            {metric.interpretation}
                          </span>
                          <span style={{
                            background: 'rgba(0, 167, 207, 0.2)',
                            color: '#00c7ff',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            minWidth: '50px',
                            textAlign: 'center'
                          }}>
                            {metric.value}
                          </span>
                        </div>
                      </div>
  
                      {/* Açıklama */}
                      <div style={{
                        color: '#8a9ba8',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        borderTop: '1px dashed rgba(138, 155, 168, 0.2)',
                        paddingTop: '8px',
                        marginTop: '8px'
                      }}>
                        {metric.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
 


        {/* Konsantrasyon Puanı */}
        <div style={{
        marginTop: 20,
        padding: 20,
        backgroundColor: "rgba(9, 82, 100, 0.2)",
        borderRadius: 10,
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}>
          <h4 style={{
            margin: "0 0 15px 0",
            color: "#00a7cf",
            fontSize: "16px",
            fontWeight: 600,
          }}>
            Konsantrasyon Analizi
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#666" }}>İlk 4 Satır</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#00a7cf" }}>
                %{result.ilk4Sonuc.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#666" }}>Orta 6 Satır</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#00a7cf" }}>
                %{result.orta6Sonuc.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#666" }}>Son 4 Satır</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#00a7cf" }}>
                %{result.son4Sonuc.toFixed(2)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 15, fontSize: 13, color: "#666", textAlign: "center" }}>
            {result.KP >= 4 ? "Yüksek konsantrasyon seviyesi" : 
             result.KP >= 3 ? "Orta düzey konsantrasyon" : "Düşük konsantrasyon seviyesi"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppContainer>
      <TitleContainer>
        <h1>D2 TEST PUAN HESAPLAMASI</h1>
      </TitleContainer>
    
      <InputContainer>
       
        
        <InputRow>
          <Label>TN:</Label>
          <Input
            value={TM}
            onChange={(e) => setTM(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <InputRow>
          <Label>E1 (HATA 1):</Label>
          <Input
            value={H1}
            onChange={(e) => setH1(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <InputRow>
          <Label>E2 (HATA 2):</Label>
          <Input
            value={H2}
            onChange={(e) => setH2(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <InputRow>
          <Label>İlk 4 Satır:</Label>
          <Input
            value={ilk4}
            onChange={(e) => setIlk4(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <InputRow>
          <Label>Orta 6 Satır:</Label>
          <Input
            value={orta6}
            onChange={(e) => setOrta6(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <InputRow>
          <Label>Son 4 Satır:</Label>
          <Input
            value={son4}
            onChange={(e) => setSon4(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <InputRow>
          <Label>Maksimum Satır TM:</Label>
          <Input
            value={maxTM}
            onChange={(e) => setMaxTM(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <InputRow>
          <Label>Minimum Satır TM:</Label>
          <Input
            value={minTM}
            onChange={(e) => setMinTM(e.target.value)}
            placeholder="Değer girin!"
          />
        </InputRow>
    
        <Button onClick={handleCalculate}>Puanı hesapla</Button>
      </InputContainer>
    
      <ResultContainer>
        {result && generateClinicalComment()}
      </ResultContainer>
    </AppContainer>
  );
};

export default D2PuanHesaplama;