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
  ResultText,
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
  const [result, setResult] = useState("");

  const getPercentile = (value, type) => { 
    if (type === 'TN') {
      const entry = TN_NORM.find(e => value >= e.min && value <= e.max);
      return entry ? entry.percentile : 0;
    }
	if (type === 'TN-E') {
      const entry = TN_E_NORM.find(e => value >= e.min && value <= e.max);
      return entry ? entry.percentile : 0;
    }
    if (type === 'HataYuzdesi') {
      const entry = HATA_YUZDESI_NORM.find(e => value >= e.value);
      return entry ? entry.percentile : 100;
    }
    if (type === 'FR') {
      const entry = FR_NORM.find(e => value >= e.value);
      return entry ? entry.percentile : 100;
    }
    // TN-E, E1, E2 gibi diğer parametreler için getPercentile kullanılmayabilir.
    return 0;
  };

  const yorumla = (deger, tip) => {
    const percentile = getPercentile(deger, tip);
    let yorum = "";
    let aciklama = "";

    if (tip === 'TN') {
    // TN: Psikomotor hızı (Algıladığını harekete dökme, kavrama hızı) hakkında bilgi verir.
    if (percentile < 10) {
        yorum = "🔴 Kritik Sorun";
        aciklama = "Çok düşük psikomotor hız! Algı-kavrama ve harekete dökmede ciddi sorunlar var.";
    } else if (percentile <= 25) {
        yorum = "🟠 Sınırda";
        aciklama = "Psikomotor hız idealin altında; algılama ve tepki süresinde tutarlılık eksik.";
    } else if (percentile <= 75) {
        yorum = "🟡 Normal";
        aciklama = "Beklenen düzeyde psikomotor hız. Algı ve eylem arasında dengeli bir performans.";
    } else if (percentile <= 90) {
        yorum = "🟢 İyi";
        aciklama = "Hızlı psikomotor tepki; algıladığını hızla harekete dökme becerisi gelişmiş.";
    } else if (percentile <= 97.1) {
        yorum = "🔵 Yüksek";
        aciklama = "Üst düzey psikomotor hız! Sonuçlar seçkin performans seviyesini gösteriyor.";
    } else {
        yorum = "🟣 Çok Yüksek";
        aciklama = "Olağanüstü psikomotor hız! Algıdan harekete geçişte mükemmel bir yetenek.";
    }
    aciklama += "\n(TN: Psikomotor hızı; algılama, kavrama ve harekete dökme becerilerini niceliksel olarak ölçer.)";
} else if (tip === 'TN-E') {
    // TN-E: Test Performansı; psikomotor hız ile seçici dikkat arasındaki dengeyi gösterir
    if (percentile < 10) {
        yorum = "🔴 Kritik Sorun";
        aciklama = "Test performansı çok düşük! Psikomotor-dikkat dengesinde ciddi bozulma mevcut.";
    } else if (percentile <= 25) {
        yorum = "🟠 Sınırda";
        aciklama = "Performans risk sınırında; motor hız ve dikkat dağılması kombinasyonu zayıf.";
    } else if (percentile <= 75) {
        yorum = "🟡 Normal";
        aciklama = "Beklenen performans seviyesi; temel test kriterleri karşılanmış durumda.";
    } else if (percentile <= 90) {
        yorum = "🟢 İyi";
        aciklama = "Test performansı ideal aralıkta; hız-dikkat dengesi optimum seviyede.";
    } else if (percentile <= 97.1) {
        yorum = "🔵 Yüksek";
        aciklama = "Üstün performans; zorlu koşullarda bile tutarlılık gösteriyor.";
    } else {
        yorum = "🟣 Çok Yüksek";
        aciklama = "Olağanüstü performans! Motor beceri ve odaklanma mükemmel uyumlu.";
    }
    aciklama += "\n(TN-E: Test Performansı; ideal olarak %75 üzeri olmalıdır. Bu, genel dikkat ve motor becerilerin kalitesini yansıtır.)";
} else if (tip === 'E1') {
      // E1: Seçici Dikkat; hata sayısı arttıkça dikkat düşüklüğü söz konusu.
      // 15-20 hata hafif, 20-30 hata orta, 30+ hata ciddi.
      if (deger >= 30) {
        yorum = "🔴 Ciddi Seçici Dikkat Sorunu";
        aciklama = "30 ve üzeri hata: Seçici dikkat ciddi düzeyde düşük, müdahale gerekiyor.";
      } else if (deger >= 20) {
        yorum = "🟠 Orta Derecede Seçici Dikkat Problemi";
        aciklama = "20-29 hata: Dikkat düzeyinde orta derecede eksiklikler mevcut.";
      } else if (deger >= 15) {
        yorum = "🟡 Hafif Seçici Dikkat Problemi";
        aciklama = "15-19 hata: Hafif eksiklikler var, ancak genel durum kabul edilebilir.";
      } else {
        yorum = "🟢 İdeal Seçici Dikkat";
        aciklama = "15'ten az hata: Seçici dikkat düzeyi iyi.";
      }
      aciklama += "\n(E1: Seçici Dikkat; hata sayısı arttıkça dikkat seviyesi düşer.)";
      return `${deger} => ${yorum}\n   ${aciklama}`;
    } else if (tip === 'E2') {
      // E2: Öğrenme Güçlüğü; hata artışı, öğrenmede ve yönergeye uyumda sorunlara işaret edebilir.
      // E1 gibi eşik değerler kullanılabilir.
      if (deger >= 30) {
        yorum = "🔴 Ciddi Öğrenme Güçlüğü";
        aciklama = "30 ve üzeri hata: Öğrenme ve görsel ayrımda ciddi güçlükler mevcut.";
      } else if (deger >= 20) {
        yorum = "🟠 Orta Derecede Öğrenme Güçlüğü";
        aciklama = "20-29 hata: Öğrenme sürecinde bazı aksaklıklar var.";
      } else if (deger >= 15) {
        yorum = "🟡 Hafif Öğrenme Güçlüğü";
        aciklama = "15-19 hata: Öğrenme sürecinde hafif zorluklar gözleniyor.";
      } else {
        yorum = "🟢 Normal Öğrenme Kapasitesi";
        aciklama = "15'ten az hata: Öğrenme ve yönergeye uyum sorunsuz.";
      }
      aciklama += "\n(E2: Öğrenme Güçlüğü; yüksek hata sayısı, görsel ayrım ve yönergeye uyumda problem olduğunu gösterir.)";
      return `${deger} => ${yorum}\n   ${aciklama}`;
    } else if (tip === 'HataYuzdesi') {
      // Hata Yüzdesi: Odaklanma düzeyi ve dikkat problemini ölçer.
     if (percentile < 10) {
    yorum = "🔴 Sorun";
    aciklama = "Performans kritik düzeyde düşük: Acil müdahale önerilir.";
} else if (percentile <= 25) {
    yorum = "🟠 Sınırda";
    aciklama = "Performans idealin altında: Takip ve geliştirme önerilir.";
} else if (percentile <= 75) {
    yorum = "🟡 Normal";
    aciklama = "Beklenen düzeyde performans: Rutin takip yeterli.";
} else if (percentile <= 90) {
    yorum = "🟢 İyi";
    aciklama = "İdeal üstü performans: Sürdürülebilir başarı seviyesi.";
} else if (percentile <= 97.1) {
    yorum = "🔵 Yüksek";
    aciklama = "Üstün performans: Kayda değer bir başarı seviyesi.";
} else {
    yorum = "🟣 Çok Yüksek";
    aciklama = "Olağanüstü performans: En üst düzeyde başarı gösterilmiştir.";
}
    } else if (tip === 'FR') {
    // FR: TN puanları arasındaki maksimum fark (dikkat istikrarı ve motivasyon göstergesi)
    if (percentile < 10) {
        yorum = "🔴 Kritik İstikrarsızlık";
        aciklama = "Aşırı yüksek fark! (%" + percentile + ") Ciddi dikkat dalgalanmaları ve motivasyon sorunları gözleniyor.";
    } else if (percentile <= 25) {
        yorum = "🟠 Riskli Dağılım";
        aciklama = "Büyük performans farkı (%" + percentile + "). Dikkatte belirgin salınımlar ve odaklanma zorlukları mevcut.";
    } else if (percentile <= 75) {
        yorum = "🟡 Normal Varyasyon";
        aciklama = "Kabul edilebilir seviyede fark (%" + percentile + "). Zaman zaman küçük konsantrasyon dalgalanmaları görülüyor.";
    } else if (percentile <= 90) {
        yorum = "🟢 İstikrarlı Performans";
        aciklama = "Düşük fark (%" + percentile + "). Tutarlı dikkat yönetimi ve sağlam motivasyon seviyesi.";
    } else if (percentile <= 97.1) {
        yorum = "🔵 Üstün Tutarlılık";
        aciklama = "Minimum performans farkı (%" + percentile + "). Yüksek seviyede odaklanma becerisi ve sürekli motivasyon.";
    } else {
        yorum = "🎉 Olağanüstü Denge";
        aciklama = "Neredeyse sıfır fark (%" + percentile + ")! Mükemmel düzeyde istikrar ve kontrol.";
    }
    aciklama += "\n(FR: En yüksek ve en düşük TN puanları arası farkı gösterir. Düşük değerler istikrarlı performansı, yüksek değerler dikkat dalgalanmalarını işaret eder.)";
} else {
      // Diğer parametreler için genel yorum
      if (percentile <= 10) yorum = "🔴 Kritik Sorun";
      else if (percentile <= 25) yorum = "🟠 Düşük Performans";
      else if (percentile <= 50) yorum = "🟡 Orta Düzey";
      else if (percentile <= 75) yorum = "🟢 İyi";
      else if (percentile <= 90) yorum = "🔵 Çok İyi";
      else yorum = "🎉 Üstün Performans";
    }

    return `${deger} (${percentile}%) => ${yorum}\n   ${aciklama}`;
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
    
    const resultText = `
    
📊 Toplam Madde (TN)       : ${TM} 
   ${yorumla(TM, 'TN').padEnd(45)}

❌ Toplam Hata (E)          : ${H} 

📈 Hata Yüzdesi (%E)       : ${yorumla(hataYuzdesi.toFixed(2), 'HataYuzdesi').padEnd(45)}

🎯 TN-E Değeri             : ${TM_H}
   ${yorumla(TM_H, 'TN-E').padEnd(45)}

⚠️ E1 (Seçici Dikkat)      : ${yorumla(H1, 'E1').padEnd(45)}
   (15-20: Hafif, 20-30: Orta, 30+: Ciddi)

🔍 E2 (Öğrenme Güçlüğü)     : ${yorumla(H2, 'E2').padEnd(45)}
   (Düşük: Normal, 15-20: Hafif, 20-30: Orta, 30+: Ciddi)

🌀 FR                     : ${yorumla(DO, 'FR').padEnd(45)}

🧠 Konsantrasyon Puanı     : ${KP.toFixed(2)}/5 
🧠 İlk 4 Satır  : %${ilk4Sonuc.toFixed(2)} 
🧠 Orta 6 Satır : %${orta6Sonuc.toFixed(2)} 
🧠 Son 4 Satır  : %${son4Sonuc.toFixed(2)} 
    
    `;
    
    setResult(resultText);
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
        <ResultText>{result}</ResultText>
      </ResultContainer>
    </AppContainer>
  );
};

export default D2PuanHesaplama;
