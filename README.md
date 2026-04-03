# NSCT Preparation Quiz

An interactive quiz application for NSCT preparation with sound effects on option selection.

## Features

- ✅ 20 sample questions across multiple categories
- ✅ 120-minute timer with visual warnings
- ✅ **Random sound effects on option selection** (NEW!)
- ✅ Question navigation with status indicators
- ✅ Progress tracking and auto-save
- ✅ Detailed results with category-wise scores
- ✅ Quiz history with localStorage
- ✅ Responsive design for mobile and desktop
- ✅ Print/PDF export functionality

## Sound Feature

When you select an answer option, a random sound effect will play from the `sounds/` folder. The sound adds an interactive feedback element to enhance user experience.

## Project Structure

```
nsct/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Quiz logic with sound manager
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

Edit the `sampleQuestions` array in `script.js`:

```javascript
{
    id: 21,
    question: "Your question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: 0, // Index of correct answer (0-3)
    category: "Category Name"
}
```

### Adding More Sounds

1. Add `.mp3` files to the `sounds/` folder
2. Update the `sounds` array in the `SoundManager` class in `script.js`

## License

This project is open source and available for educational purposes.

## Credits

Created for NSCT preparation practice.
