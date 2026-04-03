# Sound System Guide

## 🔊 Multi-Scenario Sound System

This application features an advanced sound system with minimal latency and multiple sound scenarios.

## Sound Directories Structure

```
sounds/
├── option-select/          # Plays when user clicks an option
│   ├── select1.mp3
│   ├── select2.mp3
│   └── (add more for variety)
│
├── submit-click/           # Plays when submit button is clicked
│   └── submit.mp3
│
├── alert-popup/            # Plays when confirmation modal appears
│   └── popup.mp3
│
├── loading-results/        # Plays during result calculation
│   └── loading.mp3
│
├── grade-excellent/        # Plays for 95-100% scores
│   └── excellent.mp3
│
├── grade-verygood/         # Plays for 80-95% scores
│   └── verygood.mp3
│
├── grade-good/             # Plays for 60-80% scores
│   └── good.mp3
│
├── grade-average/          # Plays for 45-60% scores
│   └── average.mp3
│
├── grade-belowaverage/     # Plays for 30-45% scores
│   └── belowavg.mp3
│
├── grade-poor/             # Plays for 20-30% scores
│   └── poor.mp3
│
├── grade-verypoor/         # Plays for 5-20% scores
│   └── verypoor.mp3
│
└── grade-fail/             # Plays for below 5% scores
    └── fail.mp3
```

## Sound Scenarios

### 1. Option Selection
- **Trigger**: User clicks any answer option
- **Directory**: `sounds/option-select/`
- **Behavior**: Randomly selects from available files
- **Volume**: 30%
- **Purpose**: Immediate feedback for user interaction

### 2. Submit Button Click
- **Trigger**: User clicks the submit button (top bar)
- **Directory**: `sounds/submit-click/`
- **Behavior**: Plays single sound
- **Volume**: 40%
- **Purpose**: Confirm action initiation

### 3. Alert Popup
- **Trigger**: Confirmation modal appears
- **Directory**: `sounds/alert-popup/`
- **Behavior**: Plays single sound
- **Volume**: 35%
- **Purpose**: Draw attention to modal

### 4. Loading Results
- **Trigger**: After confirming submit, during calculation
- **Directory**: `sounds/loading-results/`
- **Behavior**: Plays during progress animation
- **Volume**: 30%
- **Purpose**: Provide feedback during wait time

### 5. Grade-Based Results

#### Excellent (95-100%)
- **Directory**: `sounds/grade-excellent/`
- **Suggested**: Celebration, applause, victory sounds
- **Volume**: 50%

#### Very Good (80-95%)
- **Directory**: `sounds/grade-verygood/`
- **Suggested**: Success, achievement sounds
- **Volume**: 45%

#### Good (60-80%)
- **Directory**: `sounds/grade-good/`
- **Suggested**: Positive, encouraging sounds
- **Volume**: 40%

#### Average (45-60%)
- **Directory**: `sounds/grade-average/`
- **Suggested**: Neutral, motivational sounds
- **Volume**: 35%

#### Below Average (30-45%)
- **Directory**: `sounds/grade-belowaverage/`
- **Suggested**: Encouraging, try-again sounds
- **Volume**: 35%

#### Poor (20-30%)
- **Directory**: `sounds/grade-poor/`
- **Suggested**: Sympathetic, motivational sounds
- **Volume**: 40%

#### Very Poor (5-20%)
- **Directory**: `sounds/grade-verypoor/`
- **Suggested**: Disappointed but encouraging sounds
- **Volume**: 40%

#### Fail (< 5%)
- **Directory**: `sounds/grade-fail/`
- **Suggested**: Sad trombone, game over sounds
- **Volume**: 45%

## Performance Optimization

### Minimal Latency Features:

1. **Pre-loading**: All sounds are pre-loaded on page load
2. **Audio Cloning**: Uses `cloneNode()` for instant playback
3. **Preload Attribute**: Set to 'auto' for aggressive caching
4. **Promise-based**: Handles playback with modern async patterns
5. **Error Handling**: Graceful degradation if sounds fail

### Technical Implementation:

```javascript
// Sounds are pre-loaded on initialization
await soundManager.initializeSounds();

// Instant playback with cloned audio nodes
soundManager.playOptionSelect();  // < 10ms latency

// Grade-based playback
soundManager.playGradeSound(percentage);
```

## File Format Recommendations

### Optimal Formats (in order):
1. **MP3** (best compatibility)
2. **OGG** (smaller file size)
3. **WAV** (highest quality, larger files)

### File Size Guidelines:
- **Option Select**: < 100KB (short click sounds)
- **Submit/Alert**: < 200KB (notification sounds)
- **Loading**: < 500KB (ambient/loop sounds)
- **Grade Sounds**: < 1MB (celebration/result sounds)

### Duration Recommendations:
- **Option Select**: 0.1-0.5 seconds
- **Submit Click**: 0.2-0.8 seconds
- **Alert Popup**: 0.3-1.0 seconds
- **Loading**: 2-4 seconds
- **Grade Sounds**: 1-5 seconds

## Adding Your Own Sounds

1. **Find or create** appropriate sound files
2. **Convert** to MP3 format (recommended)
3. **Optimize** file size (compress if needed)
4. **Name** appropriately (e.g., `select1.mp3`, `excellent.mp3`)
5. **Place** in the correct directory
6. **Update** the file path in `script.js` if using different names

### Updating Sound Paths

Edit the `soundPaths` object in `script.js`:

```javascript
this.soundPaths = {
    optionSelect: [
        'sounds/option-select/select1.mp3',
        'sounds/option-select/select2.mp3',
        'sounds/option-select/select3.mp3'  // Add more
    ],
    // ... other scenarios
};
```

## Volume Control

Default volumes are set in the `SoundManager` class:

```javascript
this.volumes = {
    optionSelect: 0.3,        // 30%
    submitClick: 0.4,         // 40%
    alertPopup: 0.35,         // 35%
    loadingResults: 0.3,      // 30%
    gradeExcellent: 0.5,      // 50%
    // ... etc
};
```

Adjust these values (0.0 - 1.0) to your preference.

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (may require user interaction first)
- ⚠️ Mobile browsers: Some may require user gesture before first sound

## Troubleshooting

### Sound not playing?
1. Check browser console for errors
2. Verify file paths are correct
3. Ensure files exist in directories
4. Check file format compatibility
5. Try user interaction (click) before sound plays

### High latency?
1. Reduce file sizes
2. Use MP3 format
3. Check network speed (if hosted)
4. Ensure pre-loading is complete

### Wrong sound playing?
1. Verify file names match paths in code
2. Check directory structure
3. Clear browser cache

## Free Sound Resources

- **Freesound.org**: High-quality sound effects
- **Zapsplat.com**: Free sound effects library
- **Mixkit.co**: Free sound effects and music
- **BBC Sound Effects**: Archive of sound effects
- **YouTube Audio Library**: Free sounds and music

## License Notes

- Ensure you have rights to use any sound files
- Attribute sounds if required by license
- Commercial use may require paid licenses
- Check each sound resource's terms

---

**Need help?** Check the main README.md or inspect the SoundManager class in script.js.
