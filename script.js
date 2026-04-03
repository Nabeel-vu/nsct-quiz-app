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

// ====================================================================
// SOUND FILE CONFIGURATION - Add your MP3 files here!
// ====================================================================
// Simply add the filename of any MP3 file you place in each directory.
// The system will automatically use them. No need for specific names!
// ====================================================================

const SOUND_FILES = {
    // Option Selection - Randomly plays one of these when clicking options
    // Add as many as you want for variety!
    optionSelect: [
        'error_CDOxCYm.mp3',
        'faahhhhhhh.mp3',
        'gey-echo.mp3'
        // Add more files here: 'your-sound.mp3',
    ],
    
    // Submit Button Click - Plays when submit button is clicked
    submitClick: [
        'submit.mp3'
        // Add alternatives: 'submit2.mp3', 'send.mp3',
    ],
    
    // Alert Popup - Plays when confirmation modal appears
    alertPopup: [
        'popup.mp3'
        // Add alternatives: 'alert.mp3', 'notification.mp3',
    ],
    
    // Loading Results - Plays during result calculation
    loadingResults: [
        'loading.mp3'
        // Add alternatives: 'processing.mp3', 'calculating.mp3',
    ],
    
    // Grade: Excellent (95-100%)
    gradeExcellent: [
        'excellent.mp3'
        // Add alternatives: 'applause.mp3', 'celebration.mp3',
    ],
    
    // Grade: Very Good (80-95%)
    gradeVeryGood: [
        'verygood.mp3'
        // Add alternatives: 'success.mp3', 'achievement.mp3',
    ],
    
    // Grade: Good (60-80%)
    gradeGood: [
        'good.mp3'
        // Add alternatives: 'welldone.mp3', 'nice.mp3',
    ],
    
    // Grade: Average (45-60%)
    gradeAverage: [
        'average.mp3'
        // Add alternatives: 'okay.mp3', 'moderate.mp3',
    ],
    
    // Grade: Below Average (30-45%)
    gradeBelowAverage: [
        'belowavg.mp3'
        // Add alternatives: 'tryagain.mp3', 'practice.mp3',
    ],
    
    // Grade: Poor (20-30%)
    gradePoor: [
        'poor.mp3'
        // Add alternatives: 'ohno.mp3', 'studymore.mp3',
    ],
    
    // Grade: Very Poor (5-20%)
    gradeVeryPoor: [
        'verypoor.mp3'
        // Add alternatives: 'disappointed.mp3', 'needswork.mp3',
    ],
    
    // Grade: Fail (< 5%)
    gradeFail: [
        'fail.mp3'
        // Add alternatives: 'gameover.mp3', 'sadtrombone.mp3',
    ]
};

// ====================================================================
// Advanced Sound Manager with multiple scenarios and minimal latency
// ====================================================================
class SoundManager {
    constructor() {
        // Build full paths from configuration
        this.soundPaths = {
            optionSelect: this.buildPaths('option-select', SOUND_FILES.optionSelect),
            submitClick: this.buildPaths('submit-click', SOUND_FILES.submitClick),
            alertPopup: this.buildPaths('alert-popup', SOUND_FILES.alertPopup),
            loadingResults: this.buildPaths('loading-results', SOUND_FILES.loadingResults),
            gradeExcellent: this.buildPaths('grade-excellent', SOUND_FILES.gradeExcellent),
            gradeVeryGood: this.buildPaths('grade-verygood', SOUND_FILES.gradeVeryGood),
            gradeGood: this.buildPaths('grade-good', SOUND_FILES.gradeGood),
            gradeAverage: this.buildPaths('grade-average', SOUND_FILES.gradeAverage),
            gradeBelowAverage: this.buildPaths('grade-belowaverage', SOUND_FILES.gradeBelowAverage),
            gradePoor: this.buildPaths('grade-poor', SOUND_FILES.gradePoor),
            gradeVeryPoor: this.buildPaths('grade-verypoor', SOUND_FILES.gradeVeryPoor),
            gradeFail: this.buildPaths('grade-fail', SOUND_FILES.gradeFail)
        };

        // Pre-loaded audio pools for minimal latency
        this.audioPools = {};
        this.volumes = {
            optionSelect: 0.3,
            submitClick: 0.4,
            alertPopup: 0.35,
            loadingResults: 0.3,
            gradeExcellent: 0.5,
            gradeVeryGood: 0.45,
            gradeGood: 0.4,
            gradeAverage: 0.35,
            gradeBelowAverage: 0.35,
            gradePoor: 0.4,
            gradeVeryPoor: 0.4,
            gradeFail: 0.45
        };

        this.currentlyPlaying = null;
        this.initializeSounds();
    }

    // Helper method to build full file paths
    buildPaths(directory, filenames) {
        return filenames.map(filename => `sounds/${directory}/${filename}`);
    }

