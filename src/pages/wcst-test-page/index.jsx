import React, { useContext, useState, useEffect } from "react";
import { Card } from "../../components/card";
import { targetCards } from "../../services/target-cards";
import { responseCards } from "../../services/response-cards";
import * as S from "./styles";
import { WcstContext } from "../../components/context";
import { useNavigate } from "react-router-dom";

function WcstWindow() {
  const {
    result,
    setResult,
    counter,
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
  const [chainBroken, setChainBroken] = useState(false);
  const [lastPerseverativeResponse, setLastPerseverativeResponse] =
    useState(null);

  const checkSandwichRule = (responseChain, perseverativeCategory) => {
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
      (response) => response.length > 1
    );
    return {
      isSandwichRule: true,
      correctMiddleResponseCount: correctMiddleResponses.length,
    };
  };

  // Değişiklik 1: Kart karıştırma kaldırıldı
  useEffect(() => {
    if (testInfo && randomizedCards.length === 0) {
      setRandomizedCards([...responseCards]); // Direkt orijinal diziyi kullan
    }
  }, [testInfo]);

  const currentCard = randomizedCards[cardIndex] || {};
  const { resCount, resColor, resFigure } = currentCard;

  const testCompleted =
    completedCategories === 6 ||
    cardIndex >= 128 ||
    cardIndex >= randomizedCards.length;

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
      setCorrectStreak(0);
      setResponseChain([]);
      setChainBroken(false);
      setLastPerseverativeResponse(null);
    }
  }, [pendingCategoryChange, category, completedCategories]);

  const targetCardsList = (
    <>
      {targetCards.map((target, index) => (
        <div
          key={index}
          onClick={() => {
            if (!open) {
              clickHandle({ target });
            }
          }}
          style={{
            opacity: open ? 0.5 : 1,
            pointerEvents: open ? "none" : "auto",
            transition: "opacity 0.3s ease-in-out",
            cursor: open ? "default" : "pointer",
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
        <div>Test Tamamlandı</div>
      )}
    </>
  );

  const getResponseCategories = (colorMatch, figureMatch, countMatch) => {
    const categories = [];
    if (colorMatch) categories.push("color");
    if (figureMatch) categories.push("figure");
    if (countMatch) categories.push("count");
    return categories;
  };

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

    const isOther = !colorMatch && !figureMatch && !countMatch;
    const isAmbiguousAnswer =
      (colorMatch && figureMatch) ||
      (colorMatch && countMatch) ||
      (figureMatch && countMatch);

    const responseCategories = getResponseCategories(
      colorMatch,
      figureMatch,
      countMatch
    );

    if (isCorrect) {
      const newCorrectStreak = correctStreak + 1;
      setCorrectStreak(newCorrectStreak);
      const newCategoryCorrect = categoryCorrect + 1;
      setCategoryCorrect(newCategoryCorrect);
      if (newCategoryCorrect >= 10) {
        setPendingCategoryChange(true);
      }
      setConsecutivePureIncorrect(0);
      setLastPureIncorrectCategory(null);
    } else {
      setCorrectStreak(0);
      setCategoryCorrect(0);
    }

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

    if (isAmbiguousAnswer || !isPureAnswer || isOther) {
      setConsecutivePureIncorrect(0);
    }

    let isPerseverative = false;
    let isPerseverativeError = false;

    if (!isCorrect) {
      if (isPureAnswer && !isAmbiguousAnswer) {
        if (lastPureIncorrectCategory === currentResponseCategory) {
          const newConsecutiveCount = consecutivePureIncorrect + 1;
          setConsecutivePureIncorrect(newConsecutiveCount);
          if (newConsecutiveCount >= 2) {
            setPerseverativeCategory(currentResponseCategory);
            isPerseverative = true;
            isPerseverativeError = true;
            setLastPerseverativeResponse(currentResponseCategory);
            setCategoryChanged(false);
            setPrevCategory(null);
          }
        } else {
          setLastPureIncorrectCategory(currentResponseCategory);
          setConsecutivePureIncorrect(1);
        }
      }

      if (
        perseverativeCategory &&
        perseverativeCategory === currentResponseCategory
      ) {
        isPerseverative = true;
        isPerseverativeError = true;
        setLastPerseverativeResponse(currentResponseCategory);
      }

      if (
        categoryChanged &&
        prevCategory &&
        isPureAnswer &&
        !perseverativeCategory
      ) {
        if (prevCategory === "color" && colorMatch) {
          setPerseverativeCategory("color");
          isPerseverative = true;
          isPerseverativeError = true;
          setLastPerseverativeResponse("color");
        } else if (prevCategory === "figure" && figureMatch) {
          setPerseverativeCategory("figure");
          isPerseverative = true;
          isPerseverativeError = true;
          setLastPerseverativeResponse("figure");
        } else if (prevCategory === "count" && countMatch) {
          setPerseverativeCategory("count");
          isPerseverative = true;
          isPerseverativeError = true;
          setLastPerseverativeResponse("count");
        }
      }
    }

    const sandwichResult = checkSandwichRule(
      responseChain,
      perseverativeCategory
    );
    if (sandwichResult && sandwichResult.isSandwichRule) {
      const middleResponseCount = sandwichResult.correctMiddleResponseCount;
      if (isCorrect) {
        setConsecutivePureIncorrect((prev) =>
          Math.max(prev - middleResponseCount, 0)
        );
        isPerseverative = false;
        isPerseverativeError = false;
      } else {
        setConsecutivePureIncorrect((prev) => prev + middleResponseCount);
        isPerseverative = true;
        isPerseverativeError = true;
      }
    }

    if (isPureAnswer || isAmbiguousAnswer) {
      const newChain = [...responseChain, responseCategories];
      setResponseChain(newChain);
    }

    const isNonPerseverativeError = !isCorrect && !isPerseverativeError;

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

  // Değişiklik 2: HandleStart fonksiyonu güncellendi
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
    setRandomizedCards([...responseCards]); // Shuffle yerine direkt atama
    setCardIndex(0);
  };

  const handleShowResults = () => {
    navigate("/wcst-test-result");
  };

  return (
    <S.WcstWindow>
      {testInfo ? (
        testCompleted ? (
          <S.CompletedOptions>
            <div>
              <S.Button onClick={handleShowResults}>
                Sonuçları Göster
              </S.Button>
            </div>
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