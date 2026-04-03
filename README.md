# NSCT Preparation Quiz

An interactive quiz application for NSCT preparation with **2768 real questions** and sound effects on option selection.

## Features

- ✅ **2768 authentic NSCT questions** across 10 categories
- ✅ **Weighted question selection** - 100 questions per quiz based on category weights
- ✅ 120-minute timer with visual warnings
- ✅ **Random sound effects on option selection** 🔊
- ✅ Question navigation with status indicators
- ✅ Progress tracking and auto-save
- ✅ Detailed results with explanations
- ✅ Category-wise score breakdown
- ✅ Quiz history with localStorage
- ✅ Responsive design for mobile and desktop
- ✅ Print/PDF export functionality

## Question Categories

1. **Computer Networks and Cloud Computing** (362 questions, weight: 10)
2. **Programming** (254 questions, weight: 10)
3. **Data Structures And Algorithms** (219 questions, weight: 10)
4. **Operating Systems** (220 questions, weight: 5)
5. **Software Engineering** (260 questions, weight: 10)
6. **Web Development** (260 questions, weight: 10)
7. **AI Machine Learning and Data Analytics** (454 questions, weight: 10)
8. **Cyber Security** (182 questions, weight: 5)
9. **Databases** (222 questions, weight: 10)
10. **Problem Solving And Analytical Skills** (335 questions, weight: 20)

**Total: 2768 questions** - Each quiz randomly selects 100 questions based on category weights.

## Sound Feature

When you select an answer option, a random sound effect will play from the `sounds/` folder. The sound adds an interactive feedback element to enhance user experience.

## Project Structure

```
nsct/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Quiz logic with sound manager
├── questions.json      # 2768 NSCT questions with explanations
├── sounds/             # Folder containing sound effects
│   ├── sound2.mp3
│   └── sound3.mp3
└── README.md           # This file
```

## How to Use

1. Open `index.html` in a web browser
2. Enter your name
3. Click "Start Quiz"
4. Select answers (sounds will play on each selection)
5. Navigate using buttons or question index
6. Submit when complete or time runs out
7. View detailed results and history

## Technologies Used

- HTML5
- CSS3 (with CSS Variables and Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- Web Audio API for sound playback
- LocalStorage for data persistence

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Setup

Simply clone and open `index.html` in your browser. No build process required!

```bash
git clone <repository-url>
cd nsct
# Open index.html in your browser
```

## Customization

### Adding More Questions

Questions are loaded from `questions.json`. The format is:

```json
{
  "Category Name": {
    "weight": 10,
    "questions": [
      {
        "statement": "Question text?",
        "option_a": "Option A",
        "option_b": "Option B",
        "option_c": "Option C",
        "option_d": "Option D",
        "correct_option": "option_a",
        "explanation": "Explanation text"
      }
    ]
  }
}
```

### Changing Quiz Settings

Edit `QUIZ_CONFIG` in `script.js`:

```javascript
const QUIZ_CONFIG = {
    totalQuestions: 100,  // Number of questions per quiz
    timeLimit: 120 * 60,  // Time in seconds (120 minutes)
    storageKey: 'nsct_quiz_history',
    quizProgressKey: 'nsct_quiz_progress'
};
```

### Adding More Sounds

1. Add `.mp3` files to the `sounds/` folder
2. Update the `sounds` array in the `SoundManager` class in `script.js`

## License

This project is open source and available for educational purposes.

## Credits

Created for NSCT preparation practice.
