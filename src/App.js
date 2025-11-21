import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox/TypeBox";
import SentenceBox from "./components/features/SentenceBox/SentenceBox";
import Logo from "./components/common/Logo";
import MusicPlayerSnackbar from "./components/features/MusicPlayer/MusicPlayerSnackbar";
import FooterMenu from "./components/common/FooterMenu";
import FreeTypingBox from "./components/features/FreeTypingBox";
import Leaderboard from "./components/features/Leaderboard/Leaderboard";
import {
  GAME_MODE,
  GAME_MODE_DEFAULT,
  GAME_MODE_SENTENCE,
  GAME_MODE_NORMAL,
} from "./constants/Constants";
import useLocalPersistState from "./hooks/useLocalPersistState";
import DefaultKeyboard from "./components/features/Keyboard/DefaultKeyboard";
import WordsCard from "./components/features/WordsCard/WordsCard";
import {
  SOUND_MODE,
  soundOptions,
  DEFAULT_SOUND_TYPE,
  DEFAULT_SOUND_TYPE_KEY,
} from "./components/features/sound/sound";
import DynamicBackground from "./components/common/DynamicBackground";
import useBadgeTracking from "./hooks/useBadgeTracking";
import AchievementsPanel from "./components/features/Badges/AchievementsPanel";
import BadgeNotification from "./components/features/Badges/BadgeNotification";
import BackgroundMusic from "./components/common/BackgroundMusic";
import StartScreen from "./components/common/StartScreen";

