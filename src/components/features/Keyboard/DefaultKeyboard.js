import React from "react";
import { useRef, useEffect, useState } from "react";
import { Box } from "@mui/system";
import IconButton from "../../utils/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useSound from "use-sound";
import { SOUND_MAP } from "../sound/sound";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import useGameOverSound from "../../../hooks/useGameOverSound";
import {
  DEFAULT_COUNT_DOWN,
  COUNT_DOWN_90,
  COUNT_DOWN_60,
  COUNT_DOWN_30,
  COUNT_DOWN_15,
} from "../../../constants/Constants";

const DefaultKeyboard = ({ soundType, soundMode, onAddToLeaderboard, playerName }) => {
  const keyboardRef = useRef();
  const hasSubmittedToLeaderboard = useRef(false);
  const [inputChar, setInputChar] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [play] = useSound(SOUND_MAP[soundType], { volume: 0.5 });

  const [countDownConstant, setCountDownConstant] = useLocalPersistState(
    DEFAULT_COUNT_DOWN,
    "trainer-timer-constant"
  );
  const [countDown, setCountDown] = useState(countDownConstant);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  useGameOverSound(showResults);

  const accuracy =
    correctCount + incorrectCount === 0
      ? 0
      : Math.floor((correctCount / (correctCount + incorrectCount)) * 100);
  const keys = [..." abcdefghijklmnopqrstuvwxyz "];
  const resetStats = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
    setCountDown(countDownConstant);
    setIsTimerRunning(false);
    setShowResults(false);
    hasSubmittedToLeaderboard.current = false;
  };

  useEffect(() => {
    keyboardRef.current && keyboardRef.current.focus();
  });

  useEffect(() => {
    let timer;
    if (isTimerRunning && countDown > 0) {
      timer = setTimeout(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    } else if (countDown === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setShowResults(true);
    }
    return () => clearTimeout(timer);
  }, [countDown, isTimerRunning]);

  // Submit to leaderboard when results are shown (guard against double submission in React 18 Strict Mode)
  useEffect(() => {
    if (showResults && onAddToLeaderboard && correctCount > 0 && !hasSubmittedToLeaderboard.current) {
      hasSubmittedToLeaderboard.current = true;
      const lps = parseFloat((correctCount / countDownConstant).toFixed(2));
      onAddToLeaderboard(lps, "Trainer", accuracy, incorrectCount);
    }
  }, [showResults, onAddToLeaderboard, correctCount, countDownConstant, accuracy, incorrectCount]);

  useEffect(() => {
    setCountDown(countDownConstant);
  }, [countDownConstant]);

  const handleInputBlur = (event) => {
    keyboardRef.current && keyboardRef.current.focus();
  };
  const handleKeyDown = (event) => {
    if (soundMode) {
      play();
    }
    setInputChar(event.key);
    event.preventDefault();
    return;
  };
  const handleKeyUp = (event) => {
    if (!isTimerRunning && countDown > 0) {
      setIsTimerRunning(true);
    }
    
    setInputChar("");
    if (event.key === randomKey) {
      let newRandom = getRandomKeyIndex();
      let newKey = keys[newRandom];
      if (newKey === randomKey) {
        if (newRandom === 0 || newRandom === keys.length - 1) {
          newRandom = 1;
        } else {
          newRandom = newRandom + 1;
        }
      }
      setRandomKey(keys[newRandom]);
      setCorrectCount(correctCount + 1);
      return;
    }

    setIncorrectCount(incorrectCount + 1);

    event.preventDefault();
    return;
  };
  const getRandomKeyIndex = () => {
    return Math.floor(Math.random() * 27);
  };

  const [randomKey, setRandomKey] = useState(() => {
    return keys[getRandomKeyIndex()];
  });

  const getClassName = (keyString) => {
    if (keyString !== randomKey) {
      if (inputChar !== "" && inputChar === keyString) {
        return "UNITKEY VIBRATE-ERROR";
      }
      return "UNITKEY";
    }
    if (inputChar !== "" && inputChar === keyString) {
      return "UNITKEY NOVIBRATE-CORRECT";
    }
    return "UNITKEY VIBRATE";
  };
  const getSpaceKeyClassName = () => {
    if (" " !== randomKey) {
      if (inputChar !== "" && inputChar === " ") {
        return "SPACEKEY VIBRATE-ERROR";
      }
      return "SPACEKEY";
    }
    if (inputChar !== "" && inputChar === " ") {
      return "SPACEKEY NOVIBRATE-CORRECT";
    }
    return "SPACEKEY VIBRATE";
  };

  const getTimerButtonClassName = (buttonTimerCountDown) => {
    if (countDownConstant === buttonTimerCountDown) {
      return "active-button";
    }
    return "inactive-button";
  };

  const handleTimerChange = (newTimer) => {
    setCountDownConstant(newTimer);
    setCountDown(newTimer);
    setIsTimerRunning(false);
    setShowResults(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    hasSubmittedToLeaderboard.current = false;
  };

  const lettersPerSecond = countDownConstant > 0 
    ? (correctCount / countDownConstant).toFixed(2) 
    : 0;

  const lettersRow1 = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "[",
    "]",
  ];

  const row1Elements = lettersRow1.map((letter, index) => (
    <div className={getClassName(letter.toLowerCase())} key={index} id={letter}>
      {letter}
    </div>
  ));

  const lettersRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"];

  const row2Elements = lettersRow2.map((letter, index) => (
    <div className={getClassName(letter.toLowerCase())} key={index} id={letter}>
      {letter}
    </div>
  ));

  const lettersRow3 = ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"];

  const row3Elements = lettersRow3.map((letter, index) => (
    <div className={getClassName(letter.toLowerCase())} key={index} id={letter}>
      {letter}
    </div>
  ));

  return (
    <div>
      {showResults ? (
        <div className="stats-overlay" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '16px',
          gap: '8px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '4px', margin: 0 }}>⌨️ Results</h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            width: '100%'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>LPS</p>
              <h1 style={{ fontSize: '28px', margin: '4px 0' }}>{lettersPerSecond}</h1>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Accuracy</p>
              <h1 style={{ fontSize: '28px', margin: '4px 0' }}>{accuracy}%</h1>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Correct</p>
              <h2 style={{ fontSize: '18px', margin: '4px 0' }} className="correct-char-stats">{correctCount}</h2>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Incorrect</p>
              <h2 style={{ fontSize: '18px', margin: '4px 0' }} className="incorrect-char-stats">{incorrectCount}</h2>
            </div>
          </div>

          <p style={{ fontSize: '12px', opacity: 0.7, margin: '4px 0' }}>Time: {countDownConstant}s</p>

          <Box display="flex" gap={1.5} marginTop="8px">
            <IconButton
              onClick={() => {
                resetStats();
              }}
              style={{
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                padding: '12px 24px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RestartAltIcon />
              <span>Try Again</span>
            </IconButton>
          </Box>
        </div>
      ) : (
        <>
          <div className="keyboard">
            <input
              className="hidden-input"
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              ref={keyboardRef}
            ></input>
            <ul className="row row-1">{row1Elements}</ul>
            <ul className="row row-2">{row2Elements}</ul>
            <ul className="row row-3">{row3Elements}</ul>
            <ul className="row row-4">
              <div className={getSpaceKeyClassName()} id="SPACE">
                SPACE
              </div>
            </ul>{" "}
          </div>
          <div className="keyboard-stats">
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {/* Live countdown timer - above accuracy */}
          <Box display="flex" alignItems="center" gap={2}>
            <h3 className={isTimerRunning ? (countDown < 10 ? "timer-warning" : "timer-countdown") : ""}>
              {countDown} s
            </h3>
            <IconButton
              aria-label="restart"
              size="small"
              onClick={() => {
                resetStats();
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Box>

          {/* Accuracy display */}
          <Box display="flex" flexDirection="row" gap={2}>
            <h3>Accuracy: {accuracy} %</h3>
            <h3>
              <span className="CorrectKeyDowns">{correctCount}</span>
              {"  "} {"/"} {"  "}
              <span className="IncorrectKeyDowns">{incorrectCount}</span>
            </h3>
          </Box>

          {/* Timer selection buttons - below accuracy */}
          <Box display="flex" flexDirection="row" gap={1}>
            <IconButton onClick={() => handleTimerChange(COUNT_DOWN_90)}>
              <span className={getTimerButtonClassName(COUNT_DOWN_90)}>
                {COUNT_DOWN_90}
              </span>
            </IconButton>
            <IconButton onClick={() => handleTimerChange(COUNT_DOWN_60)}>
              <span className={getTimerButtonClassName(COUNT_DOWN_60)}>
                {COUNT_DOWN_60}
              </span>
            </IconButton>
            <IconButton onClick={() => handleTimerChange(COUNT_DOWN_30)}>
              <span className={getTimerButtonClassName(COUNT_DOWN_30)}>
                {COUNT_DOWN_30}
              </span>
            </IconButton>
            <IconButton onClick={() => handleTimerChange(COUNT_DOWN_15)}>
              <span className={getTimerButtonClassName(COUNT_DOWN_15)}>
                {COUNT_DOWN_15}
              </span>
            </IconButton>
          </Box>
        </Box>
      </div>
        </>
      )}
    </div>
  );
};

export default DefaultKeyboard;
