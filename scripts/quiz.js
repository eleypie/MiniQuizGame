// Quiz State Variables
let countdown;
let quizTime = 90;
let paused = false;
let remainTime = 0;
let currentScore = 0;
let currentQuestionIndex = 0;
let incorrectAnswers = [];
let quizArray = [];
let finalScore = 0;
const userAnswers = []; // User's selected answers (0-3)

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
const scorePerQuestion = document.querySelectorAll(".score-per-question");
const finalScoreDisplay = document.getElementById("final-score");

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
        quizTime = 90;
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
    const currentQuestion = quizArray[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = null; // Store user's answer
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers)); // Save user answers
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

    // console.log("Current Question Index:", currentQuestionIndex);
    // console.log("Current Question:", questionData.question);
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
        finalScore += 1; 
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

    userAnswers[currentQuestionIndex] = selectedIndex; // Store user's answer
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers)); // Save user answers
    localStorage.setItem('finalScore', JSON.stringify(finalScore)); // Save final score

    setTimeout(() => {
        selectedButton.classList.remove('correct', 'incorrect');
        answerLocked = false;
        nextQuestion();
    }, 1000);
}


// Modal Functions
function showResults() {
    stopTimer();

    // Calculate results
    const finalScore = currentScore / 20;
    const percentage = (currentScore / (quizArray.length * 20)) * 100;

    // Set message
    let message = percentage >= 80 ? "Hive Five! You're a Quizmo Champion!" :
                 percentage >= 50 ? "Good Job! You're getting there!" :
                 "Keep practicing! You'll do better next time!";

    // Update modal elements
    document.getElementById("final-score").textContent = finalScore;
    document.getElementById("result-message").textContent = message;
    document.getElementById("points-earned").textContent = currentScore;

    // Save to localStorage (without incorrect answers if not needed)
    localStorage.setItem('quizResults', JSON.stringify({
        finalScore: finalScore,
        currentScore: currentScore,
        message: message,
        allQuestions: quizArray,
        selectedSet: selectedSetName,
    }));

    // Show modal
    const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
    resultsModal.show();
}

//Review Answers 

function populateReviewPage(questionSet, userAnswers) {
    // Loop through each question
    for (let i = 0; i < questionSet.length; i++) {
        const currentQuestion = questionSet[i];
        const questionDiv = document.getElementById(`question${i+1}`);
        
        if (!questionDiv) continue;
        
        // Set question number and text
        questionDiv.querySelector('#num').textContent = i+1;
        questionDiv.querySelector('#question').textContent = currentQuestion.question;
        
        // Get all choice elements
        const choices = questionDiv.querySelectorAll('.choices');
        const choiceTexts = questionDiv.querySelectorAll('.choice-text');
        const answerStatuses = questionDiv.querySelectorAll('.answer-status');
        const finalScoreDisplay1 = JSON.parse(localStorage.getItem('finalScore'));

        // Populate choices and mark answers
        for (let j = 0; j < choices.length; j++) {
            // Set choice text
            choiceTexts[j].textContent = currentQuestion.answers[j];
            
            // Reset classes and status
            choices[j].className = 'choices'; // Remove all classes
            answerStatuses[j].textContent = '';
            answerStatuses[j].className = 'answer-status';
            

            // Mark correct answer
            if (j === currentQuestion.correct) {
                choices[j].classList.add('correct-answer');
                answerStatuses[j].classList.add('correct-status');
                answerStatuses[j].textContent = 'Correct Answer';
            }
        
            // Mark user's answer
            if (j === userAnswers[i]) {
                if (j === currentQuestion.correct) {
                    choices[j].classList.add('user-correct');
                    scorePerQuestion[i].textContent = '20';
                    finalScoreDisplay.textContent = finalScoreDisplay1; 
                
                } else {
                    choices[j].classList.add('incorrect-answer');
                    answerStatuses[j].classList.add('incorrect-status');
                    answerStatuses[j].textContent = 'Your Answer';
                }
            }
        }
        
        // Set explanation if available
        const explanationText = questionDiv.querySelector('.explanation-text');
        if (explanationText && currentQuestion.explanation) {
            explanationText.textContent = currentQuestion.explanation;
        }
        
        // Set resource link if available
        const resourceLink = questionDiv.querySelector('.resource-link');
        if (resourceLink && currentQuestion.resource) {
            resourceLink.href = currentQuestion.resource;
            resourceLink.textContent = "Read more here"; 
        }
        
        // Always show explanation section for review page
        const explanationSection = questionDiv.querySelector('.explanation');
        if (explanationSection) {
            explanationSection.style.display = 'block';
        }
    }

}

function results() {         
    let savedAnswers = JSON.parse(localStorage.getItem('userAnswers'));          
    populateReviewPage(quizArray, savedAnswers); 
};

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
    localStorage.removeItem('userAnswers');
    userAnswers.length = 0;

    currentQuestionIndex = 0;
    currentScore = 0;
    incorrectAnswers = [];
    paused = false;
    quizTime = 90; // Reset to initial time
    answerLocked = false; // Unlock buttons
    
    clearInterval(countdown);
    
    scoreDisplay.textContent = '0';
    const reviewSection = document.getElementById('answers-review');
    if (reviewSection) reviewSection.style.display = 'none';
    
    displayQuestion();
    startTimer();
    
    const resultsModal = bootstrap.Modal.getInstance(document.getElementById('resultsModal'));
    if (resultsModal) resultsModal.hide();
};

function tryAgain() {
    window.location.href='quiz.html';
    restartQuiz();
}

function quitQuiz() {
    window.location.href = '../index.html';
}

// Initialize Quiz
document.addEventListener('DOMContentLoaded', () => {
    displayQuestion();
});

