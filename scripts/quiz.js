// Quiz State Variables
let countdown;
let quizTime = 90;
let paused = false;
let remainTime = 0;
let currentScore = 0;
let currentQuestionIndex = 0;
let incorrectAnswers = [];
let quizArray = [];

// DOM Elements
const question = document.getElementById("question");
const choiceLetter = document.querySelectorAll(".choice-letter");
const choiceText = document.querySelectorAll(".choice-text");
const choices = document.querySelectorAll(".choice-btn");
const timerDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const progressBar = document.querySelector(".progress-bar");
const numDisplay = document.getElementById("num");
const selectedSetName = localStorage.getItem('selectedQuizSet');

switch (selectedSetName) {
    case "setQ1":
        quizArray = setQ1;
        break;
    case "setQ2":
        quizArray = setQ2;
        break;
    case "setQ3":
        quizArray = setQ3;
        break;
        case "setQ4":
        quizArray = setQ4;
        break;
    default:
        alert("No quiz selected!");
        break;
}

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

function resumeQuiz() {
    startTimer();
    const stopQuizModal = bootstrap.Modal.getInstance(document.getElementById('exitConfirmationModal'));
    stopQuizModal.hide();
}

function stopQuiz() {
    stopTimer();
    const stopQuizModal = new bootstrap.Modal(document.getElementById('exitConfirmationModal'));
    stopQuizModal.show();
}

function timeExpired() {
    // Handle when time runs out
    const currentQuestion = quizArray[currentQuestionIndex];
    incorrectAnswers.push({
        question: currentQuestion.question,
        userAnswer: "Time Expired",
        correctAnswer: currentQuestion.answers[currentQuestion.correct]
    });
    nextQuestion();
}

// Quiz Flow Functions
function displayQuestion() {
    const questionData = quizArray[currentQuestionIndex];
    question.textContent = questionData.question;
    
    choiceText.forEach((choice, index) => {
        choice.textContent = questionData.answers[index];
    });
    
    // Update progress
    numDisplay.textContent = currentQuestionIndex + 1;
    progressBar.style.width = `${((currentQuestionIndex + 1) / quizArray.length) * 100}%`;

    console.log("Current Question Index:", currentQuestionIndex);
    console.log("Current Question:", questionData.question);
}

function nextQuestion() {
    currentQuestionIndex += 1;
    if(currentQuestionIndex < quizArray.length) {
        if(quizTime < 0) {
            timeExpired();
            return;
        }
        displayQuestion();
    } else {
        showResults();
    }
}

let answerLocked = false;

function checkAnswer(selectedIndex) {
    if (answerLocked) return; // Prevent double-clicks
    answerLocked = true;
    
    const questionData = quizArray[currentQuestionIndex];
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
    selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
        selectedButton.classList.remove('correct', 'incorrect');
        answerLocked = false;
        nextQuestion();
    }, 1000);
}


// Modal Functions
function showResults() {
    stopTimer();

    // Update modal with final score
    document.getElementById("final-score").textContent = currentScore / 20; // Convert points to correct count
    document.getElementById("current-score-display").textContent = currentScore;
    document.getElementById("points-earned").textContent = currentScore;
    
    // Set result message based on performance
    const percentage = (currentScore / (quizArray.length * 20)) * 100;
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
    
    // Restart quiz
    displayQuestion();

    // Hide modal
    const resultsModal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
    resultsModal.hide();
    startTimer();
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