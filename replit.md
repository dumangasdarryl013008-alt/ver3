# Ele Types - Elegant Typing Test Tool

## Overview
An elegant typing test website built with React (Create React App). Features multiple typing modes, themes, vocabulary learning tools, and a touch-typing trainer.

**Current State**: Fully functional with cat-themed UI, start screen with game intro, fair badge system with anti-cheat measures, and realistic WPM calculations
**Tech Stack**: React 18, Create React App, Material-UI, Recharts, Styled Components
**Last Updated**: November 17, 2025

## Project Structure
```
├── public/          # Static assets and HTML template
├── src/
│   ├── assets/      # Sounds, vocab data, images
│   ├── components/  # React components
│   │   ├── common/  # Shared components
│   │   └── features/# Feature-specific components
│   ├── constants/   # App constants and data
│   ├── hooks/       # Custom React hooks
│   ├── scripts/     # Utility scripts
│   ├── style/       # Theme and global styles
│   └── worker/      # Web workers for performance
└── package.json     # Dependencies and scripts
```

## Key Features
1. **Typing Test**: Words and sentence modes with realistic stats (WPM, accuracy, errors)
   - WPM capped at 200 WPM (net) and 250 WPM (raw) for realistic scoring
   - Minimum 2-second elapsed time required before calculating WPM
   - Prevents unrealistic speed calculations at the start of sessions
2. **Badge/Achievement System**: Fair achievement tracking with enhanced anti-cheat measures
   - 47 unlockable badges: 10 per mode (Normal, Hard, Combo, Survival) + 7 for QWERTY Trainer
   - Tiered badges: Bronze 🥉, Silver 🥈, Gold 🥇, Star 🌟
   - Enhanced time-based validation: minimum 30-second session required to unlock badges
   - Anti-farming cooldown: 5-second minimum between badge-awarding sessions
   - WPM validation: rejects sessions outside 5-200 WPM range (no mutation)
   - Accuracy validation: rejects sessions with >100% accuracy
   - Session timestamp tracking only updates when badges are actually unlocked
   - Live progress indicators with percentage, color-coded alerts ("Almost there!" at 80%+)
   - Animated pop-up notifications when badges are earned
   - Persistent badge tracking via localStorage
   - Golden trophy button in footer with "Total Completed Badges" counter
3. **Background Music**: Smart auto-playing looped background music with toggle control
   - Cute and happy playful background music (no copyright)
   - Moderate volume (30%) for comfortable typing experience
   - Automatically starts when player clicks "Start Game" button
   - Handles browser autoplay restrictions seamlessly
   - On/off toggle button in footer menu with music note icon
   - Persistent setting via localStorage
4. **Vocabulary Cards**: GRE, TOEFL, CET4/6 word lists for learning
5. **Touch-Typing Trainer**: QWERTY keyboard trainer
6. **Themes**: 13+ static themes + 4 dynamic WebGL themes
7. **Sound Effects**: Cherry blue, keyboard, typewriter sounds
8. **Modes**: Focus mode, Ultra Zen mode, Coffee (free typing) mode
9. **Cat-Themed UI**: Playful cat face logo, paw print decorations, orange/cream color accents
10. **Start Screen**: Welcome screen displayed when the game loads
   - Game title "TypeBlast" with cat face icon
   - Centered "Start Game" button with hover animations
   - Footer credits: "Project from 12-Peter, Group 5. School Year 2025–2026."
   - Cat paw background decorations matching main interface
   - Clean state-based show/hide logic
11. **Distraction-Free Typing**: Bottom menu automatically hides when typing starts

## Development Setup

### Running the App
- **Development Server**: `npm start` (configured for port 5000)
- **Build**: `npm run build`
- **Test**: `npm run test`

### Replit Configuration
- Port: 5000 (required for Replit)
- Host: 0.0.0.0 (allows Replit proxy)
- Host check disabled for iframe preview support
- WebSocket port: 0 (auto-detect)

## Environment Notes
- Uses localStorage for settings persistence (theme, game mode, sound preferences, badge progress, background music)
- Badge data stored in localStorage: unlockedBadges array and badgeStats object
- Background music setting stored in localStorage: backgroundMusic boolean
- No backend - fully client-side application
- No environment variables or API keys required
- Audio files (background music, sound effects) and vocabulary data bundled in assets

## Recent Changes
- **2025-11-17 (Latest)**: Background Music Auto-Play on Start Game
  - Modified background music to start playing when "Start Game" button is clicked
  - Music no longer attempts to auto-play on page load
  - Provides cleaner user experience tied to game start action
  - All changes reviewed and approved by architect

- **2025-11-17**: Start Screen Implementation
  - Created new StartScreen component with game intro when app loads
  - Displays "TypeBlast" title with cat face icon
  - Centered "Start Game" button with hover animations and orange theme
  - Footer credits: "Project from 12-Peter, Group 5. School Year 2025–2026."
  - Cat paw background decorations matching main interface style
  - Uses styled-components only (no MUI) to avoid styling engine conflicts
  - State-based show/hide logic: StartScreen on load, main game after clicking Start Game
  - Updated app name in manifest.json and index.html to "TypeBlast – Typing Games"
  - All changes reviewed and approved by architect

