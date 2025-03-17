import {showScore } from "./score.js"; // Import iz score.js

const nextBtn = document.querySelector("#nextBtn");

nextBtn.addEventListener("click", async () => {
  if (questionCount < maxQuestions) {
    await getTrivia(); // Učitaj sledeće pitanje
    nextBtn.style.display = "none"; 
  } else {
    showScore(); 
  }
});