    async initializeSounds() {
        // Pre-load all available sound files
        for (const [scenario, paths] of Object.entries(this.soundPaths)) {
            this.audioPools[scenario] = [];
            
            for (const path of paths) {
                try {
                    const audio = new Audio();
                    audio.preload = 'auto';
                    audio.volume = this.volumes[scenario] || 0.3;
                    audio.src = path;
                    
                    // Pre-load by attempting to load metadata
                    await new Promise((resolve) => {
                        audio.addEventListener('canplaythrough', resolve, { once: true });
                        audio.addEventListener('error', resolve, { once: true });
                        audio.load();
                        // Don't wait forever
                        setTimeout(resolve, 1000);
                    });
                    
                    this.audioPools[scenario].push(audio);
                } catch (error) {
                    console.log(`Could not load sound: ${path}`);
                }
            }
        }
        console.log('Sound Manager initialized with pre-loaded audio');
    }

    playSound(scenario, options = {}) {
        const { stopCurrent = false, volume = null, onEnded = null } = options;

        // Stop currently playing sound if requested
        if (stopCurrent && this.currentlyPlaying) {
            this.currentlyPlaying.pause();
            this.currentlyPlaying.currentTime = 0;
        }

        const pool = this.audioPools[scenario];
        if (!pool || pool.length === 0) {
            console.log(`No sounds available for: ${scenario}`);
            return null;
        }

        try {
            // Select random sound from pool
            const randomIndex = Math.floor(Math.random() * pool.length);
            const audio = pool[randomIndex].cloneNode();
            
            // Set volume
            audio.volume = volume !== null ? volume : this.volumes[scenario];
            
            // Reset to start
            audio.currentTime = 0;
            
            // Handle ended event
            if (onEnded) {
                audio.addEventListener('ended', onEnded, { once: true });
            }
            
            // Play with promise handling
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.currentlyPlaying = audio;
                    })
                    .catch(err => {
                        console.log(`Playback failed for ${scenario}:`, err.message);
                    });
            }
            
            return audio;
        } catch (error) {
            console.log(`Error playing sound for ${scenario}:`, error);
            return null;
        }
    }

    // Convenience methods for different scenarios
    playOptionSelect() {
        return this.playSound('optionSelect');
    }

    playSubmitClick() {
        return this.playSound('submitClick');
    }

    playAlertPopup() {
        return this.playSound('alertPopup');
    }

    playLoadingResults(onEnded) {
        return this.playSound('loadingResults', { onEnded });
    }

    playGradeSound(percentage) {
        let scenario;
        
        if (percentage >= 95) {
            scenario = 'gradeExcellent';
        } else if (percentage >= 80) {
            scenario = 'gradeVeryGood';
        } else if (percentage >= 60) {
            scenario = 'gradeGood';
        } else if (percentage >= 45) {
            scenario = 'gradeAverage';
        } else if (percentage >= 30) {
            scenario = 'gradeBelowAverage';
        } else if (percentage >= 20) {
            scenario = 'gradePoor';
        } else if (percentage >= 5) {
            scenario = 'gradeVeryPoor';
        } else {
            scenario = 'gradeFail';
        }
        
        return this.playSound(scenario, { stopCurrent: true });
    }

    stopAll() {
        if (this.currentlyPlaying) {
            this.currentlyPlaying.pause();
            this.currentlyPlaying.currentTime = 0;
            this.currentlyPlaying = null;
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
    document.getElementById('submit-quiz-btn').addEventListener('click', () => {
        // Play submit click sound
        soundManager.playSubmitClick();
        showConfirmModal();
    });
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
    
    // Play option selection sound
    soundManager.playOptionSelect();
    
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
    
    // Play alert popup sound
    soundManager.playAlertPopup();
}

function hideConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
}

function confirmSubmit() {
    // Play submit click sound
    soundManager.playSubmitClick();
    
    hideConfirmModal();
    
    // Show loading screen
    showLoadingScreen();
}

function autoSubmit() {
    submitQuiz();
}

function submitQuiz() {
    clearInterval(quizState.timerInterval);
    clearQuizProgress();
    const results = calculateResults();
    saveToHistory(results);
    
    // Play grade-based sound
    soundManager.playGradeSound(results.percentage);
    
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

// Loading screen functionality
function showLoadingScreen() {
    const loadingHTML = `
        <div id="loading-screen" class="loading-screen active">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h2>Calculating Results...</h2>
                <p>Please wait while we evaluate your answers</p>
                <div class="loading-progress">
                    <div class="loading-bar" id="loading-bar"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
    
    // Play loading sound and start animation
    soundManager.playLoadingResults(() => {
        console.log('Loading sound completed');
    });
    
    // Animate progress bar
    const loadingBar = document.getElementById('loading-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                hideLoadingScreen();
                submitQuiz();
            }, 300);
        }
        loadingBar.style.width = progress + '%';
    }, 150);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('active');
        setTimeout(() => loadingScreen.remove(), 300);
    }
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
