import React, { useState, useMemo, useEffect } from "react";
import * as S from "./styles";
import staticTestResult from "../../data/staticTestResult.json";

// Kategori sıralaması ve maksimum doğru ardışık tepki sayısı
const CATEGORY_ORDER = ['color', 'figure', 'count'];
const MAX_CORRECT_CONSECUTIVE = 10;

// İlk kategorinin tamamlanıp tamamlanmadığını kontrol eder
function isFirstCategoryCompleted(results) {
    const firstCategory = CATEGORY_ORDER[0];
    let correctCount = 0;

    for (let i = 0; i < results.length; i++) {
        if (results[i].currentCategory !== firstCategory && correctCount < MAX_CORRECT_CONSECUTIVE) {
            return true;
        }
        if (results[i].currentCategory === firstCategory) {
            if (results[i].responseCategories?.includes(firstCategory)) {
                correctCount++;
                if (correctCount >= MAX_CORRECT_CONSECUTIVE) return true;
            } else {
                correctCount = 0;
            }
        }
    }
    return correctCount >= MAX_CORRECT_CONSECUTIVE;
}


export default function DebugResults() {
    const [selectedCards, setSelectedCards] = useState([]);
    const [perseverativeStats, setPerseverativeStats] = useState({ tepki: 0, hata: 0 });
    const [perseverativeResponses, setPerseverativeResponses] = useState([]);
    const [perseverativeDetails, setPerseverativeDetails] = useState([]);

    useEffect(() => {
        // --- AŞAMA 1: Temel Perseverasyon Kuralları (Sandviç Hariç) ---
        const isPerseverative_pass1 = new Array(staticTestResult.length).fill(false);
        const details_pass1 = new Array(staticTestResult.length).fill(null);
        let newPrincipleCategory = null;
        let consecutiveRuleTriggerCount = 0;
        let prevIterationCategory = null;
        const firstCategoryDone = isFirstCategoryCompleted(staticTestResult);
        let consecutivePureIncorrectCategory = null; // Önceki saf ve yanlış tepkinin kategorisi

        const updatePerseverationPass1 = (index, category, ruleExplanation, isTrigger = false) => {
            if (index < 0 || index >= staticTestResult.length) return;

            // Daha önce işaretlenmişse ve tetikleyici değilse veya aynı açıklama ise işlem yapma
            if (isPerseverative_pass1[index]) {
                const existingDetail = details_pass1[index];
                if (isTrigger && existingDetail && !existingDetail.explanation.includes("Tetikleyici")) {
                    // Mevcut açıklama tetikleyici değilse ve yeni gelen tetikleyiciyse birleştir (opsiyonel)
                    // Şimdilik üzerine yazalım, tetikleyici daha önemli olabilir.
                    // existingDetail.explanation = `${ruleExplanation}: ${category} (${existingDetail.explanation})`;
                } else if (existingDetail && existingDetail.explanation === `${ruleExplanation}: ${category}`) {
                    return; // Zaten aynıysa dokunma
                } else if (!isTrigger) {
                    // Farklı bir kuraldan işaretliyse ve bu tetikleyici değilse, eskisini koru.
                    return;
                }
                // Eğer buraya geldiyse ya ilk işaretleme ya da tetikleyici ile üzerine yazma durumu
            }


            isPerseverative_pass1[index] = true;
            const response = staticTestResult[index];
            const isError = !response.responseCategories?.includes(response.currentCategory);
            const isCorrect = !isError;
            const existingDebugInfo = details_pass1[index]?.debugInfo || ''; // Varsa debug'ı koru

            details_pass1[index] = {
                isPerseverative: true,
                isError: isError,
                isCorrectPerseverative: isCorrect,
                explanation: `${ruleExplanation}: ${category}`,
                perseverativeCategory: category,
                debugInfo: existingDebugInfo // Debug bilgisini koru
            };
        };

        // --- Aşama 1 Ana Döngü ---
        for (let i = 0; i < staticTestResult.length; i++) {
            const currentResponse = staticTestResult[i];
            const responseCategories = currentResponse.responseCategories || [];
            const currentCategory = currentResponse.currentCategory;
            const isPure = responseCategories.length === 1;
            const isCorrect = responseCategories.includes(currentCategory);
            const isIncorrect = !isCorrect;

            const categoryChanged = i > 0 && currentCategory !== prevIterationCategory;
            if (categoryChanged && newPrincipleCategory !== null) {
                newPrincipleCategory = null;
                consecutiveRuleTriggerCount = 0;
                consecutivePureIncorrectCategory = null; // Kategori değişikliğinde sıfırla
                details_pass1[i] = details_pass1[i] || {};
                details_pass1[i].debugInfo = `(Aşama 1) Kategori değişikliği, Yeni İlke (${prevIterationCategory} -> ${currentCategory}) sıfırlandı. ${details_pass1[i].debugInfo || ''}`;
            }

            let actualPreviousCategory = null;
            let matchesPreviousCategory = false;
            if (firstCategoryDone && isPure) {
                for (let j = i - 1; j >= 0; j--) {
                    if (staticTestResult[j].currentCategory !== currentCategory) {
                        actualPreviousCategory = staticTestResult[j].currentCategory;
                        break;
                    }
                }
                if (actualPreviousCategory && responseCategories[0] === actualPreviousCategory) {
                    matchesPreviousCategory = true;
                }
            }

            // Yeni kural tetikleme koşulu: Saf, yanlış, önceki kategoriyle eşleşmiyor VE ilk kategori tamamlanmış.
            const canTriggerNewRule = firstCategoryDone && isPure && isIncorrect && !matchesPreviousCategory;

            if (canTriggerNewRule) {
                if (consecutivePureIncorrectCategory === responseCategories[0] && consecutivePureIncorrectCategory !== null) {
                    consecutiveRuleTriggerCount++;
                } else {
                    consecutiveRuleTriggerCount = 1;
                }
                consecutivePureIncorrectCategory = responseCategories[0];
            } else {
                consecutiveRuleTriggerCount = 0;
                consecutivePureIncorrectCategory = null; // Ardışık değilse sıfırla
            }

            // --- YENİ İLKE TETİKLEME VE İŞARETLEME MANTIĞI (DEĞİŞTİRİLDİ) ---
            if (consecutiveRuleTriggerCount >= 2) {
                const principleCat = responseCategories[0]; // İlkeyi belirleyen kategori (mevcut saf yanıttan)

                // Yeni ilke kategorisini ayarla (eğer değişmişse)
                if (newPrincipleCategory !== principleCat) {
                    newPrincipleCategory = principleCat;
                    details_pass1[i] = details_pass1[i] || {}; // Debug info için obje oluştur
                    details_pass1[i].debugInfo = `(Aşama 1) Yeni İlke '${newPrincipleCategory}' olarak ayarlandı (indeks ${i}). ${details_pass1[i].debugInfo || ''}`;
                }

                // Sadece MEVCUT yanıtı (i) "Tetikleyici" olarak işaretle.
                // Açıklamayı, sayacın 2 mi yoksa daha fazla mı olduğuna göre ayarla.
                const explanation = (consecutiveRuleTriggerCount === 2)
                    ? "Yeni İlke (Tetikleyici)"         // Bu İLK tetikleyici yanıt (yani 2. ardışık)
                    : "Yeni İlke (Tetikleyici Devam)"; // Bu 3. veya daha sonraki ardışık tetikleyici

                // updatePerseverationPass1'i sadece 'i' indeksi için çağır.
                updatePerseverationPass1(i, newPrincipleCategory, explanation, true); // 'true' ile tetikleyici olduğunu belirt

                // --- ÖNEMLİ: i-1 İÇİN İŞARETLEME YAPILMIYOR ---
                // Eski kod: updatePerseverationPass1(i - 1, newPrincipleCategory, "Yeni İlke (Tetikleyici - Önceki)", true); BU SATIR SİLİNDİ!

            } else {
                // Henüz yeni ilke tetiklenmedi VEYA tetikleme serisi bozuldu.
                // Mevcut yanıt, HALİHAZIRDA AKTİF olan bir 'newPrincipleCategory'ye uyuyor mu VEYA 'Önceki Kategori İlkesi'ne mi uyuyor?
                // (Aşama 1'de başka bir kuraldan zaten işaretlenmediyse kontrol et)
                if (!isPerseverative_pass1[i]) {
                    if (newPrincipleCategory !== null) { // Eğer AKTİF bir yeni ilke varsa
                        if (isPure && responseCategories[0] === newPrincipleCategory) {
                            // Bu yanıt saf ve aktif yeni ilkeye uyuyor (ama tetikleyici değil)
                            updatePerseverationPass1(i, newPrincipleCategory, "Yeni İlke (Devam)");
                        }
                    } else { // Aktif yeni ilke YOKSA, fallback kuralını kontrol et
                        if (firstCategoryDone && matchesPreviousCategory && isPure && isIncorrect) {
                            // İlk kategori bitti, yanıt saf, yanlış ve önceki kategoriyle eşleşiyor
                            updatePerseverationPass1(i, actualPreviousCategory, "Önceki Kategori İlkesi");
                        }
                    }
                }
            }
            // --- Yeni İlke Mantığı Sonu ---

            prevIterationCategory = currentCategory;
        } // Aşama 1 Döngü Sonu

        // --- AŞAMA 2: Gerçek Sandviç Kuralı (Değişiklik Yok) ---
        const finalIsPerseverative = [...isPerseverative_pass1];
        const finalDetails = JSON.parse(JSON.stringify(details_pass1));

        for (let i = 0; i < staticTestResult.length; i++) {
            // Aşama 1'de işaretlenmiş olanları atla
            if (isPerseverative_pass1[i]) {
                continue;
            }

            let prevPerseverativeIndex = -1;
            let nextPerseverativeIndex = -1;

            // Önceki en yakın perseveratif tepkiyi bul
            for (let j = i - 1; j >= 0; j--) {
                if (isPerseverative_pass1[j]) {
                    prevPerseverativeIndex = j;
                    break;
                }
            }

            // Sonraki en yakın perseveratif tepkiyi bul
            for (let k = i + 1; k < staticTestResult.length; k++) {
                if (isPerseverative_pass1[k]) {
                    nextPerseverativeIndex = k;
                    break;
                }
            }

            // Hem önceki hem sonraki perseveratif tepkiler var mı kontrol et
            if (prevPerseverativeIndex !== -1 && nextPerseverativeIndex !== -1) {
                // Önceki ve sonraki perseveratif tepkilerin kategorileri aynı mı?
                const prevCategory = details_pass1[prevPerseverativeIndex].perseverativeCategory;
                const nextCategory = details_pass1[nextPerseverativeIndex].perseverativeCategory;

                // Eğer kategoriler aynıysa, aradaki tüm tepkilerde kesintisiz zincir kontrolü yap
                if (prevCategory === nextCategory) {
                    // Zincir kırılması kontrolü
                    let isChainBroken = false;

                    // Önceki perseveratif ve sonraki perseveratif arasındaki tüm tepkileri kontrol et
                    for (let j = prevPerseverativeIndex + 1; j < nextPerseverativeIndex; j++) {
                        const intermediateResponse = staticTestResult[j];
                        const intermediateCategories = intermediateResponse.responseCategories || [];

                        // Eğer aradaki bir tepki perseveratif kategoriyi içermiyorsa, zincir kırılmış demektir
                        if (!intermediateCategories.includes(prevCategory)) {
                            isChainBroken = true;
                            break;
                        }
                    }

                    // Zincir kırılmamışsa ve mevcut tepki perseveratif kategoriyi içeriyorsa sandviç kuralını uygula
                    if (!isChainBroken) {
                        const currentResponse = staticTestResult[i];
                        const responseCategories = currentResponse.responseCategories || [];

                        if (responseCategories.includes(prevCategory)) {
                            finalIsPerseverative[i] = true;
                            const isError = !responseCategories.includes(currentResponse.currentCategory);
                            const isCorrect = !isError;

                            finalDetails[i] = {
                                ...finalDetails[i],
                                isPerseverative: true,
                                isError: isError,
                                isCorrectPerseverative: isCorrect,
                                explanation: `Sandviç Kuralı: ${prevCategory}`,
                                perseverativeCategory: prevCategory,
                                debugInfo: `Kesintisiz sandviç zinciri: ${prevPerseverativeIndex + 1}-${nextPerseverativeIndex + 1}, Kategori: ${prevCategory}`
                            };
                        }
                    }
                }
            }
        }

        // --- Final Hesaplamalar (Değişiklik Yok) ---
        let finalPerseveratifTepki = 0;
        let correctedPerseveratifHata = 0;
        for (let i = 0; i < finalIsPerseverative.length; i++) {
            if (finalIsPerseverative[i]) {
                finalPerseveratifTepki++;
                if (finalDetails[i]?.isError) {
                    correctedPerseveratifHata++;
                }
            }
        }

        // State güncellemeleri (Değişiklik Yok)
        setPerseverativeStats({ tepki: finalPerseveratifTepki, hata: correctedPerseveratifHata });
        setPerseverativeResponses(finalIsPerseverative);
        setPerseverativeDetails(finalDetails);

    }, []); // Bağımlılık dizisi boş

    // --- Geri Kalan Kod (useMemo, JSX return) ---
    // ... (Değişiklik yok) ...
    // Memoize edilmiş değerler
   const scores = useMemo(() => {
    if (!staticTestResult?.length) return null;

    const totalCorrect = staticTestResult.filter(r =>
        r.responseCategories?.includes(r.currentCategory)
    ).length;
    const totalResponses = staticTestResult.length;
    const totalErrors = totalResponses - totalCorrect;

    // 6. Tamamlanan kategori sayısı
    const completedCategories = CATEGORY_ORDER.reduce((count, category) => {
        let categoryCompletedCount = 0;
        let consecutiveCorrect = 0;
        staticTestResult.forEach(response => {
            if (response.currentCategory === category && response.responseCategories?.includes(category)) {
                consecutiveCorrect++;
                if (consecutiveCorrect >= MAX_CORRECT_CONSECUTIVE) {
                    categoryCompletedCount++;
                    consecutiveCorrect = 0; // Yeni bir seri için sıfırla
                }
            } else {
                consecutiveCorrect = 0; // Seri kırıldı, sıfırla
            }
        });
        return count + categoryCompletedCount;
    }, 0);

    // 7. Perseveratif olmayan hata sayısı
    const nonPerseverativeErrors = totalErrors - perseverativeStats.hata;

    // 8. Perseveratif hata yüzdesi (Düzeltilmiş)
    const perseverativeErrorPercentage = totalResponses > 0
        ? ((perseverativeStats.hata / totalResponses) * 100).toFixed(2)
        : 0; // Toplam tepki yoksa sıfır döndür

    // 9. İlk kategori deneme sayısı (Düzeltildi)
    let firstCategoryTrials = 0;
    let firstCategoryCompleted = false;
    let consecutiveCorrect = 0;
    staticTestResult.forEach(response => {
        if (!firstCategoryCompleted) {
            firstCategoryTrials++;
            if (response.currentCategory === CATEGORY_ORDER[0]) {
                if (response.responseCategories?.includes(CATEGORY_ORDER[0])) {
                    consecutiveCorrect++;
                    if (consecutiveCorrect >= MAX_CORRECT_CONSECUTIVE) {
                        firstCategoryCompleted = true;
                    }
                } else {
                    consecutiveCorrect = 0;
                }
            }
        }
    });

    // 10. Kavramsal düzey tepki sayısı
    let conceptualResponses = 0;
    consecutiveCorrect = 0;
    staticTestResult.forEach(response => {
        if (response.responseCategories?.includes(response.currentCategory)) {
            consecutiveCorrect++;
            if (consecutiveCorrect >= 3) conceptualResponses++;
        } else {
            consecutiveCorrect = 0;
        }
    });

    // 11. Kavramsal düzey tepki yüzdesi
    const conceptualResponsePercentage = ((conceptualResponses / totalResponses) * 100).toFixed(2);

    // 12. Kurulumu sürdürmede başarısızlık
    let failureToMaintainSet = 0;
    consecutiveCorrect = 0;
    staticTestResult.forEach(response => {
        if (response.responseCategories?.includes(response.currentCategory)) {
            consecutiveCorrect++;
        } else {
            if (consecutiveCorrect >= 5 && consecutiveCorrect < 10) failureToMaintainSet++;
            consecutiveCorrect = 0;
        }
    });

    // 13. Öğrenmeyi öğrenme
    let learningToLearn = null;
    if (completedCategories >= 3) {
        const categoryErrors = CATEGORY_ORDER.map(category => {
            const categoryResponses = staticTestResult.filter(r => r.currentCategory === category);
            const errors = categoryResponses.filter(r => !r.responseCategories?.includes(category)).length;
            return (errors / categoryResponses.length) * 100;
        }).filter(v => !isNaN(v));

        const differences = [];
        for (let i = 1; i < categoryErrors.length; i++) {
            differences.push(categoryErrors[i - 1] - categoryErrors[i]);
        }
        learningToLearn = (differences.reduce((a, b) => a + b, 0) / differences.length).toFixed(2);
    }

    return {
        totalResponses,
        totalCorrect,
        totalErrors,
        perseverativeResponses: perseverativeStats.tepki,
        perseverativeErrors: perseverativeStats.hata,
        completedCategories,
        nonPerseverativeErrors,
        perseverativeErrorPercentage,
        firstCategoryTrials: firstCategoryCompleted ? firstCategoryTrials : 'Tamamlanamadı', // Değişiklik burada
        conceptualResponses,
        conceptualResponsePercentage,
        failureToMaintainSet,
        learningToLearn: learningToLearn || 'Yetersiz veri'
    };
}, [staticTestResult, perseverativeStats]);


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
                            const detail = perseverativeDetails[globalIndex];
                            const isCorrect = item.responseCategories?.includes(item.currentCategory);
                            const showPH = detail?.isPerseverative && detail?.isCorrectPerseverative;
                            const showP = detail?.isPerseverative && !showPH;

                            return (
                                <S.Line key={globalIndex} onClick={() => setSelectedCards(prev => [...prev, item])}>
                                    {/* Kutucuklar */}
                                    <S.Box isNumber isCorrect={isCorrect}>{globalIndex + 1}</S.Box>
                                    <S.Box isCorrect={item.responseCategories?.includes('color')}>R</S.Box>
                                    <S.Box isCorrect={item.responseCategories?.includes('figure')}>Ş</S.Box>
                                    <S.Box isCorrect={item.responseCategories?.includes('count')}>M</S.Box>
                                    <S.Box isCorrect={!['color', 'figure', 'count'].some(c => item.responseCategories?.includes(c))}>D</S.Box>
                                    {/* Perseverasyon göstergeleri */}
                                    <S.Box isCorrect={false} style={{ visibility: showP ? 'visible' : 'hidden', color: 'white', fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }}>P</S.Box>
                                    <S.Box isCorrect={false} style={{ visibility: showPH ? 'visible' : 'hidden', color: 'red', fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }}>PH</S.Box>
                                </S.Line>
                            );
                        })}
                    </S.Column>
                ))}
            </S.Table>

            {/* Sonuçlar paneli */}
            <S.Results>
                <table>
                    <thead><tr><th>Test Puanları</th><th>Değer</th></tr></thead>
                    <tbody>
                        {scores && [
                            ["Toplam tepki sayısı", scores.totalResponses],
                            ["Toplam yanlış sayısı", scores.totalErrors],
                            ["Toplam doğru sayısı", scores.totalCorrect],
                            ["Perseveratif tepki", scores.perseverativeResponses],
                            ["Perseveratif hata", scores.perseverativeErrors],
							 ["Tamamlanan kategori sayısı", scores.completedCategories],
    ["Perseveratif olmayan hata", scores.nonPerseverativeErrors],
    ["Perseveratif hata %", scores.perseverativeErrorPercentage],
    ["İlk kategori deneme sayısı", scores.firstCategoryTrials],
    ["Kavramsal tepki sayısı", scores.conceptualResponses],
    ["Kavramsal tepki %", scores.conceptualResponsePercentage],
    ["Kurulum başarısızlık", scores.failureToMaintainSet],
    ["Öğrenmeyi öğrenme", scores.learningToLearn]
                        ].map(([label, value], i) => (
                            (value !== undefined && value !== null) && (<tr key={i}><td>{label}</td><td>{value}</td></tr>)
                        ))}
                    </tbody>
                </table>
                {/* Detaylı açıklamalar */}
                <div style={{ marginTop: '20px', maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Perseveratif Tepki Açıklaması</h3>
                    <p>Tabloda "P" hatalı perseveratif tepkileri, "PH" ise doğru perseveratif tepkileri gösterir.</p>
                    <p>Açıklamalarda "Sandviç Kuralı" önceki ve sonraki yanıtın perseveratif olmasını gerektirir. "Yeni İlke (Tetikleyici)" sadece ilkeyi başlatan ikinci ardışık yanıtı işaretler.</p>
                    <ul>
                        {staticTestResult.map((item, index) => {
                            const detail = perseverativeDetails[index];
                            if (detail?.isPerseverative || detail?.debugInfo) {
                                return (
                                    <li key={index} style={{ borderBottom: '1px dashed #eee', paddingBottom: '5px', marginBottom: '5px' }}>
                                        Yanıt #{index + 1}: "{item.responseCategories?.join(', ') || 'BOŞ'}" (Doğru: {item.currentCategory})
                                        {detail?.isPerseverative && ` - ${detail.explanation || 'Perseveratif'}`}
                                        {detail?.isError === true && ` (HATA)`}
                                        {detail?.isCorrectPerseverative === true && ` (DOĞRU - PH)`}
                                        {detail?.debugInfo && ` [DEBUG: ${detail.debugInfo}]`}
                                    </li>
                                );
                            }
                            return null;
                        })}
                    </ul>
                </div>
            </S.Results>
        </S.Div>
    );
}