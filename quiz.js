import {showScore } from "./app.js"; 

const nextBtn = document.querySelector("#nextBtn");

nextBtn.addEventListener("click", async () => {
  if (questionCount < maxQuestions) {
    await getTrivia(); // Učitaj sledeće pitanje
    nextBtn.style.display = "none"; 
  } else {
    showScore(); 
  }
});
