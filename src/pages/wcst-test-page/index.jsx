import React, { useContext, useState, useEffect } from "react";
import { Card } from "../../components/card";
import { targetCards } from "../../services/target-cards";
import { responseCards } from "../../services/response-cards";
import * as S from "./styles"; // Stil dosyasını import ettiğinizi varsayıyorum
import { WcstContext } from "../../components/context";
import { useNavigate } from "react-router-dom";

function WcstWindow() {
  const {
    result,
    setResult,
    counter, // counter state'i burada tanımlı ama handleStart içinde tekrar set ediliyor. Kullanılmıyorsa kaldırılabilir.
    setCounter,
    completedCategories,
    setCompletedCategories,
  } = useContext(WcstContext);

  const navigate = useNavigate();

  const [cardIndex, setCardIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState(false);
  const [testInfo, setTestInfo] = useState(false);
  const [randomizedCards, setRandomizedCards] = useState([]);

  const [category, setCategory] = useState("color");
  const [prevCategory, setPrevCategory] = useState(null);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [categoryCorrect, setCategoryCorrect] = useState(0);

  const [lastPureIncorrectCategory, setLastPureIncorrectCategory] =
    useState(null);
  const [consecutivePureIncorrect, setConsecutivePureIncorrect] = useState(0);
  const [perseverativeCategory, setPerseverativeCategory] = useState(null);
  const [categoryChanged, setCategoryChanged] = useState(false);
  const [pendingCategoryChange, setPendingCategoryChange] = useState(false);

  const [responseChain, setResponseChain] = useState([]);
  const [chainBroken, setChainBroken] = useState(false); // Bu state tanımlanmış ama kullanılmıyor gibi duruyor. Gözden geçirin.
  const [lastPerseverativeResponse, setLastPerseverativeResponse] =
    useState(null); // Bu state tanımlanmış ama kullanılmıyor gibi duruyor. Gözden geçirin.

  const checkSandwichRule = (responseChain, perseverativeCategory) => {
    // ... (fonksiyon içeriği aynı kalır)
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
      (response) => response.length > 1 // Doğru cevaplar birden fazla kategori içerir varsayımı
    );
    // Not: checkSandwichRule mantığı karmaşık ve test edilmesi gerekir.
    // 'correctMiddleResponses' tanımı doğru cevapları nasıl filtrelediğine bağlı.
    // Şu anki filtreleme (`response.length > 1`), belirsiz (ambiguous) doğru cevapları sayar.
    // Saf (pure) doğru cevapları mı yoksa tüm doğru cevapları mı sayması gerektiği net değil.
    return {
      isSandwichRule: true,
      correctMiddleResponseCount: correctMiddleResponses.length,
    };
  };

  // Değişiklik 1: Kart karıştırma kaldırıldı (bu zaten yapılmıştı)
  useEffect(() => {
    if (testInfo && randomizedCards.length === 0) {
      // handleStart içinde zaten set ediliyor, bu useEffect gereksiz olabilir.
      // Eğer testInfo değiştiğinde kartları tekrar set etmek gerekmiyorsa kaldırılabilir.
      // setRandomizedCards([...responseCards]); // Direkt orijinal diziyi kullan
    }
  }, [testInfo, randomizedCards.length]); // randomizedCards.length bağımlılığı döngüye neden olabilir, dikkat.

  const currentCard = randomizedCards[cardIndex] || {};
  const { resCount, resColor, resFigure } = currentCard;

  const totalCards = randomizedCards.length; // Toplam kart sayısını alalım
  const testCompleted =
    completedCategories >= 2 || // >= 6 daha güvenli olabilir
    cardIndex >= 128 || // Maksimum kart sınırı
    (totalCards > 0 && cardIndex >= totalCards); // Veya destedeki tüm kartlar bittiğinde

  useEffect(() => {
    if (pendingCategoryChange) {
      setPrevCategory(category);
      setCategoryChanged(true);
      if (category === "color") {
        setCategory("figure");
      } else if (category === "figure") {
        setCategory("count");
      } else if (category === "count") {
        setCategory("color");
      }
      setCategoryCorrect(0);
      setCompletedCategories((prevCompleted) => prevCompleted + 1);
      setConsecutivePureIncorrect(0);
      setLastPureIncorrectCategory(null);
      setPendingCategoryChange(false);
      setCorrectStreak(0); // Kategori değiştiğinde sıfırlanmalı
      setResponseChain([]); // Kategori değiştiğinde sıfırlanmalı
      // setChainBroken(false); // Kullanılmıyorsa bu satıra gerek yok
      // setLastPerseverativeResponse(null); // Kullanılmıyorsa bu satıra gerek yok
      // setPerseverativeCategory(null); // Kategori değişince persevaratif durum sıfırlanmalı mı? WCST kurallarına bakın.
    }
  }, [pendingCategoryChange, category, completedCategories]); // Bağımlılıkları kontrol edin

  const targetCardsList = (
    <>
      {targetCards.map((target, index) => (
        <div
          key={index}
          onClick={() => {
            if (!open && !testCompleted) { // Test bittiyse tıklamayı engelle
              clickHandle({ target });
            }
          }}
          style={{
            opacity: open || testCompleted ? 0.5 : 1, // Test bittiyse de opak yap
            pointerEvents: open || testCompleted ? "none" : "auto", // Test bittiyse de tıklamayı engelle
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

  const responseCardsList = (
    <>
      {resCount && resColor && resFigure ? (
        <>
          <Card count={resCount} color={resColor} figure={resFigure} />
          <S.Warning>{open && (warn ? "✅ DOĞRU" : "❌ YANLIŞ!")}</S.Warning>
        </>
      ) : (
         // Bu durum testin başlangıcında veya bittiğinde görülebilir.
         // Eğer testInfo true ama kart yoksa gösterilecek mesajı netleştirebiliriz.
         // Örneğin: testCompleted ? <div>Test Tamamlandı</div> : <div>Kartlar Yükleniyor...</div>
         // Ama testCompleted kontrolü zaten dışarıda yapılıyor.
         // Bu kısım muhtemelen test bittiğinde değil, başlangıçta currentCard boşken çalışır.
         <div></div> // Başlangıçta boş göstermek daha iyi olabilir
      )}
    </>
  );

  const getResponseCategories = (colorMatch, figureMatch, countMatch) => {
     // ... (fonksiyon içeriği aynı kalır)
    const categories = [];
    if (colorMatch) categories.push("color");
    if (figureMatch) categories.push("figure");
    if (countMatch) categories.push("count");
    return categories;
  };

  const switchCondition = (target) => {
    // ... (fonksiyonun büyük kısmı aynı kalır)
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

    const isOther = !colorMatch && !figureMatch && !countMatch;
    const isAmbiguousAnswer =
      (colorMatch && figureMatch && countMatch) || // Üçlü eşleşme de belirsizdir
      (colorMatch && figureMatch && !countMatch) ||
      (colorMatch && !figureMatch && countMatch) ||
      (!colorMatch && figureMatch && countMatch);

    const responseCategories = getResponseCategories(
      colorMatch,
      figureMatch,
      countMatch
    );

    // --- Doğru / Yanlış Durumları ---
    if (isCorrect) {
      const newCorrectStreak = correctStreak + 1;
      setCorrectStreak(newCorrectStreak);
      const newCategoryCorrect = categoryCorrect + 1;
      setCategoryCorrect(newCategoryCorrect);
      if (newCategoryCorrect >= 3 && completedCategories < 6) { // Kategori tamamlama koşulu
        setPendingCategoryChange(true);
      }
      // Doğru cevapta persevaratif durum sıfırlanmalı mı?
      setConsecutivePureIncorrect(0);
      setLastPureIncorrectCategory(null);
      // setPerseverativeCategory(null); // Eğer doğru cevap persevarasyonu kırıyorsa
      setChainBroken(true); // Doğru cevap zinciri bozar
    } else {
      setCorrectStreak(0);
      // Yanlış cevap kategori sayacını sıfırlamaz (WCST kuralı)
      // setCategoryCorrect(0); // Bu satır kaldırılmalı
    }

    // --- Perseverasyon Mantığı ---
    const isPureColorMatch = colorMatch && !figureMatch && !countMatch;
    const isPureFigureMatch = figureMatch && !colorMatch && !countMatch;
    const isPureCountMatch = countMatch && !colorMatch && !figureMatch;
    const isPureAnswer =
      isPureColorMatch || isPureFigureMatch || isPureCountMatch;

    let currentResponseCategory = null;
    if (isPureAnswer) {
      if (isPureColorMatch) currentResponseCategory = "color";
      else if (isPureFigureMatch) currentResponseCategory = "figure";
      else if (isPureCountMatch) currentResponseCategory = "count";
    }

    // Yanlış cevaplar için perseverasyon kontrolü
    let isPerseverativeError = false;
    let isPerseverativeResponse = false; // Genel perseveratif yanıt (doğru veya yanlış)

    if (isPureAnswer && currentResponseCategory === prevCategory && categoryChanged && !isCorrect) {
      // Kategori yeni değiştiyse ve önceki kategoriye göre *yanlış* cevap verildiyse, bu birincil perseveratif hatadır.
      isPerseverativeError = true;
      isPerseverativeResponse = true;
      setPerseverativeCategory(currentResponseCategory); // Perseveratif kategori set edilir.
      setCategoryChanged(false); // İşlendi olarak işaretle
    } else if (perseverativeCategory && currentResponseCategory === perseverativeCategory && !isCorrect) {
       // Zaten bir perseveratif kategori varsa ve ona göre *yanlış* cevap verildiyse
       isPerseverativeError = true;
       isPerseverativeResponse = true;
    } else if (perseverativeCategory && currentResponseCategory === perseverativeCategory && isCorrect) {
       // Perseveratif kategoriye göre *doğru* cevap verildiyse (ama mevcut kurala göre yanlışsa)
       // Bu genellikle "Perseverative Response" olarak sayılır, "Error" değil.
       isPerseverativeResponse = true;
       // isPerseverativeError = false; // Bu durum hata değil, sadece perseveratif yanıttır.
    }

    // Not: Heaton'ın orijinal skorlaması daha detaylıdır (örn: Failure to Maintain Set).
    // Bu implementasyon temel perseveratif hataları yakalamaya odaklanıyor.

    // 'Sandwich Rule' implementasyonu riskli ve karmaşık, dikkatli test gerektirir.
    // Şimdilik yoruma alıyorum, ihtiyaç halinde tekrar aktif edilebilir.
    /*
    const sandwichResult = checkSandwichRule(
       responseChain,
       perseverativeCategory
     );
     if (sandwichResult && sandwichResult.isSandwichRule) {
       const middleResponseCount = sandwichResult.correctMiddleResponseCount;
       if (isCorrect) {
         // Doğru cevap sandviçi kırar mı? Kurala bağlı.
         isPerseverativeError = false; // Sandviç kuralı uygulanıyorsa hata durumu değişebilir
       } else {
          // Yanlış cevap sandviçi devam ettirir.
          isPerseverativeError = true; // Hata durumu teyit edilir veya set edilir.
       }
     }
    */

    // Cevap Zinciri (Sandviç kuralı için gerekli)
    // Zincir sadece belirli türdeki cevapları mı içermeli? Yoksa tüm cevapları mı?
    // Genellikle saf (pure) perseveratif cevaplar ve aradaki doğru cevaplar izlenir.
    // Şimdilik tüm cevap kategorilerini ekleyelim:
    if (!chainBroken) { // Eğer zincir kırılmadıysa (yani arada doğru cevap gelmediyse)
       const newChain = [...responseChain, responseCategories];
       setResponseChain(newChain);
    } else { // Zincir kırıldıysa (doğru cevap geldiyse) yeni zincir başlar.
       setResponseChain([responseCategories]);
       setChainBroken(false); // Zincir tekrar başladı.
    }


    const isNonPerseverativeError = !isCorrect && !isPerseverativeError;

    // setResult güncellemesi
    setResult((prevResult) => [
  ...prevResult,
  {
    cardIndex: cardIndex,
    response: currentCard,
    targetMatch: {
      color: colorMatch,
      figure: figureMatch,
      count: countMatch,
    },
    isCorrect: isCorrect,
    isOther: isOther,
    responseCategories: responseCategories,
    currentCategory: category,
    prevCategory: prevCategory, // Eklenen alan
  },
]);

    setWarn(isCorrect); // Görsel geri bildirim için
  };

  const clickHandle = ({ target }) => {
    if (open || testCompleted) return; // Eğer kart dönüyorsa veya test bittiyse işlem yapma

    setOpen(true); // Kartı çevir/geri bildirim göster
    switchCondition(target); // Hesaplamaları yap (bu setResult'u tetikler)

    setTimeout(() => {
      // Zamanlayıcı içinde state'lerin güncel halini almak riskli olabilir.
      // Özellikle testCompleted durumu switchCondition içinde değişebilir.
      // Doğrudan bir sonraki index'e geçmek daha güvenli.
      const nextCardIndex = cardIndex + 1;

      // Testin bitip bitmediğini tekrar kontrol et
      const isNextTestCompleted =
        completedCategories >= 6 ||
        nextCardIndex >= 128 ||
        (totalCards > 0 && nextCardIndex >= totalCards);

      if (!isNextTestCompleted) {
         setCardIndex(nextCardIndex); // Bir sonraki karta geç
      } else {
         // Test bittiğinde son kartın ardından index'i artırmayı durdur.
         // İsteğe bağlı: Test bitti flag'ini burada set edebilirsiniz.
         // Ancak zaten testCompleted state'i render'ı kontrol ediyor.
      }

      setOpen(false); // Geri bildirimi gizle
      setWarn(false); // Geri bildirim rengini sıfırla
      setCategoryChanged(false); // Bir sonraki kart için sıfırla
      setPrevCategory(null); // Bir sonraki kart için sıfırla (kategori değişimi olmadıysa)

    }, 1200); // Geri bildirim süresi
  };

  // Değişiklik 2: HandleStart fonksiyonu güncellendi (bu zaten yapılmıştı)
  const handleStart = () => {
    setResult([]); // Sonuçları sıfırla
    setCounter(0); // Sayaç (kullanılıyorsa) sıfırla
    setCompletedCategories(0); // Tamamlanan kategori sayısını sıfırla
    setCategory("color"); // Başlangıç kuralı
    setCategoryCorrect(0); // Mevcut kategori doğru sayısını sıfırla
    setCorrectStreak(0); // Doğru serisini sıfırla
    setPrevCategory(null); // Önceki kategori yok
    setConsecutivePureIncorrect(0); // Arka arkaya saf yanlış sayısı
    setLastPureIncorrectCategory(null); // Son saf yanlış kategori
    setPerseverativeCategory(null); // Perseveratif kategori yok
    setCategoryChanged(false); // Kategori henüz değişmedi
    setPendingCategoryChange(false); // Kategori değişikliği beklemede değil
    setResponseChain([]); // Cevap zinciri boş
    // setChainBroken(false); // Kullanılmıyorsa gerek yok
    // setLastPerseverativeResponse(null); // Kullanılmıyorsa gerek yok

    // Kartları ayarla (shuffle olmadan)
    const initialCards = [...responseCards];
    setRandomizedCards(initialCards);

    setCardIndex(0); // İlk karttan başla (index 0)
    setTestInfo(true); // Test ekranını göster
    setOpen(false); // Başlangıçta kart dönmüyor
    setWarn(false); // Başlangıçta uyarı yok
  };

  const handleShowResults = () => {
    navigate("/wcst-test-result"); // Sonuç sayfasına yönlendir
  };

  // --- EKLENEN KISIM: Kart Sayacı ---
  const renderCardCounter = () => {
    // randomizedCards yüklenmediyse veya test başlamadıysa gösterme
    if (!testInfo || totalCards === 0) {
      return null;
    }
    // Geçerli kart numarasını hesapla (1'den başlar)
    const currentCardNumber = cardIndex + 1;
    // Eğer test bittiyse son kart numarasını göster
    const displayCardNumber = currentCardNumber > totalCards ? totalCards : currentCardNumber;

    // Eğer stil dosyası (S) içinde tanımlı bir component yoksa, basit bir div kullanabiliriz:
    // return <div style={{ textAlign: 'center', margin: '10px 0', fontWeight: 'bold' }}>
    //          Kart {displayCardNumber} / {totalCards}
    //        </div>;

    // Stil dosyası kullanılıyorsa:
    return (
      <S.CardCounter> {/* styles.js içinde S.CardCounter tanımlanmalı */}
        Kart {displayCardNumber} / {totalCards}
      </S.CardCounter>
    );
  };
  // --- EKLENEN KISIM BİTTİ ---


  return (
    <S.WcstWindow>
      {testInfo ? (
        testCompleted ? (
          <S.CompletedOptions>
            <div> Test Tamamlandı </div> 
            <div>
              <S.Button onClick={handleShowResults}>
                Sonuçları Göster
              </S.Button>
            </div>
             {/* İsteğe bağlı: Testi tekrar başlatma butonu */}
             {/* <div>
               <S.Button onClick={handleStart}>
                 Tekrar Başlat
               </S.Button>
             </div> */}
          </S.CompletedOptions>
        ) : (
          <>
           
            <S.TargetCards>{targetCardsList}</S.TargetCards>
            <S.ResponseCards>{responseCardsList}</S.ResponseCards>
            {renderCardCounter()}
          </>
        )
      ) : (
        <S.Start>
          <div>
            <S.WarningButton>Hazır olduğunuzda Başla'ya basın</S.WarningButton>
            <S.Button onClick={handleStart}>Başla</S.Button>
          </div>
        </S.Start>
      )}
    </S.WcstWindow>
  );
}

export default WcstWindow;