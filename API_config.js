export const API_CONFIG = {
  BASE_URL: "https://the-trivia-api.com/v2",
  CATEGORIES: "/categories", 
  QUESTIONS: "/questions", 
  DEFAULT_LIMIT: 10,
  DIFFICULTY_TIMERS: {
    easy: 15,
    medium: 10,
    hard: 5,
  },
};

export const QUIZ_STATE = {
  currentIndex: 0,
  score: 0,
  categories: [],
  difficulty: "easy",
  questions: [],
  results: {
    correct: 0,
    wrong: 0,
    skipped: 0,
  },
  limit: API_CONFIG.DEFAULT_LIMIT, // dinamicko mjenjanje pitanja
};
