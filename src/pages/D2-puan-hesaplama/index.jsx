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
} from "./styles"; // Orijinal stiller kullanılacak

// Norm tablosu verileri (TN_NORM, TN_E_NORM, HATA_YUZDESI_NORM, FR_NORM)
// ... (Norm tabloları buraya gelecek - önceki koddan alınacak) ...
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
 { value: 10, percentile: 75 }
 
];


const D2PuanHesaplama = () => {
  const [TM, setTM] = useState("");
  const [H1, setH1] = useState("");
  const [H2, setH2] = useState("");
  // --- DEĞİŞİKLİK: State isimleri işaretlenen yerine hata olarak güncellendi ---
  const [ilk4Hata, setIlk4Hata] = useState(""); // Opsiyonel - İlk 4 satırdaki toplam hata
  const [orta6Hata, setOrta6Hata] = useState(""); // Opsiyonel - Orta 6 satırdaki toplam hata
  const [son4Hata, setSon4Hata] = useState(""); // Opsiyonel - Son 4 satırdaki toplam hata
  // --- DEĞİŞİKLİK SONU ---
  const [maxTM, setMaxTM] = useState("");
  const [minTM, setMinTM] = useState("");
  const [result, setResult] = useState(null);

  // getPercentile fonksiyonu (Değişiklik yok)
  const getPercentile = (value, type) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 0;

    let normTable;
    let lowerIsBetter = false;

    switch (type) {
      case 'TN': normTable = TN_NORM; break;
      case 'TN-E': normTable = TN_E_NORM; break;
      case 'HataYuzdesi': normTable = HATA_YUZDESI_NORM; lowerIsBetter = true; break;
      case 'FR': normTable = FR_NORM; lowerIsBetter = true; break;
      default: return 0;
    }

    if (!normTable || normTable.length === 0) return 0;

    if (normTable[0].min !== undefined) { // Aralık bazlı norm (TN, TN-E)
        const entry = normTable.find(e => numericValue >= e.min && numericValue <= e.max);
        if (entry) return entry.percentile;
        if (numericValue < normTable[0].min) return 0;
        if (numericValue > normTable[normTable.length - 1].max) return 100;
        return 0; // Aralığa düşmediyse (teorik olarak olmamalı)
    } else { // Eşik bazlı norm (Hata%, FR)
        let percentile = 0;
        if (lowerIsBetter) {
            // Yüksek değer düşük yüzdelik anlamına gelir
            for (let i = 0; i < normTable.length; i++) {
                if (numericValue <= normTable[i].value) {
                    percentile = normTable[i].percentile;
                } else {
                    break; // Eşiği aştı, önceki yüzdelik geçerli
                }
            }
            // En düşük eşikten bile iyiyse (çok az hata/fark) 100 döndür
            if (percentile === normTable[normTable.length - 1].percentile && numericValue < normTable[normTable.length - 1].value) {
                return 100;
            }
             // En yüksek eşikten bile kötüyse (çok hata/fark), 0 döndürelim (ya da en düşük yüzdelik)
             if (percentile === 0 && numericValue > normTable[0].value) {
                 return normTable[0].percentile > 0 ? normTable[0].percentile : 0; // En düşük %'yi döndür veya 0
            }
        } else {
            // Yüksek değer yüksek yüzdelik anlamına gelir (bu D2'de yok ama genel yapı)
            for (let i = normTable.length - 1; i >= 0; i--) {
                if (numericValue >= normTable[i].value) {
                    percentile = normTable[i].percentile;
                    break;
                }
            }
        }
        return percentile;
    }
  };

