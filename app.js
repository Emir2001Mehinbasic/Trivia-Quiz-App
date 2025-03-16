const API_URL = "https://the-trivia-api.com/v2/questions?limit=10";
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timerInterval;
let answerTimeout;

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const scoreElement = document.getElementById("score");
const skipButton = document.getElementById("skip-btn");
const errorElement = document.getElementById("error");
const difficultyElement = document.getElementById("difficulty");
const timerDisplay = document.getElementById("timer");

