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

## Sound Feature 🔊

The app includes an **advanced multi-scenario sound system** with minimal latency:

### Sound Scenarios:

1. **Option Selection** - Plays when clicking answer options
2. **Submit Button** - Plays when clicking submit
3. **Alert Popup** - Plays when confirmation modal appears
4. **Loading Results** - Plays during result calculation with progress animation
5. **Grade-Based Results** - Different sounds for different score ranges:
   - 🏆 **Excellent** (95-100%)
   - 🎉 **Very Good** (80-95%)
   - 👍 **Good** (60-80%)
   - 📊 **Average** (45-60%)
   - 📉 **Below Average** (30-45%)
   - ⚠️ **Poor** (20-30%)
   - 😟 **Very Poor** (5-20%)
   - ❌ **Fail** (< 5%)

All sounds are pre-loaded for **< 10ms playback latency**. See [SOUND_GUIDE.md](SOUND_GUIDE.md) for detailed documentation.

## Project Structure

```
nsct/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Quiz logic with sound manager
├── questions.json      # 2768 NSCT questions with explanations
├── sounds/             # Multi-scenario sound system
│   ├── option-select/      # Option click sounds (2 files)
│   ├── submit-click/       # Submit button sound
│   ├── alert-popup/        # Modal popup sound
│   ├── loading-results/    # Loading animation sound
│   ├── grade-excellent/    # 95-100% score sound
│   ├── grade-verygood/     # 80-95% score sound
│   ├── grade-good/         # 60-80% score sound
│   ├── grade-average/      # 45-60% score sound
│   ├── grade-belowaverage/ # 30-45% score sound
│   ├── grade-poor/         # 20-30% score sound
│   ├── grade-verypoor/     # 5-20% score sound
│   └── grade-fail/         # <5% score sound
├── SOUND_GUIDE.md      # Detailed sound system documentation
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

Place sound files in appropriate directories under `sounds/`. See [SOUND_GUIDE.md](SOUND_GUIDE.md) for:
- Directory structure and purpose
- File format recommendations
- Optimal file sizes and durations
- Volume control
- Free sound resources

**Quick Example:**
```bash
# Add option selection sounds
sounds/option-select/select3.mp3
sounds/option-select/select4.mp3

# Add custom grade sounds
sounds/grade-excellent/celebration.mp3
```

The system automatically detects and uses all MP3 files in each directory.

## License

This project is open source and available for educational purposes.

## Credits

Created for NSCT preparation practice.