// getInterpretation fonksiyonu (Değişiklik yok)
const getInterpretation = (score, type) => {
  let interpretation = "";
  const colors = {
      bad: "#c0392b",
      warning: "#a8a5e6",
      normal: "#5dade2",
      good: "#6c5ce7",
      very_good: "#8477e6",
      excellent: "#a8a5e6", // İstersen 'very_good' ile aynı olabilir
      na: "#7f8c8d"
  };
  let color = colors.na;
  let explanation = "Yorumlanamadı veya skor norm dışı."; // Varsayılan açıklama

  // Yüzdelik dilimlerini yorumlama
  if (type === 'TN' || type === 'TN-E') {
    const percentile = score;
    const isTN = type === 'TN';
    const metricName = isTN ? "Psikomotor hız" : "Net performans (hız-dikkat)";

     if (percentile === 0 || percentile === 100 && score === 0) { // Skor 0 ise veya %0/%100 ise (norm dışı)
         interpretation = "N/A";
         color = colors.na;
         explanation = `Skor (${score}) norm tablosu dışında veya hesaplanamadı. Yüzdelik: ${percentile}.`;
     } else if (percentile < 10) {
      interpretation = "Kritik Sorun";
      color = colors.bad;
      explanation = `${metricName} yüzdeliği (${percentile}) kritik düzeyde düşük. ${isTN ? 'Algısal işlemleme ile motor tepki arasında belirgin gecikme gözleniyor.' : 'Hız ve doğruluk arasında ciddi dengesizlik var.'}`;
    } else if (percentile <= 25) {
      interpretation = "Sınırda";
      color = colors.warning;
      explanation = `${metricName} yüzdeliği (${percentile}) beklenenden yavaş/düşük. ${isTN ? 'Algı-motor koordinasyonunda hafif tutarsızlıklar olabilir.' : 'Performans sınırda veya dengesiz, hız ve dikkat arasında tam uyum yok.'}`;
    } else if (percentile <= 75) {
      interpretation = "Normal";
      color = colors.normal;
      explanation = `${metricName} yüzdeliği (${percentile}) beklenen düzeyde. ${isTN ? 'Algısal bilgileri motor yanıtlara dönüştürme becerisi normlara uygun.' : 'Hız ve dikkat arasında beklenen denge sağlanmış.'}`;
    } else if (percentile <= 90) {
      interpretation = "İyi";
      color = colors.good;
      explanation = `${metricName} yüzdeliği (${percentile}) ortalamanın üzerinde/iyi düzeyde. ${isTN ? 'Bilgiyi hızlı kavrama ve etkin motor tepkiler verme becerisi iyi.' : 'İyi bir hız-dikkat dengesi, tutarlı performans.'}`;
    } else if (percentile <= 97.1) {
      interpretation = "Yüksek";
      color = colors.very_good;
      explanation = `${metricName} yüzdeliği (${percentile}) yüksek düzeyde. ${isTN ? 'Algı-motor entegrasyonu oldukça gelişmiş.' : 'Yüksek düzeyde bütünleşik performans, güçlü odaklanma.'}`;
    } else { // 97.1 üzeri ve 100 dahil (norm içi en yüksek)
      interpretation = "Çok Yüksek";
      color = colors.excellent;
      explanation = `${metricName} yüzdeliği (${percentile}) sıra dışı düzeyde. ${isTN ? 'Olağanüstü hız ve verimlilik.' : 'Olağanüstü performans, maksimum verimlilik.'}`;
    }

  } else if (type === 'HataYuzdesi') {
    const percentile = score;
     if (percentile === 0 || percentile === 100 && score > HATA_YUZDESI_NORM[0].value) { // %0 veya çok yüksek hata için norm dışı
         interpretation = "N/A"; color = colors.na; explanation = `Hata oranı (${score.toFixed(1)}%) norm tablosu dışında veya hesaplanamadı. Yüzdelik: ${percentile}.`;
     }
     else if (percentile < 10) {
      interpretation = "Sorun"; color = colors.bad;
      explanation = `Hata oranı yüzdeliği (${percentile}) çok düşük, bu da çok yüksek hata oranına işaret ediyor. Belirgin dikkat dağınıklığı veya odaklanma güçlüğü olabilir.`;
    } else if (percentile <= 25) {
      interpretation = "Sınırda"; color = colors.warning;
      explanation = `Hata oranı yüzdeliği (${percentile}) düşük, bu da beklenenden yüksek hata oranını gösteriyor. Dikkatte dalgalanmalar olabilir.`;
    } else if (percentile <= 75) {
      interpretation = "Normal"; color = colors.normal;
      explanation = `Hata oranı yüzdeliği (${percentile}) normal aralıkta. Yapılan hatalar beklenen sınırlar içinde. Yeterli odaklanma.`;
    } else if (percentile <= 90) {
      interpretation = "İyi"; color = colors.good;
      explanation = `Hata oranı yüzdeliği (${percentile}) yüksek, bu da düşük hata oranına işaret ediyor. Dikkat performansı istikrarlı.`;
    } else { // 90 üzeri (100 dahil)
      interpretation = "Çok İyi / Yüksek"; color = colors.very_good;
      explanation = `Hata oranı yüzdeliği (${percentile}) çok yüksek, bu da çok düşük hata oranını gösteriyor. Üstün odaklanma becerisi.`;
    }

  } else if (type === 'FR') {
    const percentile = score;
     if (percentile === 0 || percentile === 100 && score > FR_NORM[0].value) { // %0 veya çok yüksek FR için norm dışı
         interpretation = "N/A"; color = colors.na; explanation = `Performans farkı (${score}) norm tablosu dışında veya hesaplanamadı. Yüzdelik: ${percentile}.`;
     }
     else if (percentile <= 10) {
      interpretation = "Kritik İstikrarsızlık"; color = colors.bad;
      explanation = `Performans istikrarı yüzdeliği (${percentile}) çok düşük. Test bölümleri arasında aşırı hız farkları var. Motivasyon veya dikkat sürekliliğinde ciddi sorunlar olabilir.`;
    } else if (percentile <= 25) {
      interpretation = "Riskli Dağılım"; color = colors.warning;
      explanation = `Performans istikrarı yüzdeliği (${percentile}) düşük. Test boyunca hız tutarlı değil. Dikkat yönetiminde zorluklar olabilir.`;
    } else if (percentile <= 75) {
      interpretation = "Normal Varyasyon"; color = colors.normal;
      explanation = `Performans istikrarı yüzdeliği (${percentile}) normal aralıkta. Hızdaki hafif farklılıklar doğal konsantrasyon dalgalanmalarıyla uyumlu.`;
    } else if (percentile <= 90) {
      interpretation = "İstikrarlı Performans"; color = colors.good;
      explanation = `Performans istikrarı yüzdeliği (${percentile}) yüksek. Çalışma hızı oldukça tutarlı. Dikkat sürekliliği iyi.`;
    } else { // 90 üzeri (100 dahil)
      interpretation = "Çok İstikrarlı / Yüksek"; color = colors.very_good;
      explanation = `Performans istikrarı yüzdeliği (${percentile}) çok yüksek. Çalışma hızında minimum değişkenlik. Yüksek zihinsel dayanıklılık.`;
    }

  } else if (type === 'E1') {
    const deger = parseInt(score);
    if (isNaN(deger)) {
        interpretation = "N/A";
        color = colors.na;
        explanation = "E1 değeri girilmedi.";
    } else if (deger >= 30) {
        interpretation = "Çok Düşük Seçici Dikkat";
        color = colors.bad;
        explanation = `E1 değeri yüksek (${deger}). Seçici dikkatin çok düşük olduğunu, uyaranları filtrelemede ciddi güçlükler yaşandığını gösteriyor.`;
    } else if (deger >= 20) {
        interpretation = "Düşük Seçici Dikkat";
        color = colors.warning;
        explanation = `E1 değeri (${deger}) belirgin derecede yüksek. Bu durum, seçici dikkatin düşük olduğunu ve dikkat dağıtıcı unsurlara karşı yetersiz kaldığınızı işaret ediyor.`;
    } else if (deger >= 10) {
        interpretation = "Orta Seçici Dikkat";
        color = colors.normal;
        explanation = `E1 değeri (${deger}) orta seviyede. Seçici dikkat performansınız ne çok düşük ne de ideal, dikkat dağıtıcı unsurlara karşı belirli bir direnç mevcut.`;
    } else {
        interpretation = "Yüksek Seçici Dikkat";
        color = colors.good;
        explanation = `E1 değeri düşük (${deger}). Bu, seçici dikkatinizin güçlü olduğunu, uyaranları etkili şekilde filtreleyebildiğinizi gösteriyor.`;
    }
  } else if (type === 'E2') {
    const deger = parseInt(score);
    if (isNaN(deger)) {
        interpretation = "N/A";
        color = colors.na;
        explanation = "E2 değeri girilmedi.";
    } else if (deger >= 30) {
        interpretation = "Ciddi Öğrenme Güçlüğü";
        color = colors.bad;
        explanation = `Öğrenme sürecinde ciddi güçlükler var (${deger} hata). Özellikle zihinsel engelli bireylerde bu yüksek değer, görsel ayrımlaştırma ve yönergeye uyum sağlama konusunda belirgin sorunlar yaşandığını gösterir.`;
    } else if (deger >= 20) {
        interpretation = "Orta Derecede Öğrenme Güçlüğü";
        color = colors.warning;
        explanation = `Öğrenme sürecinde orta seviyede zorluklar mevcut (${deger} hata). Görsel ayrım ve yönergelere uyum sağlama konusunda belirli problemlerin yaşanabileceğini işaret ediyor.`;
    } else if (deger >= 15) {
        interpretation = "Hafif Öğrenme Güçlüğü";
        color = colors.normal;
        explanation = `Öğrenme sürecinde bazı aksaklıklar gözlenmiş (${deger} hata). Küçük çaplı görsel ayrım ve yönergeye uyum sorunları olabilse de genel performans kabul edilebilir seviyededir.`;
    } else {
        interpretation = "Normal Öğrenme Yeteneği";
        color = colors.good;
        explanation = `Öğrenme sürecinde çok az hata görülmüş (${deger} hata) veya hiç hata yapılmamış. Görsel ayrım ve yönergelere uyum konusunda başarılı bir performans sergilenmiş.`;
    }
}


  // Açıklamaya yorumu ekleyen kısmı kaldırıyoruz, çünkü açıklamalar artık doğrudan atanıyor.
  // if (explanation && interpretation !== "N/A" && interpretation !== "-") {
  //     explanation += ` (${interpretation})`;
  // } else if (!explanation && interpretation !== "N/A" && interpretation !== "-") {
  //     explanation = interpretation;
  // }

  return { interpretation, color, explanation };
};


  // handleCalculate fonksiyonu (Opsiyonel alan kontrolü ve KP HESAPLAMA GÜNCELLENDİ)
  const handleCalculate = () => {
    const mandatoryInputs = { TM, H1, H2, maxTM, minTM };
    for (const key in mandatoryInputs) {
      const value = mandatoryInputs[key];
      if (value === "" || isNaN(parseInt(value)) || parseInt(value) < 0) { // Negatif kontrolü eklendi
        alert(`Lütfen '${key.toUpperCase()}' alanı için geçerli, negatif olmayan bir sayısal değer girin. Bu alan zorunludur.`);
        return;
      }
    }
    const tmInt = parseInt(TM);
    const h1Int = parseInt(H1);
    const h2Int = parseInt(H2);
    const maxTMInt = parseInt(maxTM);
    const minTMInt = parseInt(minTM);

    // Min/Max kontrolü
    if (minTMInt > maxTMInt) {
        alert("Minimum Satır TN, Maksimum Satır TN değerinden büyük olamaz.");
        return;
    }
     if (maxTMInt > tmInt) {
         alert("Maksimum Satır TN, Toplam İşaretlenen Madde (TN) sayısından büyük olamaz.");
         return;
     }

    // --- DEĞİŞİKLİK: Opsiyonel Hata Girdilerini Al ---
    const ilk4HataInt = (ilk4Hata !== "" && !isNaN(parseInt(ilk4Hata)) && parseInt(ilk4Hata)>=0) ? parseInt(ilk4Hata) : null;
    const orta6HataInt = (orta6Hata !== "" && !isNaN(parseInt(orta6Hata)) && parseInt(orta6Hata)>=0) ? parseInt(orta6Hata) : null;
    const son4HataInt = (son4Hata !== "" && !isNaN(parseInt(son4Hata)) && parseInt(son4Hata)>=0) ? parseInt(son4Hata) : null;
    // --- DEĞİŞİKLİK SONU ---

    // Toplam Hata (H) hesaplaması
    const H = h1Int + h2Int;

    // --- DEĞİŞİKLİK: Opsiyonel hata alanlarının toplamının Toplam Hata (H)'yı geçmemesi kontrolü (eğer hepsi girildiyse) ---
    if (ilk4HataInt !== null && orta6HataInt !== null && son4HataInt !== null) {
        if ((ilk4HataInt + orta6HataInt + son4HataInt) > H) {
             alert("İlk 4, Orta 6 ve Son 4 satırlardaki hataların toplamı, Toplam Hata (E1+E2) sayısını geçemez.");
             return;
        }
    }
    // --- DEĞİŞİKLİK SONU ---

    // Hataların TN'den büyük olamayacağı kontrolü
    if (H > tmInt) {
        alert("Toplam hata sayısı (E1 + E2), Toplam İşaretlenen Madde (TN) sayısından büyük olamaz.");
        return;
    }

    // Diğer standart skorlar
    const hataYuzdesi = tmInt > 0 ? parseFloat(((H / tmInt) * 100).toFixed(2)) : 0;
    const TM_H = tmInt - H; // Bu TN-E'dir
    const DO = maxTMInt - minTMInt; // Bu FR'dir

    // --- DEĞİŞİKLİK: KP Hesabı (Hata Ortalamaları Üzerinden) ve Ortalama Hata Değişkenleri ---
    let KP = null;
    let ilk4HataOrt = null;
    let orta6HataOrt = null;
    let son4HataOrt = null;
    if (ilk4HataInt !== null && orta6HataInt !== null && son4HataInt !== null) {
      KP = (ilk4HataInt / 4) + (orta6HataInt / 6) + (son4HataInt / 4);
      ilk4HataOrt = ilk4HataInt / 4;
      orta6HataOrt = orta6HataInt / 6;
      son4HataOrt = son4HataInt / 4;
    }
    // --- DEĞİŞİKLİK SONU ---

    setResult({ // Sonuçları state'e kaydet
      TM: tmInt,
      TM_percentile: getPercentile(tmInt, 'TN'),
      H,
      hataYuzdesi,
      hataYuzdesi_percentile: getPercentile(hataYuzdesi, 'HataYuzdesi'),
      TM_H, // TN-E
      TM_H_percentile: getPercentile(TM_H, 'TN-E'),
      H1: h1Int,
      H2: h2Int,
      DO, // FR
      DO_percentile: getPercentile(DO, 'FR'),
      KP: KP !== null ? parseFloat(KP.toFixed(2)) : null, // Hata bazlı KP
      // --- DEĞİŞİKLİK: Hata ortalamalarını kaydet ---
      ilk4HataOrt: ilk4HataOrt !== null ? parseFloat(ilk4HataOrt.toFixed(2)) : null,
      orta6HataOrt: orta6HataOrt !== null ? parseFloat(orta6HataOrt.toFixed(2)) : null,
      son4HataOrt: son4HataOrt !== null ? parseFloat(son4HataOrt.toFixed(2)) : null
      // --- DEĞİŞİKLİK SONU ---
    });
  };


  // generateClinicalComment fonksiyonu (Değişiklik yok, ancak KP yorumu GÜNCELLENDİ)
  const generateClinicalComment = () => {
    if (!result) return null;

    // comparisons objesi ve populatedComparisons hesaplaması aynı kalacak
    // ... (comparisons ve populatedComparisons kodları burada) ...
     const comparisons = {
      GenelPerformans: [
        { label: "Toplam Madde (TN)", scoreKey: "TM_percentile", valueKey: "TM", type: 'TN' },
        { label: "TN-E Değeri", scoreKey: "TM_H_percentile", valueKey: "TM_H", type: 'TN-E' },
      ],
      DikkatVeHata: [
        { label: "Hata Yüzdesi (%E)", scoreKey: "hataYuzdesi_percentile", valueKey: "hataYuzdesi", type: 'HataYuzdesi' },
        { label: "E1 (Seçici Dikkat)", scoreKey: "H1", valueKey: "H1", type: 'E1' },
        { label: "E2 (Öğrenme Güçlüğü)", scoreKey: "H2", valueKey: "H2", type: 'E2' },
      ],
      IstikrarVeKonsantrasyon: [
        { label: "FR (Dikkat Salınımı)", scoreKey: "DO_percentile", valueKey: "DO", type: 'FR' }
       
      ],
    };

    const populatedComparisons = {};
    Object.keys(comparisons).forEach(category => {
      populatedComparisons[category] = comparisons[category]
        .map(metric => {
          let interpretationResult = null;
          const scoreForInterpretation = metric.scoreKey.includes('percentile') ? result[metric.scoreKey] : result[metric.valueKey];
          const valueToDisplay = result[metric.valueKey];

          if (metric.type && scoreForInterpretation !== undefined && scoreForInterpretation !== null) {
            interpretationResult = getInterpretation(scoreForInterpretation, metric.type);
          } else if (!metric.type && valueToDisplay !== null && valueToDisplay !== undefined) {
             interpretationResult = { interpretation: "-", color: "#7f8c8d", explanation: "Bu metrik için otomatik yorumlama mevcut değil." };
          } else {
             interpretationResult = { interpretation: "N/A", color: "#7f8c8d", explanation: "Yorumlanacak skor bulunamadı veya hesaplanamadı." };
          }
          const formattedValue = valueToDisplay !== undefined && valueToDisplay !== null
                                  ? (typeof valueToDisplay === 'number' ? valueToDisplay.toFixed(metric.valueKey === 'hataYuzdesi' || metric.valueKey === 'KP' ? 2 : 0) : valueToDisplay)
                                  : 'N/A';

          return {
            label: metric.label,
            value: formattedValue,
            ...interpretationResult,
          };
        })
        .filter(metric => metric.interpretation !== undefined);
    });


    return (
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        {/* Dikey Sıralı Kart Düzeni - Orijinal stil sınıf adları */}
        <div className="metric-grid"> {/* Bu sınıf adı styles.jsx'te tanımlı olmalı */}
          {Object.entries(populatedComparisons).map(([category, metrics]) => (
            <div key={category} className="metric-card"> {/* Bu sınıf adı styles.jsx'te tanımlı olmalı */}
              {/* Kategori Başlığı (Aynı kalabilir) */}
              <div style={{ borderLeft: '4px solid #6c5ce7', paddingLeft: '12px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#a8a5e6', fontSize: '16px', fontWeight: 600, textTransform: 'uppercase' }}>
                  { category === 'GenelPerformans' ? 'Genel Performans' : category === 'DikkatVeHata' ? 'Dikkat ve Hata Analizi' : category === 'IstikrarVeKonsantrasyon' ? 'İstikrar ve Konsantrasyon' : category }
                </h3>
              </div>

              {/* Metric Items (YENİ JSX YAPISI) */}
              <div className="metric-items-container"> {/* Metrikleri saran yeni container */}
                {metrics.map((metric, index) => (
                  <div key={index} className="metric-row"> {/* Her satır için container */}
                    <span className="metric-label">{metric.label}</span>
                    <div className="metric-details"> {/* Değer ve yorumu gruplayan div */}
                      {/* Yorum Metni (Tag görünümü) */}
                      {metric.interpretation !== '-' && metric.interpretation !== 'N/A' && (
                        <span className="metric-interpretation-tag" style={{ color: metric.color, backgroundColor: `${metric.color}20`, borderColor: `${metric.color}50` }}>
                          {metric.interpretation}
                        </span>
                      )}
                      {/* Ham Değer (Badge görünümü) */}
                      <span className="metric-value-badge">
                        {metric.value}
                        {metric.label === 'Hata Yüzdesi (%E)' && metric.value !== 'N/A' ? '%' : ''}
                      </span>
                    </div>
                    {/* Açıklama (Ayrı bir satırda gibi) */}
                    <div className="metric-explanation-text">
                      {metric.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* --- DEĞİŞİKLİK: Konsantrasyon Puanı yerine Bölümsel Hata Analizi --- */}
        {result.KP !== null && result.ilk4HataOrt !== null && result.orta6HataOrt !== null && result.son4HataOrt !== null && (
          <div className="konsantrasyon-analizi">
            <h4 className="konsantrasyon-title">Bölümsel Hata Analizi </h4> {/* Başlık güncellendi */}
            <div className="konsantrasyon-grid">
              <div className="konsantrasyon-item">
                <div className="konsantrasyon-item-label">İlk 4 Satır Ort. Hata</div> {/* Etiket güncellendi */}
                <div className="konsantrasyon-item-value">{result.ilk4HataOrt.toFixed(2)}</div> {/* Değer güncellendi */}
              </div>
              <div className="konsantrasyon-item">
                 <div className="konsantrasyon-item-label">Orta 6 Satır Ort. Hata</div> {/* Etiket güncellendi */}
                 <div className="konsantrasyon-item-value">{result.orta6HataOrt.toFixed(2)}</div> {/* Değer güncellendi */}
              </div>
              <div className="konsantrasyon-item">
                 <div className="konsantrasyon-item-label">Son 4 Satır Ort. Hata</div> {/* Etiket güncellendi */}
                 <div className="konsantrasyon-item-value">{result.son4HataOrt.toFixed(2)}</div> {/* Değer güncellendi */}
              </div>
            </div>
            <div className="konsantrasyon-yorum">
              KP Skoru (Ort. Hata Toplamı): {result.KP.toFixed(2)}
              {/* Basit yorum kaldırıldı, çünkü hata bazlı KP'nin normatif yorumu belirsiz.
                  Yüksek KP artık daha fazla ortalama hataya işaret eder. */}
            </div>
          </div>
        )}
        {/* --- DEĞİŞİKLİK SONU --- */}
      </div>
    );
  }; // generateClinicalComment sonu


  return (
    <AppContainer>
      <TitleContainer>
        <h1>D2 TEST PUAN HESAPLAMASI</h1>
      </TitleContainer>

      <InputContainer>
         {/* Zorunlu Alanlar (Değişiklik yok) */}
         <InputRow>
           <Label>TN (Toplam İşaretlenen):</Label>
           <Input value={TM} onChange={(e) => setTM(e.target.value)} placeholder="Zorunlu" type="number" min="0" required/>
         </InputRow>
         <InputRow>
           <Label>E1 (Hata 1 - Yanlış İşaretleme):</Label>
           <Input value={H1} onChange={(e) => setH1(e.target.value)} placeholder="Zorunlu" type="number" min="0" required/>
         </InputRow>
         <InputRow>
           <Label>E2 (Hata 2 - Atlanan Hedef):</Label>
           <Input value={H2} onChange={(e) => setH2(e.target.value)} placeholder="Zorunlu" type="number" min="0" required/>
         </InputRow>
         <InputRow>
            <Label>Maksimum Satır TN:</Label>
            <Input value={maxTM} onChange={(e) => setMaxTM(e.target.value)} placeholder="Zorunlu" type="number" min="0" required/>
          </InputRow>
          <InputRow>
            <Label>Minimum Satır TN:</Label>
            <Input value={minTM} onChange={(e) => setMinTM(e.target.value)} placeholder="Zorunlu" type="number" min="0" required/>
          </InputRow>

          {/* --- DEĞİŞİKLİK: Opsiyonel Alanlar Hata Girişleri İçin Güncellendi --- */}
          <InputRow>
            <Label>İlk 4 Satır Toplam Hata (Opsiyonel):</Label> {/* Etiket Güncellendi */}
            <Input value={ilk4Hata} onChange={(e) => setIlk4Hata(e.target.value)} placeholder="KP Hesabı için giriniz (Hata Sayısı)" type="number" min="0"/> {/* State, onChange, placeholder güncellendi */}
          </InputRow>
          <InputRow>
            <Label>Orta 6 Satır Toplam Hata (Opsiyonel):</Label> {/* Etiket Güncellendi */}
            <Input value={orta6Hata} onChange={(e) => setOrta6Hata(e.target.value)} placeholder="KP Hesabı için giriniz (Hata Sayısı)" type="number" min="0"/> {/* State, onChange, placeholder güncellendi */}
          </InputRow>
          <InputRow>
            <Label>Son 4 Satır Toplam Hata (Opsiyonel):</Label> {/* Etiket Güncellendi */}
            <Input value={son4Hata} onChange={(e) => setSon4Hata(e.target.value)} placeholder="KP Hesabı için giriniz (Hata Sayısı)" type="number" min="0"/> {/* State, onChange, placeholder güncellendi */}
          </InputRow>
          {/* --- DEĞİŞİKLİK SONU --- */}

        <Button onClick={handleCalculate}>Puanı Hesapla</Button>
      </InputContainer>

      <ResultContainer>
        {/* Sonuçlar hesaplandıysa yorumu göster */}
        {result && generateClinicalComment()}
         {/* Sonuç yoksa başlangıç mesajı */}
         {!result && (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', fontStyle: 'italic', padding: '2rem', lineHeight: '1.5' }}>
                Hesaplama yapmak için lütfen zorunlu alanları girin ve 'Puanı Hesapla' düğmesine basın. KP ve bölümsel hata analizi için opsiyonel alanları doldurabilirsiniz.
            </p>
         )}
      </ResultContainer>
    </AppContainer>
  );
};

export default D2PuanHesaplama;