function App() {
  // Game started state
  const [gameStarted, setGameStarted] = useState(false);
  
  // Player name state
  const [playerName, setPlayerName] = useLocalPersistState("", "playerName");
  
  // Leaderboard states
  const [regularLeaderboard, setRegularLeaderboard] = useLocalPersistState([], "regularLeaderboard");
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  
  // Typing game mode (Normal, Hard, Survival, Combo)
  const [typingGameMode, setTypingGameMode] = useLocalPersistState(GAME_MODE_NORMAL, "typingGameMode");

  // Badge tracking
  const {
    unlockedBadges,
    badgeStats,
    recentlyUnlocked,
    checkAndUnlockBadges,
    updateBadgeStats,
    resetBadgeProgress,
    isBadgeUnlocked,
    getUnlockedCount,
  } = useBadgeTracking();

  const [achievementsOpen, setAchievementsOpen] = useState(false);
  
  // localStorage persist theme setting
  const [theme, setTheme] = useState(() => {
    const stickyTheme = window.localStorage.getItem("theme");
    if (stickyTheme !== null) {
      const localTheme = JSON.parse(stickyTheme);
      const upstreamTheme = themesOptions.find(
        (e) => e.label === localTheme.label
      ).value;
      // we will do a deep equal here. In case we want to support customized local theme.
      const isDeepEqual = localTheme === upstreamTheme;
      return isDeepEqual ? localTheme : upstreamTheme;
    }
    return defaultTheme;
  });

  // local persist game mode setting
  const [soundMode, setSoundMode] = useLocalPersistState(false, SOUND_MODE);

  const [soundType, setSoundType] = useLocalPersistState(
    DEFAULT_SOUND_TYPE,
    DEFAULT_SOUND_TYPE_KEY
  );

  // local persist game mode setting
  const [gameMode, setGameMode] = useLocalPersistState(
    GAME_MODE_DEFAULT,
    GAME_MODE
  );

  const handleGameModeChange = (currGameMode) => {
    setGameMode(currGameMode);
  };

  // localStorage persist focusedMode setting
  const [isFocusedMode, setIsFocusedMode] = useState(
    localStorage.getItem("focused-mode") === "true"
  );

  // musicMode setting - auto-enabled for Spotify autoplay
  const [isMusicMode, setIsMusicMode] = useState(true);

  // ultraZenMode setting
  const [isUltraZenMode, setIsUltraZenMode] = useState(
    localStorage.getItem("ultra-zen-mode") === "true"
  );

  // coffeeMode setting
  const [isCoffeeMode, setIsCoffeeMode] = useState(false);

  // trainer mode setting
  const [isTrainerMode, setIsTrainerMode] = useState(false);

  // words card mode
  const [isWordsCardMode, setIsWordsCardMode] = useLocalPersistState(
    false,
    "IsInWordsCardMode"
  );

  // background music setting
  const [isBackgroundMusicOn, setIsBackgroundMusicOn] = useLocalPersistState(
    true,
    "backgroundMusic"
  );

  // typing status (waiting, started, finished)
  const [typingStatus, setTypingStatus] = useState("waiting");

  const isWordGameMode =
    gameMode === GAME_MODE_DEFAULT &&
    !isCoffeeMode &&
    !isTrainerMode &&
    !isWordsCardMode;
  const isSentenceGameMode =
    gameMode === GAME_MODE_SENTENCE &&
    !isCoffeeMode &&
    !isTrainerMode &&
    !isWordsCardMode;

  const handleThemeChange = (e) => {
    window.localStorage.setItem("theme", JSON.stringify(e.value));
    setTheme(e.value);
  };

  const handleSoundTypeChange = (e) => {
    setSoundType(e.label);
  };

  const toggleFocusedMode = () => {
    setIsFocusedMode(!isFocusedMode);
  };

  const toggleSoundMode = () => {
    setSoundMode(!soundMode);
  };

  const toggleMusicMode = () => {
    setIsMusicMode(!isMusicMode);
  };

  const toggleUltraZenMode = () => {
    setIsUltraZenMode(!isUltraZenMode);
  };

  const toggleCoffeeMode = () => {
    setIsCoffeeMode(!isCoffeeMode);
    setIsTrainerMode(false);
    setIsWordsCardMode(false);
  };

  const toggleTrainerMode = () => {
    setIsTrainerMode(!isTrainerMode);
    setIsCoffeeMode(false);
    setIsWordsCardMode(false);
  };

  const toggleWordsCardMode = () => {
    setIsTrainerMode(false);
    setIsCoffeeMode(false);
    setIsWordsCardMode(!isWordsCardMode);
  };

  const toggleBackgroundMusic = () => {
    setIsBackgroundMusicOn(!isBackgroundMusicOn);
  };

  const handleAddToLeaderboard = (score, mode, accuracy, incorrectCount) => {
    const name = playerName.trim() || "Anonymous";
    const newEntry = {
      playerName: name,
      score: score,
      mode: mode,
      accuracy: accuracy || 0,
      incorrectCount: incorrectCount || 0,
      date: new Date().toISOString(),
    };
    const updatedLeaderboard = [...regularLeaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    setRegularLeaderboard(updatedLeaderboard);
  };


  useEffect(() => {
    localStorage.setItem("focused-mode", isFocusedMode);
  }, [isFocusedMode]);

  useEffect(() => {
    localStorage.setItem("ultra-zen-mode", isUltraZenMode);
  }, [isUltraZenMode]);

  const textInputRef = useRef(null);
  const focusTextInput = () => {
    textInputRef.current && textInputRef.current.focus();
  };

  const textAreaRef = useRef(null);
  const focusTextArea = () => {
    textAreaRef.current && textAreaRef.current.focus();
  };

  const sentenceInputRef = useRef(null);
  const focusSentenceInput = () => {
    sentenceInputRef.current && sentenceInputRef.current.focus();
  };

  useEffect(() => {
    if (isWordGameMode) {
      focusTextInput();
      return;
    }
    if (isSentenceGameMode) {
      focusSentenceInput();
      return;
    }
    if (isCoffeeMode) {
      focusTextArea();
      return;
    }
    return;
  }, [
    theme,
    isFocusedMode,
    isMusicMode,
    isCoffeeMode,
    isWordGameMode,
    isSentenceGameMode,
    soundMode,
    soundType,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <>
        <BackgroundMusic isPlaying={isBackgroundMusicOn && gameStarted} />
        <DynamicBackground theme={theme}></DynamicBackground>
        <GlobalStyles />
        {!gameStarted ? (
          <StartScreen onStartGame={() => setGameStarted(true)} />
        ) : (
        <div className="canvas">
          {/* Floating cat paw decorations */}
          <div className="floating-cat-paws">
            {[
              { top: '5%', left: '2%', size: 55, rotate: -20, opacity: 0.13 },
              { top: '8%', right: '3%', size: 48, rotate: 35, opacity: 0.11 },
              { top: '18%', left: '7%', size: 52, rotate: -15, opacity: 0.12 },
              { top: '22%', right: '12%', size: 50, rotate: 25, opacity: 0.10 },
              { top: '32%', left: '5%', size: 46, rotate: 18, opacity: 0.11 },
              { top: '38%', right: '8%', size: 54, rotate: -28, opacity: 0.12 },
              { top: '48%', left: '10%', size: 49, rotate: 32, opacity: 0.10 },
              { top: '52%', right: '15%', size: 51, rotate: -12, opacity: 0.11 },
              { top: '62%', left: '4%', size: 47, rotate: 22, opacity: 0.09 },
              { top: '68%', right: '6%', size: 53, rotate: -25, opacity: 0.12 },
              { top: '78%', left: '8%', size: 50, rotate: 15, opacity: 0.10 },
              { top: '82%', right: '10%', size: 48, rotate: -18, opacity: 0.11 },
              { bottom: '8%', left: '12%', size: 52, rotate: 28, opacity: 0.11 },
              { bottom: '12%', right: '14%', size: 49, rotate: -22, opacity: 0.10 },
              { top: '42%', left: '18%', size: 45, rotate: -8, opacity: 0.09 },
            ].map((paw, index) => (
              <div 
                key={index}
                className="cat-paw" 
                style={{ 
                  position: 'absolute', 
                  ...paw, 
                  transform: `rotate(${paw.rotate}deg)`,
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              >
                <svg width={paw.size} height={paw.size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 3px 6px rgba(255, 152, 0, 0.3))' }}>
                  {/* Main pad - better shape */}
                  <ellipse cx="50" cy="70" rx="18" ry="22" fill="#FF9800" opacity="0.85"/>
                  <ellipse cx="50" cy="68" rx="14" ry="18" fill="#FFB74D" opacity="0.6"/>
                  
                  {/* Toe pads - improved positioning and shape */}
                  {/* Left toe */}
                  <ellipse cx="28" cy="42" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
                  <ellipse cx="28" cy="41" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
                  
                  {/* Middle left toe */}
                  <ellipse cx="42" cy="32" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
                  <ellipse cx="42" cy="31" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
                  
                  {/* Middle right toe */}
                  <ellipse cx="58" cy="32" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
                  <ellipse cx="58" cy="31" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
                  
                  {/* Right toe */}
                  <ellipse cx="72" cy="42" rx="9" ry="11" fill="#FF9800" opacity="0.85"/>
                  <ellipse cx="72" cy="41" rx="6" ry="8" fill="#FFB74D" opacity="0.5"/>
                </svg>
              </div>
            ))}
          </div>
          <Logo 
            isFocusedMode={isFocusedMode} 
            isMusicMode={isMusicMode}
            playerName={playerName}
            setPlayerName={setPlayerName}
          ></Logo>
          {isWordGameMode && (
            <TypeBox
              isUltraZenMode={isUltraZenMode}
              textInputRef={textInputRef}
              isFocusedMode={isFocusedMode}
              soundMode={soundMode}
              theme={theme}
              soundType={soundType}
              key="type-box"
              handleInputFocus={() => focusTextInput()}
              typingGameMode={typingGameMode}
              setTypingGameMode={setTypingGameMode}
              onAddToLeaderboard={handleAddToLeaderboard}
              onStatusChange={setTypingStatus}
              badgeStats={badgeStats}
              updateBadgeStats={updateBadgeStats}
              checkAndUnlockBadges={checkAndUnlockBadges}
            ></TypeBox>
          )}
          {isSentenceGameMode && (
            <SentenceBox
              sentenceInputRef={sentenceInputRef}
              isFocusedMode={isFocusedMode}
              soundMode={soundMode}
              soundType={soundType}
              key="sentence-box"
              handleInputFocus={() => focusSentenceInput()}
            ></SentenceBox>
          )}
          {isCoffeeMode && !isTrainerMode && !isWordsCardMode && (
            <FreeTypingBox
              textAreaRef={textAreaRef}
              soundMode={soundMode}
              soundType={soundType}
            />
          )}
          {isTrainerMode && !isCoffeeMode && !isWordsCardMode && (
            <DefaultKeyboard
              soundMode={soundMode}
              soundType={soundType}
              onAddToLeaderboard={handleAddToLeaderboard}
              playerName={playerName}
            ></DefaultKeyboard>
          )}
          {isWordsCardMode && !isCoffeeMode && !isTrainerMode && (
            <WordsCard soundMode={soundMode} soundType={soundType}></WordsCard>
          )}
          {typingStatus !== "started" && (
            <div className="bottomBar">
              <FooterMenu
                isWordGameMode={isWordGameMode}
                themesOptions={themesOptions}
                theme={theme}
                soundMode={soundMode}
                toggleSoundMode={toggleSoundMode}
                soundOptions={soundOptions}
                soundType={soundType}
                toggleUltraZenMode={toggleUltraZenMode}
                handleSoundTypeChange={handleSoundTypeChange}
                handleThemeChange={handleThemeChange}
                toggleFocusedMode={toggleFocusedMode}
                toggleMusicMode={toggleMusicMode}
                toggleCoffeeMode={toggleCoffeeMode}
                isCoffeeMode={isCoffeeMode}
                isMusicMode={isMusicMode}
                isUltraZenMode={isUltraZenMode}
                isFocusedMode={isFocusedMode}
                gameMode={gameMode}
                handleGameModeChange={handleGameModeChange}
                isTrainerMode={isTrainerMode}
                toggleTrainerMode={toggleTrainerMode}
                isWordsCardMode={isWordsCardMode}
                toggleWordsCardMode={toggleWordsCardMode}
                onOpenLeaderboard={() => setLeaderboardOpen(true)}
                onOpenAchievements={() => setAchievementsOpen(true)}
                isBackgroundMusicOn={isBackgroundMusicOn}
                toggleBackgroundMusic={toggleBackgroundMusic}
              ></FooterMenu>
            </div>
          )}
          {typingStatus !== "started" && (
            <div className="cat-paw-footer">
              <svg width="40" height="40" viewBox="0 0 48 48" style={{ opacity: 0.6 }}>
                <ellipse cx="24" cy="32" rx="8" ry="10" fill="currentColor"/>
                <circle cx="14" cy="20" r="5" fill="currentColor"/>
                <circle cx="22" cy="16" r="5" fill="currentColor"/>
                <circle cx="26" cy="16" r="5" fill="currentColor"/>
                <circle cx="34" cy="20" r="5" fill="currentColor"/>
              </svg>
            </div>
          )}
          <Leaderboard
            open={leaderboardOpen}
            onClose={() => setLeaderboardOpen(false)}
            leaderboardData={regularLeaderboard}
          />
          <AchievementsPanel
            open={achievementsOpen}
            onClose={() => setAchievementsOpen(false)}
            badgeStats={badgeStats}
            unlockedBadges={unlockedBadges}
            currentGameMode={typingGameMode}
          />
          {recentlyUnlocked && (
            <BadgeNotification
              badge={recentlyUnlocked}
              onClose={() => {}}
            />
          )}
        </div>
        )}
      </>
    </ThemeProvider>
  );
}

export default App;
