import React, { useState, useMemo, useEffect } from "react";
import * as S from "./styles";
import staticTestResult from "../../data/staticTestResult.json";

// Kategori sıralaması ve maksimum doğru ardışık tepki sayısı
const CATEGORY_ORDER = ['color', 'figure', 'count'];
const MAX_CORRECT_CONSECUTIVE = 10;

export default function DebugResults() {
  // State'ler
  const [selectedCards, setSelectedCards] = useState([]);
  const [perseverativeStats, setPerseverativeStats] = useState({
    tepki: 0,
    hata: 0
  });
  const [perseverativeResponses, setPerseverativeResponses] = useState([]);
  const [perseverativeDetails, setPerseverativeDetails] = useState([]);

  // İlk kategorinin tamamlanıp tamamlanmadığını kontrol eder
  function isFirstCategoryCompleted(results) {
    const firstCategory = CATEGORY_ORDER[0];
    let correctCount = 0;

    for (let i = 0; i < results.length; i++) {
      if (results[i].currentCategory === firstCategory) {
        if (results[i].responseCategories?.includes(firstCategory)) {
          correctCount++;
          if (correctCount >= MAX_CORRECT_CONSECUTIVE) return true;
        } else {
          correctCount = 0;
        }
      } else {
        return true;
      }
    }
    return false;
  }

  // Belirli bir kategorideki saf tepkileri sayar
  function countConsecutivePureResponses(results, startIndex, category) {
    let count = 0;
    let sandwichOngoing = true;
    let indices = [];
    let sandwichIndices = [];

    for (let i = startIndex; i < results.length && sandwichOngoing; i++) {
      const response = results[i];
      const responseCategories = response.responseCategories || [];
      const currentCategory = response.currentCategory;

      if (responseCategories.length === 1 && responseCategories[0] === category) {
        indices.push(i);
      } else if (responseCategories.includes(category) && responseCategories.length >= 2) {
        if (indices.length >= 1) sandwichIndices.push(i);
      } else {
        sandwichOngoing = false;
      }
    }
    return { count, indices, sandwichIndices, isValid: indices.length >= 1 && sandwichIndices.length >= 1 };
  }

  // Sandviç koşulunu kontrol eder (önceki ve sonraki saf tepkiler)
  function checkSandwichCondition(results, index, category) {
    let hasPreviousPure = false;
    // Önceki saf tepkileri kontrol et
    for (let i = index - 1; i >= 0; i--) {
      const responseCategories = results[i].responseCategories || [];
      if (responseCategories.length === 1 && responseCategories[0] === category) {
        hasPreviousPure = true;
        break;
      } else if (responseCategories.length === 1 && responseCategories[0] !== category) {
        break;
      }
    }

    let hasNextPure = false;
    // Sonraki saf tepkileri kontrol et
    for (let i = index + 1; i < results.length; i++) {
      const responseCategories = results[i].responseCategories || [];
      if (responseCategories.length === 1 && responseCategories[0] === category) {
        hasNextPure = true;
        break;
      } else if (responseCategories.length === 1 && responseCategories[0] !== category) {
        break;
      }
    }

    return hasPreviousPure && hasNextPure;
  }

  // Perseverasyon hesaplamalarını yapan ana efekt
  useEffect(() => {
    let perseveratifTepki = 0;
    let perseveratifHata = 0;
    const isPerseverative = new Array(staticTestResult.length).fill(false);
    const details = new Array(staticTestResult.length).fill(null);
    const firstCategoryCompleted = isFirstCategoryCompleted(staticTestResult);
    let perseverationCategory = firstCategoryCompleted ? 'color' : null;
    let activeChain = null;

    // Perseverasyon güncelleme fonksiyonu
    const updatePerseveration = (index, category, rule) => {
      isPerseverative[index] = true;
      perseveratifTepki++;

      const isError = !staticTestResult[index].responseCategories.includes(
        staticTestResult[index].currentCategory
      );

      if (isError) perseveratifHata++;

      details[index] = {
        isPerseverative: true,
        isError: isError,
        explanation: `${rule}: ${category} perseverasyonu`
      };
    };

    // Sandviç tipi perseverasyonları işler
    const updateSandwichPerseveration = (index, category) => {
      const response = staticTestResult[index];
      if (response.responseCategories?.length < 2) return;

      const isSandwich = checkSandwichCondition(staticTestResult, index, category);

      if (!isSandwich) return;

      isPerseverative[index] = true;
      perseveratifTepki++;

      details[index] = {
        isPerseverative: true,
        isError: false,
        explanation: `Sandviç: ${category} içeren müphem yanıt (öncesi ve sonrasında saf ${category} tepkisi var)`
      };
    };

    // Yeni perseverasyon kalıbı başlatır
    const handleNewPerseverationRule = (startIndex, category, indices, sandwichIndices) => {
      perseverationCategory = category;
      details[startIndex] = {
        isPerseverative: false,
        isError: true,
        explanation: `Yeni perseverasyon kalıbı: ${category}`
      };

      for (let j = 1; j < indices.length; j++) {
        updatePerseveration(indices[j], category, "Kural 3");
      }

      sandwichIndices.forEach(sandwichIndex => {
        if (checkSandwichCondition(staticTestResult, sandwichIndex, category)) {
          updateSandwichPerseveration(sandwichIndex, category);
        }
      });

      activeChain = {
        startIndex: indices.length > 0 ? indices[indices.length - 1] : startIndex,
        category: category
      };
    };

    // Zincir geçerliliğini kontrol eder
    const validateChain = (currentIndex, category) => {
      return checkSandwichCondition(staticTestResult, currentIndex, category);
    };

    // Ana döngü: Her tepkiyi işler
    for (let i = 0; i < staticTestResult.length; i++) {
      const current = staticTestResult[i];
      const responseCategories = current.responseCategories || [];
      const isPure = responseCategories.length === 1;
      const currentCategory = current.currentCategory;

      // Aktif zincir kontrolü
      if (activeChain && !responseCategories.includes(activeChain.category)) {
        activeChain = null;
      }

      // Kural 1: İlk kategori tamamlanmamışsa
      if (!firstCategoryCompleted && isPure && !responseCategories.includes(currentCategory)) {
        if (!perseverationCategory) {
          perseverationCategory = responseCategories[0];
          updatePerseveration(i, responseCategories[0], "Kural 1");
        } else if (responseCategories[0] === perseverationCategory) {
          updatePerseveration(i, perseverationCategory, "Kural 1");
        } else {
          const { indices, sandwichIndices, isValid } = countConsecutivePureResponses(staticTestResult, i, responseCategories[0]);
          if (isValid) {
            handleNewPerseverationRule(i, responseCategories[0], indices, sandwichIndices);
          }
        }
      }

      // Kural 2: İlk kategori tamamlanmışsa
      else if (firstCategoryCompleted && isPure && !responseCategories.includes(currentCategory)) {
        let previousCategory = null;
        if (i > 0) {
          for (let j = i - 1; j >= 0; j--) {
            if (staticTestResult[j].currentCategory !== currentCategory) {
              previousCategory = staticTestResult[j].currentCategory;
              break;
            }
          }
        }

        if (previousCategory && responseCategories[0] === previousCategory) {
          updatePerseveration(i, previousCategory, "Kural 2");
        } else {
          const { indices, sandwichIndices, isValid } = countConsecutivePureResponses(staticTestResult, i, responseCategories[0]);
          if (isValid) {
            handleNewPerseverationRule(i, responseCategories[0], indices, sandwichIndices);
          }
        }
      }

      // Sandviç tepkilerini işle
      if (activeChain && responseCategories.length >= 2 && responseCategories.includes(activeChain.category)) {
        if (checkSandwichCondition(staticTestResult, i, activeChain.category)) {
          updateSandwichPerseveration(i, activeChain.category);
        }
      }

      // Yeni zincir başlat
      if (isPerseverative[i] && !activeChain) {
        activeChain = {
          startIndex: i,
          category: staticTestResult[i].responseCategories[0]
        };
      }
    }

    // Hata sayacını düzelt
    let correctedPerseveratifHata = 0;
    for (let i = 0; i < isPerseverative.length; i++) {
      if (isPerseverative[i]) {
        const isError = !staticTestResult[i].responseCategories?.includes(staticTestResult[i].currentCategory);
        const isCorrectSandwich = details[i]?.explanation?.startsWith("Sandviç") && !isError;
        if (isError && !isCorrectSandwich) {
          correctedPerseveratifHata++;
        }
      }
    }

    // State güncellemeleri
    setPerseverativeStats({ tepki: perseveratifTepki, hata: correctedPerseveratifHata });
    setPerseverativeResponses(isPerseverative);
    setPerseverativeDetails(details);
  }, []);

  // Memoize edilmiş değerler
  const totalPerseverativeCount = useMemo(() => {
    return perseverativeResponses.filter(isPerseverative => isPerseverative).length;
  }, [perseverativeResponses]);

  const scores = useMemo(() => {
    if (!staticTestResult?.length) return null;

    return {
      totalResponses: staticTestResult.length,
      totalCorrect: staticTestResult.filter(r =>
        r.responseCategories?.includes(r.currentCategory)
      ).length,
      ...perseverativeStats,
      displayedPerseverativeCount: totalPerseverativeCount
    };
  }, [staticTestResult, perseverativeStats, totalPerseverativeCount]);

  // Tablo görünümü için sütunlara böl
  const rowsPerColumn = 22;
  const columns = Array.from(
    { length: Math.ceil(staticTestResult.length / rowsPerColumn) },
    (_, i) => staticTestResult.slice(i * rowsPerColumn, (i + 1) * rowsPerColumn)
  );

  return (
    <S.Div>
      {/* Tablo görünümü */}
      <S.Table>
        {columns.map((column, colIndex) => (
          <S.Column key={colIndex}>
            {column.map((item, index) => {
              const globalIndex = colIndex * rowsPerColumn + index;
              const isCorrect = item.responseCategories?.includes(item.currentCategory);
              const isPerseverative = perseverativeResponses[globalIndex];
              const isSandwich = perseverativeDetails[globalIndex]?.explanation?.startsWith("Sandviç");
              const showPH = isSandwich && item.responseCategories?.includes(item.currentCategory);

              return (
                <S.Line
                  key={index}
                  onClick={() => setSelectedCards(prev => [...prev, item])}
                >
                  {/* Kutucuklar */}
                  <S.Box isNumber isCorrect={isCorrect}>
                    {globalIndex + 1}
                  </S.Box>
                  <S.Box isCorrect={item.responseCategories?.includes('color')}>
                    R
                  </S.Box>
                  <S.Box isCorrect={item.responseCategories?.includes('figure')}>
                    Ş
                  </S.Box>
                  <S.Box isCorrect={item.responseCategories?.includes('count')}>
                    M
                  </S.Box>
                  <S.Box
                    isCorrect={!['color','figure','count'].some(c =>
                      item.responseCategories?.includes(c))}
                  >
                    D
                  </S.Box>
                  {/* Perseverasyon göstergeleri */}
                  <S.Box
                    isCorrect={false}
                    style={{
                      visibility: isPerseverative ? 'visible' : 'hidden',
                      backgroundColor: 'transparent',
                      border: 'none'
                    }}
                  >
                    P
                  </S.Box>
                  <S.Box
                    isCorrect={false}
                    style={{
                      visibility: showPH ? 'visible' : 'hidden',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'red'
                    }}
                  >
                    PH
                  </S.Box>
                </S.Line>
              );
            })}
          </S.Column>
        ))}
      </S.Table>

      {/* Sonuçlar paneli */}
      <S.Results>
        <table>
          <thead>
            <tr>
              <th>Test Puanları</th>
              <th>Değer</th>
            </tr>
          </thead>
          <tbody>
            {scores && [
              ["Toplam tepki sayısı", scores.totalResponses],
              ["Toplam yanlış sayısı", scores.totalResponses - scores.totalCorrect],
              ["Toplam doğru sayısı", scores.totalCorrect],
              ["Perseveratif tepki", scores.displayedPerseverativeCount],
              ["Perseveratif hata", scores.hata],
            ].map(([label, value], i) => (
              <tr key={i}>
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Detaylı açıklamalar */}
        <div style={{ marginTop: '20px' }}>
          <h3>Perseveratif Tepki Açıklaması</h3>
          <p>Tabloda "P" harfi ile işaretlenen yanıtlar perseveratif tepkilerdir.</p>
          <ul>
            {staticTestResult.map((item, index) => (
              perseverativeResponses[index] && (
                <li key={index}>
                  Yanıt #{index + 1}: "{item.responseCategories?.join(', ')}" -
                  {perseverativeDetails[index]?.explanation || "Perseveratif tepki"}
                </li>
              )
            ))}
          </ul>
        </div>
      </S.Results>
    </S.Div>
  );
}