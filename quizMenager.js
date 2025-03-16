import { API_CONFIG, QUIZ_STATE } from "./config.js";

export const fetchCategories = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.CATEGORIES}`
    );
    const data = await response.json();
    return Object.entries(data).map(([id, name]) => ({
      id: id.toLowerCase().replace(/\s+/g, "_"),
      name: name.name,
    }));
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

export const fetchQuestions = async () => {
  try {
    const params = new URLSearchParams({
      categories: QUIZ_STATE.categories,
      difficulty: QUIZ_STATE.difficulty,
      limit: API_CONFIG.LIMIT,
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.QUESTIONS}?${params}`
    );
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch questions");
  }
};

export const handleAnswer = (selected, correct) => {
  if (selected === correct) {
    QUIZ_STATE.results.correct++;
    QUIZ_STATE.score++;
  } else if (selected === "skipped") {
    QUIZ_STATE.results.skipped++;
  } else {
    QUIZ_STATE.results.wrong++;
  }
};

export const resetQuiz = () => {
  QUIZ_STATE.currentIndex = 0;
  QUIZ_STATE.score = 0;
  QUIZ_STATE.questions = [];
  QUIZ_STATE.results = { correct: 0, wrong: 0, skipped: 0 };
};
