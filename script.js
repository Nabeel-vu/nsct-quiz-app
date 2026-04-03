// Quiz Configuration
const QUIZ_CONFIG = {
    totalQuestions: 100,
    timeLimit: 120 * 60, // 120 minutes
    storageKey: 'nsct_quiz_history',
    quizProgressKey: 'nsct_quiz_progress'
};

// Global variable to store loaded questions
let categoryData = null;

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        categoryData = await response.json();
        console.log('Questions loaded successfully');
        return categoryData;
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions. Please refresh the page.');
        throw error;
    }
}

// Select weighted random questions
function selectWeightedQuestions(categoryData, totalQuestions) {
    const selectedQuestions = [];
    const totalWeight = Object.values(categoryData).reduce((sum, cat) => sum + cat.weight, 0);
    
    // Calculate how many questions from each category based on weight
    const categoryQuestionCounts = {};
    let remaining = totalQuestions;
    
    Object.entries(categoryData).forEach(([category, data], index, array) => {
        if (index === array.length - 1) {
            categoryQuestionCounts[category] = remaining;
        } else {
            const count = Math.round((data.weight / totalWeight) * totalQuestions);
            categoryQuestionCounts[category] = count;
            remaining -= count;
        }
    });
    
    // Select random questions from each category
    Object.entries(categoryQuestionCounts).forEach(([category, count]) => {
        const questions = categoryData[category].questions;
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, questions.length));
        
        selected.forEach((q, index) => {
            selectedQuestions.push({
                id: selectedQuestions.length + 1,
                question: q.statement,
                options: [q.option_a, q.option_b, q.option_c, q.option_d],
                correct: ['option_a', 'option_b', 'option_c', 'option_d'].indexOf(q.correct_option),
                category: category,
                explanation: q.explanation
            });
        });
    });
    
    // Shuffle final questions
    return selectedQuestions.sort(() => Math.random() - 0.5);
}

// Sound Manager for playing random sounds
class SoundManager {
    constructor() {
        this.sounds = [
            'sounds/sound2.mp3',
            'sounds/sound3.mp3'
        ];
        this.audioPool = [];
        this.initializeSounds();
    }

    initializeSounds() {
        // Pre-load audio files
        this.sounds.forEach(src => {
            const audio = new Audio(src);
            audio.volume = 0.3; // Set volume to 30%
            this.audioPool.push(audio);
        });
    }

    playRandomSound() {
        try {
            const randomIndex = Math.floor(Math.random() * this.sounds.length);
            const audio = new Audio(this.sounds[randomIndex]);
            audio.volume = 0.3;
            audio.play().catch(err => console.log('Sound play failed:', err));
        } catch (error) {
            console.log('Sound error:', error);
        }
    }
}

// Initialize sound manager
const soundManager = new SoundManager();

// Quiz State
let quizState = {
    studentName: '',
    questions: [],
    answers: [],
    currentQuestionIndex: 0,
    visitedQuestions: new Set(),
    timeRemaining: QUIZ_CONFIG.timeLimit,
    timerInterval: null,
    quizStartTime: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    setupEventListeners();
    loadStudentName();
});

function setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('view-history-btn').addEventListener('click', () => showPage('history-page'));
    document.getElementById('view-history-result-btn').addEventListener('click', () => showPage('history-page'));
    document.getElementById('back-to-home-btn').addEventListener('click', () => showPage('landing-page'));
    document.getElementById('new-quiz-btn').addEventListener('click', () => {
        clearQuizProgress();
        showPage('landing-page');
    });
    document.getElementById('submit-quiz-btn').addEventListener('click', () => showConfirmModal());
    document.getElementById('confirm-submit').addEventListener('click', confirmSubmit);
    document.getElementById('cancel-submit').addEventListener('click', hideConfirmModal);
    document.getElementById('prev-btn').addEventListener('click', () => navigateQuestion(-1));
    document.getElementById('next-btn').addEventListener('click', () => navigateQuestion(1));
    document.getElementById('download-pdf-btn').addEventListener('click', downloadPDF);
}

function loadStudentName() {
    const saved = localStorage.getItem('nsct_student_name');
    if (saved) {
        document.getElementById('student-name').value = saved;
    }
}

async function startQuiz() {
    const name = document.getElementById('student-name').value.trim();
    if (!name) {
        alert('Please enter your name');
        return;
    }

    if (!categoryData) {
        alert('Questions are still loading. Please wait...');
        return;
    }

    localStorage.setItem('nsct_student_name', name);
    quizState.studentName = name;
    quizState.questions = selectWeightedQuestions(categoryData, QUIZ_CONFIG.totalQuestions);
    quizState.answers = new Array(quizState.questions.length).fill(null);
    quizState.currentQuestionIndex = 0;
    quizState.visitedQuestions = new Set();
    quizState.timeRemaining = QUIZ_CONFIG.timeLimit;
    quizState.quizStartTime = Date.now();

    showPage('quiz-page');
    renderQuestionIndex();
    renderQuestion();
    startTimer();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'history-page') {
        loadHistory();
    }
}

