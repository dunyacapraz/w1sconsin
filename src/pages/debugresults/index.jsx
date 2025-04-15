import React, { useState, useMemo, useEffect, useContext } from "react";
import * as S from "./styles"; // ./styles dosyasından stilleri aldığımızı varsayıyoruz
import { WcstContext } from "../../components/context";

// Kategori sıralaması ve maksimum doğru ardışık tepki sayısı
const CATEGORY_ORDER = ["color", "figure", "count"];
const MAX_CORRECT_CONSECUTIVE = 10;

// NORMS verisi aynı kalıyor
const NORMS = {
  // ... (NORMS verisi öncekiyle aynı) ...
    "5-11": {
        "20-54": {
          totalResponses: { X: 121.7 },
          totalErrors: { X: 55.38 },
          totalCorrect: { X: 66.28 },
          completedCategories: { X: 3.45 },
          perseverativeResponses: { X: 34.44 },
          perseverativeErrors: { X: 29.85 },
          nonPerseverativeErrors: { X: 25.25 },
          perseverativeResponsePercentage: { X: 23.88, Ss: 1 }, // Ss korundu
          firstCategoryTrials: { X: 19.22 },
          conceptualResponses: { X: 50.25 },
          conceptualResponsePercentage: { X: 42.85, Ss: 1 }, // Ss korundu
          failureToMaintainSet: { X: 0.8 },
          learningToLearn: { X: -0.02 }
        },
        "55-72": {
          totalResponses: { X: 122.04 },
          totalErrors: { X: 55.71 },
          totalCorrect: { X: 66.32 },
          completedCategories: { X: 3.18 },
          perseverativeResponses: { X: 38.36 },
          perseverativeErrors: { X: 32.71 },
          nonPerseverativeErrors: { X: 22.79 },
          perseverativeResponsePercentage: { X: 26.09, Ss: 1 }, // Ss korundu
          firstCategoryTrials: { X: 22.36 },
          conceptualResponses: { X: 49.29 },
          conceptualResponsePercentage: { X: 42.0, Ss: 1 }, // Ss korundu
          failureToMaintainSet: { X: 1.0 },
          learningToLearn: { X: -0.03 }
        }
      },
      "12+": {
        "20-54": {
          totalResponses: { X: 106.25 },
          totalErrors: { X: 34.61 },
          totalCorrect: { X: 71.4 },
          completedCategories: { X: 4.98 },
          perseverativeResponses: { X: 19.39 },
          perseverativeErrors: { X: 17.69 },
          nonPerseverativeErrors: { X: 16.72 },
          perseverativeResponsePercentage: { X: 15.48, Ss: 1 }, // Ss korundu
          firstCategoryTrials: { X: 15.72 },
          conceptualResponses: { X: 62.23 },
          conceptualResponsePercentage: { X: 61.99, Ss: 1 }, // Ss korundu
          failureToMaintainSet: { X: 0.75 },
          learningToLearn: { X: -0.01 }
        },
        "55-78": {
          totalResponses: { X: 104.68 },
          totalErrors: { X: 34.23 },
          totalCorrect: { X: 70.45 },
          completedCategories: { X: 4.77 },
          perseverativeResponses: { X: 19.5 },
          perseverativeErrors: { X: 16.77 },
          nonPerseverativeErrors: { X: 17.41 },
          perseverativeResponsePercentage: { X: 14.96, Ss: 1 }, // Ss korundu
          firstCategoryTrials: { X: 18.14 },
          conceptualResponses: { X: 58.14 },
          conceptualResponsePercentage: { X: 59.16, Ss: 1 }, // Ss korundu
          failureToMaintainSet: { X: 0.41 },
          learningToLearn: { X: -0.01 }
        }
      }
};


// İlk kategorinin tamamlanıp tamamlanmadığını kontrol eder (Bu fonksiyon artık doğrudan kullanılmayacak, ama 'firstCategoryTrials' için benzer mantık içeride var)
// function isFirstCategoryCompleted(results) { ... } // Bu fonksiyonun doğrudan kullanımına gerek kalmadı, mantık 'scores' içinde

