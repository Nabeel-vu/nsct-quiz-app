// Quiz Preparation Script - Display all questions with answers and explanations

let allQuestions = [];
let filteredQuestions = [];
let categoryData = null;

// Load questions on page load
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadQuestions();
    displayQuestions();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('back-to-home').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        filterQuestions();
    });

    document.getElementById('category-filter').addEventListener('change', (e) => {
        filterQuestions();
    });

    // Scroll to top button
    window.addEventListener('scroll', () => {
        const scrollBtn = document.getElementById('scroll-top-btn');
        if (scrollBtn) {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }
    });
}

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        categoryData = await response.json();

        // Parse all questions
        let questionNumber = 1;
        Object.entries(categoryData).forEach(([categoryName, data]) => {
            data.questions.forEach(question => {
                allQuestions.push({
                    number: questionNumber++,
                    category: categoryName,
                    weight: data.weight,
                    statement: question.statement,
                    options: [
                        { letter: 'A', text: question.option_a },
                        { letter: 'B', text: question.option_b },
                        { letter: 'C', text: question.option_c },
                        { letter: 'D', text: question.option_d }
                    ],
                    correctOption: question.correct_option,
                    explanation: question.explanation
                });
            });
        });

        filteredQuestions = [...allQuestions];
        console.log(`Loaded ${allQuestions.length} questions`);

        // Update stats
        document.getElementById('total-questions').textContent = allQuestions.length;
        document.getElementById('total-categories').textContent = Object.keys(categoryData).length;

        // Populate category filter
        populateCategoryFilter();

        // Hide loading, show content
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('filter-section').style.display = 'block';
        document.getElementById('questions-container').style.display = 'block';

    } catch (error) {
        console.error('Error loading questions:', error);
        document.getElementById('loading-screen').innerHTML = `
            <div style="text-align: center; color: #ef4444;">
                <h2>Failed to load questions</h2>
                <p>Please refresh the page or check your connection.</p>
            </div>
        `;
    }
}

// Populate category filter dropdown
function populateCategoryFilter() {
    const select = document.getElementById('category-filter');
    const categories = Object.keys(categoryData);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}

// Filter questions based on search and category
function filterQuestions() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedCategory = document.getElementById('category-filter').value;

    filteredQuestions = allQuestions.filter(question => {
        // Category filter
        const categoryMatch = selectedCategory === 'all' || question.category === selectedCategory;

        // Search filter
        const searchMatch = searchTerm === '' || 
            question.statement.toLowerCase().includes(searchTerm) ||
            question.options.some(opt => opt.text.toLowerCase().includes(searchTerm)) ||
            question.explanation.toLowerCase().includes(searchTerm);

        return categoryMatch && searchMatch;
    });

    displayQuestions();
}

// Display questions grouped by category
function displayQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    if (filteredQuestions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <h2>No questions found</h2>
                <p>Try adjusting your search or filter.</p>
            </div>
        `;
        return;
    }

    // Group questions by category
    const groupedQuestions = {};
    filteredQuestions.forEach(question => {
        if (!groupedQuestions[question.category]) {
            groupedQuestions[question.category] = [];
        }
        groupedQuestions[question.category].push(question);
    });

    // Display each category
    Object.entries(groupedQuestions).forEach(([categoryName, questions]) => {
        const categorySection = createCategorySection(categoryName, questions);
        container.appendChild(categorySection);
    });

    // Add scroll to top button
    if (!document.getElementById('scroll-top-btn')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.id = 'scroll-top-btn';
        scrollBtn.className = 'scroll-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.appendChild(scrollBtn);
    }
}

// Create category section
function createCategorySection(categoryName, questions) {
    const section = document.createElement('div');
    section.className = 'category-section';

    const weight = categoryData[categoryName].weight;

    section.innerHTML = `
        <div class="category-header">
            <h2 class="category-title">${categoryName}</h2>
            <div class="category-meta">
                <span class="category-count">${questions.length} Questions</span>
                <span class="category-weight">Weight: ${weight}</span>
            </div>
        </div>
    `;

    questions.forEach(question => {
        const questionCard = createQuestionCard(question);
        section.appendChild(questionCard);
    });

    return section;
}

// Create question card
function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';

    const correctOptionLetter = question.correctOption.replace('option_', '').toUpperCase();

    const optionsHTML = question.options.map(option => {
        const isCorrect = option.letter === correctOptionLetter;
        return `
            <div class="option-item ${isCorrect ? 'correct' : ''}">
                <span class="option-letter">${option.letter}</span>
                <span class="option-text">${option.text}</span>
                ${isCorrect ? '<span class="correct-badge">✓ Correct</span>' : ''}
            </div>
        `;
    }).join('');

    card.innerHTML = `
        <span class="question-number">Question #${question.number}</span>
        <div class="question-text">${question.statement}</div>
        <div class="options-list">
            ${optionsHTML}
        </div>
        <div class="explanation-box">
            <span class="explanation-label">💡 Explanation:</span>
            <div class="explanation-text">${question.explanation}</div>
        </div>
    `;

    return card;
}

// Print functionality
function printPreparation() {
    window.print();
}
