# Quick Reference: Adding Sound Files

## 🎯 How to Add Your Sound Files (ANY NAME!)

### Step 1: Place Your MP3 File
Drop your MP3 file into the appropriate directory. **Use ANY filename you want!**

### Step 2: Update the Config
Edit `script.js` and find the `SOUND_FILES` configuration at the top (around line 11):

```javascript
const SOUND_FILES = {
    optionSelect: [
        'error_CDOxCYm.mp3',
        'your-new-sound.mp3'  // ← Add your filename here!
    ],
    // ... other scenarios
};
```

### Step 3: Done! 🎉
The system automatically:
- ✅ Builds the full path
- ✅ Pre-loads the audio
- ✅ Randomly selects from your sounds
- ✅ Handles missing files gracefully

## 📁 Directory Mapping

### 1. Option Selection Sounds (Click Feedback)
**Directory:** `sounds/option-select/`
**Config Key:** `optionSelect`
**Current files:** error_CDOxCYm.mp3, faahhhhhhh.mp3, gey-echo.mp3

```javascript
optionSelect: [
    'error_CDOxCYm.mp3',
    'faahhhhhhh.mp3',
    'gey-echo.mp3',
    'any-name-you-want.mp3'  // Add more!
],
```

### 2. Submit Button Sound
**Directory:** `sounds/submit-click/`
**Config Key:** `submitClick`

```javascript
submitClick: [
    'submit.mp3',
    'send-whoosh.mp3'  // Add alternatives
],
```

### 3. Alert/Modal Popup Sound
**Directory:** `sounds/alert-popup/`
**Config Key:** `alertPopup`

```javascript
alertPopup: [
    'popup.mp3',
    'notification-bell.mp3'
],
```

### 4. Loading/Calculating Results Sound
**Directory:** `sounds/loading-results/`
**Config Key:** `loadingResults`

```javascript
loadingResults: [
    'loading.mp3',
    'processing-beep.mp3'
],
```

### 5. Grade Sounds

#### 🏆 Excellent (95-100%)
**Directory:** `sounds/grade-excellent/`
**Config Key:** `gradeExcellent`

```javascript
gradeExcellent: [
    'excellent.mp3',
    'applause.mp3',
    'victory-fanfare.mp3'
],
```

#### 🎉 Very Good (80-95%)
**Directory:** `sounds/grade-verygood/`
**Config Key:** `gradeVeryGood`

```javascript
gradeVeryGood: [
    'verygood.mp3',
    'success-chime.mp3'
],
```

#### 👍 Good (60-80%)
**Directory:** `sounds/grade-good/`
**Config Key:** `gradeGood`

```javascript
gradeGood: [
    'good.mp3',
    'well-done.mp3'
],
```

#### 📊 Average (45-60%)
**Directory:** `sounds/grade-average/`
**Config Key:** `gradeAverage`

```javascript
gradeAverage: [
    'average.mp3',
    'okay-sound.mp3'
],
```

#### 📉 Below Average (30-45%)
**Directory:** `sounds/grade-belowaverage/`
**Config Key:** `gradeBelowAverage`

```javascript
gradeBelowAverage: [
    'belowavg.mp3',
    'try-again.mp3'
],
```

#### ⚠️ Poor (20-30%)
**Directory:** `sounds/grade-poor/`
**Config Key:** `gradePoor`

```javascript
gradePoor: [
    'poor.mp3',
    'oh-no-gentle.mp3'
],
```

#### 😟 Very Poor (5-20%)
**Directory:** `sounds/grade-verypoor/`
**Config Key:** `gradeVeryPoor`

```javascript
gradeVeryPoor: [
    'verypoor.mp3',
    'disappointed.mp3'
],
```

#### ❌ Fail (< 5%)
**Directory:** `sounds/grade-fail/`
**Config Key:** `gradeFail`

```javascript
gradeFail: [
    'fail.mp3',
    'sad-trombone.mp3',
    'game-over.mp3'
],
```

## 🎯 Complete Example

