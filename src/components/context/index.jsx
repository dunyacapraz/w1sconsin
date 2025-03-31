import { createContext, useState, useEffect } from "react";

export const WcstContext = createContext("");
function calculatePerseverative(data) {
  let currentCategory = null;
  let perseverativeResponses = 0;
  let perseverativeErrors = 0;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Eğer yeni kategori tamamlandıysa, yeni kategoriye geç
    if (item.categoryComplete) {
      currentCategory = item.category;
      continue; // Bu adımı atla çünkü bu kategori tamamlanmış.
    }

    // Eğer bir önceki kategori varsa (en az 1 kategori tamamlanmışsa)
    if (currentCategory !== null && item.category !== currentCategory) {
      // Kişi hala önceki kategoriye göre eşleştiriyorsa:
      const wasFollowingOldCategory =
        (currentCategory === 1 && item.color) ||
        (currentCategory === 2 && item.figure); // Varsayım: color → kategori 1, figure → kategori 2 gibi

      if (wasFollowingOldCategory) {
        perseverativeResponses++;
        if (!item.isCorrect) {
          perseverativeErrors++;
        }
      }
    }
  }

  return {
    perseverativeResponses,
    perseverativeErrors,
  };
}
export function WcstProvider({ children }) {
  const [result, setResult] = useState([]);
  const [counter, setCounter] = useState(0);
  const [completedCategories, setCompletedCategories] = useState(0);
  const [firstCategoryResponseCount, setFirstCategoryResponseCount] =
    useState(0);

  const [perseverativeResponses, setPerseverativeResponses] = useState(0);
  const [perseverativeErrors, setPerseverativeErrors] = useState(0);
  const [nonPerseverativeErrors, setNonPerseverativeErrors] = useState(0);
  const [conceptualLevelResponses, setConceptualLevelResponses] = useState(0);
  const [learningToLearn, setLearningToLearn] = useState(0);

  useEffect(() => {
    const firstCategoryCount = result.filter((r) => r.category === 1).length;
    setFirstCategoryResponseCount(firstCategoryCount);

    // var perserativeHata = 0;
    // var perseveratifTepki = 0;
    // var previousCategory = null;
    // result.forEach((e, index) => {
    //   // index to back and find different category
    //   if (index > 0) {
    //     var tempIndex = index;
    //     while (tempIndex >= 0) {
    //       if (
    //         result[tempIndex].currentCategory != result[index].currentCategory
    //       ) {
    //         previousCategory = result[tempIndex].currentCategory;
    //         break;
    //       }
    //       tempIndex--;
    //     }
    //   }

    //   console.log("E CEVAP", e);
    //   if (e.currentCategory != null) {
    //     console.log("bura girdi", e.cardIndex);
    //     // saf doğru cevap olduğunu anlıyoruz burada
    //     if (
    //       e.responseCategories.includes(e.currentCategory) &&
    //       e.responseCategories.length == 1
    //     ) {
    //       console.log("saf doğru cevap");
    //     }
    //     // doğru ama saf cevap değil
    //     else if (
    //       e.responseCategories.includes(e.currentCategory) &&
    //       e.responseCategories.length > 1
    //     ) {
    //       console.log("doğru ama saf cevap değil");
    //     }
    //     // perserative cevap
    //     else if (
    //       !e.responseCategories.includes(e.currentCategory) &&
    //       e.responseCategories.length == 1 &&
    //       e.responseCategories[0] == previousCategory
    //     ) {
    //       console.log("perserative cevap");
    //       perserativeHata++;
    //       perseveratifTepki++;

    //       var shouldContinue = true;
    //       var tempIndex = index;
    //       var counter = 0;
    //       while (shouldContinue) {
    //         // olası bi zircirin başlangıcı
    //         if (tempIndex + 1 <= result.length - 1) {
    //           tempIndex++;
    //           var nextElement = result[tempIndex];
    //           // perserative mi
    //           if (
    //             !nextElement.responseCategories.includes(e.currentCategory) &&
    //             nextElement.responseCategories.length == 1 &&
    //             e.responseCategories[0] == previousCategory
    //           ) {
    //             shouldContinue = false;
    //           } else {
    //             counter++;
    //             console.log("counter arttı");
    //           }
    //         } else {
    //           perseveratifTepki = perseveratifTepki + counter;
    //           shouldContinue = false;
    //         }
    //       }
    //     } else {
    //       console.log("hiçbiri");
    //     }
    //   } else {
    //     console.log("elseeeee");
    //   }
    // });

    // console.log("PERSERATIVE TEPKİ SAYIS111111I", perseveratifTepki);
  }, [result]);

  const values = {
    result,
    setResult,
    counter,
    setCounter,
    completedCategories,
    setCompletedCategories,
    perseverativeResponses,
    setPerseverativeResponses,
    perseverativeErrors,
    setPerseverativeErrors,
    nonPerseverativeErrors,
    setNonPerseverativeErrors,
    conceptualLevelResponses,
    setConceptualLevelResponses,
    learningToLearn,
    setLearningToLearn,
    firstCategoryResponseCount,
    setFirstCategoryResponseCount,
  };

  return <WcstContext.Provider value={values}>{children}</WcstContext.Provider>;
}
