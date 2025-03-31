import React, { useContext, useState, useEffect } from "react";
import { Card } from "../../components/card";
import { targetCards } from "../../services/target-cards";
import { responseCards } from "../../services/response-cards";
import * as S from "./styles";
import { WcstContext } from "../../components/context";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function WcstWindow() {
  const {
    result,
    setResult,
    counter,
    setCounter,
    completedCategories,
    setCompletedCategories,
  } = useContext(WcstContext);

  const navigate = useNavigate(); // Initialize useNavigate

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
  const [chainBroken, setChainBroken] = useState(false);
  const [lastPerseverativeResponse, setLastPerseverativeResponse] =
    useState(null);

  // Güncellenmiş Sandviç Kuralı Kontrolü
  const checkSandwichRule = (responseChain, perseverativeCategory) => {
    // Zincir en az 3 eleman içermeli
    if (responseChain.length < 3) return false;
    // Zincirin başı ve sonunun saf perseveratif cevap olup olmadığını kontrol et
    const firstResponse = responseChain[0];
    const lastResponse = responseChain[responseChain.length - 1];
    // Başlangıç ve bitiş saf perseveratif cevap mı kontrolü
    const isFirstPurePerseverative =
      firstResponse.length === 1 &&
      firstResponse.includes(perseverativeCategory);

    const isLastPurePerseverative =
      lastResponse.length === 1 && lastResponse.includes(perseverativeCategory);
    // Eğer başlangıç ve bitiş saf perseveratif değilse, kural geçerli değil
    if (!isFirstPurePerseverative || !isLastPurePerseverative) {
      return false;
    }
    // Ara kartların kontrol edilmesi
    const middleResponses = responseChain.slice(1, -1);

    // 2 saf perseveratif cevap arasındaki DOĞRU eşleşmeleri say
    const correctMiddleResponses = middleResponses.filter(
      (response) => response.length > 1 // Birden fazla kategoride eşleşme
    );
    return {
      isSandwichRule: true,
      correctMiddleResponseCount: correctMiddleResponses.length,
    };
  };

  // Kartları karıştırmak için Fisher-Yates shuffle algoritması
  const shuffleCards = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Başlangıçta kartları karıştır
  useEffect(() => {
    if (testInfo && randomizedCards.length === 0) {
      setRandomizedCards(shuffleCards(responseCards));
    }
  }, [testInfo]);

  // Kart bilgisi - karıştırılmış kartlardan al
  const currentCard = randomizedCards[cardIndex] || {};
  const { resCount, resColor, resFigure } = currentCard;


  const testCompleted =
    completedCategories === 6 ||
    cardIndex >= 128 ||
    cardIndex >= randomizedCards.length;

  // Kategori değişimi için useEffect
  useEffect(() => {
    if (pendingCategoryChange) {
      // Eski kategoriyi kaydet
      setPrevCategory(category);
      setCategoryChanged(true);

      // Yeni kategoriye geç
      if (category === "color") {
        setCategory("figure");
      } else if (category === "figure") {
        setCategory("count");
      } else if (category === "count") {
        setCategory("color");
      }

      // Değişimleri yap
      setCategoryCorrect(0);
      setCompletedCategories((prevCompleted) => prevCompleted + 1);
      setConsecutivePureIncorrect(0);
      setLastPureIncorrectCategory(null);
      setPendingCategoryChange(false);

      setCorrectStreak(0);

      setResponseChain([]);
      setChainBroken(false);
      setLastPerseverativeResponse(null);

      // console.log(
      //  "Kategori değişimi tamamlandı. Yeni kategori:",
      //  category === "color"
      //    ? "figure"
      //    : category === "figure"
      //    ? "count"
      //    : "color"
      // );
    }
  }, [pendingCategoryChange, category, completedCategories]);

  // Target kartlar listesi
  const targetCardsList = (
    <>
      {targetCards.map((target, index) => (
        <div
          key={index}
          onClick={() => {
            if (!open) { // Sadece 'open' false ise tıklamayı işle
              clickHandle({ target });
            }
          }}
          style={{
            opacity: open ? 0.5 : 1, // 'open' true ise opacity'i düşür
            pointerEvents: open ? 'none' : 'auto', // 'open' true ise tıklamayı engelle
            transition: 'opacity 0.3s ease-in-out', // İsteğe bağlı: Yumuşak geçiş için
            cursor: open ? 'default' : 'pointer', // İsteğe bağlı: İmleci de değiştir
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

  // Response kartlar listesi
  const responseCardsList = (
    <>
      {resCount && resColor && resFigure ? (
        <>
          <Card count={resCount} color={resColor} figure={resFigure} />
          <S.Warning>{open && (warn ? "✅ DOĞRU" : "❌ YANLIŞ!")}</S.Warning>
        </>
      ) : (
        <div>Test Tamamlandı</div>
      )}
    </>
  );

  // Yanıtın hangi kategorileri içerdiğini belirleyen yardımcı fonksiyon
  const getResponseCategories = (colorMatch, figureMatch, countMatch) => {
    const categories = [];
    if (colorMatch) categories.push("color");
    if (figureMatch) categories.push("figure");
    if (countMatch) categories.push("count");
    return categories;
  };

  const switchCondition = (target) => {
    // Eşleşme kontrolü
    const colorMatch = resColor === target.targColor;
    const figureMatch = resFigure === target.targFigure;
    const countMatch = resCount === target.targCount;

    // Seçilen kategoriye göre doğruluğu belirle
    let isCorrect = false;
    if (category === "color") {
      isCorrect = colorMatch;
    } else if (category === "figure") {
      isCorrect = figureMatch;
    } else if (category === "count") {
      isCorrect = countMatch;
    }

    // Hiçbir kategori ile eşleşmeme durumu
    const isOther = !colorMatch && !figureMatch && !countMatch;

    // Belirsiz cevap kontrolü (birden fazla kategoride eşleşme var)
    const isAmbiguousAnswer =
      (colorMatch && figureMatch) ||
      (colorMatch && countMatch) ||
      (figureMatch && countMatch);

    // Yanıtın içerdiği kategorileri belirle
    const responseCategories = getResponseCategories(
      colorMatch,
      figureMatch,
      countMatch
    );

    // Doğru cevap sayılarını güncelle
    if (isCorrect) {
      const newCorrectStreak = correctStreak + 1;
      setCorrectStreak(newCorrectStreak);

      const newCategoryCorrect = categoryCorrect + 1;
      setCategoryCorrect(newCategoryCorrect);

      // Kategori değişimi kontrolü - 3 ardışık doğru cevap
      if (newCategoryCorrect >= 10) {
        // console.log("3 doğru cevap tamamlandı, kategori değişimi başlatılıyor");
        setPendingCategoryChange(true);
      }

      // Doğru cevap gelince ardışık saf yanlış sayısını sıfırla
      setConsecutivePureIncorrect(0);
      setLastPureIncorrectCategory(null);
    } else {
      // Yanlış cevap geldiğinde hem correctStreak hem de categoryCorrect sıfırlanıyor
      setCorrectStreak(0);
      setCategoryCorrect(0);
    }

    // Saf cevap kontrolü - sadece tek bir kategoride eşleşme var
    const isPureColorMatch = colorMatch && !figureMatch && !countMatch;
    const isPureFigureMatch = figureMatch && !colorMatch && !countMatch;
    const isPureCountMatch = countMatch && !colorMatch && !figureMatch;

    // Genel saf cevap
    const isPureAnswer =
      isPureColorMatch || isPureFigureMatch || isPureCountMatch;

    // Seçilen saf yanlış cevabın kategorisini belirle
    let currentResponseCategory = null;
    if (isPureAnswer) {
      if (isPureColorMatch) currentResponseCategory = "color";
      else if (isPureFigureMatch) currentResponseCategory = "figure";
      else if (isPureCountMatch) currentResponseCategory = "count";
    }

    // Belirsiz cevap veya saf olmayan cevap geldiğinde ardışık saf yanlış sayacını sıfırla
    if (isAmbiguousAnswer || !isPureAnswer || isOther) {
      // console.log(
      //  "Belirsiz veya saf olmayan cevap - Ardışık saf yanlış sayacı sıfırlandı"
      // );
      setConsecutivePureIncorrect(0);
    }

    // Perseveratif hesaplama logic'i - SADECE YANLIŞ CEVAPLAR İÇİN
    let isPerseverative = false;
    let isPerseverativeError = false;

    // PERSEVERASYON İLKESİ KONTROLÜ - SADECE YANLIŞ CEVAPLAR İÇİN
    if (!isCorrect) {
      // 1. Belirsiz olmayan saf yanlış cevaplar için (tek kategoride eşleşen)
      if (isPureAnswer && !isAmbiguousAnswer) {
        // Son saf yanlış kategori ile aynı mı kontrol et
        if (lastPureIncorrectCategory === currentResponseCategory) {
          // Ardışık sayısını arttır
          const newConsecutiveCount = consecutivePureIncorrect + 1;
          setConsecutivePureIncorrect(newConsecutiveCount);

          // Minimum 2 ardışık saf yanlış olması şartını ekle
          if (newConsecutiveCount >= 2) {
            // console.log(
            //  `Gerçek ardışık saf yanlış cevap (${newConsecutiveCount}) - Perseveratif ilke belirlendi:`,
            //  currentResponseCategory
            // );
            setPerseverativeCategory(currentResponseCategory);
            isPerseverative = true;
            isPerseverativeError = true;
            setLastPerseverativeResponse(currentResponseCategory);

            setCategoryChanged(false);
            setPrevCategory(null);
          }
        }
        // Farklı bir saf yanlış kategoriyse
        else {
          setLastPureIncorrectCategory(currentResponseCategory);
          setConsecutivePureIncorrect(1);
          // console.log(
          //  "Yeni saf yanlış cevap kategorisi:",
          //  currentResponseCategory
          // );
        }

        // Perseveratif ilke belirlenmiş ve cevap o ilkeye uyuyorsa
        if (
          perseverativeCategory &&
          perseverativeCategory === currentResponseCategory
        ) {
          isPerseverative = true;
          isPerseverativeError = true;
          // console.log(
          //  "Perseveratif hata - İlkeye göre:",
          //  currentResponseCategory
          // );
          setLastPerseverativeResponse(currentResponseCategory);
        }
      }

      // Kategori değişiminden sonraki kontrol
      if (
        categoryChanged &&
        prevCategory &&
        isPureAnswer &&
        !perseverativeCategory
      ) {
        // Yeni bir perseveratif ilke belirlenmemişse önceki kategoriye göre kontrol yap
        if (prevCategory === "color" && colorMatch) {
          // console.log(
          //  "Kategori değişimi sonrası önceki kategoriye (color) göre perseveratif hata. Yeni perseveratif ilke: color"
          // );
          setPerseverativeCategory("color");
          isPerseverative = true;
          isPerseverativeError = true;
          setLastPerseverativeResponse("color");
        } else if (prevCategory === "figure" && figureMatch) {
          // console.log(
          //  "Kategori değişimi sonrası önceki kategoriye (figure) göre perseveratif hata. Yeni perseveratif ilke: figure"
          // );
          setPerseverativeCategory("figure");
          isPerseverative = true;
          isPerseverativeError = true;
          setLastPerseverativeResponse("figure");
        } else if (prevCategory === "count" && countMatch) {
          // console.log(
          //  "Kategori değişimi sonrası önceki kategoriye (count) göre perseveratif hata. Yeni perseveratif ilke: count"
          // );
          setPerseverativeCategory("count");
          isPerseverative = true;
          isPerseverativeError = true;
          setLastPerseverativeResponse("count");
        }
      }
    }

    // Güncellenmiş Sandviç Kuralı Kontrolü Kullanımı
    const sandwichResult = checkSandwichRule(
      responseChain,
      perseverativeCategory
    );
    if (sandwichResult && sandwichResult.isSandwichRule) {
      // console.log("Sandviç Kuralı Uygulandı!");
      const middleResponseCount = sandwichResult.correctMiddleResponseCount;

      if (isCorrect) {
        // Doğru yanıtta: Perseveratif işaretleme yapılmaz,
        // doğru tepkiyi güçlendirmek için counter'dan middleResponseCount çıkarılır.
        setConsecutivePureIncorrect((prev) =>
          Math.max(prev - middleResponseCount, 0)
        );
        isPerseverative = false;
        isPerseverativeError = false;
      } else {
        // Yanlış yanıtta: doğrudan perseveratif tepki eklenir.
        setConsecutivePureIncorrect((prev) => prev + middleResponseCount);
        isPerseverative = true;
        isPerseverativeError = true;

        // Eğer perseveratif hata yapıldıysa, hata sayısını 1 azalt
        // setPerseverativeErrorCount((prev) => Math.max(prev - 1, 0));
      }
    }

    // Yanıt zincirini güncelle (sadece saf ve belirsiz cevaplar için)
    if (isPureAnswer || isAmbiguousAnswer) {
      const newChain = [...responseChain, responseCategories];
      setResponseChain(newChain);
    }

    // Non-perseveratif hata kontrolü (Yanlış ve perseveratif olmayan)
    const isNonPerseverativeError = !isCorrect && !isPerseverativeError;

    // console.log("Sonuç:", {
    //  cardIndex,
    //  response: currentCard,
    //  currentCategory: category,
    //  prevCategory,
    //  currentResponseCategory,
    //  responseCategories,
    //  color: colorMatch,
    //  figure: figureMatch,
    //  count: countMatch,
    //  isCorrect,
    //  perseverativeCategory,
    //  isPerseverative,
    //  isPerseverativeError,
    //  isNonPerseverativeError,
    //  categoryChanged,
    //  isAmbiguousAnswer,
    //  chainBroken,
    //  responseChain: responseChain.length,
    //  lastPerseverativeResponse,
    //  consecutivePureIncorrect:
    //    isPureAnswer && !isCorrect
    //      ? lastPureIncorrectCategory === currentResponseCategory
    //        ? consecutivePureIncorrect + 1
    //        : 1
    //      : 0,
    //  lastPureIncorrectCategory,
    //  categoryCorrect,
    // });

    // Sonucu kaydet
    setResult([
      ...result,
      {
        response: currentCard,
        color: colorMatch,
        figure: figureMatch,
        count: countMatch,
        other: isOther,
        isCorrect: isCorrect,
        categoryComplete: categoryCorrect >= 2,
        category: category === "color" ? 1 : category === "figure" ? 2 : 3,
        isPerseverative: isPerseverative,
        isPerseverativeError: isPerseverativeError,
        isNonPerseverativeError: isNonPerseverativeError,
        isConceptualLevel: false,
        isSetupFailure: false,
        isLearningToLearn: false,
        responseCategories: responseCategories,
        currentCategory: category,
        prevCategory,
        cardIndex,
      },
    ]);

    setWarn(isCorrect);
  };

  const clickHandle = ({ target }) => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      setCardIndex(cardIndex + 1);
    }, 1200);

    switchCondition(target);
  };

  const handleStart = () => {
    setCounter(0);
    setTestInfo(true);
    setResult([]);
    setCompletedCategories(0);
    setCategoryCorrect(0);
    setCorrectStreak(0);
    setPrevCategory(null);
    setConsecutivePureIncorrect(0);
    setLastPureIncorrectCategory(null);
    setPerseverativeCategory(null);
    setCategoryChanged(false);
    setPendingCategoryChange(false);
    setCategory("color");

    setResponseChain([]);
    setChainBroken(false);
    setLastPerseverativeResponse(null);

    setRandomizedCards(shuffleCards(responseCards));
    setCardIndex(0);
  };

  const downloadResultsAsJson = () => {
    if (!result || result.length === 0) {
      console.warn("İndirilecek sonuç bulunamadı");
      return;
    }

    // Sadece istenen alanları içeren yeni bir dizi oluştur
    const simplifiedResults = result.map(item => ({
      response: item.response,
      categoryComplete: item.categoryComplete,
      category: item.category,
      responseCategories: item.responseCategories,
      currentCategory: item.currentCategory,
      prevCategory: item.prevCategory,
      cardIndex: item.cardIndex
    }));

    try {
      const blob = new Blob([JSON.stringify(simplifiedResults, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wcst-results-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("JSON indirme hatası:", error);
    }
  };

  const handleShowAndDownload = () => {
    downloadResultsAsJson();
    navigate("/wcst-test-result");
  };

  return (
    <S.WcstWindow>
      {testInfo ? (
        testCompleted ? (
          <S.CompletedOptions>
            {/* Removed the S.NavLinkButton and modified the S.Button */}
            <S.Button onClick={handleShowAndDownload}>
              Sonuçları Göster ve İndir
            </S.Button>
          </S.CompletedOptions>
        ) : (
          <>
            <S.TargetCards>{targetCardsList}</S.TargetCards>
            <S.ResponseCards>{responseCardsList}</S.ResponseCards>
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