function renderQuestionIndex() {
    const container = document.getElementById('question-index');
    container.innerHTML = '';

    quizState.questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'index-btn';
        btn.textContent = index + 1;
        btn.onclick = () => goToQuestion(index);
        
        if (index === quizState.currentQuestionIndex) {
            btn.classList.add('current');
        } else if (quizState.answers[index] !== null) {
            btn.classList.add('answered');
        } else if (quizState.visitedQuestions.has(index)) {
            btn.classList.add('skipped');
        } else {
            btn.classList.add('not-visited');
        }

        container.appendChild(btn);
    });

    updateAnsweredCount();
}

function renderQuestion() {
    const question = quizState.questions[quizState.currentQuestionIndex];
    quizState.visitedQuestions.add(quizState.currentQuestionIndex);

    document.getElementById('question-number').textContent = `Question ${quizState.currentQuestionIndex + 1}`;
    document.getElementById('question-category').textContent = question.category;
    document.getElementById('question-text').textContent = question.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (quizState.answers[quizState.currentQuestionIndex] === index) {
            optionDiv.classList.add('selected');
        }

        optionDiv.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;

        optionDiv.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionDiv);
    });

    document.getElementById('prev-btn').disabled = quizState.currentQuestionIndex === 0;
    renderQuestionIndex();
}

function selectOption(optionIndex) {
    quizState.answers[quizState.currentQuestionIndex] = optionIndex;
    
    // Play random sound on option selection
    soundManager.playRandomSound();
    
    renderQuestion();
    saveQuizProgress();
}

function navigateQuestion(direction) {
    const newIndex = quizState.currentQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < quizState.questions.length) {
        quizState.currentQuestionIndex = newIndex;
        renderQuestion();
        saveQuizProgress();
    }
}

function goToQuestion(index) {
    quizState.currentQuestionIndex = index;
    renderQuestion();
    saveQuizProgress();
}

function updateAnsweredCount() {
    const answered = quizState.answers.filter(a => a !== null).length;
    document.getElementById('answered-count').textContent = `${answered}/${quizState.questions.length} Answered`;
}

