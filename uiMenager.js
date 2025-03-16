import { QUIZ_STATE } from "./config.js";
import {calculateResults,getCurrentQuestion,getTimerDuration,} from "./quizManager.js";

let timerInterval;

export function initializeCategorySelection(categories) {
  const container = document.querySelector("#categories");
  container.innerHTML = "";

  categories.forEach(([categoryId, categoryName]) => {
    const div = document.createElement("div");
    div.className = "category-item";
    div.innerHTML = ` <input type="checkbox" id="${categoryId}" value="${categoryId}"> <label for="${categoryId}">${categoryName}</label>`;
    container.appendChild(div);
  });
}

export function showScreen(screenName) {
  document.querySelectorAll(".setup-screen, .quiz-container, .results-container").forEach((el) => el.classList.remove("active"));
  document.querySelector(`.${screenName}`).classList.add("active");
}

export function updateQuestionUI() {
  const question = getCurrentQuestion();
  const questionElement = document.querySelector("#question");
  const answersElement = document.querySelector("#answers");
  const difficultyElement = document.querySelector("#difficulty");
  const categoryElement = document.querySelector("#category");

 
  questionElement.textContent = question.question.text;//Update- a novo pitanje 

  
  difficultyElement.className = `difficulty-badge ${question.difficulty}`;
  difficultyElement.textContent = question.difficulty;
  categoryElement.textContent = question.category;

  //Update-a odgovore
  answersElement.innerHTML = "";
  const answers = [...question.incorrectAnswers, question.correctAnswer];
  answers.sort(() => Math.random() - 0.5);

  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.onclick = () =>handleAnswerSelection(answer, question.correctAnswer);
    answersElement.appendChild(button);
  });

  startTimer(getTimerDuration(question.difficulty));
}

function startTimer(duration) {
  let timeLeft = duration;
  const timerDisplay = document.querySelector("#timer");

  clearInterval(timerInterval);
  timerDisplay.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function handleAnswerSelection(selectedAnswer, correctAnswer) {
  clearInterval(timerInterval);
  calculateResults(selectedAnswer, correctAnswer);
  showAnswerFeedback(selectedAnswer, correctAnswer);
  setTimeout(advanceToNextQuestion, 1500);
}

function handleTimeout() {
  calculateResults("skipped", "");
  showAnswerFeedback(null, getCurrentQuestion().correctAnswer);
  setTimeout(advanceToNextQuestion, 1500);
}

function showAnswerFeedback(selectedAnswer, correctAnswer) {
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.classList.add("correct");
    } else if (button.textContent === selectedAnswer) {
      button.classList.add("wrong");
    }
  });

  updateScoreDisplay();
}

function advanceToNextQuestion() {
  QUIZ_STATE.currentQuestionIndex++;

  if (QUIZ_STATE.currentQuestionIndex < QUIZ_STATE.questions.length) {
    updateQuestionUI();
  } else {
    showResultsScreen();
  }
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = QUIZ_STATE.score;
}

export function showResultsScreen() {
  showScreen("results-container");


  document.querySelector("#final-score").textContent = `${QUIZ_STATE.score}/${QUIZ_STATE.questions.length}`;
  document.querySelector("#correct-answers").textContent =QUIZ_STATE.results.correct;
  document.querySelector("#wrong-answers").textContent =QUIZ_STATE.results.wrong;
  document.querySelector("#skipped-questions").textContent =QUIZ_STATE.results.skipped;


  const detailsContainer = document.querySelector("#results-details");
  detailsContainer.innerHTML = "";

  QUIZ_STATE.questions.forEach((question, index) => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `<h4>Question ${index + 1}</h4><p>${question.question.text}</p><p class="correct-answer">Correct Answer: ${
              question.correctAnswer
            }</p>
        `;
    detailsContainer.appendChild(div);
  });
}