- **2025-11-13 (Latest Session)**: Smart Auto-Start Background Music
  - Enhanced BackgroundMusic component to handle browser autoplay restrictions
  - Music now attempts to auto-play on page load
  - If blocked by browser, automatically starts on first user interaction (typing, clicking, touching)
  - Retries playback until successful, then removes event listeners
  - Properly handles all edge cases with memoized callbacks and correct dependency arrays
  - All changes reviewed and approved by architect

- **2025-11-13 (Earlier)**: Enhanced Badge System with Stricter Anti-Cheat & Expanded Badge Collection
  - **Badge Text Update**: Changed "badges unlocked" to "Total Completed Badges" for clarity
  - **Enhanced Anti-Cheat Validation**:
    - Increased minimum session time from 10 to 30 seconds
    - Added 5-second cooldown between badge-awarding sessions to prevent farming
    - Added WPM range validation (5-200 WPM) that rejects (not caps) unrealistic scores
    - Added accuracy validation to reject >100% accuracy
    - Fixed timestamp update to only fire when badges are actually unlocked
    - Fixed stale closure bug in useCallback dependency array
    - Removed stats mutation - validation now uses read-only comparisons
  - **Expanded Badge Collection** (from 33 to 47 total badges):
    - Normal mode: Added 4 new badges (Speed Demon, Marathon Typer, Perfect Session, Elite Performer)
    - Hard mode: Added 4 new badges (Pressure Cooker, Speed & Accuracy Combo, Error-Free Streak, Hard Mode Legend)
    - Combo mode: Added 4 new badges (Combo Starter, Combo Builder, Unstoppable Chain, Combo Master Supreme)
    - Survival mode: Added 4 new badges (Quick Survivor, Bonus Hunter, Ultimate Survivor, Survival Perfectionist)
  - **New Badge Requirement Types**: words_typed, wpm_and_accuracy, consecutive_perfect_rounds, survival_time_and_accuracy
  - **UI Improvements**: Changed results screen background from transparent to solid grey (#3C3C3C) for better readability
  - All changes reviewed and approved by architect - anti-cheat validation is now bulletproof
  
- **2025-11-13**: Fair Badge System & Realistic WPM Calculations
  - Added time-based badge validation: 10-second minimum session time required
  - Implemented WPM caps: 200 WPM (net), 250 WPM (raw) to prevent cheating
  - Added minimum 2-second elapsed time before WPM calculation begins
  - Added session timestamp tracking to badge system for monitoring
  - Removed all "Back" buttons from result screens (only "Try Again" remains)
  - Cleaned up unused imports (ArrowBackIcon) and variables
  - All changes reviewed and approved by architect

- **2025-11-12**: Background Music Feature
  - Added auto-playing looped background music from GitHub repository
  - Created BackgroundMusic component with 30% volume for comfortable listening
  - Implemented on/off toggle button in footer menu next to sentence mode
  - Music plays automatically on app load and loops continuously
  - Toggle control shows music note icon when on, crossed-out icon when off
  - Setting persists across browser sessions via localStorage
  - Downloaded "Play With Me - Cute Happy Playful Background Music" (no copyright)
  - All changes reviewed and approved by architect

- **2025-11-11**: Comprehensive Badge/Achievement System
  - Implemented 33 badges across all 5 game modes (Normal, Hard, Combo, Survival, QWERTY Trainer)
  - Created BadgeConfig.js with tiered badge definitions and unlock requirements
  - Built useBadgeTracking.js hook for badge progress tracking and localStorage persistence
  - Developed AchievementsPanel component with tabbed interface for viewing all badges
  - Created BadgeProgressIndicator with visual progress bars, percentage display, and color-coded alerts
  - Implemented BadgeNotification component with animated pop-up "🎉 Congratulations!" messages
  - Integrated badge tracking into TypeBox component to track WPM, accuracy, errors, consecutive improvements
  - Added golden trophy button (🏆) to footer menu with "View your progress" text
  - Fixed category identifier mismatch and Set rehydration bugs for production readiness
  - All changes reviewed and approved by architect

- **2025-11-09**: Cat-themed UI enhancements
  - Replaced keyboard icon with custom cat face SVG logo
  - Updated tagline to "Ready to type? Practice your typing skills with style!"
  - Added floating cat paw print decoration at bottom-right
  - Implemented auto-hide functionality: bottom menu hides when typing starts
  - Added Back button in results screen to restore menu visibility
  - Applied cat-themed styling: rounded buttons, orange/cream accents, playful hover animations
  - Removed Spotify player integration
  - Made results box more compact (max-width 700px vs 1000px)

- **2025-10-08**: Imported from GitHub and configured for Replit
  - Modified package.json start script to run on port 5000 with host 0.0.0.0
  - Disabled host check for Replit proxy compatibility
  - Set up development workflow