Let's say you want to add 3 new option click sounds:

1. **Place files:**
   ```
   sounds/option-select/click1.mp3
   sounds/option-select/pop-sound.mp3
   sounds/option-select/beep-123.mp3
   ```

2. **Update script.js:**
   ```javascript
   const SOUND_FILES = {
       optionSelect: [
           'error_CDOxCYm.mp3',
           'faahhhhhhh.mp3',
           'gey-echo.mp3',
           'click1.mp3',           // ← New!
           'pop-sound.mp3',        // ← New!
           'beep-123.mp3'          // ← New!
       ],
       // ... rest of config
   };
   ```

3. **Done!** Your sounds will randomly play when clicking options.

## 💡 Pro Tips

### Multiple Sounds for Variety
Add multiple files to any category for random selection:
```javascript
optionSelect: [
    'sound1.mp3',
    'sound2.mp3',
    'sound3.mp3',
    'sound4.mp3'  // System picks randomly!
],
```

### Fallback Sounds
If a sound file is missing, the system logs an error but continues working.

### Testing New Sounds
After adding sounds:
1. Refresh the browser
2. Open Console (F12)
3. Look for "Sound Manager initialized" message
4. Test the scenario that uses your sound

### File Naming
Use descriptive names for easy management:
- ✅ `option-click-soft.mp3`
- ✅ `celebration-applause.mp3`
- ✅ `fail-trombone.mp3`
- ❌ `sound1.mp3` (not descriptive)
- ❌ `asdf.mp3` (confusing)

## 🎼 Free Sound Resources

### General Sound Effects
- **Freesound.org** - Huge library, free account needed
- **Zapsplat.com** - No attribution required (free tier)
- **Mixkit.co** - High quality, completely free
- **Pixabay** - Free sounds, no attribution
- **Soundbible.com** - Public domain sounds

### UI/Button Sounds
- Search: "ui click", "button press", "interface sound"
- Search: "notification", "alert", "popup"
- Search: "success", "achievement", "level up"

### Result/Grade Sounds
- Search: "applause", "celebration", "fanfare"
- Search: "success", "achievement", "win"
- Search: "fail", "game over", "sad trombone"
- Search: "neutral", "moderate", "average"

## 📋 Quick Checklist

Before adding sounds, ensure:
- [ ] Sound is in MP3 format
- [ ] File size is optimized (< 1MB)
- [ ] Duration is appropriate for scenario
- [ ] Volume is reasonable (normalize if needed)
- [ ] File name matches expected name OR update script.js
- [ ] You have rights to use the sound

## 🔧 Testing Your Sounds

1. Open `index.html` in browser
2. Open browser console (F12)
3. Start quiz
4. Test each scenario:
   - Click options
   - Click submit button
   - See confirmation modal
   - Watch loading screen
   - View results (try to get different scores)

## 💡 Pro Tips

1. **Consistency:** Keep similar volume levels across all sounds
2. **Duration:** Shorter is usually better for UI feedback
3. **Quality:** Use 128kbps MP3 for good quality/size balance
4. **Variety:** Add multiple option-select sounds for variety
5. **License:** Always check license before using

## 🛠️ Editing Sound Files

### Recommended Tools (Free)
- **Audacity** - Full-featured audio editor
- **Online Audio Converter** - Convert formats
- **MP3Cut** - Trim MP3 files online
- **Audio Compressor** - Reduce file size

### Common Edits
- Trim silence from start/end
- Normalize volume
- Convert to MP3
- Reduce bitrate to compress
- Fade in/out for smoother playback

## ⚙️ Custom Sound Paths

If you want different filenames, edit `script.js`:

```javascript
// Find the SoundManager class
this.soundPaths = {
    optionSelect: [
        'sounds/option-select/click1.mp3',  // Change here
        'sounds/option-select/click2.mp3'
    ],
    submitClick: ['sounds/submit-click/send.mp3'],  // Change here
    // ... etc
};
```

---

**Need more help?** Check `SOUND_GUIDE.md` for detailed documentation!
