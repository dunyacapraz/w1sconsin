import React, { useContext } from "react";
import * as S from "./styles";
import { WcstContext } from "../../components/context";

function WcstTable() {
  const { result, completedCategories } = useContext(WcstContext);
  const safeResult = result || [];

  const rowsPerColumn = 18;
  const totalColumns = Math.ceil(safeResult.length / rowsPerColumn);

  const columns = Array.from({ length: totalColumns }, (_, columnIndex) =>
    safeResult.slice(columnIndex * rowsPerColumn, (columnIndex + 1) * rowsPerColumn)
  );

  const calculateResults = () => {
    const totalResponses = safeResult.length;
    const correctResponses = safeResult.filter((r) => r.isCorrect).length;
    const incorrectResponses = totalResponses - correctResponses;

    // Perseveratif hesaplamalar (önceki mantık korunuyor)
    const perseverativeResponses = safeResult.filter((r) => r.isPerseverative).length;
    const perseverativeErrors = safeResult.filter((r) => r.isPerseverativeError).length;
    const nonPerseverativeErrors = safeResult.filter((r) => r.isNonPerseverativeError).length;
    const perseverativeErrorPercentage = totalResponses ? (perseverativeErrors / totalResponses) * 100 : 0;

    const firstCategoryResponseCount = safeResult.filter((r) => r.category === 1).length;

    // 1. Kavramsal Düzey Tepki Sayısı: 
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
    // 2. Kavramsal Düzey Tepki Yüzdesi:
    const conceptualLevelPercentage = totalResponses ? (conceptualLevelCount / totalResponses) * 100 : 0;

    // 3. Kurulumu Sürdürmede Başarısızlık:
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

    // 4. Öğrenmeyi Öğrenme:
    // categoryComplete true olan sonuçların sıra numaralarını (deneme sayısını) alalım.
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
      const avgOther = otherCompletions.reduce((a, b) => a + b, 0) / otherCompletions.length;
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

  return (
    <S.Div>
      <S.Table>
        {columns.map((column, colIndex) => (
          <S.Column key={colIndex}>
            {column.map((item, index) => (
              <S.Line key={index}>
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
              </S.Line>
            ))}
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
              ["Toplam perseveratif tepki sayısı", scores.perseverativeResponses],
              ["Toplam perseveratif hata sayısı", scores.perseverativeErrors],
              ["Toplam perseveratif olmayan hata sayısı", scores.nonPerseverativeErrors],
              ["Perseveratif hata yüzdesi", scores.perseverativeErrorPercentage.toFixed(2) + "%"],
              ["İlk kategoriyi tamamlamada kullanılan tepki sayısı", scores.firstCategoryResponseCount],
              ["Kavramsal düzey tepki sayısı", scores.conceptualLevelResponses],
              ["Kavramsal düzey tepki yüzdesi", scores.conceptualLevelPercentage.toFixed(2) + "%"],
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
    </S.Div>
  );
}

export default WcstTable;
