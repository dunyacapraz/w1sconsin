import React, { useContext, useState, useEffect } from "react";
import * as S from "./styles";
import { WcstContext } from "../../components/context";
import { useRef } from "react";

function WcstTable() {
  const { result, completedCategories } = useContext(WcstContext);
  const safeResult = result || [];
  const [showDetails, setShowDetails] = useState(false); 
  const [selectedCards, setSelectedCards] = useState([]); 
  const [unselectedCards, setUnselectedCards] = useState([]); 

  const rowsPerColumn = 18;
  const totalColumns = Math.ceil(safeResult.length / rowsPerColumn);

  const columns = Array.from({ length: totalColumns }, (_, columnIndex) =>
    safeResult.slice(
      columnIndex * rowsPerColumn,
      (columnIndex + 1) * rowsPerColumn
    )
  );

  useEffect(() => {
    let perserativeHata = 0;
    let perseveratifTepki = 0;
    let previousCategory = null;

    result.forEach((e, index) => {
      console.group(`Yanıt	  ${index + 1}`);
      console.log("Analiz:", e);

      // Önceki farklı kategoriyi bulma
      if (index > 0) {
        let tempIndex = index;
        while (tempIndex >= 0) {
          if (result[tempIndex].currentCategory !== result[index].currentCategory) {
            previousCategory = result[tempIndex].currentCategory;
            break;
          }
          tempIndex--;
        }
      }

      if (e.currentCategory != null) {
        console.log(
  '%cÖnceki Kategori: %c%s  ' +
  '%cGüncel Kategori: %c%s  ' + 
  '%cEşleşen Kategori(ler): %c%s',
  
  'color: #ff5555; font-weight: bold;',  // Önceki Kategori Etiketi (Kırmızı ve Kalın)
  'color: #f1fa8c;',  // Önceki Kategori Değeri (Sarı)
  previousCategory ?? "Yok", // Değerin kendisi (null kontrolü)

  'color: #50fa7b;',  // Güncel Kategori Etiketi (Yeşil)
  'color: #f1fa8c;',  // Güncel Kategori Değeri (Sarı)
  e.currentCategory ?? "Yok", // Değerin kendisi (null kontrolü)

  'color: #50fa7b;',  // Eşleşen Kategori(ler) Etiketi (Yeşil)
  e.responseCategories.length 
    ? 'color: #f1fa8c;'  // Değer stili (Doluysa Sarı)
    : 'color: #6272a4; font-style: italic;',  // "Yok" ise Mavi ve italik
  e.responseCategories.length 
    ? e.responseCategories.join(", ") 
    : "Yok" // Eğer boşsa "Yok" yazdır
);



        // Saf doğru cevap durumu
        if (e.responseCategories.includes(e.currentCategory) && e.responseCategories.length === 1) {
          console.log("Saf doğru cevap");
        }
        // Doğru fakat saf cevap değil
        else if (e.responseCategories.includes(e.currentCategory) && e.responseCategories.length > 1) {
          console.log("Doğru ama saf cevap değil");
        }
        // Perseveratif cevap durumu
        else if (
          !e.responseCategories.includes(e.currentCategory) &&
          e.responseCategories.length === 1 &&
          e.responseCategories[0] === previousCategory
        ) {
          console.group("Perseveratif Cevap Detayları");
          console.log("Perserative cevap, 1 arttı");
          perserativeHata++;
          perseveratifTepki++;

          let shouldContinue = true;
          let tempIndex = index;
          let correctCount = 0;
          let counter = 0;

          while (shouldContinue) {
            if (tempIndex + 1 <= result.length - 1) {
              tempIndex++;
              const nextElement = result[tempIndex];
              // Perseveratif kontrolü
              if (
                !nextElement.responseCategories.includes(e.currentCategory) &&
                nextElement.responseCategories.length === 1 &&
                nextElement.responseCategories[0] === previousCategory
              ) {
                perseveratifTepki += counter;
                perserativeHata += counter - correctCount;
                console.log("Zincirdeki doğru sayısı:", correctCount);
                shouldContinue = false;
              } else if (
                nextElement.responseCategories.includes(nextElement.currentCategory) &&
                nextElement.responseCategories.length === 1
              ) {
                correctCount++;
                counter++;
                console.log("Zincirdeki doğru (saf) cevap, count:", correctCount);
              } else if (
                nextElement.responseCategories.includes(nextElement.currentCategory) &&
                nextElement.responseCategories.length > 1
              ) {
                counter++;
                correctCount++;
                console.log("Zincirdeki doğru cevap (saf değil), count:", correctCount);
              } else {
                counter++;
                console.log("Zincirdeki yanlış cevap, counter:", counter);
              }
            } else {
              console.log("Zincir sonlandı, toplam counter:", counter);
              shouldContinue = false;
            }
          }
          console.groupEnd();
        } else {
          console.log("Farklı durum, detaylandırılmadı");
        }
      } else {
     console.log(
        `Current Category null. Önceki Kategori: ${previousCategory}, Güncel Kategori: ${e.currentCategory}`
    );
      }
      console.groupEnd();
    });

    console.log("PERSERATIVE TEPKİ SAYISI:", perseveratifTepki);
    console.log("PERSERATIVE HATA SAYISI:", perserativeHata);
  }, []);

  const calculateResults = () => {
    const totalResponses = safeResult.length;
    const correctResponses = safeResult.filter((r) => r.isCorrect).length;
    const incorrectResponses = totalResponses - correctResponses;

    const perseverativeResponses = safeResult.filter(
      (r) => r.isPerseverative
    ).length;
    const perseverativeErrors = safeResult.filter(
      (r) => r.isPerseverativeError
    ).length;
    const nonPerseverativeErrors = safeResult.filter(
      (r) => r.isNonPerseverativeError
    ).length;
    const perseverativeErrorPercentage = totalResponses
      ? (perseverativeErrors / totalResponses) * 100
      : 0;

    const firstCategoryResponseCount = safeResult.filter(
      (r) => r.category === 1
    ).length;

    let conceptualLevelCount = 0;
    let currentStreak = 0;
    safeResult.forEach((response) => {
      if (response.isCorrect) {
        currentStreak++;
      } else {
        if (currentStreak >= 3) {
          conceptualLevelCount += Math.floor(currentStreak / 3);
        }
        currentStreak = 0;
      }
    });
    if (currentStreak >= 3) {
      conceptualLevelCount += Math.floor(currentStreak / 3);
    }

    const conceptualLevelPercentage = totalResponses
      ? (conceptualLevelCount / totalResponses) * 100
      : 0;

    let setupFailures = 0;
    currentStreak = 0;
    safeResult.forEach((response) => {
      if (response.isCorrect) {
        currentStreak++;
      } else {
        if (currentStreak >= 5) {
          setupFailures++;
        }
        currentStreak = 0;
      }
    });

    const completions = [];
    safeResult.forEach((response, index) => {
      if (response.categoryComplete) {
        completions.push(index + 1);
      }
    });
    let learningToLearn = 0;
    if (completions.length >= 2) {
      const firstCompletion = completions[0];
      const otherCompletions = completions.slice(1);
      const avgOther =
        otherCompletions.reduce((a, b) => a + b, 0) / otherCompletions.length;
      learningToLearn = firstCompletion - avgOther;
    }

    return {
      totalResponses,
      correctResponses,
      incorrectResponses,
      completedCategories,
      perseverativeResponses,
      perseverativeErrors,
      nonPerseverativeErrors,
      perseverativeErrorPercentage,
      firstCategoryResponseCount,
      conceptualLevelResponses: conceptualLevelCount,
      conceptualLevelPercentage,
      setupFailures,
      learningToLearn,
    };
  };

  const scores = calculateResults();

  // Detaylı tablonun görünürlüğünü değiştirir
  const toggleDetails = () => setShowDetails((prev) => !prev);

  // Kart seçimini yönetir
  const handleCardSelect = (card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((selected) => selected !== card));
      setUnselectedCards([...unselectedCards, card]);
    } else {
      setUnselectedCards(
        unselectedCards.filter((unselected) => unselected !== card)
      );
      setSelectedCards([...selectedCards, card]);
    }
  };

  return (
    <S.Div>
      <S.Table>
        {columns.map((column, colIndex) => (
          <S.Column key={colIndex}>
            {column.map((item, index) => {
              const isPerseverative = item.isPerseverative;
              return (
                <S.Line key={index} onClick={() => handleCardSelect(item)}>
                  <S.Box
                    isNumber={true}
                    isCorrect={item.isCorrect}
                    index={index + 1 + colIndex * rowsPerColumn}
                  >
                    {index + 1 + colIndex * rowsPerColumn}
                  </S.Box>
                  <S.Box isCorrect={item.color} isSelection={false}>
                    R
                  </S.Box>
                  <S.Box isCorrect={item.figure} isSelection={false}>
                    Ş
                  </S.Box>
                  <S.Box isCorrect={item.count} isSelection={false}>
                    M
                  </S.Box>
                  <S.Box isCorrect={item.other} isSelection={false}>
                    D
                  </S.Box>
                  {isPerseverative && <S.Box isSelection={false}>P</S.Box>}
                </S.Line>
              );
            })}
          </S.Column>
        ))}
      </S.Table>

      <S.Results>
        <table>
          <thead>
            <tr>
              <th>Test Puanları</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Toplam tepki sayısı", scores.totalResponses],
              ["Toplam yanlış sayısı", scores.incorrectResponses],
              ["Toplam doğru sayısı", scores.correctResponses],
              ["Tamamlanan kategori sayısı", scores.completedCategories],
              [
                "Toplam perseveratif tepki sayısı",
                scores.perseverativeResponses,
              ],
              ["Toplam perseveratif hata sayısı", scores.perseverativeErrors],
              [
                "Toplam perseveratif olmayan hata sayısı",
                scores.nonPerseverativeErrors,
              ],
              [
                "Perseveratif hata yüzdesi",
                scores.perseverativeErrorPercentage.toFixed(2) + "%",
              ],
              [
                "İlk kategoriyi tamamlamada kullanılan tepki sayısı",
                scores.firstCategoryResponseCount,
              ],
              ["Kavramsal düzey tepki sayısı", scores.conceptualLevelResponses],
              [
                "Kavramsal düzey tepki yüzdesi",
                scores.conceptualLevelPercentage.toFixed(2) + "%",
              ],
              ["Kurulumu sürdürmede başarısızlık", scores.setupFailures],
              ["Öğrenmeyi öğrenme", scores.learningToLearn],
            ].map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </S.Results>

      {/* Toggle Button for Detailed Results */}
      <S.Button onClick={toggleDetails}>
        {showDetails ? "Detayları Gizle" : "Detayları Göster"}
      </S.Button>

      {/* Detailed Table */}
      {showDetails && (
        <S.DetailedTable>
          <thead>
            <tr>
              <th>#</th>
              <th>Perseveratif Tepki</th>
              <th>Chain Kuralı</th>
              <th>Yanlış Cevap</th>
              <th>Doğru Cevap</th>
              <th>Seçilen Kart?</th>
            </tr>
          </thead>
          <tbody>
            {safeResult.map((response, index) => {
              const isPerseverative = response.isPerseverative
                ? "Evet"
                : "Hayır";
              const chainRule = response.isChainRule ? "Evet" : "Hayır";
              const isIncorrect = !response.isCorrect ? "Evet" : "Hayır";
              const isCorrect = response.isCorrect ? "Evet" : "Hayır";
              const isSelected = selectedCards.includes(response)
                ? "Evet"
                : "Hayır";

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{isPerseverative}</td>
                  <td>{chainRule}</td>
                  <td>{isIncorrect}</td>
                  <td>{isCorrect}</td>
                  <td>{isSelected}</td>
                </tr>
              );
            })}
          </tbody>
        </S.DetailedTable>
      )}
    </S.Div>
  );
}

export default WcstTable;
