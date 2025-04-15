import React, { useContext, useState, useEffect } from "react";
import { Card } from "../../components/card";
import { targetCards } from "../../services/target-cards";
import { responseCards } from "../../services/response-cards";
import * as S from "./styles";
import { WcstContext } from "../../components/context";
import { useNavigate } from "react-router-dom";

function WcstWindow() {
  const { result, setResult, counter, setCounter, completedCategories, 
          setCompletedCategories } = useContext(WcstContext);
  const navigate = useNavigate();
  
  // State'ler
  const [cardIndex, setCardIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState(false);
  const [testInfo, setTestInfo] = useState(false);
  const [category, setCategory] = useState("color");
  const [correctStreak, setCorrectStreak] = useState(0);

  // Test durum kontrolü
  const testCompleted = completedCategories >= 6 || cardIndex >= 127;

  const clickHandle = ({ target }) => {
    if (open || testCompleted) return;

    // Eşleme mantığı
    const colorMatch = responseCards[cardIndex].resColor === target.targColor;
    const figureMatch = responseCards[cardIndex].resFigure === target.targFigure;
    const countMatch = responseCards[cardIndex].resCount === target.targCount;

    let isCorrect = false;
    if (category === "color") isCorrect = colorMatch;
    else if (category === "figure") isCorrect = figureMatch;
    else if (category === "count") isCorrect = countMatch;

    // Kategori değişim ve sayaç mantığı
    if (isCorrect) {
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      
      if (newStreak === 10) {
        setCompletedCategories(prev => prev + 1);
        setCorrectStreak(0);
        setCategory(prev => 
          prev === "color" ? "figure" : 
          prev === "figure" ? "count" : "color"
        );
      }
    } else {
      setCorrectStreak(0);
    }

    // Sonuçları güncelle
    setResult([...result, { 
      cardIndex,
      isCorrect,
      category,
      completedCategories 
    }]);

    // UI feedback
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      if(!testCompleted) setCardIndex(prev => prev + 1);
    }, 1200);
  };

  const handleStart = () => {
    // Reset all states
    setCardIndex(0);
    setCompletedCategories(0);
    setCorrectStreak(0);
    setCategory("color");
    setResult([]);
    setTestInfo(true);
  };

  return (
    <S.WcstWindow>
      {testInfo ? (
        testCompleted ? (
          <S.CompletedOptions>
            <h3>Test Tamamlandı!</h3>
            <S.Button onClick={() => navigate("/results")}>
              Sonuçları Görüntüle
            </S.Button>
          </S.CompletedOptions>
        ) : (
          <>
            <S.ProgressBar>
              <div>Kategori: {completedCategories}/6</div>
              <div>Kart: {cardIndex + 1}/128</div>
            </S.ProgressBar>
            
            <S.TargetCards>
              {targetCards.map((target, i) => (
                <div key={i} onClick={() => clickHandle({ target })}>
                  <Card {...target} />
                </div>
              ))}
            </S.TargetCards>

            <S.ResponseCards>
              <Card {...responseCards[cardIndex]} />
              {open && <S.Warning>{warn ? "✅ DOĞRU" : "❌ YANLIŞ"}</S.Warning>}
            </S.ResponseCards>
          </>
        )
      ) : (
        <S.StartScreen>
          <S.Instructions>
            {/* Talimatlar buraya */}
          </S.Instructions>
          <S.StartButton onClick={handleStart}>Testi Başlat</S.StartButton>
        </S.StartScreen>
      )}
    </S.WcstWindow>
  );
}

export default WcstWindow;