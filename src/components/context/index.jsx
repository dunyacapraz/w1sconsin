import { createContext, useState, useEffect } from "react";

export const WcstContext = createContext("");

export function WcstProvider({ children }) {
  const [result, setResult] = useState([]);
  const [counter, setCounter] = useState(0);
  const [completedCategories, setCompletedCategories] = useState(0);
  const [firstCategoryResponseCount, setFirstCategoryResponseCount] = useState(0);

  const [perseverativeResponses, setPerseverativeResponses] = useState(0);
  const [perseverativeErrors, setPerseverativeErrors] = useState(0);
  const [nonPerseverativeErrors, setNonPerseverativeErrors] = useState(0);
  const [conceptualLevelResponses, setConceptualLevelResponses] = useState(0);
  const [learningToLearn, setLearningToLearn] = useState(0);

  useEffect(() => {
    const firstCategoryCount = result.filter((r) => r.category === 1).length;
    setFirstCategoryResponseCount(firstCategoryCount);
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