export default function DebugResults() {
  const { result } = useContext(WcstContext);
  // State tanımlamaları ilk koddan aynen alındı
  const [selectedCards, setSelectedCards] = useState([]);
  const [perseverativeStats, setPerseverativeStats] = useState({
    tepki: 0,
    hata: 0,
  });
  const [perseverativeResponses, setPerseverativeResponses] = useState([]);
  const [perseverativeDetails, setPerseverativeDetails] = useState([]);
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // useEffect içindeki perseverasyon hesaplama mantığı ilk koddan aynen alındı
  useEffect(() => {
    // ... (Perseverasyon hesaplama kodu değişmedi, önceki yanıttaki gibi) ...
    if (!result || result.length === 0) {
        setPerseverativeStats({ tepki: 0, hata: 0 });
        setPerseverativeResponses([]);
        setPerseverativeDetails([]);
        console.warn("useEffect içinde result verisi bulunamadı veya boş.");
        return;
    }

    const isPerseverative_pass1 = new Array(result.length).fill(false);
    const details_pass1 = Array.from({ length: result.length }, () => ({}));
    let establishedPrincipleCategory = null;
    let potentialPrincipleCategory = null;
    let potentialChainLength = 0;
    let potentialPureCount = 0;
    let potentialPureIndices = [];
    let potentialChainStartIndex = -1;
    let prevIterationCategory = null;
    // İlk kategori tamamlama kontrolü için isFirstCategoryCompleted fonksiyonu doğrudan kullanılmıyor,
    // perseverasyon mantığı kendi içinde bu kontrolü yapıyor olabilir veya dolaylı yoldan etkileniyor olabilir.
    // Orijinal mantığı koruyalım.
    const firstCategoryDone = result && result.length > 0 ? (()=>{
        if (!result || result.length === 0) return false;
        const firstCategory = CATEGORY_ORDER[0];
        let correctCount = 0;
        for (let i = 0; i < result.length; i++) {
            if (result[i].currentCategory !== firstCategory && correctCount < MAX_CORRECT_CONSECUTIVE) return true;
            if (result[i].currentCategory === firstCategory) {
                if (result[i].responseCategories?.includes(firstCategory)) {
                    correctCount++; if (correctCount >= MAX_CORRECT_CONSECUTIVE) return true;
                } else { correctCount = 0; }
            }
        } return correctCount >= MAX_CORRECT_CONSECUTIVE;
    })() : false;

    const updatePerseverationPass1 = (
      index,
      category,
      ruleExplanation,
      isTrigger = false,
      debugMessage = ""
    ) => {
        if (index < 0 || index >= result.length) {
            console.warn(`updatePerseverationPass1 geçersiz index ile çağrıldı: ${index}`);
            return;
        }
        const existingDetail = details_pass1[index];
        const newExplanation = `${ruleExplanation}: ${category}`;

        if (isPerseverative_pass1[index] && !isTrigger && existingDetail?.explanation && existingDetail.explanation !== newExplanation && !existingDetail.explanation.startsWith("Sandviç")) {
            existingDetail.debugInfo = `${existingDetail.debugInfo || ""} | ${debugMessage} (İşaretleme atlandı: ${newExplanation}, mevcut: ${existingDetail.explanation})`;
           return;
        }

        isPerseverative_pass1[index] = true;
        const response = result[index];
        if (!response) {
            console.warn(`updatePerseverationPass1 içinde result[${index}] bulunamadı.`);
            return;
        }

        const isError = !response.responseCategories?.includes(response.currentCategory);
        const isCorrectPerseverative = !isError;
        const existingDebugInfo = existingDetail?.debugInfo || "";

        details_pass1[index] = {
          ...existingDetail,
          isPerseverative: true,
          isError: isError,
          isCorrectPerseverative: isCorrectPerseverative,
          explanation: newExplanation,
          perseverativeCategory: category,
          debugInfo: `${existingDebugInfo ? existingDebugInfo + " | " : ""}${debugMessage}`,
        };
    };

    // --- Aşama 1 Ana Döngü ---
    for (let i = 0; i < result.length; i++) {
      const currentResponse = result[i];
        if (!currentResponse) {
            console.warn(`Aşama 1 döngüsünde geçersiz currentResponse, index: ${i}`);
            continue;
        }

      const responseCategories = currentResponse.responseCategories || [];
      const currentCategory = currentResponse.currentCategory;
      const isPure = responseCategories.length === 1;
      const isAmbiguous = responseCategories.length > 1;
      const isCorrect = responseCategories.includes(currentCategory);
      const isIncorrect = !isCorrect;

      const categoryChanged = i > 0 && currentCategory !== prevIterationCategory;
      if (categoryChanged) {
        const debugResetMsg = `(Aşama 1) Kategori Değişikliği (${prevIterationCategory} -> ${currentCategory}). Yeni İlke Takibi Sıfırlandı.`;
        if (!details_pass1[i]) details_pass1[i] = {}; // Initialize if not exists
        details_pass1[i].debugInfo = `${details_pass1[i].debugInfo || ""} | ${debugResetMsg}`;

        establishedPrincipleCategory = null;
        potentialPrincipleCategory = null;
        potentialChainLength = 0;
        potentialPureCount = 0;
        potentialPureIndices = [];
        potentialChainStartIndex = -1;
      }

      let actualPreviousCategory = null;
      let matchesPreviousCategory = false;
        if (firstCategoryDone && isPure && isIncorrect) {
            let foundPrevCategory = false;
            for(let prevIndex = i - 1; prevIndex >= 0; prevIndex--){
                if(!result[prevIndex]) continue;
                if(result[prevIndex].currentCategory !== currentCategory){
                    actualPreviousCategory = result[prevIndex].currentCategory;
                    foundPrevCategory = true;
                    break;
                }
            }
            if (foundPrevCategory && responseCategories[0] === actualPreviousCategory) {
                matchesPreviousCategory = true;
            }
        }

        const canStartChain = firstCategoryDone && isPure && isIncorrect; // !matchesPreviousCategory kaldırıldı

       if (!details_pass1[i]) details_pass1[i] = {}; // Initialize if not exists

      if (canStartChain) {
        const currentPureCategory = responseCategories[0];
        if (potentialPrincipleCategory === null || currentPureCategory !== potentialPrincipleCategory) {
            potentialPrincipleCategory = currentPureCategory;
            potentialChainLength = 1;
            potentialPureCount = 1;
            potentialPureIndices = [i];
            potentialChainStartIndex = i;
            details_pass1[i].debugInfo = `${details_pass1[i].debugInfo || ""} | (Aşama 1) Yeni potansiyel ilke zinciri BAŞLATILDI/DEĞİŞTİ: '${potentialPrincipleCategory}' (indeks ${i}, saf#: ${potentialPureCount})`;
        } else {
            potentialChainLength++;
            potentialPureCount++;
            potentialPureIndices.push(i);
            details_pass1[i].debugInfo = `${details_pass1[i].debugInfo || ""} | (Aşama 1) Potansiyel zincir DEVAM ediyor ('${potentialPrincipleCategory}', saf, uzunluk ${potentialChainLength}, indeks ${i}, saf#: ${potentialPureCount})`;
        }
      } else if (potentialPrincipleCategory !== null) {
        if (responseCategories.includes(potentialPrincipleCategory)) {
            potentialChainLength++;
            if (isPure) {
                potentialPureCount++;
                potentialPureIndices.push(i);
            }
             details_pass1[i].debugInfo = `${details_pass1[i].debugInfo || ""} | (Aşama 1) Potansiyel zincir DEVAM ediyor ('${potentialPrincipleCategory}', ${isPure ? 'saf' : 'müphem'}, uzunluk ${potentialChainLength}, indeks ${i}, saf#: ${potentialPureCount})`;
        } else {
            details_pass1[i].debugInfo = `${details_pass1[i].debugInfo || ""} | (Aşama 1) Potansiyel zincir ('${potentialPrincipleCategory}') KIRILDI (indeks ${i})`;
            potentialPrincipleCategory = null;
            potentialChainLength = 0;
            potentialPureCount = 0;
            potentialPureIndices = [];
            potentialChainStartIndex = -1;
        }
      }

      if (potentialPureCount >= 3 && establishedPrincipleCategory !== potentialPrincipleCategory) {
          establishedPrincipleCategory = potentialPrincipleCategory;
          const currentEstablishedPrinciple = establishedPrincipleCategory;
          const estMsg = `(Aşama 1) Yeni İlke KESİNLEŞTİ ('${currentEstablishedPrinciple}'): 3. saf yanıt #${i + 1}'de geldi. Şimdi 2. ve 3. saf işaretleniyor.`;
          details_pass1[i].debugInfo = `${details_pass1[i].debugInfo || ""} | ${estMsg}`;

          for (let k = 1; k < potentialPureIndices.length; k++) {
               const pureIndex = potentialPureIndices[k];
               if (pureIndex !== undefined && pureIndex >= 0 && pureIndex < result.length) {
                    if (!details_pass1[pureIndex]) details_pass1[pureIndex] = {}; // Initialize if not exists
                   updatePerseverationPass1(
                       pureIndex,
                       currentEstablishedPrinciple,
                       `Yeni İlke (Kurucu Saf ${k + 1}.)`,
                       false,
                       `(Aşama 1) İlke '${currentEstablishedPrinciple}' #${i + 1}'de kesinleştiği için geriye dönük işaretlendi (bu ${k+1}. saf katkıda bulundu).`
                   );
               } else {
                    console.warn(`Geriye dönük işaretlemede geçersiz pureIndex: ${pureIndex}, k: ${k}`);
               }
          }
      }

      if (!isPerseverative_pass1[i]
          && establishedPrincipleCategory !== null
          && establishedPrincipleCategory === potentialPrincipleCategory
          && isPure
          && responseCategories[0] === establishedPrincipleCategory)
      {
          updatePerseverationPass1(
              i,
              establishedPrincipleCategory,
              "Yeni İlke (Saf Devam)",
              false,
              `(Aşama 1) Önceden kesinleşmiş Yeni İlkeye ('${establishedPrincipleCategory}') uyan saf devam yanıtı.`
          );
      }
      else if (establishedPrincipleCategory === null && !isPerseverative_pass1[i] && matchesPreviousCategory) {
        updatePerseverationPass1(
            i,
            actualPreviousCategory,
            "Önceki Kategori İlkesi",
            false,
            // Debug mesajını da durumu yansıtacak şekilde güncelleyebiliriz:
            `(Aşama 1) Aktif 'Yeni İlke' olmadığında Önceki Kategori İlkesi ('${actualPreviousCategory}') uygulandı.`
        );
     }

      prevIterationCategory = currentCategory;
    } // Aşama 1 Döngü Sonu

    // --- AŞAMA 1.5 (Revize Edilmiş Hali) ---
    for (let i = 0; i < result.length - 1; i++) {
      const currentDetail = details_pass1[i];
      const nextResponse = result[i + 1];
        if (!nextResponse) continue;

      if (
        currentDetail?.isPerseverative &&
        !currentDetail.explanation?.startsWith("Önceki Kategori İlkesi") &&
        !currentDetail.explanation?.startsWith("Yeni İlke")
      ) {
        const perseverativeCategory = currentDetail.perseverativeCategory;
        const nextResponseCategories = nextResponse.responseCategories || [];

        if (!nextResponseCategories.includes(perseverativeCategory)) {
          isPerseverative_pass1[i] = false;
          if (details_pass1[i]) {
            details_pass1[i].isPerseverative = false;
            details_pass1[i].debugInfo = `${
              details_pass1[i].debugInfo || ""
            } | (Aşama 1.5 Minimal) İşaret kaldırıldı (Önceki/Yeni İlke DEĞİL): Sonraki cevap (#${
              i + 2
            }) '${perseverativeCategory}' zincirini kırdı.`;
          }
        }
      }
    }
    // --- Aşama 1.5 Sonu ---

    // --- AŞAMA 2 (Sandviç - Revize Edilmiş Hali) ---
    const finalIsPerseverative = [...isPerseverative_pass1];
    const finalDetails = JSON.parse(JSON.stringify(details_pass1));

     for (let i = 0; i < result.length; i++) {
        if (finalIsPerseverative[i]) {
          continue;
        }
        let prevPerseverativeIndex = -1;
        let prevPerseverativeCategory = null;
        let nextConfirmingPureIndex = -1;

        for (let j = i - 1; j >= 0; j--) {
          if (isPerseverative_pass1[j]) { // Pass 1 sonucuna bak
            prevPerseverativeIndex = j;
            prevPerseverativeCategory = details_pass1[j]?.perseverativeCategory; // Pass 1 detayına bak
            break;
          }
        }

        if (prevPerseverativeIndex !== -1 && prevPerseverativeCategory) {
          for (let k = i + 1; k < result.length; k++) {
             const potentialNextResponse = result[k];
              if (!potentialNextResponse) continue;
             const potentialNextCategories = potentialNextResponse.responseCategories || [];
             const isNextPure = potentialNextCategories.length === 1;
             // Sandviç için sonraki tepkinin PURE olması ve ÖNCEKİ P kategorisine uyması GEREKLİ DEĞİL.
             // Sadece Aşama 1'de P olarak işaretlenmiş olması yeterli. Düzeltme: Heaton'a göre sonraki teyit edici PURE olmalı. Mantığı koru.
             if (isPerseverative_pass1[k] && details_pass1[k]?.perseverativeCategory === prevPerseverativeCategory && isNextPure && potentialNextCategories[0] === prevPerseverativeCategory) {
                 nextConfirmingPureIndex = k;
                 break;
             }
             // Sadece PURE kontrolü yetmez, aynı zamanda Aşama 1'de P olarak işaretlenmiş mi?
             // Heaton Kılavuzu: "an ambiguous response... is scored perseverative if it occurs between two other responses which are perseverative according to the same principle [Rule A or B]"
             // Kural A = Yeni İlke, Kural B = Önceki İlke. Sandviç bunlara uymayanlar içindi.
             // Tekrar Kontrol: Roberts et al. (2007) WCST-CV4 Manual: "...a response is scored as perseverative... if it is consistent with a principle (color, form, or number) that was previously correct or consistently incorrect, and if this response would not otherwise be scored as perseverative (Rule A, B, or C)." Rule C = Failure to Maintain Set (ilgili değil).
             // Bu tanım "Sandviç"i direkt içermiyor gibi. Belki de orijinal kodda farklı bir yorumlama vardı.
             // Şimdilik orijinal koddaki gibi sonraki PURE kontrolünü bırakalım.

          }
        }

        if (prevPerseverativeIndex !== -1 && nextConfirmingPureIndex !== -1) {
          const sandwichCategory = prevPerseverativeCategory;
          let isChainUnbroken = true;
          for (let j_intermediate = prevPerseverativeIndex + 1; j_intermediate < nextConfirmingPureIndex; j_intermediate++) {
            if (!result[j_intermediate]) { isChainUnbroken = false; break; }
            const intermediateCategories = result[j_intermediate].responseCategories || [];
            // Ara tepkinin sandviç kategorisini içermesi yeterli.
            if (!intermediateCategories.includes(sandwichCategory)) {
              isChainUnbroken = false;
              const debugBreakMsg = `(Aşama 2 Revize) Sandviç zinciri ('${sandwichCategory}') #${j_intermediate + 1} adımında kırıldı.`;
              if (!finalDetails[j_intermediate]) finalDetails[j_intermediate] = {};
              finalDetails[j_intermediate].debugInfo = `${finalDetails[j_intermediate]?.debugInfo || ""} | ${debugBreakMsg}`;
              break;
            }
          }

          if (isChainUnbroken) {
              // Sandviç kuralı ile işaretlenecek olanlar ÖZELLİKLE Aşama 1'de İŞARETLENMEMİŞ OLANLARDIR.
              // Sandviç kuralı ile işaretlenecek olanlar ÖZELLİKLE Aşama 1'de İŞARETLENMEMİŞ OLANLARDIR.
for (let j_sandwich = prevPerseverativeIndex + 1; j_sandwich < nextConfirmingPureIndex; j_sandwich++) {
  // Sadece Aşama 1'de işaretlenmemiş olanları işaretle
  if (!isPerseverative_pass1[j_sandwich]) {
      finalIsPerseverative[j_sandwich] = true; // Final listeyi güncelle
      const currentResponse = result[j_sandwich];
      if (!currentResponse) continue; // Güvenlik kontrolü
      const responseCategories = currentResponse.responseCategories || [];

      // Yanıtın gerçek doğruluğunu ve müphemliğini kontrol et
      const isError = !responseCategories.includes(currentResponse.currentCategory);
      const isCorrect = !isError;
      const isAmbiguous = responseCategories.length > 1; // Müphemlik kontrolü

      // Hata mesajı ve perseverasyon tipini belirle
      let explanationText = `Sandviç Kuralı: ${sandwichCategory}`;
      let perseverationType = 'SANDWICH'; // Varsayılan sandviç tipi

      if (isAmbiguous && isError) {
          // ----> İSTEDİĞİNİZ DURUM <----
          explanationText = `Sandviç Kuralı (Müphem Hata): ${sandwichCategory}`;
          perseverationType = 'SANDWICH_AMBIGUOUS_ERROR'; // Özel tip ata
      } else if (isAmbiguous && isCorrect) {
          // İsteğe bağlı: Müphem doğru sandviçler için de ayrı tip atanabilir
           explanationText = `Sandviç Kuralı (Müphem Doğru): ${sandwichCategory}`;
           perseverationType = 'SANDWICH_AMBIGUOUS_CORRECT';
      } else if (!isAmbiguous && isError) {
           explanationText = `Sandviç Kuralı (Saf Hata): ${sandwichCategory}`;
           perseverationType = 'SANDWICH_PURE_ERROR';
      } else { // !isAmbiguous && isCorrect
           explanationText = `Sandviç Kuralı (Saf Doğru): ${sandwichCategory}`;
           perseverationType = 'SANDWICH_PURE_CORRECT';
      }

      const debugMsg = `(Aşama 2 Revize) Sandviç Kuralı (${prevPerseverativeIndex + 1} ile ${nextConfirmingPureIndex + 1} arası) uygulandı: Kategori: ${sandwichCategory}`;
      if (!finalDetails[j_sandwich]) finalDetails[j_sandwich] = {}; // Initialize if not exists

      finalDetails[j_sandwich] = {
        ...finalDetails[j_sandwich],
        isPerseverative: true,
        isError: isError, // Gerçek hata durumunu koru
        isCorrectPerseverative: isCorrect, // Gerçek doğruluğu koru (PH için önemli)
        explanation: explanationText, // Detaylı açıklama
        perseverativeCategory: sandwichCategory,
        perseverationType: perseverationType, // <<<--- YENİ ALAN: Özel durumu belirtir
        debugInfo: `${
          finalDetails[j_sandwich]?.debugInfo || ""
        } | ${debugMsg}`,
      };
    }
  } // End Loop 5
} // <<<<<<------ BU PARANTEZİN OLDUĞUNDAN EMİN OLUN: End Block 4 (if isChainUnbroken)
} // <<<<<<------ Bu parantez Block 1'i bitirir (if prevPerseverativeIndex)
} // Aşama 2 döngü sonu

// --- Final Hesaplamalar ve State Güncellemeleri ---
let finalPerseveratifTepki = 0;
let correctedPerseveratifHata = 0;
for (let i = 0; i < finalIsPerseverative.length; i++) {
if (finalIsPerseverative[i]) {
finalPerseveratifTepki++;
// Hata sayımı için finalDetails'e bakmak önemli. Çünkü sandviç ile eklenenler hata olabilir.
if (finalDetails[i]?.isPerseverative && finalDetails[i]?.isError) {
  correctedPerseveratifHata++;
}
}
}

    // Konsola yazdırma - Debugging için
    //console.log("Final Perseverative Details:", finalDetails.map((d, i) => ({ index: i + 1, ...d })));
    //console.log("Final Perseverative Stats:", { tepki: finalPerseveratifTepki, hata: correctedPerseveratifHata });


    setPerseverativeStats({
      tepki: finalPerseveratifTepki,
      hata: correctedPerseveratifHata,
    });
    setPerseverativeResponses(finalIsPerseverative); // Bu state belki artık gereksiz? finalDetails yeterli.
    setPerseverativeDetails(finalDetails);


  }, [result]); 


  
  // useMemo içindeki skor hesaplamaları (Kavramsal dahil)
  const scores = useMemo(() => {
    // GÜVENLİK KONTROLÜ: result dizisinin her elemanının geçerli olduğunu varsayalım
    // Eğer result içinde null/undefined elemanlar olabiliyorsa, tüm döngülerde kontrol eklenmeli.
    if (!result?.length || !result.every(r => r)) { // <--- BURADA FAZLA PARANTEZ VAR
      console.warn("useMemo: result verisi boş veya geçersiz eleman içeriyor.");
      return null;
    }

    // Temel sayımlar
    const totalResponses = result.length;
    const totalCorrect = result.filter((r) =>
       r.responseCategories?.includes(r.currentCategory)
    ).length;
    const totalErrors = totalResponses - totalCorrect;

    // --- YENİ Tamamlanan Kategori Hesaplaması ve LTL için Hazırlık ---
    let completedCategoriesCount = 0;
    let consecutiveCorrect = 0;
    let currentRule = null; // Takip edilen aktif kural
    let categoryJustCompleted = false; // Bir kategorinin hemen tamamlanıp tamamlanmadığını kontrol etmek için
    const sequentialCompletionInfo = []; // LTL için: { index: i, rule: currentRule }

    for (let i = 0; i < result.length; i++) {
        const response = result[i];
        // response null/undefined değilse devam et (yukarıdaki every kontrolü sayesinde gereksiz olabilir)
        // if (!response) continue;

        const ruleForThisTrial = response.currentCategory;
        const isCorrect = response.responseCategories?.includes(ruleForThisTrial);

        // Kural değişikliği kontrolü
        if (ruleForThisTrial !== currentRule) {
            currentRule = ruleForThisTrial;
            consecutiveCorrect = 0; // Yeni kural için sayacı sıfırla
            categoryJustCompleted = false; // Yeni kural için tamamlanma bayrağını sıfırla
        }

        // Mevcut kurala göre değerlendirme
        if (currentRule) { // Sadece bir kural aktifse say
            if (isCorrect) {
                consecutiveCorrect++;
                // Kategori tamamlandı mı? (Ve hemen önce tamamlanmadı mı?)
                if (consecutiveCorrect >= MAX_CORRECT_CONSECUTIVE && !categoryJustCompleted) {
                    completedCategoriesCount++;
                    categoryJustCompleted = true; // Bu seride tamamlandı olarak işaretle
                    sequentialCompletionInfo.push({ index: i, rule: currentRule }); // LTL için bilgi ekle
                }
            } else {
                // Hata yapıldıysa seriyi ve tamamlanma bayrağını sıfırla
                consecutiveCorrect = 0;
                categoryJustCompleted = false;
            }
        }
    }
    // --- YENİ Tamamlanan Kategori Hesaplaması SONU ---

    // Perseverasyon skorları state'ten alınır (useEffect içinde hesaplanır)
    // GÜVENLİK KONTROLÜ: perseverativeStats'ın tanımlı olduğundan emin ol
    const perseverativeResponsesCount = perseverativeStats?.tepki ?? 0; // Nullish coalescing ile varsayılan değer ata
    const perseverativeErrorsCount = perseverativeStats?.hata ?? 0;

    const nonPerseverativeErrors = totalErrors - perseverativeErrorsCount;

    const perseverativeResponsePercentage =
      totalResponses > 0
        ? parseFloat(
            ((perseverativeResponsesCount/ totalResponses) * 100).toFixed(2)
          )
        : 0;

    // İlk kategori deneme sayısı (Bu mantık genellikle ilk 10 doğruya ulaşana kadar geçen süreye bakar)
    let firstCategoryTrials = 0;
    let firstCategoryCompletedCheck = false;
    let firstConsecutiveCorrect = 0;
    const firstCategoryRule = CATEGORY_ORDER[0];
    for(let i=0; i < result.length; i++){
        const response = result[i];
        // response null/undefined değilse devam et
        // if (!response) continue;

        // Sadece ilk kategori kuralı aktifken say
        if(response.currentCategory === firstCategoryRule && !firstCategoryCompletedCheck) {
            firstCategoryTrials++;
            if (response.responseCategories?.includes(firstCategoryRule)) {
                firstConsecutiveCorrect++;
                if (firstConsecutiveCorrect >= MAX_CORRECT_CONSECUTIVE) {
                    firstCategoryCompletedCheck = true;
                }
            } else {
                firstConsecutiveCorrect = 0; // Hata sayacı sıfırlar
            }
        } else if (response.currentCategory !== firstCategoryRule && !firstCategoryCompletedCheck) {
             // İlk kategori bitmeden başka kategoriye geçildiyse sayımı durdur
             break;
        } else if (firstCategoryCompletedCheck) {
             // Zaten tamamlandıysa döngüden çık
            break;
        }
    }
    // Eğer döngü bittiğinde tamamlanmadıysa ve test bitmediyse (128'den az) özel değer ata
    const finalFirstCategoryTrials = firstCategoryCompletedCheck
        ? firstCategoryTrials
        : totalResponses < 128 ? "Tamamlanamadı" : firstCategoryTrials;


    // *******************************************************************
    // **** KAVRAMSAL DÜZEY TEPKİ SAYISI VE YÜZDESİ HESAPLAMASI ****
    // *******************************************************************
    let conceptualResponsesCount = 0; // Sadece sayıyı tutar
    let conceptualResponsesTotalInRuns = 0; // Serilerdeki toplam doğru yanıt sayısı
    let consecutiveCorrectConceptual = 0;

    result.forEach((response) => {
        // if (!response) return; // Güvenlik kontrolü
        if (response.responseCategories?.includes(response.currentCategory)) {
            consecutiveCorrectConceptual++;
        } else {
            // Hata yapıldıysa veya seri bittiyse, önceki seriyi değerlendir
            if (consecutiveCorrectConceptual >= 3) {
                // conceptualResponsesCount += consecutiveCorrectConceptual; // Eski hesaplama
                 conceptualResponsesTotalInRuns += consecutiveCorrectConceptual; // Yeni: Serideki tüm doğruları ekle
            }
            consecutiveCorrectConceptual = 0; // Seriyi sıfırla
        }
    });
    // Döngü bittikten sonra hala devam eden bir seri varsa onu da ekle
    if (consecutiveCorrectConceptual >= 3) {
        // conceptualResponsesCount += consecutiveCorrectConceptual; // Eski hesaplama
        conceptualResponsesTotalInRuns += consecutiveCorrectConceptual; // Yeni: Serideki tüm doğruları ekle
    }

    // Kavramsal Düzey Tepki Sayısı: >=3'lük serilerdeki toplam DOĞRU yanıt sayısı
    conceptualResponsesCount = conceptualResponsesTotalInRuns;

    // Kavramsal Düzey Tepki Yüzdesi: Bu sayının TOPLAM yanıt sayısına oranı
    const conceptualResponsePercentage =
      totalResponses > 0
        ? parseFloat(((conceptualResponsesCount / totalResponses) * 100).toFixed(2))
        : 0;
    // *******************************************************************
    // **** KAVRAMSAL HESAPLAMA SONU ****
    // *******************************************************************


    // Kurulumu sürdürmede başarısızlık (Mantık aynı: >=5 doğru sonrası hata)
    let failureToMaintainSet = 0;
    let consecutiveCorrectFMS = 0;
    
    result.forEach((response) => {
        if (response.responseCategories?.includes(response.currentCategory)) {
            consecutiveCorrectFMS++; // Doğru yanıtlarda sayaç artar
        } else {
            // Hata durumunda: 5-9 aralığı kontrolü
            if (consecutiveCorrectFMS >= 5 && consecutiveCorrectFMS <= 9) {
                failureToMaintainSet++; // Sadece 5-9 aralığındaki doğrular sonrası hatalar sayılır
            }
            consecutiveCorrectFMS = 0; // Hata sonrası sayaç sıfırlanır
        }
    });
    
    // Döngü sonunda kalan seri kontrolü (test erken biterse)
    if (consecutiveCorrectFMS >= 5 && consecutiveCorrectFMS <= 9) {
        failureToMaintainSet++;
    }

    // --- ÖĞRENMEYİ ÖĞRENME (LTL) - YENİ HESAPLAMA ---

    // Yardımcı fonksiyon: Belirli bir kural örneğinin başlangıç indeksini bulur
    // Bu fonksiyonlar useMemo dışında da tanımlanabilir, ancak burada kalması da sorun değil.
    const findRuleInstanceStart = (endIndex) => {
        if (endIndex < 0 || !result[endIndex]) return -1;
        const targetRule = result[endIndex].currentCategory;
        for (let j = endIndex - 1; j >= 0; j--) {
            if (!result[j] || result[j].currentCategory !== targetRule) {
                return j + 1;
            }
        }
        return 0;
    };

    // Yardımcı fonksiyon: Belirli bir kural örneğindeki hata oranını hesaplar
    const calculateErrorRateForCategoryInstance = (startIndex, endIndex, rule) => {
        if (startIndex < 0 || endIndex < startIndex) return 0;

        let errors = 0;
        let totalTrialsInRule = 0;
        for (let i = startIndex; i <= endIndex; i++) {
            const response = result[i];
            if (!response) continue;
            if (response.currentCategory === rule) {
                totalTrialsInRule++;
                if (!response.responseCategories?.includes(rule)) {
                    errors++;
                }
            }
        }
        if (totalTrialsInRule === 0) return 0;
        return (errors / totalTrialsInRule) * 100;
    };


    let learningToLearn = null; // Başlangıç değeri

    if (sequentialCompletionInfo.length >= 3) {
        try {
            const errorRates = [];
            for (let k = 0; k < 3; k++) { // İlk 3 tamamlanma için
                const completion = sequentialCompletionInfo[k];
                const endIndex = completion.index;
                const rule = completion.rule;
                const startIndex = findRuleInstanceStart(endIndex);

                if (startIndex === -1) {
                   console.error(`LTL: Kural başlangıcı bulunamadı, index ${endIndex}, rule ${rule}`);
                   throw new Error(`LTL Calculation Error: Cannot find start index for completion at index ${endIndex}`);
                }

                const rate = calculateErrorRateForCategoryInstance(startIndex, endIndex, rule);
                errorRates.push(rate);
            }

            if (errorRates.length === 3) {
                const diff1 = errorRates[0] - errorRates[1];
                const diff2 = errorRates[1] - errorRates[2];
                const ltlScore = (diff1 + diff2) / 2;
                learningToLearn = parseFloat(ltlScore.toFixed(2));
            } else {
                 console.error("LTL Hesaplama: Beklenen 3 hata oranı bulunamadı.");
                 learningToLearn = "Hesaplama Hatası";
            }

        } catch (error) {
            console.error("LTL Hesaplama sırasında hata:", error);
            learningToLearn = "Hesaplama Hatası";
        }

    } else {
        learningToLearn = "Yetersiz Veri";
    }
    // --- ÖĞRENMEYİ ÖĞRENME SONU ---


    // Sonuçları döndür
    return {
      totalResponses,
      totalCorrect,
      totalErrors,
      completedCategories: completedCategoriesCount, // Yeni hesaplanan değer
      perseverativeResponses: perseverativeResponsesCount,
      perseverativeErrors: perseverativeErrorsCount,
      nonPerseverativeErrors,
      perseverativeResponsePercentage,
      firstCategoryTrials: finalFirstCategoryTrials,
      //---->> YENİ EKLENEN/DÜZENLENENLER <<----
      conceptualResponses: conceptualResponsesCount, // Kavramsal tepki SAYISI
      conceptualResponsePercentage,                 // Kavramsal tepki YÜZDESİ
      //---->>------------------------------<<----
      failureToMaintainSet,
      learningToLearn: learningToLearn, // Yeni hesaplanan değer veya durum string'i
    };
  }, [result, perseverativeStats]); // Bağımlılıklara perseverativeStats eklendi

  // getNormGroup fonksiyonu ilk koddan aynen alındı
  const getNormGroup = () => {
    // ... (Fonksiyon içeriği değişmedi, önceki yanıttaki gibi) ...
        if (!age || !education) return null;
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum <= 0) return null;

        let ageRangeKey = "";
        let educationKey = education;

        if (educationKey === "5-11") {
            if (ageNum >= 20 && ageNum <= 54) ageRangeKey = "20-54";
            else if (ageNum >= 55 && ageNum <= 72) ageRangeKey = "55-72";
        } else if (educationKey === "12+") {
            if (ageNum >= 20 && ageNum <= 54) ageRangeKey = "20-54";
            else if (ageNum >= 55 && ageNum <= 78) ageRangeKey = "55-78";
        }

        if (!ageRangeKey || !NORMS[educationKey]?.[ageRangeKey]) {
          console.warn(`Norm bulunamadı: Yaş=${age}, Eğitim=${education}`);
          return null;
        }

        return NORMS[educationKey][ageRangeKey];
  };

  // compareWithNorm fonksiyonu ilk koddan aynen alındı (daha detaylı yorumlama içeriyor)
 // compareWithNorm fonksiyonu İLK koddan alındı ve İSTEĞİNİZE GÖRE DÜZENLENDİ
 const compareWithNorm = (scoreKey) => {
  const normGroup = getNormGroup();
  // Temel kontroller (norm grubu var mı, skorlar hesaplanmış mı?)
  if (!normGroup || !scores || scores[scoreKey] === undefined) {
    // Skor yoksa veya hesaplanmamışsa null dönelim, yorum gösterilmez.
     // Ancak skor var ama norm yoksa farklı bir durum olabilir.
     if (scores && scores[scoreKey] !== undefined) {
          const userValue = scores[scoreKey];
           // Sayısal olmayan değerleri veya normu olmayanları burada yakalayabiliriz
           if (typeof userValue !== 'number' || !normGroup || !normGroup[scoreKey]?.X) {
               return {
                   userValue: typeof userValue === 'number'
                              ? userValue.toFixed(Number.isInteger(userValue) ? 0 : 2)
                              : String(userValue), // String'e çevir (örn: "Tamamlanamadı")
                   normMean: 'N/A',
                   interpretation: "Norm Yok / Yorumlanamaz",
                   color: "#7f8c8d" // Gri
               };
           }
     } else {
         return null; // Skorun kendisi yoksa tamamen boş dön
     }
  }

  const userValue = scores[scoreKey];
  const normMean = normGroup[scoreKey]?.X;
  // const normSD = normGroup[scoreKey]?.Ss; // Artık SD'ye ihtiyacımız yok bu mantıkta

  // Sayısal olmayan değerler için özel durumlar (LTL, Tamamlanamadı vs.)
  if (typeof userValue !== 'number') {
      // learningToLearn veya firstCategoryTrials string ise veya norm yoksa
      if ((scoreKey === 'learningToLearn' && userValue !== null) ||
          (scoreKey === 'firstCategoryTrials' && typeof userValue === 'string') ||
          typeof normMean !== 'number' ) {
          return {
              userValue: String(userValue), // Değeri string olarak göster
              normMean: typeof normMean === 'number' ? normMean.toFixed(2) : 'N/A',
              interpretation: "Yorum Yok",
              color: "#7f8c8d" // Gri
          };
      }
      return null; // Diğer beklenmedik durumlar
  }

  // Norm ortalaması geçerli bir sayı değilse yorumlama yapma
  if (typeof normMean !== 'number') {
      return {
          userValue: userValue.toFixed(Number.isInteger(userValue) ? 0 : 2),
          normMean: 'N/A',
          interpretation: "Norm Yok",
          color: "#7f8c8d" // Gri
      };
  }

  // Metrik yönleri (1: yüksek iyi, -1: yüksek kötü) - BU HALA ÖNEMLİ!
  const metricDirection = {
    totalResponses: -1,
    totalErrors: -1,
    totalCorrect: 1,
    completedCategories: 1,
    perseverativeResponses: -1,
    perseverativeErrors: -1,
    nonPerseverativeErrors: -1,
    perseverativeResponsePercentage: -1,
    firstCategoryTrials: -1, // Düşük daha iyi (eğer sayıysa)
    conceptualResponses: 1,
    conceptualResponsePercentage: 1,
    failureToMaintainSet: -1,
    learningToLearn: 1,      // Yüksek daha iyi (eğer sayıysa)
  }[scoreKey] || 0;

  let interpretation = "Normal"; // Varsayılan olarak Normal ayarlayalım
  let color = "#3498db";       // Varsayılan renk Mavi (Normal)

  // --- YENİ BASİTLEŞTİRİLMİŞ KARŞILAŞTIRMA MANTIĞI ---
  if (metricDirection === 1) { // Yüksek skorun iyi olması gereken metrikler
      if (userValue < normMean) {
          interpretation = "Kötü";
          color = "#e74c3c"; // Kırmızı
      }
      // userValue >= normMean ise zaten "Normal" ve Mavi kalacak
  } else if (metricDirection === -1) { // Düşük skorun iyi olması gereken metrikler (Yani yüksek skor KÖTÜ)
      if (userValue > normMean) {
          interpretation = "Kötü";
          color = "#e74c3c"; // Kırmızı
      }
      // userValue <= normMean ise zaten "Normal" ve Mavi kalacak
  } else { // metricDirection 0 ise veya tanımlı değilse
       interpretation = "Yorum Yok";
       color = "#7f8c8d"; // Gri
  }
  // --- YENİ MANTIK SONU ---

  return {
    userValue: userValue.toFixed(Number.isInteger(userValue) ? 0 : 2),
    normMean: normMean.toFixed(2),
    // normSD: normSD?.toFixed(2) || null, // İsterseniz SD'yi hala bilgi olarak gönderebilirsiniz
    interpretation,
    color
  };
};

  // generateClinicalComment fonksiyonu İKİNCİ koddan alındı ve uyarlandı
  const generateClinicalComment = () => {
    // ... (Fonksiyon içeriği değişmedi, önceki yanıttaki gibi) ...
        const isEmpty = !age || !education;
        const normGroup = getNormGroup(); // İlk kodun getNormGroup fonksiyonu kullanılıyor

        if (isEmpty)
          return (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px", // Yükseklik biraz azaltıldı
                padding: "20px",
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)", // Renk biraz daha parlak
                  fontSize: "17px", // Boyut ayarlandı
                  fontWeight: 500,
                }}
              >
                Klinik yorumu görebilmek için lütfen yaş ve eğitim süresi bilgilerini giriniz.
              </p>
            </div>
          );

         if (!normGroup) return ( // Norm grubu bulunamazsa mesaj göster (ilk koddan alındı)
           <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", padding: "20px" }}>
               <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)", fontSize: "17px", fontWeight: 500 }}>
                   Girilen yaş ({age}) ve eğitim ({education === "5-11" ? "5-11 Yıl" : "12+ Yıl"}) düzeyi için uygun norm grubu bulunamadı. Lütfen bilgileri kontrol ediniz.
               </p>
           </div>
         );

         if (!scores) return ( // Skorlar henüz hesaplanmadıysa
             <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", padding: "20px" }}>
                 <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)", fontSize: "17px", fontWeight: 500 }}>
                     Skorlar hesaplanıyor, lütfen bekleyiniz...
                 </p>
             </div>
         );

        // İKİNCİ koddan alınan karşılaştırma yapısı, İLK kodun compareWithNorm fonksiyonunu kullanıyor
        const comparisons = {
          Dikkat: [
            { label: "Toplam Hata", scoreKey: "totalErrors" },
            { label: "Kurulum Sürdürme", scoreKey: "failureToMaintainSet" },
          ],
          Perseveratif: [
            { label: "Toplam Tepki", scoreKey: "totalResponses" },
            { label: "Toplam Hata", scoreKey: "totalErrors" }, // Tekrar eklendi
            { label: "Tamamlanan Kategori", scoreKey: "completedCategories" },
            { label: "Perseveratif Tepki", scoreKey: "perseverativeResponses" },
            { label: "Perseveratif Hata", scoreKey: "perseverativeErrors" },
            { label: "Perseveratif Olmayan Hata", scoreKey: "nonPerseverativeErrors" },
            { label: "Perseveratif Hata %", scoreKey: "perseverativeResponsePercentage" },
            { label: "Kavramsal Tepki %", scoreKey: "conceptualResponsePercentage" }, // İstek üzerine buraya eklendi
          ],
          Kavramsal: [
            { label: "Toplam Doğru", scoreKey: "totalCorrect" },
            { label: "Kavramsal Tepki", scoreKey: "conceptualResponses" }, // Bu sayıdır, yüzdelik değil
            { label: "Kurulum Sürdürme", scoreKey: "failureToMaintainSet" }, // İstek üzerine buraya tekrar eklendi
          ],
        };

        // Karşılaştırma verilerini oluştur
        const populatedComparisons = {};
    Object.keys(comparisons).forEach(category => {
        populatedComparisons[category] = comparisons[category]
            .map(metric => ({
                ...metric,
                // Güncellenmiş compareWithNorm burada çağrılıyor
                comparisonResult: compareWithNorm(metric.scoreKey)
            }))
            .filter(metric => metric.comparisonResult !== null);
    });


    // ----- >>>> JSX return kısmı (Stil Düzeltmesi ile) <<<< -----
    return (
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "30px",
          width: '100%',
        }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#00a7cf",
              fontSize: "24px",
              fontWeight: 600,
              borderBottom: "2px solid rgba(0, 167, 207, 0.3)",
              paddingBottom: "12px",
              textAlign: 'center',
              width: '100%',
            }}
          >
            Klinik Yorum
          </h3>

          {/* Demografik Bilgiler */}
          <div
             style={{
               display: "flex",
               justifyContent: 'center',
               gap: 25,
               alignItems: "center",
               padding: "15px 20px",
               backgroundColor: "rgba(0, 167, 207, 0.08)",
               borderRadius: 8,
               border: '1px solid rgba(0, 167, 207, 0.2)',
               flexWrap: 'wrap',
               width: '100%',
             }}
           >
             {/* ... Demografik bilgiler (değişiklik yok) ... */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
               <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>Hasta:</span>
               <span style={{ color: 'white', fontWeight: 600 }}>{firstName || '[Ad]'} {lastName || '[Soyad]'}</span>
             </div>
             <div style={{ width: 1, height: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", margin: '0 10px', display: 'none', sm: 'block' }}></div>
             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
               <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>Yaş:</span>
               <span style={{ color: 'white', fontWeight: 600 }}>{age}</span>
             </div>
              <div style={{ width: 1, height: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", margin: '0 10px', display: 'none', sm: 'block' }}></div>
             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
               <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>Eğitim:</span>
               <span style={{ color: 'white', fontWeight: 600 }}>{education === "5-11" ? "5-11 Yıl" : "12+ Yıl"}</span>
             </div>
           </div>

          {/* Performans Değerlendirmesi - Grid Düzeni */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "25px",
              width: '100%',
            }}
          >
            {Object.entries(populatedComparisons).map(([categoryKey, metrics]) => (
              // --- Kategori Sütunu (Kutu) ---
              <div
                key={categoryKey}
                style={{ /* ... Kutu stilleri (değişiklik yok) ... */
                  padding: '20px 25px',
                  backgroundColor: "rgba(0, 0, 0, 0.15)",
                  borderRadius: 10,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Kategori Başlığı */}
                <h4 style={{ /* ... Başlık stilleri (değişiklik yok) ... */
                    margin: "0 0 20px 0", color: "#00a7cf", fontSize: "18px",
                    fontWeight: 600, textTransform: "capitalize",
                    borderBottom: "1px solid rgba(0, 167, 207, 0.2)", paddingBottom: "10px",
                    textAlign: 'left',
                 }} >
                   { /* Kategori isimleri (değişiklik yok) ... */ }
                   { { Dikkat: "Dikkat", Perseveratif: "Perseveratif", Kavramsal: "Kavramsal" }[categoryKey] || categoryKey }
                </h4>

                {/* Metriklerin Dikey Listesi */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, flexGrow: 1 }}>
                  {metrics.map((metric, index) => {
                    if (!metric.comparisonResult) return null;
                    const { userValue, normMean, normSD, interpretation, color } = metric.comparisonResult;
                    const formattedValue = userValue;

                    return (
                      // ----- Metrik Satırı -----
<div
  key={index}
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: index < metrics.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
    minHeight: '30px',
    gap: '10px' // Etiket ve yorum arası boşluk
  }}
>
  {/* Metrik Etiketi ve Değer */}
  <span
    style={{
      // Mevcut stiller
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.85)",
      fontWeight: 400,
      flex: '1 1 auto', // Esneklik için önemli
      lineHeight: '1.4',

      // --- YENİ EKLENEN STİLLER ---
      backgroundColor: 'rgba(255, 255, 255, 0.05)', // Açık renk arka plan (beyaz %5 opaklık)
      padding: '10px 10px', // İç boşluk (yukarı/aşağı 4px, sağ/sol 10px)
      borderRadius: '12px', // Köşeleri yuvarlatma
      // --- YENİ EKLENEN STİLLER SONU ---
     }}
  >
    {metric.label}: <span style={{ fontWeight: 500, color: 'white' }}>{formattedValue}</span>
  </span>

  {/* ----- >>> YORUM SPAN (Değişiklik Yok) <<< ----- */}
  {interpretation && interpretation !== "Yorum Yok" && (
      <span
        style={{
          color: color || "#bdc3c7",
          fontWeight: 600,
          fontSize: 12,
          backgroundColor: `${color || "#bdc3c7"}25`,
          padding: "8px 14px",
          borderRadius: 12,
          minWidth: '90px',
          textAlign: 'center',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
        title={`Norm Ort: ${normMean || 'N/A'}${normSD ? ` (± ${normSD})` : ''}`}
      >
        {interpretation || "N/A"}
      </span>
   )}
   {/* ----- >>> YORUM SPAN SONU <<< ----- */}

                      </div>
                      // ----- Metrik Satırı Sonu -----
                    );
                  })} {/* metrics.map sonu */}
                </div> {/* Metrik listesi sonu */}
              </div> // Kategori sütunu sonu
            ))} {/* populatedComparisons.map sonu */}
          </div> {/* Grid Container Sonu */}
        </div> // Ana return div sonu
      );
  }; // generateClinicalComment sonu


  // Tablo görünümü için sütunlara bölme (ilk koddan aynen alındı)
  const columnRowCounts = [22, 22, 20, 22, 22, 20]; // Her sütunda istenen satır sayıları
  const columns = []; // Sütunları tutacak boş dizi
  let startIndex = 0; // Dilimlemeye başlanacak indeks
  const totalResponses = result?.length || 0; // Toplam yanıt sayısı (varsa)
  
  // İstenen her satır sayısı için döngü
  for (const count of columnRowCounts) {
    // Eğer hala işlenecek yanıt varsa (başlangıç indeksi toplamı geçmediyse)
    if (startIndex < totalResponses) {
      // Bu sütunun biteceği indeksi hesapla (toplam yanıt sayısını geçmemeli)
      const endIndex = Math.min(startIndex + count, totalResponses);
      // result dizisinden ilgili bölümü dilimle
      const columnData = result?.slice(startIndex, endIndex) || [];
      // Dilimlenen bölümü columns dizisine ekle
      columns.push(columnData);
      // Bir sonraki dilimleme için başlangıç indeksini güncelle
      startIndex = endIndex;
    } else {
      // Eğer tüm yanıtlar zaten önceki sütunlara dağıtıldıysa döngüden çık
      break;
    }
  }
  // downloadResults fonksiyonu ilk koddan aynen alındı (detaylı JSON içeriyor)
  const downloadResults = () => {
    // Gerekli kontroller (result var mı, demografik bilgiler girilmiş mi?)
    if (!result || result.length === 0) {
      console.warn("İndirilecek sonuç bulunamadı");
      alert("İndirilecek sonuç verisi bulunamadı.");
      return;
    }
    if (!firstName || !lastName || !age || !education) {
        alert("Lütfen indirmeden önce tüm demografik bilgileri doldurun (dosya adı için gereklidir).");
        return;
    }

    // Detaylı yanıtları sizin istediğiniz JSON formatına dönüştür
    const formattedDetailedResults = result.map((item, index) => {
         if (!item) return null; // Güvenlik kontrolü

         // item.response objesinin beklenen yapıda olduğunu varsayıyoruz
         const responseData = item.response || {};

         return {
              // Sizin örnek JSON'unuzdaki alan adları ve yapı kullanılıyor:
              response: {
                resCount: responseData.resCount !== undefined ? responseData.resCount : null,
                resColor: responseData.resColor !== undefined ? responseData.resColor : null,
                resFigure: responseData.resFigure !== undefined ? responseData.resFigure : null,
              },
              categoryComplete: item.categoryComplete !== undefined ? item.categoryComplete : null, // Orijinal item'dan alınır (varsa)
              category: item.category !== undefined ? item.category : null, // Alan adı 'category' olarak değiştirildi
              responseCategories: item.responseCategories || [], // Alan adı aynı
              currentCategory: item.currentCategory !== undefined ? item.currentCategory : null, // Alan adı 'currentCategory' olarak değiştirildi
              prevCategory: item.prevCategory !== undefined ? item.prevCategory : null, // Orijinal item'dan alınır (varsa)
              cardIndex: index, // Alan adı 'cardIndex' olarak değiştirildi (0'dan başlar)
        };
    }).filter(item => item !== null); // Null olanları filtrele

    // İndirilecek veri artık formatlanmış sonuçlar dizisi
    const dataToDownload = formattedDetailedResults; // Sadece bu diziyi ata

    // Demografik bilgiler sadece dosya adı için kullanılacak
     const demographicInfo = {
            firstName,
            lastName,
            testDate: new Date().toISOString().slice(0, 10),
     };

    try {
      // JSON'a çevirirken doğrudan formatlanmış diziyi kullan
      const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Dosya adını oluştur (Demografik bilgilerden)
      const safeFirstName = firstName.replace(/[^a-zA-Z0-9]/g, '_') || 'Hasta';
      const safeLastName = lastName.replace(/[^a-zA-Z0-9]/g, '_') || 'Adi';
      const filename = `WCST_DetayliSonuclar_${safeLastName}_${safeFirstName}_${demographicInfo.testDate}.json`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("JSON indirme hatası:", error);
      alert("Sonuçları indirirken bir hata oluştu.");
    }
 };

  // result null veya boşsa erken dönüş (ilk koddan alındı)
  if (!result || result.length === 0) {
     return <S.Div style={{padding: '50px', textAlign: 'center', color: 'white'}}>Test sonuçları yükleniyor veya test henüz başlatılmadı...</S.Div>;
  }

  // Ana JSX yapısı
  return (
    <S.Div>
      {/* Tablo görünümü (İlk koddan aynen alındı) */}
      <S.Table>
         {columns.map((column, colIndex) => (
           <S.Column key={colIndex}>
             {column.map((item, index) => {
               if (!item) return null; // Güvenlik kontrolü eklendi
               let columnStartIndex = 0;
for (let prevColIndex = 0; prevColIndex < colIndex; prevColIndex++) {
  // Önceki sütunun gerçek uzunluğunu ekle (daha sağlam bir yöntem)
  columnStartIndex += columns[prevColIndex]?.length || 0;
  // Alternatif (columnRowCounts dizisine güvenirsek):
  // columnStartIndex += columnRowCounts[prevColIndex] || 0;
}
// Genel indeksi, sütun başlangıç indeksine mevcut öğenin sütun içindeki indeksini ekleyerek bul.
const globalIndex = columnStartIndex + index;
// --- YENİ HESAPLAMA SONU ---
               const detail = perseverativeDetails?.[globalIndex];
               const isCorrect = item.responseCategories?.includes(
                 item.currentCategory
               );
                // PH: Perseveratif AMA doğru. P: Perseveratif VE yanlış.
                const isP_candidate = detail?.isPerseverative && !detail?.isCorrectPerseverative; // Yanlış perseveratif adayı
                const isPH_candidate = detail?.isPerseverative && detail?.isCorrectPerseverative; // Doğru perseveratif adayı
                const showPh = detail?.perseverationType === 'SANDWICH_AMBIGUOUS_ERROR';

                return (
      <S.Line key={globalIndex}>
      {/* Kutucuklar */}
    <S.Box isNumber isCorrect={isCorrect}>
      {globalIndex + 1}
    </S.Box>
    <S.Box isCorrect={item.responseCategories?.includes("color")}>
      R
    </S.Box>
    <S.Box
      isCorrect={item.responseCategories?.includes("figure")}
    >
      Ş
    </S.Box>
    <S.Box isCorrect={item.responseCategories?.includes("count")}>
      M
    </S.Box>
    <S.Box
      isCorrect={ // D: Hiçbirine uymuyorsa VE eşleşme varsa (yani başka bir kartla eşleşti?) Bu mantık WCST'ye uymuyor olabilir. Hata işareti olabilir.
        !["color", "figure", "count"].some((c) =>
          item.responseCategories?.includes(c)
        ) && (item.responseCategories?.length > 0)
      }
      // Belki de bu 'Diğer Hata' olmalı? Yanlış ve P değilse?
      // Şimdilik orijinal mantığı koruyalım.
    >
      D
    </S.Box>
    
    {/* Perseverasyon göstergeleri için tutarlı bir konteyner */}
    <div style={{ 
      display: 'flex', 
      marginLeft: '5px', 
      width: '30px', 
      justifyContent: 'center'
    }}>
      {/* P göstergesi */}
      {(isP_candidate && !showPh) && (
        <span style={{
          color: "#dcdcdc", 
          fontWeight: "bold",
          minWidth: '20px',
          textAlign: 'center'
        }}>
          P
        </span>
      )}

      {/* PH göstergesi */}
      {isPH_candidate && (
        <span style={{
          color: "#e74c3c", 
          fontWeight: "bold", 
          minWidth: '20px',
          textAlign: 'center'
        }}>
          PH
        </span>
      )}

      {/* Ph göstergesi */}
      {showPh && (
        <span style={{
          color: "#dcdcdc", 
          fontWeight: "bold",
          minWidth: '20px',
          textAlign: 'center'
        }}>
          Ph
        </span>
      )}
    </div>
  </S.Line>
               );
             })}
           </S.Column>
         ))}
       </S.Table>

      {/* Sağ Panel: Sonuçlar, Demografi */}
      <S.RightPanel> {/* RightPanel stilini kullanmaya devam edelim */}

        {/* Skor Tablosu (Güncellenmiş hali) */}
       <S.Results>
  <div className="mb-8">
    <h3 className="text-center text-xl text-gray-200 mb-5">Test Skorları</h3>
    {scores ? (
      <S.DetailedTable>
        <tbody>
          {[
            { label: "Toplam tepki sayısı", key: "totalResponses" },
            { label: "Toplam yanlış sayısı", key: "totalErrors" },
            { label: "Toplam doğru sayısı", key: "totalCorrect" },
            { label: "Tamamlanan kategori sayısı", key: "completedCategories" },
            { label: "Perseveratif tepki (P+PH)", key: "perseverativeResponses" },
            { label: "Perseveratif hata (P)", key: "perseverativeErrors" },
            { label: "Perseveratif olmayan hata", key: "nonPerseverativeErrors" },
            { label: "Perseveratif hata yüzdesi (%)", key: "perseverativeResponsePercentage" },
            { label: "İlk kategori deneme sayısı", key: "firstCategoryTrials" },
            { label: "Kavramsal düzey tepki sayısı", key: "conceptualResponses" },
            { label: "Kavramsal düzey tepki yüzdesi (%)", key: "conceptualResponsePercentage" },
            { label: "Kurulumu sürdürmede başarısızlık", key: "failureToMaintainSet" },
            { label: "Öğrenmeyi öğrenme", key: "learningToLearn" },
          ].map(({ label, key }, index) => {
            const value = scores[key];
            if (value === undefined || value === null) return null;
            return (
              <tr key={index}>
                <td>{label}</td>
                <td>{typeof value === "number" ? value.toFixed(Number.isInteger(value) ? 0 : 2) : value}</td>
              </tr>
            );
          })}
        </tbody>
      </S.DetailedTable>
    ) : (
      <p className="text-center text-white/70">Skorlar hesaplanıyor...</p>
    )}
  </div>
</S.Results>

        {/* Demografik Bilgiler ve İndirme (Değişiklik yok) */}
        <S.DemographicSection>
           {/* ... (İçerik aynı, önceki yanıttaki gibi) ... */}
            <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#eee'}}>Demografik Bilgiler ve İndirme</h3>
           {/* İkinci koddan alınan input/select yapısı */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginBottom: '25px' }}>
              <div>
                  <label htmlFor="firstName" style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: 'rgba(255,255,255,0.8)'}}>Ad</label>
                  <input
                      id="firstName"
                      type="text"
                      placeholder="Hasta Adı"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                  />
              </div>
              <div>
                  <label htmlFor="lastName" style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: 'rgba(255,255,255,0.8)'}}>Soyad</label>
                  <input
                      id="lastName"
                      type="text"
                      placeholder="Hasta Soyadı"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                  />
              </div>
              <div>
                  <label htmlFor="age" style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: 'rgba(255,255,255,0.8)'}}>Yaş</label>
                  <input
                      id="age"
                      type="number"
                      placeholder="Yaş"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="0"
                      max="120"
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                  />
              </div>
              <div>
                  <label htmlFor="education" style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: 'rgba(255,255,255,0.8)'}}>Eğitim Süresi</label>
                  <select
                      id="education"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
                  >
                      <option value="">Seçiniz...</option>
                      <option value="5-11">5-11 Yıl</option>
                      <option value="12+">12+ Yıl</option>
                  </select>
              </div>
           </div>

           {/* İndirme Butonu ve Notu (İkinci koddan alındı) */}
           <div style={{ textAlign: 'center' }}>
               <button
                   onClick={downloadResults}
                   disabled={!firstName || !lastName || !age || !education}
                   style={{
                       backgroundColor: !firstName || !lastName || !age || !education ? '#555' : '#00a7cf', // Renkler güncellendi
                       color: 'white',
                       padding: '12px 28px', // Boyut ayarlandı
                       borderRadius: '8px',
                       border: 'none',
                       cursor: !firstName || !lastName || !age || !education ? 'not-allowed' : 'pointer',
                       fontSize: '15px', // Boyut ayarlandı
                       transition: 'background-color 0.3s ease', // Geçiş efekti
                   }}
                   onMouseOver={e => { if (!e.target.disabled) e.target.style.backgroundColor = '#008cb4'; }}
                   onMouseOut={e => { if (!e.target.disabled) e.target.style.backgroundColor = '#00a7cf'; }}
               >
                   Sonuçları İndir (JSON)
               </button>
               <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '12px' }}>
                   JSON formatında detaylı sonuçları indirmek için lütfen tüm demografik bilgileri doldurun.
               </p>
           </div>
        </S.DemographicSection>

      </S.RightPanel> {/* Sağ panel sarmalayıcı sonu */}

       {/* Klinik Yorum Alanı (Değişiklik yok) */}
       <S.ClinicalSection>
         {generateClinicalComment()}
      
       </S.ClinicalSection>

        {/* Perseveratif Açıklamalar (Değişiklik yok) */}
        <S.PerseverativeSection>
          {/* ... (İçerik aynı, önceki yanıttaki gibi) ... */}
           <h3>Perseveratif Tepki Analizi</h3>
           <div className="info-text">
             <p>Tabloda görülen işaretler:</p>
             <ul>
               <li><strong>P:</strong> Hatalı perseveratif tepki (Yanlış kategoriye ısrar)</li>
               <li><strong>PH:</strong> Doğru perseveratif tepki (Doğru kategoriye ısrar - Hata değil)</li>
             </ul>
             <p className="rule-explanation">
               <strong>Kural Açıklamaları (Özet):</strong>
               <br />- <strong>Yeni İlke:</strong> Genellikle 3 ardışık *saf ve yanlış* yanıttan sonra belirlenen ve takip edilen hatalı kural. İşaretleme 2. yanıttan başlar.
               <br />- <strong>Önceki Kategori İlkesi:</strong> Kategori değiştikten sonra, bir önceki geçerli kategori kuralına *saf ve yanlış* şekilde takılma.
               <br />- <strong>Sandviç Kuralı:</strong> Aşama 1'de işaretlenmiş iki perseveratif yanıt arasında kalan ve aynı perseveratif kategoriye uyan (zinciri kırmayan) diğer yanıtlar.
             </p>
           </div>
           <div className="explanation-list">
             {result.map((item, index) => {
                 if (!item) return null; // Güvenlik kontrolü
                 const detail = perseverativeDetails?.[index];
                 // Sadece P veya PH olanları veya debug bilgisi olanları göster
                 if (detail?.isPerseverative || detail?.debugInfo) {
                     const isCorrect = item.responseCategories?.includes(item.currentCategory);
                     // PH: Perseveratif AMA doğru. P: Perseveratif VE yanlış.
                     const isPH = detail?.isPerseverative && detail?.isCorrectPerseverative;
                     const isP = detail?.isPerseverative && !detail?.isCorrectPerseverative;

                     return (
                         <div key={index} className={`explanation-item ${isP ? 'item-error' : (isPH ? 'item-correct-p' : 'item-debug')}`}>
                             <div className="response-header">
                                 <span className="response-number">#{index + 1}</span>
                                 <span className="response-categories">
                                     Yanıt: [{item.responseCategories?.join(', ') || 'BOŞ'}]
                                 </span>
                                 <span className="correct-category">
                                      (Beklenen: {item.currentCategory})
                                 </span>
                                 {/* Etiketler */}
                                 {isP && <span className="error-tag">P</span>}
                                 {isPH && <span className="correct-tag" style={{backgroundColor: 'rgba(0, 167, 207, 0.2)', color: '#00a7cf'}}>PH</span>}
                                 {/* Debug bilgisi olan ama P/PH olmayanlar için etiket */}
                                 {!detail?.isPerseverative && detail?.debugInfo && <span className="tag tag-debug" style={{background: 'rgba(127, 140, 141, 0.2)', color: '#7f8c8d'}}>Debug</span>}
                             </div>
                             {detail?.isPerseverative && (
                                 <div className="explanation-text">
                                     <strong>Açıklama:</strong> {detail.explanation || "Perseveratif tepki tespit edildi"}
                                      {detail.perseverativeCategory && ` (${detail.perseverativeCategory})`}
                                 </div>
                             )}
                             {detail?.debugInfo && (
                                 <div className="debug-info">
                                     <strong>Detay/Debug:</strong> {detail.debugInfo}
                                 </div>
                             )}
                         </div>
                     );
                 }
                 return null;
             })}
             {/* Eğer hiç P/PH veya debug yoksa mesaj göster */}
             {perseverativeDetails.every(d => !d?.isPerseverative && !d?.debugInfo) && (
                 <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '20px'}}>Perseveratif tepki veya analiz detayı bulunamadı.</p>
             )}
           </div>
        </S.PerseverativeSection>

    </S.Div>
  );
}
