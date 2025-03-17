let currentTrivia = {}; // Current trivia question
let timer; 
let timeRemaining = 0; 
let questionCount = 0; 
const maxQuestions = 3; 
const score = { correct: 0 }; 


const fetchBtn = document.querySelector("#fetchBtn");
const questionElement = document.querySelector("#question");
const answersList = document.querySelector("#answers");
const difficultySelect = document.querySelector("#difficulty");
const categorySelect = document.querySelector("#category");
const nextBtn = document.querySelector("#nextBtn");
const timerElement = document.querySelector("#timeRemaining");
const currentQuestionNumber = document.querySelector("#currentQuestionNumber");


const scorePopup = document.getElementById("scorePopup");
const finalScoreElement = document.getElementById("finalScore");
const closePopupBtn = document.getElementById("closePopupBtn");

fetchBtn.addEventListener("click", async () => {
  const selectedCategory = categorySelect.value;
  if (!selectedCategory) {
    alert("Please select a category!");
    return;
  }

  // Start the quiz if less than 3 questions have been answered
  if (questionCount < maxQuestions) {
    nextBtn.style.display = "none"; // Hide "Next Question" button until answered
    await getTrivia(); // Get new trivia question
    startTimer(); // Start the timer
    questionCount++; // Increment question count
    currentQuestionNumber.textContent = `Question: ${questionCount}`; // Update question number
    document.getElementById("quizArea").style.display = "block"; // Show quiz area
  } else {
    showScore(); // Show score popup after 3 questions
    fetchBtn.disabled = true; // Disable start button after quiz ends
  }
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
      answers.sort(() => Math.random() - 0.5); // Randomize answers

      answersList.innerHTML = ""; // Clear previous answers
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
  clearInterval(timer);ed
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
  finalScoreElement.textContent = score.correct; 
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
