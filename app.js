import { API_CONFIG, QUIZ_STATE } from "./config.js";
import { fetchCategories, fetchQuestions, resetQuiz } from "./quizManager.js";
import { initUI } from "./uiManager.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    initUI.loading(true);
    const categories = await fetchCategories();
    initUI.initCategories(categories);

    // Event Listeners
    document.querySelector("#start-btn").addEventListener("click", startQuiz);
    document
      .querySelector("#restart-btn")
      .addEventListener("click", restartQuiz);
    document.querySelector("#skip-btn").addEventListener("click", skipQuestion);

    document.querySelector("#answers").addEventListener("click", (e) => {
      const answerBtn = e.target.closest(".answer-btn");
      if (answerBtn) {
        const selected = answerBtn.dataset.answer;
        const correct =
          QUIZ_STATE.questions[QUIZ_STATE.currentIndex].correctAnswer;
        initUI.showFeedback(selected, correct);
        handleAnswer(selected, correct);
        setTimeout(initUI.nextQuestion, 1500);
      }
    });
  } catch (error) {
    initUI.showError(error.message);
  } finally {
    initUI.loading(false);
  }
});

async function startQuiz() {
  try {
    QUIZ_STATE.categories = Array.from(
      document.querySelectorAll("#categories input:checked")
    ).map((cb) => cb.value);

    QUIZ_STATE.difficulty = document.querySelector(
      'input[name="difficulty"]:checked'
    ).value;

    if (!QUIZ_STATE.categories.length) {
      throw new Error("Please select at least one category");
    }

    initUI.loading(true);
    QUIZ_STATE.questions = await fetchQuestions();
    resetQuiz();
    initUI.showScreen("quiz");
    initUI.updateQuestion();
  } catch (error) {
    initUI.showError(error.message);
  } finally {
    initUI.loading(false);
  }
}

function restartQuiz() {
  resetQuiz();
  initUI.showScreen("setup");
  document
    .querySelectorAll("#categories input")
    .forEach((cb) => (cb.checked = false));
  document.querySelector(
    'input[name="difficulty"][value="easy"]'
  ).checked = true;
}

function skipQuestion() {
  const correct = QUIZ_STATE.questions[QUIZ_STATE.currentIndex].correctAnswer;
  initUI.showFeedback(null, correct);
  handleAnswer("skipped", correct);
  setTimeout(initUI.nextQuestion, 1500);
}
