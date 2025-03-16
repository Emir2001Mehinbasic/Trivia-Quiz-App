import { API_CONFIG, QUIZ_STATE } from "./config.js";

export async function fetchCategories() {//Fetch-a kategorije iz API
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.CATEGORIES_ENDPOINT}`
    );
    const data = await response.json();
    return Object.entries(data);
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
}

export async function fetchQuestions() {
  //Fetch-a pitanja iz API
  try {
    const params = new URLSearchParams({
      categories: QUIZ_STATE.selectedCategories.join(","),
      limit: API_CONFIG.DEFAULT_LIMIT,
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.QUESTIONS_ENDPOINT}?${params}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch questions");
  }
}

export function calculateResults(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    QUIZ_STATE.results.correct++;
    QUIZ_STATE.score++;
  } else if (selectedAnswer === "skipped") {
    QUIZ_STATE.results.skipped++;
  } else {
    QUIZ_STATE.results.wrong++;
  }
}

export function resetQuizState() {
  QUIZ_STATE.currentQuestionIndex = 0;
  QUIZ_STATE.score = 0;
  QUIZ_STATE.questions = [];
  QUIZ_STATE.results = { correct: 0, wrong: 0, skipped: 0 };
}

export function getCurrentQuestion() {
  return QUIZ_STATE.questions[QUIZ_STATE.currentQuestionIndex];
}

export function getTimerDuration(difficulty) {
  return API_CONFIG.DIFFICULTY_TIMERS[difficulty] || 10;
}
