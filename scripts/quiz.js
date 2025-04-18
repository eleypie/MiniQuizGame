// Quiz State Variables
let countdown;
let quizTime = 10;
let paused = false;
let remainTime = 0;
let currentScore = 0;
let currentQuestionIndex = 0;
let incorrectAnswers = [];

// DOM Elements
const question = document.getElementById("question");
const choiceLetter = document.querySelectorAll(".choice-letter");
const choiceText = document.querySelectorAll(".choice-text");
const choices = document.querySelectorAll(".choice-btn");
const timerDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const progressBar = document.querySelector(".progress-bar");
const numDisplay = document.getElementById("num");


// Timer Functions
function startTimer() {
    clearInterval(countdown);

    if(!paused) {
        quizTime = 90; // 1.5 minutes in seconds
    } else {
        quizTime = remainTime;
    }
    
    updateTimer();

    countdown = setInterval(() => {
        quizTime--;
  
        if (quizTime < 0) {
            clearInterval(countdown);
            paused = false;
            timeExpired();
        } else {
            updateTimer();
        }
    }, 1000);
}

function updateTimer() {
    let minutes = Math.floor(quizTime / 60);
    let seconds = quizTime % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
    paused = true;
    remainTime = quizTime;
    clearInterval(countdown);
}

function timeExpired() {
    // Handle when time runs out
    const currentQuestion = setQ1[currentQuestionIndex];
    incorrectAnswers.push({
        question: currentQuestion.question,
        userAnswer: "Time Expired",
        correctAnswer: currentQuestion.answers[currentQuestion.correct]
    });
    nextQuestion();
}

// Quiz Flow Functions
function displayQuestion() {
    const questionData = setQ1[currentQuestionIndex];
    question.textContent = questionData.question;
    
    choiceText.forEach((choice, index) => {
        choice.textContent = questionData.answers[index];
    });
    
    // Update progress
    numDisplay.textContent = currentQuestionIndex + 1;
    progressBar.style.width = `${((currentQuestionIndex + 1) / setQ1.length) * 100}%`;
    
    // Reset timer for each question
    if(!paused) {
        startTimer();
    }

    console.log("Current Question Index:", currentQuestionIndex);
    console.log("Current Question:", questionData.question);
}

function nextQuestion() {
    currentQuestionIndex += 1;
    if(currentQuestionIndex < setQ1.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

let answerLocked = false;

function checkAnswer(selectedIndex) {
    if (answerLocked) return; // Prevent double-clicks
    answerLocked = true;

    stopTimer();

    const questionData = setQ1[currentQuestionIndex];
    const isCorrect = selectedIndex == questionData.correct;

    if (isCorrect) {
        currentScore += 20;
        scoreDisplay.textContent = currentScore;
    } else {
        incorrectAnswers.push({
            question: questionData.question,
            userAnswer: questionData.answers[selectedIndex],
            correctAnswer: questionData.answers[questionData.correct]
        });
    }

    const choices = document.querySelectorAll('.choice-btn');
    const selectedButton = choices[selectedIndex];
    selectedButton.classList.add(isCorrect ? 'correct-answer' : 'incorrect-answer');

    setTimeout(() => {
        selectedButton.classList.remove('correct-answer', 'incorrect-answer');
        answerLocked = false;
        nextQuestion();
    }, 1000);
}


// Modal Functions
function showResults() {
    // Update modal with final score
    document.getElementById("final-score").textContent = currentScore / 20; // Convert points to correct count
    document.getElementById("current-score-display").textContent = currentScore;
    document.getElementById("points-earned").textContent = currentScore;
    
    // Set result message based on performance
    const percentage = (currentScore / (setQ1.length * 20)) * 100;
    let message = "";
    
    if(percentage >= 80) message = "Hive Five! You're a Quizmo Champion!";
    else if(percentage >= 50) message = "Good Job! You're getting there!";
    else message = "Keep practicing! You'll do better next time!";
    
    document.getElementById("result-message").textContent = message;
    
    // Populate incorrect answers
    const incorrectContainer = document.querySelector('.incorrect-answers');
    incorrectContainer.innerHTML = incorrectAnswers.map((answer, index) => `
        <div class="incorrect-answer">
            <div class="question">Question ${index + 1}: ${answer.question}</div>
            <div class="your-answer">Your answer: ${answer.userAnswer}</div>
            <div class="correct-answer">Correct answer: ${answer.correctAnswer}</div>
        </div>
    `).join('');
    
    // Show results modal
    const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
    resultsModal.show();
}

// Toggle answers review
document.getElementById('toggle-review')?.addEventListener('click', function() {
    const reviewSection = document.getElementById('answers-review');
    if (reviewSection.style.display === 'none') {
        reviewSection.style.display = 'block';
        this.innerHTML = '<i class="bi bi-x-circle"></i> Hide Answers';
    } else {
        reviewSection.style.display = 'none';
        this.innerHTML = '<i class="bi bi-search"></i> Review Answers';
    }
});

// Navigation Functions
function exitQuiz() {
    window.location.href = "index.html";
}

function restartQuiz() {
    // Reset all quiz state
    currentQuestionIndex = 0;
    currentScore = 0;
    incorrectAnswers = [];
    paused = false;
    
    // Update UI
    scoreDisplay.textContent = '0';
    document.getElementById('answers-review').style.display = 'none';
    document.getElementById('toggle-review').innerHTML = '<i class="bi bi-search"></i> Review Answers';
    
    // Restart quiz
    displayQuestion();
    
    // Hide modal
    const resultsModal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
    resultsModal.hide();
}

function quitQuiz() {
    window.location.href = '../index.html';
}

// Initialize Quiz
document.addEventListener('DOMContentLoaded', () => {
    displayQuestion();
    
    // Add event listeners to answer buttons
    choices.forEach((button, index) => {
        button.addEventListener('click', () => checkAnswer(index));
    });
});