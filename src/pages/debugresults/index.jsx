import React, { useState, useMemo, useEffect } from "react";
import * as S from "./styles";
import staticTestResult from "../../data/staticTestResult.json";

// Kategori sıralaması ve maksimum doğru ardışık tepki sayısı
const CATEGORY_ORDER = ['color', 'figure', 'count'];
const MAX_CORRECT_CONSECUTIVE = 10;

const NORMS = {
  '5-11': {
    '20-54': {
      totalResponses: { X: 121.70, Ss: 13.27 },
      totalErrors: { X: 55.38, Ss: 20.84 },
      totalCorrect: { X: 66.28, Ss: 13.29 },
      completedCategories: { X: 3.45, Ss: 1.78 },
      perseverativeResponses: { X: 34.44, Ss: 16.94 },
      perseverativeErrors: { X: 29.85, Ss: 13.55 },
      nonPerseverativeErrors: { X: 25.25, Ss: 11.62 },
      perseverativeErrorPercentage: { X: 23.88, Ss: 9.87 },
      firstCategoryTrials: { X: 19.22, Ss: 13.17 },
      conceptualResponses: { X: 50.25, Ss: 18.15 },
      conceptualResponsePercentage: { X: 42.85, Ss: 19.07 },
      failureToMaintainSet: { X: 0.80, Ss: 0.95 },
      learningToLearn: { X: -0.02, Ss: 0.08 }
    },
    '55-72': {
      totalResponses: { X: 122.04, Ss: 13.43 },
      totalErrors: { X: 55.71, Ss: 19.11 },
      totalCorrect: { X: 66.32, Ss: 9.65 },
      completedCategories: { X: 3.18, Ss: 1.63 },
      perseverativeResponses: { X: 38.36, Ss: 17.77 },
      perseverativeErrors: { X: 32.71, Ss: 13.78 },
      nonPerseverativeErrors: { X: 22.79, Ss: 10.16 },
      perseverativeErrorPercentage: { X: 26.09, Ss: 9.95 },
      firstCategoryTrials: { X: 22.36, Ss: 14.93 },
      conceptualResponses: { X: 49.29, Ss: 14.96 },
      conceptualResponsePercentage: { X: 42.00, Ss: 17.74 },
      failureToMaintainSet: { X: 1.00, Ss: 0.90 },
      learningToLearn: { X: -0.03, Ss: 0.07 }
    }
  },
  '12+': {
    '20-54': {
      totalResponses: { X: 106.25, Ss: 21.12 },
      totalErrors: { X: 34.61, Ss: 21.37 },
      totalCorrect: { X: 71.40, Ss: 10.03 },
      completedCategories: { X: 4.98, Ss: 1.59 },
      perseverativeResponses: { X: 19.39, Ss: 13.57 },
      perseverativeErrors: { X: 17.69, Ss: 11.11 },
      nonPerseverativeErrors: { X: 16.72, Ss: 12.17 },
      perseverativeErrorPercentage: { X: 15.48, Ss: 7.65 },
      firstCategoryTrials: { X: 15.72, Ss: 8.34 },
      conceptualResponses: { X: 62.23, Ss: 13.93 },
      conceptualResponsePercentage: { X: 61.99, Ss: 20.11 },
      failureToMaintainSet: { X: 0.75, Ss: 0.91 },
      learningToLearn: { X: -0.01, Ss: 0.07 }
    },
    '55-78': {
      totalResponses: { X: 104.68, Ss: 20.49 },
      totalErrors: { X: 34.23, Ss: 22.19 },
      totalCorrect: { X: 70.45, Ss: 8.86 },
      completedCategories: { X: 4.77, Ss: 1.95 },
      perseverativeResponses: { X: 19.50, Ss: 12.70 },
      perseverativeErrors: { X: 16.77, Ss: 10.34 },
      nonPerseverativeErrors: { X: 17.41, Ss: 13.68 },
      perseverativeErrorPercentage: { X: 14.96, Ss: 7.08 },
      firstCategoryTrials: { X: 18.14, Ss: 12.30 },
      conceptualResponses: { X: 58.14, Ss: 14.64 },
      conceptualResponsePercentage: { X: 59.16, Ss: 21.24 },
      failureToMaintainSet: { X: 0.41, Ss: 0.59 },
      learningToLearn: { X: -0.01, Ss: 0.03 }
    }
  }
};

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
    const [age, setAge] = useState('');
    const [education, setEducation] = useState('');
	

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
 
  const getNormGroup = () => {
        if (!age || !education) return null;
        const ageNum = parseInt(age);
        
        let ageRange = '';
        if (education === '5-11') {
            ageRange = ageNum >= 55 ? '55-72' : '20-54';
        } else {
            ageRange = ageNum >= 55 ? '55-78' : '20-54';
        }
        
        return NORMS[education]?.[ageRange] || null;
    };

    const compareWithNorm = (scoreKey) => {
    const normGroup = getNormGroup();
    if (!normGroup || !scores || typeof scores[scoreKey] !== 'number') return null;
    
    const userValue = scores[scoreKey];
    const normValue = normGroup[scoreKey]?.X;
    const normSD = normGroup[scoreKey]?.Ss;

    if (!normValue || !normSD) return null;
    
    const zScore = (userValue - normValue) / normSD;
    
    // Metriklerin yönünü belirle (1: Yüksek iyi, -1: Yüksek kötü)
    const metricDirection = {
        totalResponses: -1,
        totalErrors: -1,
        totalCorrect: 1,
        completedCategories: 1,
        perseverativeResponses: -1,
        perseverativeErrors: -1,
        nonPerseverativeErrors: -1,
        perseverativeErrorPercentage: -1,
        conceptualResponsePercentage: 1,
        failureToMaintainSet: -1,
        learningToLearn: 1
    }[scoreKey] || 0;

    let interpretation = 'Normal';
    if (zScore > 1) {
        interpretation = metricDirection === 1 ? 'İyi' : 'Zayıf';
    } else if (zScore < -1) {
        interpretation = metricDirection === 1 ? 'Zayıf' : 'İyi';
    }

    return {
        userValue,
        normValue,
        normSD,
        zScore,
        interpretation,
        direction: metricDirection
    };
};

    const generateClinicalComment = () => {
    if (!age || !education) return <p>Lütfen yaş ve eğitim bilgilerini giriniz</p>;
    
    const comparisons = {
        dikkat: [
            { label: "Toplam Hata", ...compareWithNorm('totalErrors') },
            { label: "Kurulum Sürdürme", ...compareWithNorm('failureToMaintainSet') }
        ],
        perseveratif: [
            { label: "Toplam Tepki", ...compareWithNorm('totalResponses') },
            { label: "Toplam Hata", ...compareWithNorm('totalErrors') },
            { label: "Tamamlanan Kategori", ...compareWithNorm('completedCategories') },
            { label: "Perseveratif Tepki", ...compareWithNorm('perseverativeResponses') },
            { label: "Perseveratif Hata", ...compareWithNorm('perseverativeErrors') },
            { label: "Perseveratif Olmayan Hata", ...compareWithNorm('nonPerseverativeErrors') },
            { label: "Perseveratif Hata %", scoreKey: 'perseverativeErrorPercentage', direction: -1 },
        { label: "Kavramsal Tepki %", scoreKey: 'conceptualResponsePercentage', direction: 1 }, 
        ],
        kavramsal: [
            { label: "Toplam Doğru", ...compareWithNorm('totalCorrect') },
            { label: "Kavramsal Tepki", ...compareWithNorm('conceptualResponses') },
            { label: "Kurulum Sürdürme", ...compareWithNorm('failureToMaintainSet') }
        ],
        kurulum: [
            { label: "Kurulum Sürdürme", ...compareWithNorm('failureToMaintainSet') }
        ]
    };

    return (
    <div style={{ 
        marginTop: 20, 
        padding: '25px 30px',
        borderRadius: 12,
       
       
    }}>
        <h3 style={{
            margin: '0 0 25px 0',
            color: '#00a7cf', // Başlık rengini sayfa temasına uygun yaptım
            fontSize: '24px',
            fontWeight: 600,
            borderBottom: '2px solid rgba(0, 167, 207, 0.3)',
            paddingBottom: '12px'
        }}>
            <span style={{ color: '#00a7cf' }}>▹</span> Klinik Yorum
        </h3>

        {/* Demografik Bilgiler */}
        <div style={{ 
            marginBottom: 30,
            display: 'flex',
            gap: 25,
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: 'rgba(0, 167, 207, 0.05)', // Hafif mavi arka plan
            borderRadius: 8
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                    backgroundColor: '#00a7cf',
                    color: 'white',
                    padding: '6px 12px',
					fontSize: 14,
                    fontWeight: 500
                }}>
                    Yaş: {age}
                </span>
            </div>
            <div style={{ 
                width: 1, 
                height: 30, 
                backgroundColor: 'rgba(255, 255, 255, 0.2)' 
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                    backgroundColor: '#00a7cf',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 500
                }}>
                    Eğitim: {education === '5-11' ? '5-11 Yıl' : '12+ Yıl'}
                </span>
            </div>
        </div>

        {/* Performans Değerlendirmesi */}
        <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20
        }}>
            {Object.entries(comparisons).map(([category, metrics]) => (
                <div key={category} style={{
                    padding: 20,
                    backgroundColor: 'rgba(0, 167, 207, 0.03)',
                    borderRadius: 10,
                    border: '1px solid rgba(0, 167, 207, 0.1)'
                }}>
                    <h4 style={{
                        margin: '0 0 15px 0',
                        color: '#00a7cf',
                        fontSize: '16px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                    }}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h4>
                    
                    <div style={{ display: 'grid', gap: 12 }}>
                        {metrics.map((metric, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 15px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <span style={{ 
                                    fontSize: 14,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 500 
                                }}>
                                    {metric.label}
                                </span>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                   <span style={{
    color: metric.interpretation === 'İyi' ? '#2ecc71' :  // Yeşil (Olumlu)
           metric.interpretation === 'Zayıf' ? '#e74c3c' : // Kırmızı (Olumsuz)
           '#3498db',                                      // Mavi (Normal)
    fontWeight: 600,
    fontSize: 13
}}>
    {metric.interpretation}
</span>
                                    {metric.percentile && (
                                        <span style={{
                                            backgroundColor: 'rgba(0, 167, 207, 0.2)',
                                            color: '#00a7cf',
                                            padding: '4px 8px',
                                            borderRadius: 12,
                                            fontSize: 12,
                                            fontWeight: 500
                                        }}>
                                            {metric.percentile}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};

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
      {/* 1. Bölüm: Skor Tablosu */}
      <div style={{ marginBottom: 30 }}>
        <table>
          <thead><tr><th>Test Puanları</th><th>Değer</th></tr></thead>
          <tbody>
  {scores && [
    ["Toplam tepki sayısı", scores.totalResponses],
    ["Toplam yanlış sayısı", scores.totalErrors],
    ["Toplam doğru sayısı", scores.totalCorrect],
    ["Tamamlanan kategori sayısı", scores.completedCategories],
    ["Perseveratif tepki", scores.perseverativeResponses],
    ["Perseveratif hata", scores.perseverativeErrors],
    ["Perseveratif olmayan hata", scores.nonPerseverativeErrors],
    ["Perseveratif hata yüzdesi", scores.perseverativeErrorPercentage],
    ["İlk kategori deneme sayısı", scores.firstCategoryTrials],
    ["Kavramsal tepki sayısı", scores.conceptualResponses],
    ["Kavramsal tepki %", scores.conceptualResponsePercentage],
    ["Kurulum başarısızlık", scores.failureToMaintainSet],
    ["Öğrenmeyi öğrenme", scores.learningToLearn]
  ].map(([label, value], i) => (
    (value !== undefined && value !== null) && (
      <tr key={i}>
        <td>{label}</td>
        <td>
          {typeof value === 'number' 
            ? Number.isInteger(value) 
              ? value 
              : value.toFixed(2) 
            : value}
        </td>
      </tr>
    )
  ))}
</tbody>
        </table>
      </div>
    </S.Results>

    {/* 2. Bölüm: Demografik Bilgiler */}
    <S.DemographicSection>
      <h3>Demografik Bilgiler</h3>
      <div className="input-group">
        <div className="input-field">
          <label>Yaş</label>
          <input
            type="number"
            placeholder="Yaş"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="0"
            max="120"
          />
        </div>
        <div className="input-field">
          <label>Eğitim Süresi</label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          >
            <option value="">Seçiniz</option>
            <option value="5-11">5-11 Yıl</option>
            <option value="12+">12+ Yıl</option>
          </select>
        </div>
      </div>
    </S.DemographicSection>

    {/* 3. Bölüm: Klinik Yorum - Results'ın dışına taşındı */}
    <S.ClinicalSection>
      
      <div className="clinical-content" style={{ width: '100%' }}>
        {generateClinicalComment()}
      </div>
    </S.ClinicalSection>

    {/* 4. Bölüm: Perseveratif Açıklamalar */}
    <S.PerseverativeSection>
      <h3>Perseveratif Tepki Analizi</h3>	
      <div className="info-text">
        <p>Tabloda görülen işaretler:</p>
        <ul>
          <li><strong>P:</strong> Hatalı perseveratif tepki</li>
          <li><strong>PH:</strong> Doğru perseveratif tepki</li>
        </ul>
        <p className="rule-explanation">
          <strong>Sandviç Kuralı:</strong> Önceki ve sonraki yanıtın perseveratif olmasını gerektirir.<br />
          <strong>Yeni İlke (Tetikleyici):</strong> İlkeyi başlatan ikinci ardışık yanıtı işaretler.
        </p>
      </div>
      <div className="explanation-list">
        {staticTestResult.map((item, index) => {
          const detail = perseverativeDetails[index];
          if (detail?.isPerseverative || detail?.debugInfo) {
            return (
              <div key={index} className="explanation-item">
                <div className="response-header">
                  <span className="response-number">#{index + 1}</span>
                  <span className="response-categories">"{item.responseCategories?.join(', ') || 'BOŞ'}"</span>
                  <span className="correct-category">(Doğru: {item.currentCategory})</span>
                  {detail?.isError && <span className="error-tag">HATA</span>}
                  {detail?.isCorrectPerseverative && <span className="correct-tag">DOĞRU - PH</span>}
                </div>
                {detail?.isPerseverative && (
                  <div className="explanation-text">
                    {detail.explanation || 'Perseveratif tepki tespit edildi'}
                  </div>
                )}
                {detail?.debugInfo && (
                  <div className="debug-info">
                    {detail.debugInfo}
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    </S.PerseverativeSection>
  </S.Div>
);
}