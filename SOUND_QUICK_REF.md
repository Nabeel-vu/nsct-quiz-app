# Quick Reference: Sound File Locations

## 🎯 Where to Place Your Sound Files

Copy this guide when adding sounds to your app!

### 1. Option Selection Sounds (Click Feedback)
**Location:** `sounds/option-select/`
**Files:** `select1.mp3`, `select2.mp3`, `select3.mp3`, etc.
**Recommended:** Short click/pop sounds (0.1-0.5 seconds)
**Examples:** Click, beep, tap, button press

### 2. Submit Button Sound
**Location:** `sounds/submit-click/`
**File:** `submit.mp3`
**Recommended:** Confirmation sound (0.2-0.8 seconds)
**Examples:** Whoosh, send, confirm

### 3. Alert/Modal Popup Sound
**Location:** `sounds/alert-popup/`
**File:** `popup.mp3`
**Recommended:** Attention-grabbing sound (0.3-1.0 seconds)
**Examples:** Bell, notification, ping

### 4. Loading/Calculating Results Sound
**Location:** `sounds/loading-results/`
**File:** `loading.mp3`
**Recommended:** Ambient/processing sound (2-4 seconds)
**Examples:** Processing, computing, analyzing

### 5. Result Grade Sounds

#### 🏆 Excellent (95-100%)
**Location:** `sounds/grade-excellent/`
**File:** `excellent.mp3`
**Examples:** Applause, fanfare, celebration, victory

#### 🎉 Very Good (80-95%)
**Location:** `sounds/grade-verygood/`
**File:** `verygood.mp3`
**Examples:** Success chime, achievement, tada

#### 👍 Good (60-80%)
**Location:** `sounds/grade-good/`
**File:** `good.mp3`
**Examples:** Positive ding, well done, nice

#### 📊 Average (45-60%)
**Location:** `sounds/grade-average/`
**File:** `average.mp3`
**Examples:** Neutral tone, okay, moderate

#### 📉 Below Average (30-45%)
**Location:** `sounds/grade-belowaverage/`
**File:** `belowavg.mp3`
**Examples:** Encouraging tone, try again, practice more

#### ⚠️ Poor (20-30%)
**Location:** `sounds/grade-poor/`
**File:** `poor.mp3`
**Examples:** Sympathetic tone, oh no (gentle), needs work

#### 😟 Very Poor (5-20%)
**Location:** `sounds/grade-verypoor/`
**File:** `verypoor.mp3`
**Examples:** Disappointed (not harsh), oh dear, study more

#### ❌ Fail (< 5%)
**Location:** `sounds/grade-fail/`
**File:** `fail.mp3`
**Examples:** Sad trombone, game over, oops

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
