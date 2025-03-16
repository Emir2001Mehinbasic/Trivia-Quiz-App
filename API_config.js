export const API_CONFIG = {
  BASE_URL: "https://the-trivia-api.com/v2",
  CATEGORIES_ENDPOINT: "/api/categories",
  QUESTIONS_ENDPOINT: "/questions",
  DEFAULT_LIMIT: 10,
  DIFFICULTY_TIMERS: {
    easy: 10,
    medium: 8,
    hard: 6,
  },
};

export const QUIZ_STATE = {
  currentQuestionIndex: 0,
  score: 0,
  selectedCategories: [],
  questions: [],
  results: {
    correct: 0,
    wrong: 0,
    skipped: 0,
  },
};
