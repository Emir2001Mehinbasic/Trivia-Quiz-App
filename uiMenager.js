import { API_CONFIG, QUIZ_STATE } from "./config.js";
import { handleAnswer } from "./quizManager.js";

let timer;

export const initUI = {
  loading: (show) => {
    document.querySelector(".loading").style.display = show ? "flex" : "none";
  },

  showScreen: (screen) => {
    document.querySelectorAll("[data-screen]").forEach((el) => {
      el.classList.toggle("active", el.dataset.screen === screen);
    });
  },

  initCategories: (categories) => {
    const container = document.querySelector("#categories");
    container.innerHTML = categories
      .map(
        ({ id, name }) => `
            <div class="category-item">
                <input type="checkbox" id="${id}" value="${id}">
                <label for="${id}">${name}</label>
            </div>
        `
      )
      .join("");
  },

  updateQuestion: () => {
    const question = QUIZ_STATE.questions[QUIZ_STATE.currentIndex];
    const answers = [...question.incorrectAnswers, question.correctAnswer].sort(
      () => Math.random() - 0.5
    );

    document.querySelector("#question").textContent = question.question.text;
    document.querySelector("#category").textContent = question.category;
    document.querySelector("#difficulty").textContent = question.difficulty;

    const answersContainer = document.querySelector("#answers");
    answersContainer.innerHTML = answers
      .map(
        (answer) => `
            <button class="answer-btn" data-answer="${answer}">${answer}</button>
        `
      )
      .join("");

    this.startTimer(API_CONFIG.DIFFICULTY_TIMERS[QUIZ_STATE.difficulty]);
  },

  startTimer: (seconds) => {
    clearInterval(timer);
    let time = seconds;
    const timerEl = document.querySelector("#timer");

    timer = setInterval(() => {
      timerEl.textContent = `${time}s`;
      if (time-- <= 0) {
        clearInterval(timer);
        this.handleTimeout();
      }
    }, 1000);
  },

  handleTimeout: () => {
    const correct = QUIZ_STATE.questions[QUIZ_STATE.currentIndex].correctAnswer;
    this.showFeedback(null, correct);
    handleAnswer("skipped", correct);
    setTimeout(this.nextQuestion, 1500);
  },

  showFeedback: (selected, correct) => {
    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.answer === correct) {
        btn.classList.add("correct");
      }
      if (btn.dataset.answer === selected) {
        btn.classList.add("wrong");
      }
    });
    document.querySelector("#score").textContent = QUIZ_STATE.score;
  },

  nextQuestion: () => {
    QUIZ_STATE.currentIndex++;
    if (QUIZ_STATE.currentIndex < QUIZ_STATE.questions.length) {
      this.updateQuestion();
    } else {
      this.showResults();
    }
  },

  showResults: () => {
    this.showScreen("results");
    document.querySelector("#final-score").textContent = QUIZ_STATE.score;
    document.querySelector("#correct-count").textContent =
      QUIZ_STATE.results.correct;
    document.querySelector("#wrong-count").textContent =
      QUIZ_STATE.results.wrong;
    document.querySelector("#skipped-count").textContent =
      QUIZ_STATE.results.skipped;

    const details = document.querySelector("#results-details");
    details.innerHTML = QUIZ_STATE.questions
      .map(
        (q, i) => `
            <div class="result-item">
                <h3>Question ${i + 1}</h3>
                <p>${q.question.text}</p>
                <p class="correct-answer">Correct: ${q.correctAnswer}</p>
            </div>
        `
      )
      .join("");
  },

  showError: (message) => {
    const errorEl = document.querySelector("#error");
    errorEl.textContent = message;
    errorEl.classList.add("show");
    setTimeout(() => errorEl.classList.remove("show"), 3000);
  },
};
