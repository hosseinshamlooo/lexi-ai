export interface ConversationInsights {
  id: string;
  title: string;
  date: string;
  situation: {
    role: string;
    description: string;
    greeting: string;
    prompt: string;
    image?: string;
  };
  language: string;
  summary?: {
    summary: string;
    recapPoints: string[];
  };
  analysis?: {
    summary: string;
    level: string;
    topics: Array<{
      title: string;
      points: string[];
    }>;
  };
  userMessages: any[];
  feedbackData?: {
    recap: string[];
    progress: {
      speakingTime: { student: number; teacher: number };
      totalWords: number;
      newWords: number;
    };
    feedback: Array<{
      type: string;
      text: string;
      highlight: string;
    }>;
    vocabulary: string[];
  };
}

const STORAGE_KEY = 'conversation-insights';

export const saveInsights = (insights: ConversationInsights): void => {
  try {
    const existing = getInsightsHistory();
    const updated = [insights, ...existing.filter(item => item.id !== insights.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save insights:', error);
  }
};

export const getInsightsHistory = (): ConversationInsights[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load insights:', error);
    return [];
  }
};

export const getInsightsById = (id: string): ConversationInsights | undefined => {
  const insights = getInsightsHistory();
  return insights.find(insight => insight.id === id);
};

export const clearInsightsHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear insights:', error);
  }
};

