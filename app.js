let currentTrivia = {}; 
let timer; 
let timeRemaining = 0; 
let questionCount = 0; 
const maxQuestions = 5; 
const score = { correct: 0 }; 

const fetchBtn = document.querySelector("#fetchBtn");
const questionElement = document.querySelector("#question");
const answersList = document.querySelector("#answers");
const difficultySelect = document.querySelector("#difficulty");
const categorySelect = document.querySelector("#category");
const nextBtn = document.querySelector("#nextBtn");
const timerElement = document.querySelector("#timeRemaining");
const currentQuestionNumber = document.querySelector("#currentQuestionNumber");
const scorePopup = document.querySelector("#scorePopup");
const finalScoreElement = document.querySelector("#finalScore");
const closePopupBtn = document.querySelector("#closePopupBtn");

fetchBtn.addEventListener("click", async () => {
  const selectedCategory = categorySelect.value;
  if (!selectedCategory) {
    alert("Please select a category!");
    return;
  }
  
  if (questionCount < maxQuestions) {
    nextBtn.style.display = "none"; 
    await getTrivia(); 
    startTimer(); 
    questionCount++; 
    currentQuestionNumber.textContent = `Question: ${questionCount}`; 
  } else {
    showScore(); 
    fetchBtn.disabled = true; 
  }
  fetchBtn.style.display = "none";
  document.querySelector("#quizArea").style.display = "block";
  
});

async function getTrivia() {
  try {
    const selectedDifficulty = difficultySelect.value;
    const response = await fetch(
      `https://the-trivia-api.com/v2/questions?limit=1&difficulties=${selectedDifficulty}&categories=${categorySelect.value}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      currentTrivia = data[0];
      questionElement.textContent = currentTrivia.question.text;

      const answers = [
        ...currentTrivia.incorrectAnswers,
        currentTrivia.correctAnswer,
      ];
      answers.sort(() => Math.random() - 0.5); // random pitanja daje

      answersList.innerHTML = ""; // uklanja prolsa pitanja
      answers.forEach((answer) => {
        const li = document.createElement("li");
        li.textContent = answer;
        li.addEventListener("click", checkAnswer);
        answersList.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Error fetching trivia data:", err);
  }
}

function checkAnswer(event) {
  const selectedAnswer = event.target.textContent;
  const isCorrect = selectedAnswer === currentTrivia.correctAnswer;

  if (isCorrect) {
    event.target.style.backgroundColor = "green";
    score.correct++; 
  } else {
    event.target.style.backgroundColor = "red";
  }

 
  answersList
    .querySelectorAll("li")
    .forEach((li) => li.removeEventListener("click", checkAnswer));
  nextBtn.style.display = "block";
  clearInterval(timer);
}

function startTimer() {
  const selectedDifficulty = difficultySelect.value;

  if (selectedDifficulty === "easy") {
    timeRemaining = 10;
  } else if (selectedDifficulty === "medium") {
    timeRemaining = 8;
  } else if (selectedDifficulty === "hard") {
    timeRemaining = 5;
  }

  timerElement.textContent = timeRemaining;

  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      timerElement.textContent = timeRemaining;
    } else {
      clearInterval(timer);
      alert("Time's up!");
      nextBtn.style.display = "block"; 
    }
  }, 1000);
}


nextBtn.addEventListener("click", async () => {
  if (questionCount < maxQuestions) {
    nextBtn.style.display = "none";
    await getTrivia();
    startTimer();
    questionCount++;
    currentQuestionNumber.textContent = `Question: ${questionCount}`;
  } else {
    showScore(); 
  }
});

function showScore() {
  const playerName = document.querySelector("#players-name").value.trim(); 

  if (!playerName) {
    alert("Please enter your name!");
    return;
  }
  finalScoreElement.textContent = `${playerName}: ${score.correct}`; 
  scorePopup.classList.add("show"); 
}


closePopupBtn.addEventListener("click", () => {
  scorePopup.classList.remove("show"); 
  resetQuiz(); 
});

function resetQuiz() {
  score.correct = 0;
  questionCount = 0;
  document.getElementById("quizArea").style.display = "none";
  fetchBtn.disabled = false; 
}