function startTimer() {
    updateTimerDisplay();
    quizState.timerInterval = setInterval(() => {
        quizState.timeRemaining--;
        updateTimerDisplay();
        saveQuizProgress();

        if (quizState.timeRemaining <= 0) {
            clearInterval(quizState.timerInterval);
            autoSubmit();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(quizState.timeRemaining / 60);
    const seconds = quizState.timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const timerEl = document.getElementById('timer');
    timerEl.textContent = display;

    timerEl.classList.remove('warning', 'danger');
    if (quizState.timeRemaining <= 300) {
        timerEl.classList.add('danger');
    } else if (quizState.timeRemaining <= 600) {
        timerEl.classList.add('warning');
    }
}

function showConfirmModal() {
    const answered = quizState.answers.filter(a => a !== null).length;
    const unanswered = quizState.questions.length - answered;
    
    let message = `You have answered ${answered} out of ${quizState.questions.length} questions.`;
    if (unanswered > 0) {
        message += `\n${unanswered} questions remain unanswered.`;
    }
    
    document.getElementById('modal-message').textContent = message;
    document.getElementById('confirm-modal').classList.add('active');
}

function hideConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

function confirmSubmit() {
    hideConfirmModal();
    submitQuiz();
}

function autoSubmit() {
    submitQuiz();
}

function submitQuiz() {
    clearInterval(quizState.timerInterval);
    clearQuizProgress();
    const results = calculateResults();
    saveToHistory(results);
    displayResults(results);
}

function calculateResults() {
    let totalScore = 0;
    const categoryScores = {};

    quizState.questions.forEach((question, index) => {
        const userAnswer = quizState.answers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) totalScore++;

        if (!categoryScores[question.category]) {
            categoryScores[question.category] = { correct: 0, total: 0 };
        }
        categoryScores[question.category].total++;
        if (isCorrect) categoryScores[question.category].correct++;
    });

    return {
        studentName: quizState.studentName,
        totalScore,
        totalQuestions: quizState.questions.length,
        percentage: Math.round((totalScore / quizState.questions.length) * 100),
        categoryScores,
        answers: quizState.answers,
        questions: quizState.questions,
        timestamp: new Date().toISOString(),
        timeSpent: QUIZ_CONFIG.timeLimit - quizState.timeRemaining
    };
}

function displayResults(results) {
    document.getElementById('student-result-name').textContent = results.studentName;
    document.getElementById('total-score').textContent = `${results.totalScore}/${results.totalQuestions}`;
    document.getElementById('percentage').textContent = `${results.percentage}%`;

    // Category scores
    const categoryContainer = document.getElementById('category-scores');
    categoryContainer.innerHTML = '';
    Object.entries(results.categoryScores).forEach(([category, scores]) => {
        const card = document.createElement('div');
        card.className = 'category-score-card';
        card.innerHTML = `
            <div class="category-name">${category}</div>
            <div class="category-score">${scores.correct}/${scores.total}</div>
        `;
        categoryContainer.appendChild(card);
    });

    // Detailed questions
    const detailedContainer = document.getElementById('detailed-questions');
    detailedContainer.innerHTML = '';
    results.questions.forEach((question, index) => {
        const userAnswer = results.answers[index];
        const isCorrect = userAnswer === question.correct;
        const status = userAnswer === null ? 'skipped' : isCorrect ? 'correct' : 'wrong';

        const questionDiv = document.createElement('div');
        questionDiv.className = 'detailed-question';
        
        let optionsHTML = '';
        question.options.forEach((option, optIndex) => {
            let optionClass = 'other-option';
            if (optIndex === question.correct) {
                optionClass = 'correct-answer';
            } else if (optIndex === userAnswer && !isCorrect) {
                optionClass = 'wrong-answer';
            }

            optionsHTML += `
                <div class="detailed-option ${optionClass}">
                    <span class="answer-label">${String.fromCharCode(65 + optIndex)}</span>
                    <span>${option}</span>
                </div>
            `;
        });

        const explanationHTML = question.explanation ? `
            <div class="explanation">
                <div class="explanation-label">Explanation:</div>
                <div>${question.explanation}</div>
            </div>
        ` : '';

        questionDiv.innerHTML = `
            <div class="detailed-question-header">
                <span class="detailed-question-number">Question ${index + 1} - ${question.category}</span>
                <span class="status-badge ${status}">${status.toUpperCase()}</span>
            </div>
            <div class="detailed-question-text">${question.question}</div>
            <div class="detailed-options">${optionsHTML}</div>
            ${explanationHTML}
        `;

        detailedContainer.appendChild(questionDiv);
    });

    showPage('result-page');
}

function saveToHistory(results) {
    const history = JSON.parse(localStorage.getItem(QUIZ_CONFIG.storageKey) || '[]');
    history.push(results);
    localStorage.setItem(QUIZ_CONFIG.storageKey, JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(QUIZ_CONFIG.storageKey) || '[]');
    const container = document.getElementById('history-list');

    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">📚</div>
                <h3>No Quiz History</h3>
                <p>You haven't taken any quizzes yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach((result, index) => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <div class="history-info">
                <h3>${result.studentName}</h3>
                <div class="history-date">${new Date(result.timestamp).toLocaleString()}</div>
            </div>
            <div class="history-score">
                <div class="history-score-value">${result.percentage}%</div>
                <div class="history-score-label">${result.totalScore}/${result.totalQuestions}</div>
            </div>
            <button class="view-details-btn" onclick="viewHistoryDetails(${history.length - 1 - index})">View Details</button>
        `;
        container.appendChild(card);
    });
}

function viewHistoryDetails(index) {
    const history = JSON.parse(localStorage.getItem(QUIZ_CONFIG.storageKey) || '[]');
    const reversedIndex = history.length - 1 - index;
    const results = history[reversedIndex];
    displayResults(results);
}

function saveQuizProgress() {
    const progress = {
        studentName: quizState.studentName,
        questions: quizState.questions,
        answers: quizState.answers,
        currentQuestionIndex: quizState.currentQuestionIndex,
        visitedQuestions: Array.from(quizState.visitedQuestions),
        timeRemaining: quizState.timeRemaining,
        quizStartTime: quizState.quizStartTime
    };
    localStorage.setItem(QUIZ_CONFIG.quizProgressKey, JSON.stringify(progress));
}

function clearQuizProgress() {
    localStorage.removeItem(QUIZ_CONFIG.quizProgressKey);
}

function downloadPDF() {
    window.print();
}

// Handle page visibility for timer
document.addEventListener('visibilitychange', () => {
    if (document.getElementById('quiz-page').classList.contains('active')) {
        if (document.hidden) {
            if (quizState.timerInterval) {
                clearInterval(quizState.timerInterval);
            }
        } else {
            if (quizState.timeRemaining > 0) {
                startTimer();
            }
        }
    }
});

// Prevent accidental page close during quiz
window.addEventListener('beforeunload', (e) => {
    if (document.getElementById('quiz-page').classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});
