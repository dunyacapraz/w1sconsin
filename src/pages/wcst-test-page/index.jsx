import React, { useContext, useState, useEffect } from "react";
import { Card } from "../../components/card";
import { targetCards } from "../../services/target-cards";
import { responseCards } from "../../services/response-cards";
import * as S from "./styles"; // ./styles dosyasından stilleri aldığımızı varsayıyoruz
import { WcstContext } from "../../components/context";
import { useNavigate } from "react-router-dom";

// Kategori tamamlanması için gereken doğru ardışık tepki sayısı (DebugResults ile tutarlı)
const MAX_CORRECT_CONSECUTIVE = 10; // <--- EKLENDİ

function WcstWindow() {
  const {
    result,
    setResult,
    // counter state'i WcstWindow içinde kullanılmıyor gibi görünüyor, kaldırılabilir?
    // counter,
    // setCounter,
    completedCategories,
    setCompletedCategories,
  } = useContext(WcstContext);

  const navigate = useNavigate();

  // State tanımlamaları aynı kalıyor...
  const [cardIndex, setCardIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState(false);
  const [testInfo, setTestInfo] = useState(false);
  const [randomizedCards, setRandomizedCards] = useState([]);

  const [category, setCategory] = useState("color");
  const [prevCategory, setPrevCategory] = useState(null);
  const [correctStreak, setCorrectStreak] = useState(0); // Genel doğru serisi (kullanılıyor mu kontrol edilmeli)
  const [categoryCorrect, setCategoryCorrect] = useState(0); // Mevcut kategori içindeki doğru serisi

  // Perseverasyonla ilgili state'ler aynı kalıyor...
  const [lastPureIncorrectCategory, setLastPureIncorrectCategory] =
    useState(null);
  const [consecutivePureIncorrect, setConsecutivePureIncorrect] = useState(0);
  const [perseverativeCategory, setPerseverativeCategory] = useState(null);
  const [categoryChanged, setCategoryChanged] = useState(false); // Kategori yeni mi değişti?
  const [pendingCategoryChange, setPendingCategoryChange] = useState(false); // Kategori değiştirme işlemi beklmede mi?

  // Sandviç kuralı için state'ler (kullanımı gözden geçirilebilir)
  const [responseChain, setResponseChain] = useState([]);
  // const [chainBroken, setChainBroken] = useState(false); // Bu state kullanılmıyor gibi, kaldırılabilir
  // const [lastPerseverativeResponse, setLastPerseverativeResponse] =
  //   useState(null); // Bu state kullanılmıyor gibi, kaldırılabilir

  // checkSandwichRule fonksiyonu aynı kalıyor (ancak WcstWindow içindeki kullanımı sınırlı görünüyor)
  const checkSandwichRule = (responseChain, perseverativeCategory) => {
    // ... (fonksiyon içeriği aynı) ...
    if (responseChain.length < 3) return false;
    const firstResponse = responseChain[0];
    const lastResponse = responseChain[responseChain.length - 1];
    const isFirstPurePerseverative =
      firstResponse.length === 1 &&
      firstResponse.includes(perseverativeCategory);

    const isLastPurePerseverative =
      lastResponse.length === 1 && lastResponse.includes(perseverativeCategory);
    if (!isFirstPurePerseverative || !isLastPurePerseverative) {
      return false;
    }
    const middleResponses = responseChain.slice(1, -1);

    const correctMiddleResponses = middleResponses.filter(
      (response) => response.length > 1 // Bu mantık hatalı olabilir, müphem olanları sayıyor
    );
    return {
      isSandwichRule: true,
      correctMiddleResponseCount: correctMiddleResponses.length,
    };
  };

  const currentCard = randomizedCards[cardIndex] || {};
  const { resCount, resColor, resFigure } = currentCard;

  // Test bitiş koşulu güncellendi (artık 6 kategori tamamlanınca bitiyor gibi varsayılabilir?)
  // Orijinal WCST'de genellikle 6 kategori tamamlanınca veya 128 kart bitince biter.
  // completedCategories === 2 koşulu yerine daha standart bir koşul gerekebilir.
  // Şimdilik orijinal mantığı koruyalım, ancak DebugResults'ın 6 kategori beklediğini varsayalım.
  const testCompleted =
    completedCategories >= 6 || // Genellikle 6 kategori hedeflenir
    cardIndex >= 128 ||
    cardIndex >= randomizedCards.length;

  // Kategori değiştirme mantığı useEffect içinde
  useEffect(() => {
    if (pendingCategoryChange) {
      setPrevCategory(category); // Önceki kategoriyi sakla
      setCategoryChanged(true); // Kategori değişikliği bayrağını ayarla

      // Kategori döngüsü
      const categoryOrder = ["color", "figure", "count"];
      const currentIndex = categoryOrder.indexOf(category);
      const nextIndex = (currentIndex + 1) % categoryOrder.length;
      setCategory(categoryOrder[nextIndex]); // Bir sonraki kategoriye geç

      // State sıfırlamaları
      setCategoryCorrect(0); // Yeni kategori için doğru sayacını sıfırla
      setCompletedCategories((prevCompleted) => prevCompleted + 1); // Tamamlanan kategori sayısını artır
      setConsecutivePureIncorrect(0); // Perseverasyon takibini sıfırla
      setLastPureIncorrectCategory(null);
      // setPerseverativeCategory(null); // Aktif perseverasyon kuralı sıfırlanmalı mı? Genellikle evet.
      setPendingCategoryChange(false); // Bekleme durumunu kaldır

      // setCorrectStreak(0); // Genel doğru serisi (kullanılıyorsa)

      // setResponseChain([]); // Sandviç kuralı için zincir sıfırlanmalı mı?
      // setChainBroken(false);
      // setLastPerseverativeResponse(null);
    }
  }, [pendingCategoryChange, category, completedCategories]); // Bağımlılıklar kontrol edildi

  // JSX - Target Kartları (Değişiklik yok)
  const targetCardsList = (
    <>
      {targetCards.map((target, index) => (
        <div
          key={index}
          onClick={() => {
            if (!open && !testCompleted) { // Test bitmediyse tıklamaya izin ver
              clickHandle({ target });
            }
          }}
          style={{
            opacity: open || testCompleted ? 0.5 : 1, // Test bittiyse de soluk göster
            pointerEvents: open || testCompleted ? "none" : "auto", // Test bittiyse tıklamayı engelle
            transition: "opacity 0.3s ease-in-out",
            cursor: open || testCompleted ? "default" : "pointer",
          }}
        >
          <Card
            count={target.targCount}
            color={target.targColor}
            figure={target.targFigure}
          />
        </div>
      ))}
    </>
  );

  // JSX - Response Kartları (Değişiklik yok)
  const responseCardsList = (
    <>
      {resCount && resColor && resFigure ? (
        <>
          <Card count={resCount} color={resColor} figure={resFigure} />
          <S.Warning>{open && (warn ? "✅ DOĞRU" : "❌ YANLIŞ!")}</S.Warning>
        </>
      ) : (
        // Test başlangıçta veya bittiğinde gösterilecek içerik
        <div>{testCompleted ? 'Test Tamamlandı' : 'Kart Yükleniyor...'}</div>
      )}
    </>
  );

  // Yanıt kategorilerini bulan yardımcı fonksiyon (Değişiklik yok)
  const getResponseCategories = (colorMatch, figureMatch, countMatch) => {
    const categories = [];
    if (colorMatch) categories.push("color");
    if (figureMatch) categories.push("figure");
    if (countMatch) categories.push("count");
    return categories;
  };

  // Ana test mantığı - Kart tıklandığında çalışır
  const switchCondition = (target) => {
    const colorMatch = resColor === target.targColor;
    const figureMatch = resFigure === target.targFigure;
    const countMatch = resCount === target.targCount;

    let isCorrect = false;
    if (category === "color") {
      isCorrect = colorMatch;
    } else if (category === "figure") {
      isCorrect = figureMatch;
    } else if (category === "count") {
      isCorrect = countMatch;
    }

    const responseCategories = getResponseCategories(
      colorMatch,
      figureMatch,
      countMatch
    );

    // --- Doğru Yanıt Durumu ---
    let currentCategoryCorrect = categoryCorrect; // Mevcut doğru serisini al
    if (isCorrect) {
      currentCategoryCorrect++; // Doğru ise artır
      setCategoryCorrect(currentCategoryCorrect); // State'i güncelle

      // Kategori tamamlama kontrolü (MAX_CORRECT_CONSECUTIVE kullanılarak)
      if (currentCategoryCorrect >= MAX_CORRECT_CONSECUTIVE) { // <--- DÜZELTİLDİ (Eşik 10 oldu)
        setPendingCategoryChange(true); // Kategori değiştirme işlemini tetikle
      }

      // Doğru yanıtta perseverasyon takibi sıfırlanır (genellikle)
      setConsecutivePureIncorrect(0);
      setLastPureIncorrectCategory(null);
      // setCorrectStreak(correctStreak + 1); // Genel doğru serisi (kullanılıyorsa)

    } else {
      // --- Yanlış Yanıt Durumu ---
      setCategoryCorrect(0); // Mevcut kategori doğru serisini sıfırla
      // setCorrectStreak(0); // Genel doğru serisini sıfırla (kullanılıyorsa)

      // --- Perseverasyon Kontrolleri (Yanlış Yanıt Durumunda) ---
      // Bu kısım DebugResults'daki detaylı analize göre basitleştirilebilir veya kaldırılabilir,
      // çünkü DebugResults bu analizi kendi yapıyor. Şimdilik bırakalım.
      const isPureColorMatch = colorMatch && !figureMatch && !countMatch;
      const isPureFigureMatch = figureMatch && !colorMatch && !countMatch;
      const isPureCountMatch = countMatch && !colorMatch && !figureMatch;
      const isPureAnswer = isPureColorMatch || isPureFigureMatch || isPureCountMatch;
      let currentPureResponseCategory = null;
      if (isPureAnswer) {
         if (isPureColorMatch) currentPureResponseCategory = "color";
         else if (isPureFigureMatch) currentPureResponseCategory = "figure";
         else if (isPureCountMatch) currentPureResponseCategory = "count";

         // "Yeni İlke" benzeri perseverasyon takibi (basit hali)
         if (lastPureIncorrectCategory === currentPureResponseCategory) {
            const newConsecutiveCount = consecutivePureIncorrect + 1;
            setConsecutivePureIncorrect(newConsecutiveCount);
            if (newConsecutiveCount >= 3) { // 3 ardışık saf yanlış -> perseverasyon kuralı başlar
                setPerseverativeCategory(currentPureResponseCategory);
            }
         } else {
            setLastPureIncorrectCategory(currentPureResponseCategory);
            setConsecutivePureIncorrect(1);
         }
      } else {
         // Müphem veya 'other' yanıt saf seriyi bozar
         setConsecutivePureIncorrect(0);
         setLastPureIncorrectCategory(null);
      }

      // "Önceki Kategoriye Takılma" kontrolü (basit hali)
      if (categoryChanged && prevCategory && isPureAnswer) {
          if (currentPureResponseCategory === prevCategory) {
              // Önceki kategoriye saf ve yanlış şekilde takıldı
              setPerseverativeCategory(prevCategory);
          }
      }
    
    }

    // Sonuç objesini oluştur
    const resultObject = {
        response: currentCard,
        // color, figure, count alanları responseCategories ile gereksizleşti
        // color: colorMatch,
        // figure: figureMatch,
        // count: countMatch,
        // other: !colorMatch && !figureMatch && !countMatch,
        isCorrect: isCorrect,
        // Kategori tamamlama durumu (Doğru eşik ile hesaplandı)
        categoryComplete: currentCategoryCorrect >= MAX_CORRECT_CONSECUTIVE, // <--- DÜZELTİLDİ (Eşik 10)
        // category: category === "color" ? 1 : category === "figure" ? 2 : 3, // Sayı yerine string
        category: category, // <--- DÜZELTİLDİ (String olarak kaydediliyor)
        responseCategories: responseCategories, // Bu çok önemli
        currentCategory: category, // Bu da çok önemli
        prevCategory: prevCategory, // Kategori değişimi sonrası önemli
        cardIndex: cardIndex,
    };

    // Sonucu Context'e gönder
    setResult((prevResult) => [...prevResult, resultObject]);

    // Kategori değişimi bayrağını sıfırla (bir sonraki adıma hazırlık)
    if(categoryChanged) {
        setCategoryChanged(false);
        // setPrevCategory(null); // prevCategory bir sonraki adıma kadar kalmalı
    }

    // Görsel geri bildirim için
    setWarn(isCorrect);
  };

  // Kart tıklama yöneticisi
  const clickHandle = ({ target }) => {
    if (testCompleted) return; // Test bittiyse işlem yapma

    setOpen(true); // Görsel geri bildirimi başlat (Doğru/Yanlış)
    setTimeout(() => {
      setOpen(false); // Geri bildirimi kaldır
      if (cardIndex + 1 < randomizedCards.length && completedCategories < 6) { // Son karta gelmediyse VE test bitmediyse
           setCardIndex(cardIndex + 1); // Bir sonraki karta geç
       } else {
           // Test bitti (ya kart bitti ya kategoriler tamamlandı)
           // handleShowResults() otomatik çağrılabilir veya buton gösterilir (mevcut yapı)
       }
    }, 1200); // Geri bildirim süresi

    switchCondition(target); // Test mantığını çalıştır
  };

  // Test başlangıç fonksiyonu
  const handleStart = () => {
    // State sıfırlamaları
    // setCounter(0); // Kullanılmıyorsa kaldırıldı
    setResult([]);
    setCompletedCategories(0);
    setCategoryCorrect(0);
    setCorrectStreak(0); // Kullanılıyorsa sıfırla
    setPrevCategory(null);
    setConsecutivePureIncorrect(0);
    setLastPureIncorrectCategory(null);
    setPerseverativeCategory(null);
    setCategoryChanged(false);
    setPendingCategoryChange(false);
    setCategory("color"); // Başlangıç kategorisi

    setResponseChain([]); // Sandviç için sıfırla (kullanılıyorsa)
    // setChainBroken(false);
    // setLastPerseverativeResponse(null);

    // Kartları sabit sıra ile yükle (karıştırma yok)
    setRandomizedCards([...responseCards]); // responseCards'ın import edildiğini varsayıyoruz
    setCardIndex(0); // İlk kart indeksi
    setTestInfo(true); // Test arayüzünü göster
  };

  // Sonuç sayfasına yönlendirme
  const handleShowResults = () => {
    navigate("/wcst-test-result"); // DebugResults bileşeninin olduğu sayfa
  };

  // Ana JSX yapısı
  return (
    <S.WcstWindow>
      {testInfo ? (
        testCompleted ? ( // Test bittiyse
          <S.CompletedOptions>
            
            <S.Button onClick={handleShowResults}>
              Sonuçları Göster
            </S.Button>
          </S.CompletedOptions>
        ) : ( // Test devam ediyorsa
          <>
            <S.TargetCards>{targetCardsList}</S.TargetCards>
            <S.ResponseCards>{responseCardsList}</S.ResponseCards>
            {/* İlerleme göstergesi eklenebilir */}
            <S.ProgressIndicator>
               Kart: {cardIndex + 1} / {randomizedCards.length}
            </S.ProgressIndicator>
          </>
        )
      ) : ( // Test başlamadıysa
        <S.Start>
          <div>
            
            <S.WarningButton>Hazır olduğunda Başla'ya basın</S.WarningButton>
            <S.Button onClick={handleStart}>Başla</S.Button>
          </div>
        </S.Start>
      )}
    </S.WcstWindow>
  );
}

export default WcstWindow;
