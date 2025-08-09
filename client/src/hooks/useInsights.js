import { useState, useEffect } from 'react';

export const useInsights = () => {
  const [insights, setInsights] = useState(() => {
    const savedInsights = sessionStorage.getItem('spoon-insights');
    return savedInsights ? JSON.parse(savedInsights) : null;
  });

  // Update sessionStorage whenever insights change
  useEffect(() => {
    if (insights) {
      sessionStorage.setItem('spoon-insights', JSON.stringify(insights));
    } else {
      sessionStorage.removeItem('spoon-insights');
    }
  }, [insights]);

  const clearInsights = () => {
    setInsights(null);
  };

  return { insights, setInsights, clearInsights };
};