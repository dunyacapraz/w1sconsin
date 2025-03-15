import React, { useContext, useState } from "react";
import { Card } from "../../components/card";
import { targetCards } from "../../services/target-cards";
import { responseCards } from "../../services/response-cards";
import * as S from "./styles";
import { WcstContext } from "../../components/context";

function WcstWindow() {
  const {
    result,
    setResult,
    counter,
    setCounter,
    completedCategories,
    setCompletedCategories,
  } = useContext(WcstContext);

  const [cardIndex, setCardIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState(false);
  const [testInfo, setTestInfo] = useState(false);

  const [category, setCategory] = useState("color"); // İlk kategori: renk
  const [prevCategory, setPrevCategory] = useState(null); // Perseveratif hata tespiti için önceki kategori
  const [correctStreak, setCorrectStreak] = useState(0); // Art arda doğru sayısı
  const [categoryCorrect, setCategoryCorrect] = useState(0); // Mevcut kategoride doğru sayısı

  // Kart bilgisi
  const { resCount, resColor, resFigure } = responseCards[cardIndex] || {};  // responseCards[cardIndex] güvenli erişim

  // Test bitirme kontrolü: 6 kategori tamamlanmışsa veya 128 karta ulaşılmışsa
  const testCompleted = completedCategories === 6 || cardIndex >= 128;

  // Target kartlar listesi
  const targetCardsList = (
    <>
      {targetCards.map((target, index) => (
        <div
          key={index}
          onClick={() => {
            clickHandle({ target });
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
      {resCount && resColor && resFigure ? (  // responseCards[cardIndex] objesinin boş olmadığını kontrol et
        <>
          <Card count={resCount} color={resColor} figure={resFigure} />
          <S.Warning>{open && (warn ? "✅ DOĞRU" : "❌ YANLIŞ!")}</S.Warning>
        </>
      ) : (
        <div>Test Tamamlandı</div>
      )}
    </>
  );

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
    if (isOther) {
      isCorrect = false;
    }

    const newCorrectStreak = isCorrect ? correctStreak + 1 : 0;
    const newCategoryCorrect = isCorrect ? categoryCorrect + 1 : 0;

    if (isCorrect) {
      setCorrectStreak(newCorrectStreak);
      setCategoryCorrect(newCategoryCorrect);
    } else {
      setCorrectStreak(0);
      setCategoryCorrect(0);
    }

    if (newCategoryCorrect === 10) {
      setCategoryCorrect(0);
      setCompletedCategories((prevCompleted) => {
        const newCompleted = prevCompleted + 1;
        return newCompleted;
      });
      setPrevCategory(category);

      if (category === "color") {
        setCategory("figure");
      } else if (category === "figure") {
        setCategory("count");
      } else if (category === "count") {
        setCategory("color");
      }
    }

    const isPerseverative = !isCorrect && correctStreak > 0;
    let isPerseverativeError = false;
    if (!isCorrect && prevCategory) {
      if (prevCategory === "color") {
        isPerseverativeError = colorMatch;
      } else if (prevCategory === "figure") {
        isPerseverativeError = figureMatch;
      } else if (prevCategory === "count") {
        isPerseverativeError = countMatch;
      }
    }
    const isNonPerseverativeError = !isCorrect && !isPerseverativeError;

    setResult([
      ...result,
      {
        response: responseCards[cardIndex],
        color: colorMatch,
        figure: figureMatch,
        count: countMatch,
        other: isOther,
        isCorrect: isCorrect,
        categoryComplete: newCategoryCorrect === 3,
        category: category === "color" ? 1 : category === "figure" ? 2 : 3,
        isPerseverative: isPerseverative,
        isPerseverativeError: isPerseverativeError,
        isNonPerseverativeError: isNonPerseverativeError,
        isConceptualLevel: false,
        isSetupFailure: false,
        isLearningToLearn: false,
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
    setPrevCategory(null);
  };

  return (
    <S.WcstWindow>
      {testInfo ? (
        testCompleted ? (
          <S.NavLinkButton to="/wcst-test-result">
            <S.Button>Sonuçları Göster</S.Button>
          </S.NavLinkButton>
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