import React, { useEffect, useState, useMemo, useRef } from "react";
import useSound from "use-sound";
import {
  wordsGenerator,
  tagalogWordsGenerator,
} from "../../../scripts/wordsGenerator";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import UndoIcon from "@mui/icons-material/Undo";
import IconButton from "../../utils/IconButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import CapsLockSnackbar from "../CapsLockSnackbar";
import Stats from "./Stats";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import {
  DEFAULT_COUNT_DOWN,
  COUNT_DOWN_90,
  COUNT_DOWN_60,
  COUNT_DOWN_30,
  COUNT_DOWN_15,
  DEFAULT_WORDS_COUNT,
  DEFAULT_DIFFICULTY,
  HARD_DIFFICULTY,
  NUMBER_ADDON,
  SYMBOL_ADDON,
  DEFAULT_DIFFICULTY_TOOLTIP_TITLE,
  HARD_DIFFICULTY_TOOLTIP_TITLE,
  NUMBER_ADDON_TOOLTIP_TITLE,
  SYMBOL_ADDON_TOOLTIP_TITLE,
  ENGLISH_MODE,
  TAGALOG_MODE,
  ENGLISH_MODE_TOOLTIP_TITLE,
  TAGALOG_MODE_TOOLTIP_TITLE,
  DEFAULT_DIFFICULTY_TOOLTIP_TITLE_TAGALOG,
  HARD_DIFFICULTY_TOOLTIP_TITLE_TAGALOG,
  RESTART_BUTTON_TOOLTIP_TITLE,
  REDO_BUTTON_TOOLTIP_TITLE,
  PACING_CARET,
  PACING_PULSE,
  PACING_CARET_TOOLTIP,
  PACING_PULSE_TOOLTIP,
  NUMBER_ADDON_KEY,
  SYMBOL_ADDON_KEY,
} from "../../../constants/Constants";
import { SOUND_MAP, createMeowSound } from "../sound/sound";
import EnglishModeWords from "../../common/EnglishModeWords";
import TagalogModeWords from "../../common/TagalogModeWords";
import GameModeSelector from "./GameModeSelector";
import TimeAnimation from "../TimeAnimation/TimeAnimation";
import {
  GAME_MODE_NORMAL,
  GAME_MODE_HARD,
  GAME_MODE_SURVIVAL,
  GAME_MODE_COMBO,
} from "../../../constants/Constants";

const TypeBox = ({
  textInputRef,
  isFocusedMode,
  isUltraZenMode,
  soundMode,
  soundType,
  handleInputFocus,
  theme,
  typingGameMode,
  setTypingGameMode,
  onAddToLeaderboard,
  onStatusChange,
  badgeStats,
  updateBadgeStats,
  checkAndUnlockBadges,
}) => {
  const meowSound = useMemo(() => soundType === "meow" ? createMeowSound() : null, [soundType]);
  
  const [play] = useSound(
    soundType === "meow" ? SOUND_MAP["cherry"] : SOUND_MAP[soundType], 
    { volume: 0.5 }
  );
  const [playTimerIncrease] = useSound(
    soundType === "meow" ? SOUND_MAP["cherry"] : SOUND_MAP[soundType], 
    { volume: 0.3, playbackRate: 1.5 }
  );
  const [playTimerDecrease] = useSound(
    soundType === "meow" ? SOUND_MAP["cherry"] : SOUND_MAP[soundType], 
    { volume: 0.3, playbackRate: 0.7 }
  );
  
  const playTypingSound = () => {
    if (soundType === "meow" && meowSound) {
      meowSound();
    } else {
      play();
    }
  };
  const [incorrectCharsCount, setIncorrectCharsCount] = useState(0);

  const [timeAnimations, setTimeAnimations] = useState([]);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  // local persist timer
  const [countDownConstant, setCountDownConstant] = useLocalPersistState(
    DEFAULT_COUNT_DOWN,
    "timer-constant"
  );

  // local persist pacing style
  const [pacingStyle, setPacingStyle] = useLocalPersistState(
    PACING_PULSE,
    "pacing-style"
  );

  // local persist difficulty
  const [difficulty, setDifficulty] = useLocalPersistState(
    DEFAULT_DIFFICULTY,
    "difficulty"
  );

  // local persist difficulty
  const [language, setLanguage] = useLocalPersistState(
    ENGLISH_MODE,
    "language"
  );

  // local persist words add on for number
  const [numberAddOn, setNumberAddOn] = useLocalPersistState(
    false,
    NUMBER_ADDON_KEY
  );

  // local persist words add on for symbol
  const [symbolAddOn, setSymbolAddOn] = useLocalPersistState(
    false,
    SYMBOL_ADDON_KEY
  );

  // Caps Lock
  const [capsLocked, setCapsLocked] = useState(false);

  // tab-enter restart dialog
  const [openRestart, setOpenRestart] = useState(false);

  const EnterkeyPressReset = (e) => {
    // press enter/or tab to reset;
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      setOpenRestart(false);
      reset(
        countDownConstant,
        difficulty,
        language,
        numberAddOn,
        symbolAddOn,
        false
      );
    } // press space to redo
    else if (e.keyCode === 32) {
      e.preventDefault();
      setOpenRestart(false);
      reset(
        countDownConstant,
        difficulty,
        language,
        numberAddOn,
        symbolAddOn,
        true
      );
    } else {
      e.preventDefault();
      setOpenRestart(false);
    }
  };
  const handleTabKeyOpen = () => {
    setOpenRestart(true);
  };

  // set up words state
  const [wordsDict, setWordsDict] = useState(() => {
    if (language === ENGLISH_MODE) {
      return wordsGenerator(
        DEFAULT_WORDS_COUNT,
        difficulty,
        ENGLISH_MODE,
        numberAddOn,
        symbolAddOn
      );
    }
    if (language === TAGALOG_MODE) {
      return tagalogWordsGenerator(
        difficulty,
        TAGALOG_MODE,
        numberAddOn,
        symbolAddOn
      );
    }
  });

  const words = useMemo(() => {
    return wordsDict.map((e) => e.val);
  }, [wordsDict]);

  const wordsKey = useMemo(() => {
    return wordsDict.map((e) => e.key);
  }, [wordsDict]);

  const wordSpanRefs = useMemo(
    () =>
      Array(words.length)
        .fill(0)
        .map((i) => React.createRef()),
    [words]
  );

  // set up timer state
  const [countDown, setCountDown] = useState(countDownConstant);
  const [intervalId, setIntervalId] = useState(null);

  // set up game loop status state
  const [status, setStatus] = useState("waiting");

  // enable menu
  const menuEnabled = !isFocusedMode || status === "finished";

  // set up hidden input input val state
  const [currInput, setCurrInput] = useState("");
  // set up world advancing index
  const [currWordIndex, setCurrWordIndex] = useState(0);
  // set up char advancing index
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [prevInput, setPrevInput] = useState("");

  // set up words examine history
  const [wordsCorrect, setWordsCorrect] = useState(new Set());
  const [wordsInCorrect, setWordsInCorrect] = useState(new Set());
  const [inputWordsHistory, setInputWordsHistory] = useState({});

  // setup stats
  const [rawKeyStrokes, setRawKeyStrokes] = useState(0);
  const [wpmKeyStrokes, setWpmKeyStrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [statsCharCount, setStatsCharCount] = useState([]);

  // set up char examine hisotry
  const [history, setHistory] = useState({});
  const keyString = currWordIndex + "." + currCharIndex;
  const [currChar, setCurrChar] = useState("");

  useEffect(() => {
    if (currWordIndex === DEFAULT_WORDS_COUNT - 1) {
      if (language === ENGLISH_MODE) {
        const generatedEng = wordsGenerator(
          DEFAULT_WORDS_COUNT,
          difficulty,
          ENGLISH_MODE,
          numberAddOn,
          symbolAddOn
        );
        setWordsDict((currentArray) => [...currentArray, ...generatedEng]);
      }
      if (language === TAGALOG_MODE) {
        const generatedChinese = tagalogWordsGenerator(
          difficulty,
          TAGALOG_MODE,
          numberAddOn,
          symbolAddOn
        );
        setWordsDict((currentArray) => [...currentArray, ...generatedChinese]);
      }
    }
    if (wordSpanRefs[currWordIndex]) {
      const scrollElement = wordSpanRefs[currWordIndex].current;
      if (scrollElement) {
        scrollElement.scrollIntoView({
          block: "center",
        });
      }
    } else {
      return;
    }
  }, [
    currWordIndex,
    wordSpanRefs,
    difficulty,
    language,
    numberAddOn,
    symbolAddOn,
  ]);

  const reset = (
    newCountDown,
    difficulty,
    language,
    newNumberAddOn,
    newSymbolAddOn,
    isRedo
  ) => {
    setStatus("waiting");
    if (onStatusChange) onStatusChange("waiting");
    if (!isRedo) {
      if (language === TAGALOG_MODE) {
        setWordsDict(
          tagalogWordsGenerator(
            difficulty,
            language,
            newNumberAddOn,
            newSymbolAddOn
          )
        );
      }
      if (language === ENGLISH_MODE) {
        setWordsDict(
          wordsGenerator(
            DEFAULT_WORDS_COUNT,
            difficulty,
            language,
            newNumberAddOn,
            newSymbolAddOn
          )
        );
      }
    }
    setNumberAddOn(newNumberAddOn);
    setSymbolAddOn(newSymbolAddOn);
    setCountDownConstant(newCountDown);
    setCountDown(newCountDown);
    setDifficulty(difficulty);
    setLanguage(language);
    clearInterval(intervalId);
    setWpm(0);
    setRawKeyStrokes(0);
    setWpmKeyStrokes(0);
    setCurrInput("");
    setPrevInput("");
    setIntervalId(null);
    setCurrWordIndex(0);
    setCurrCharIndex(-1);
    setCurrChar("");
    setHistory({});
    setInputWordsHistory({});
    setWordsCorrect(new Set());
    setWordsInCorrect(new Set());
    textInputRef.current.focus();
    // console.log("fully reset waiting for next inputs");
    wordSpanRefs[0].current.scrollIntoView();
  };

  const start = () => {
    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      setCurrWordIndex(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory({});
      setInputWordsHistory({});
      setWordsCorrect(new Set());
      setWordsInCorrect(new Set());
      setStatus("waiting");
      if (onStatusChange) onStatusChange("waiting");
      textInputRef.current.focus();
    }

    if (status !== "started") {
      setStatus("started");
      if (onStatusChange) onStatusChange("started");
      let intervalId = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(intervalId);
            // current total extra inputs char count
            const currCharExtraCount = Object.values(history)
              .filter((e) => typeof e === "number")
              .reduce((a, b) => a + b, 0);

            // current correct inputs char count
            const currCharCorrectCount = Object.values(history).filter(
              (e) => e === true
            ).length;

            // current correct inputs char count
            const currCharIncorrectCount = Object.values(history).filter(
              (e) => e === false
            ).length;

            // current missing inputs char count
            const currCharMissingCount = Object.values(history).filter(
              (e) => e === undefined
            ).length;

            // current total advanced char counts
            const currCharAdvancedCount =
              currCharCorrectCount +
              currCharMissingCount +
              currCharIncorrectCount;

            // When total inputs char count is 0,
            // that is to say, both currCharCorrectCount and currCharAdvancedCount are 0,
            // accuracy turns out to be 0 but NaN.
            const accuracy =
              currCharCorrectCount === 0
                ? 0
                : (currCharCorrectCount / currCharAdvancedCount) * 100;

            setStatsCharCount([
              accuracy,
              currCharCorrectCount,
              currCharIncorrectCount,
              currCharMissingCount,
              currCharAdvancedCount,
              currCharExtraCount,
            ]);

            checkPrev();
            setStatus("finished");
            if (onStatusChange) onStatusChange("finished");

            return countDownConstant;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
      setIntervalId(intervalId);
    }
  };

  const handleComposition = () => {
    // Track composition events for mobile keyboard compatibility
    // The onChange event will handle all input processing
  };

  const UpdateInput = (e) => {
    if (status === "finished") {
      return;
    }
    
    const newValue = e.target.value;
    setCurrInput(newValue);
    
    // Clone inputWordsHistory for React immutability
    const newInputWordsHistory = { ...inputWordsHistory };
    newInputWordsHistory[currWordIndex] = newValue.trim();
    setInputWordsHistory(newInputWordsHistory);
    
    // Mobile compatibility: Detect word completion when trailing space is added
    // (mobile keyboards auto-commit with space, but don't fire keyDown events)
    if (newValue.endsWith(' ') && newValue.trim().length > 0) {
      // Word is complete - check it and advance (pass the fresh value to avoid stale state)
      const prevCorrectness = checkPrev(newValue);
      if (prevCorrectness === true || prevCorrectness === false) {
        // Reset and advance to next word
        setCurrInput("");
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(-1);
        setCurrChar("");
        return;
      }
    }
    
    // Update currCharIndex to point to the last typed character (for caret rendering)
    const trimmedValue = newValue.trimStart();
    const trimmedEnd = trimmedValue.trimEnd();
    
    if (trimmedEnd.length > 0) {
      const newCharIndex = trimmedEnd.length - 1;
      const actualChar = trimmedEnd[newCharIndex];
      setCurrCharIndex(newCharIndex);
      setCurrChar(actualChar || "");
    } else {
      setCurrCharIndex(-1);
      setCurrChar("");
    }
  };

  const handleKeyUp = (e) => {
    setCapsLocked(e.getModifierState("CapsLock"));
  };

  const wpmWorkerRef = useRef(null);

  useEffect(() => {
    // Initialize worker
    wpmWorkerRef.current = new Worker(
      new URL("../../../worker/calculateWpmWorker", import.meta.url)
    );

    return () => {
      // Cleanup worker on component unmount
      if (wpmWorkerRef.current) {
        wpmWorkerRef.current.terminate();
      }
    };
  }, []);

  const calculateWpm = (wpmKeyStrokes, countDownConstant, countDown) => {
    if (wpmKeyStrokes !== 0) {
      if (!wpmWorkerRef.current) return; // Ensure worker is initialized

      wpmWorkerRef.current.postMessage({
        wpmKeyStrokes,
        countDownConstant,
        countDown,
      });

      wpmWorkerRef.current.onmessage = (event) => {
        setWpm(event.data);
      };

      wpmWorkerRef.current.onerror = (error) => {
        console.error("Worker error:", error);
      };
    }
  };

  const handleKeyDown = (e) => {
    if (status !== "finished" && soundMode) {
      playTypingSound();
    }
    const key = e.key;
    const keyCode = e.keyCode;
    setCapsLocked(e.getModifierState("CapsLock"));

    // keydown count for KPM calculations to all types of operations
    if (status === "started") {
      setRawKeyStrokes(rawKeyStrokes + 1);
    }

    // disable Caps Lock key
    if (keyCode === 20) {
      e.preventDefault();
      return;
    }

    // disable shift alt ctrl
    if (keyCode >= 16 && keyCode <= 18) {
      e.preventDefault();
      return;
    }

    // disable tab key
    if (keyCode === 9) {
      e.preventDefault();
      handleTabKeyOpen();
      return;
    }

    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      return;
    }

    // Update stats when typing unless there is no effective WPM
    if (wpmKeyStrokes !== 0) {
      calculateWpm(wpmKeyStrokes, countDownConstant, countDown);
    }

    // start the game by typing any thing
    if (status !== "started" && status !== "finished") {
      start();
    }

    // space bar
    if (keyCode === 32) {
      const prevCorrectness = checkPrev();
      // advance to next regardless prev correct/not
      if (prevCorrectness === true || prevCorrectness === false) {
        if (
          words[currWordIndex].split("").length > currInput.split("").length
        ) {
          setIncorrectCharsCount((prev) => prev + 1);
        }

        // reset currInput
        setCurrInput("");
        // advance to next
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(-1);
        return;
      } else {
        // but don't allow entire word skip
        // console.log("entire word skip not allowed");
        return;
      }

      // backspace
    } else if (keyCode === 8) {
      // delete the mapping match records
      delete history[keyString];

      // avoid over delete
      if (currCharIndex < 0) {
        // only allow delete prev word, rewind to previous
        if (wordsInCorrect.has(currWordIndex - 1)) {
          // console.log("detected prev incorrect, rewinding to previous");
          const prevInputWord = inputWordsHistory[currWordIndex - 1];
          // console.log(prevInputWord + " ")
          setCurrInput(prevInputWord + " ");
          setCurrCharIndex(prevInputWord.length - 1);
          setCurrWordIndex(currWordIndex - 1);
          setPrevInput(prevInputWord);
        }
        return;
      }
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
      return;
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
      return;
      // if (keyCode >= 65 && keyCode <= 90) {
      //   setCurrCharIndex(currCharIndex + 1);
      //   setCurrChar(key);
      // } else {
      //   return;
      // }
    }
  };

  const getExtraCharClassName = (i, idx, extra) => {
    if (
      pacingStyle === PACING_CARET &&
      currWordIndex === i &&
      idx === extra.length - 1
    ) {
      return "caret-extra-char-right-error";
    }
    return "error-char";
  };

  const getExtraCharsDisplay = (word, i) => {
    let input = inputWordsHistory[i];
    if (!input) {
      input = currInput.trim();
    }
    if (i > currWordIndex) {
      return null;
    }
    if (input.length <= word.length) {
      return null;
    } else {
      const extra = input.slice(word.length, input.length).split("");
      // Don't mutate history during render - extra char count is tracked elsewhere
      return extra.map((c, idx) => (
        <span key={idx} className={getExtraCharClassName(i, idx, extra)}>
          {c}
        </span>
      ));
    }
  };

  const showTimeAnimation = (value, type) => {
    const animationId = Date.now() + Math.random();
    const newAnimation = {
      id: animationId,
      value: value,
      type: type,
    };
    
    setTimeAnimations(prev => [...prev, newAnimation]);
    
    setTimeout(() => {
      setTimeAnimations(prev => prev.filter(anim => anim.id !== animationId));
    }, 1000);
  };

  const checkPrev = (inputValue = null) => {
    const wordToCompare = words[currWordIndex];
    const currInputWithoutSpaces = (inputValue !== null ? inputValue : currInput).trim();
    const isCorrect = wordToCompare === currInputWithoutSpaces;
    if (!currInputWithoutSpaces || currInputWithoutSpaces.length === 0) {
      return null;
    }
    if (isCorrect) {
      wordsCorrect.add(currWordIndex);
      wordsInCorrect.delete(currWordIndex);
      let inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput("");
      setWpmKeyStrokes(wpmKeyStrokes + currInputWithoutSpaces.length + 1);

      if (typingGameMode === GAME_MODE_SURVIVAL) {
        setCountDown(prev => prev + 1);
        showTimeAnimation(1, 'bonus');
      } else if (typingGameMode === GAME_MODE_COMBO) {
        const newConsecutive = consecutiveCorrect + 1;
        setConsecutiveCorrect(newConsecutive);
        if (newConsecutive % 2 === 0) {
          setCountDown(prev => prev + 3);
          showTimeAnimation(3, 'bonus');
        }
      }

      return true;
    } else {
      wordsInCorrect.add(currWordIndex);
      wordsCorrect.delete(currWordIndex);
      let inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      setPrevInput(prevInput + " " + currInputWithoutSpaces);

      if (typingGameMode === GAME_MODE_HARD) {
        setCountDown(prev => Math.max(0, prev - 1));
        showTimeAnimation(1, 'penalty');
      } else if (typingGameMode === GAME_MODE_SURVIVAL) {
        setCountDown(prev => Math.max(0, prev - 2));
        showTimeAnimation(2, 'penalty');
      } else if (typingGameMode === GAME_MODE_COMBO) {
        setConsecutiveCorrect(0);
        setCountDown(prev => Math.max(0, prev - 1));
        showTimeAnimation(1, 'penalty');
      }

      return false;
    }
  };

  const getWordClassName = (wordIdx) => {
    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word error-word active-word";
        } else {
          return "word error-word active-word-no-pulse";
        }
      }
      return "word error-word";
    } else {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word active-word";
        } else {
          return "word active-word-no-pulse";
        }
      }
      return "word";
    }
  };

  const charsWorkerRef = useRef();

  useEffect(() => {
    charsWorkerRef.current = new Worker(
      new URL("../../../worker/trackCharsErrorsWorker", import.meta.url)
    );

    charsWorkerRef.current.onmessage = (e) => {
      if (e.data.type === "increment") {
        setIncorrectCharsCount((prev) => prev + 1);
      }
    };

    return () => {
      charsWorkerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (status !== "started") return;

    const word = words[currWordIndex];

    charsWorkerRef.current.postMessage({
      word,
      currChar,
      currCharIndex,
    });
  }, [currChar, status, currCharIndex, words, currWordIndex]);

  // Update history when input changes (moved out of render for React purity)
  useEffect(() => {
    if (status === "finished" || currWordIndex >= words.length) return;
    
    const currentInput = currInput.trimStart();
    const currentWord = words[currWordIndex];
    const newHistory = { ...history };
    
    // Update history for each character in the current word
    for (let charIdx = 0; charIdx < currentWord.length; charIdx++) {
      const keyString = currWordIndex + "." + charIdx;
      if (charIdx < currentInput.length) {
        const typedChar = currentInput[charIdx];
        const expectedChar = currentWord[charIdx];
        newHistory[keyString] = typedChar === expectedChar;
      } else {
        // Clear history entries for characters that were deleted
        delete newHistory[keyString];
      }
    }
    
    setHistory(newHistory);
  }, [currInput, currWordIndex, status, words]);

  const getCharClassName = (wordIdx, charIdx, char, word) => {
    const keyString = wordIdx + "." + charIdx;
    
    // For current word, check against actual input (no mutation, just read)
    if (wordIdx === currWordIndex && status !== "finished") {
      const currentInput = currInput.trimStart();
      
      if (charIdx < currentInput.length) {
        // Character has been typed - check history
        const isCorrect = history[keyString] === true;
        
        if (pacingStyle === PACING_CARET && charIdx === currentInput.length - 1) {
          return isCorrect ? "caret-char-right-correct" : "caret-char-right-error";
        }
        return isCorrect ? "correct-char" : "error-char";
      } else if (charIdx === currentInput.length && pacingStyle === PACING_CARET) {
        // Caret position (next character to type)
        return "caret-char-left";
      }
      return "char";
    }
    
    // For previous words, use history
    if (history[keyString] === true) {
      return "correct-char";
    }
    if (history[keyString] === false) {
      return "error-char";
    }
    if (wordIdx < currWordIndex) {
      // missing chars in previous words
      return "char";
    }
    return "char";
  };

  const getDifficultyButtonClassName = (buttonDifficulty) => {
    if (difficulty === buttonDifficulty) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getAddOnButtonClassName = (addon) => {
    if (addon) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getPacingStyleButtonClassName = (buttonPacingStyle) => {
    if (pacingStyle === buttonPacingStyle) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getTimerButtonClassName = (buttonTimerCountDown) => {
    if (countDownConstant === buttonTimerCountDown) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getLanguageButtonClassName = (buttonLanguage) => {
    if (language === buttonLanguage) {
      return "active-button";
    }
    return "inactive-button";
  };

  const renderResetButton = () => {
    return (
      <div className="restart-button" key="restart-button">
        <Grid container justifyContent="center" alignItems="center">
          <Box display="flex" flexDirection="row">
            {menuEnabled && (
              <>
                <IconButton
                  onClick={() => {
                    if (soundMode) {
                      if (COUNT_DOWN_90 > countDownConstant) {
                        playTimerIncrease();
                      } else {
                        playTimerDecrease();
                      }
                    }
                    reset(
                      COUNT_DOWN_90,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_90)}>
                    {COUNT_DOWN_90}
                  </span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (soundMode) {
                      if (COUNT_DOWN_60 > countDownConstant) {
                        playTimerIncrease();
                      } else {
                        playTimerDecrease();
                      }
                    }
                    reset(
                      COUNT_DOWN_60,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_60)}>
                    {COUNT_DOWN_60}
                  </span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (soundMode) {
                      if (COUNT_DOWN_30 > countDownConstant) {
                        playTimerIncrease();
                      } else {
                        playTimerDecrease();
                      }
                    }
                    reset(
                      COUNT_DOWN_30,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_30)}>
                    {COUNT_DOWN_30}
                  </span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    if (soundMode) {
                      if (COUNT_DOWN_15 > countDownConstant) {
                        playTimerIncrease();
                      } else {
                        playTimerDecrease();
                      }
                    }
                    reset(
                      COUNT_DOWN_15,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_15)}>
                    {COUNT_DOWN_15}
                  </span>
                </IconButton>
              </>
            )}
          </Box>
          {menuEnabled && (
            <Box display="flex" flexDirection="row">
              <IconButton
                onClick={() => {
                  reset(
                    countDownConstant,
                    difficulty,
                    language,
                    !numberAddOn,
                    symbolAddOn,
                    false
                  );
                }}
              >
                <Tooltip title={NUMBER_ADDON_TOOLTIP_TITLE}>
                  <span className={getAddOnButtonClassName(numberAddOn)}>
                    {NUMBER_ADDON}
                  </span>
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  reset(
                    countDownConstant,
                    difficulty,
                    language,
                    numberAddOn,
                    !symbolAddOn,
                    false
                  );
                }}
              >
                <Tooltip title={SYMBOL_ADDON_TOOLTIP_TITLE}>
                  <span className={getAddOnButtonClassName(symbolAddOn)}>
                    {SYMBOL_ADDON}
                  </span>
                </Tooltip>
              </IconButton>
              <IconButton>
                {" "}
                <span className="menu-separator"> | </span>{" "}
              </IconButton>
              <IconButton
                onClick={() => {
                  reset(
                    countDownConstant,
                    difficulty,
                    ENGLISH_MODE,
                    numberAddOn,
                    symbolAddOn,
                    false
                  );
                }}
              >
                <Tooltip title={ENGLISH_MODE_TOOLTIP_TITLE}>
                  <span className={getLanguageButtonClassName(ENGLISH_MODE)}>
                    eng
                  </span>
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  reset(
                    countDownConstant,
                    difficulty,
                    TAGALOG_MODE,
                    numberAddOn,
                    symbolAddOn,
                    false
                  );
                }}
              >
                <Tooltip title={TAGALOG_MODE_TOOLTIP_TITLE}>
                  <span className={getLanguageButtonClassName(TAGALOG_MODE)}>
                    tgl
                  </span>
                </Tooltip>
              </IconButton>
            </Box>
          )}
          {menuEnabled && (
            <Box display="flex" flexDirection="row">
              <IconButton
                onClick={() => {
                  setPacingStyle(PACING_PULSE);
                }}
              >
                <Tooltip title={PACING_PULSE_TOOLTIP}>
                  <span className={getPacingStyleButtonClassName(PACING_PULSE)}>
                    {PACING_PULSE}
                  </span>
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  setPacingStyle(PACING_CARET);
                }}
              >
                <Tooltip title={PACING_CARET_TOOLTIP}>
                  <span className={getPacingStyleButtonClassName(PACING_CARET)}>
                    {PACING_CARET}
                  </span>
                </Tooltip>
              </IconButton>
            </Box>
          )}
        </Grid>
      </div>
    );
  };

  const baseChunkSize = 120;
  const [startIndex, setStartIndex] = useState(0);
  const [visibleWordsCount, setVisibleWordsCount] = useState(baseChunkSize);

  // Reset startIndex when status changes
  const hasAddedToLeaderboard = useRef(false);

  useEffect(() => {
    setStartIndex(0);
    setTimeAnimations([]);
    if (status === "started") {
      setConsecutiveCorrect(0);
      hasAddedToLeaderboard.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (status === "finished" && wpm > 0 && onAddToLeaderboard && !hasAddedToLeaderboard.current) {
      hasAddedToLeaderboard.current = true;
      const accuracy = Math.round(statsCharCount[0] || 0);
      console.log("Adding to leaderboard:", Math.round(wpm), typingGameMode || GAME_MODE_NORMAL, accuracy);
      onAddToLeaderboard(Math.round(wpm), typingGameMode || GAME_MODE_NORMAL, accuracy);
      
      if (checkAndUnlockBadges) {
        const sessionTime = countDownConstant - countDown;
        const currentStats = {
          wpm: Math.round(wpm),
          accuracy: accuracy,
          errors: incorrectCharsCount,
          completed: true,
          timeRemaining: countDown,
          points: Math.round(wpm * (accuracy / 100)),
          noPause: true,
          sessionTime: sessionTime,
        };
        
        checkAndUnlockBadges(typingGameMode || GAME_MODE_NORMAL, currentStats);
        
        if (updateBadgeStats) {
          if (accuracy >= 90) {
            const prevSessions = badgeStats?.consecutiveAccuracySessions || 0;
            updateBadgeStats({ consecutiveAccuracySessions: prevSessions + 1 });
          } else {
            updateBadgeStats({ consecutiveAccuracySessions: 0 });
          }
          
          const prevWpm = badgeStats?.lastWpm || 0;
          if (Math.round(wpm) > prevWpm) {
            const prevImprovements = badgeStats?.consecutiveImprovements || 0;
            updateBadgeStats({ 
              consecutiveImprovements: prevImprovements + 1,
              lastWpm: Math.round(wpm)
            });
          } else {
            updateBadgeStats({ 
              consecutiveImprovements: 0,
              lastWpm: Math.round(wpm)
            });
          }
        }
      }
    }
  }, [status, wpm, onAddToLeaderboard, typingGameMode, statsCharCount, checkAndUnlockBadges, updateBadgeStats, badgeStats, incorrectCharsCount, countDown]);

  // Adjust visible words based on current word index
  useEffect(() => {
    const endIndex = startIndex + visibleWordsCount;

    // Ensure the current word is within the visible area
    if (currWordIndex >= endIndex - 5) {
      const newStartIndex = Math.max(
        0,
        Math.min(
          currWordIndex - Math.floor(visibleWordsCount / 2),
          words.length - visibleWordsCount
        )
      );

      if (newStartIndex !== startIndex) {
        setStartIndex(newStartIndex);
        setVisibleWordsCount(
          Math.min(words.length - newStartIndex, baseChunkSize)
        );
      }
    }
  }, [currWordIndex, startIndex, words.length, visibleWordsCount]);

  // Calculate the end index and slice the words
  const endIndex = useMemo(
    () => Math.min(startIndex + visibleWordsCount, words.length),
    [startIndex, visibleWordsCount, words.length]
  );

  const currentWords = useMemo(
    () => words.slice(startIndex, endIndex),
    [startIndex, endIndex, words]
  );

  return (
    <>
      <TimeAnimation 
        animations={timeAnimations}
      />
      <div onClick={handleInputFocus}>
        <CapsLockSnackbar open={capsLocked}></CapsLockSnackbar>
        {menuEnabled && typingGameMode && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <GameModeSelector 
              gameMode={typingGameMode} 
              setGameMode={setTypingGameMode}
              disabled={status === "started"}
            />
          </Box>
        )}
        {language === ENGLISH_MODE && (
          <EnglishModeWords
            currentWords={currentWords}
            currWordIndex={currWordIndex}
            isUltraZenMode={isUltraZenMode}
            startIndex={startIndex}
            status={status}
            wordSpanRefs={wordSpanRefs}
            getWordClassName={getWordClassName}
            getCharClassName={getCharClassName}
            getExtraCharsDisplay={getExtraCharsDisplay}
          />
        )}
        {language === TAGALOG_MODE && (
          <TagalogModeWords
            currentWords={currentWords}
            currWordIndex={currWordIndex}
            isUltraZenMode={isUltraZenMode}
            startIndex={startIndex}
            status={status}
            wordSpanRefs={wordSpanRefs}
            getWordClassName={getWordClassName}
            getCharClassName={getCharClassName}
            getExtraCharsDisplay={getExtraCharsDisplay}
          />
        )}
        <div className="stats">
          <Stats
            status={status}
            language={language}
            wpm={wpm}
            setIncorrectCharsCount={setIncorrectCharsCount}
            incorrectCharsCount={incorrectCharsCount}
            theme={theme}
            countDown={countDown}
            countDownConstant={countDownConstant}
            statsCharCount={statsCharCount}
            rawKeyStrokes={rawKeyStrokes}
            wpmKeyStrokes={wpmKeyStrokes}
            renderResetButton={renderResetButton}
            onReset={() => reset(countDownConstant, difficulty, language, numberAddOn, symbolAddOn, false)}
            onBack={() => {
              setStatus("waiting");
              if (onStatusChange) onStatusChange("waiting");
            }}
          ></Stats>
          {status !== "finished" && renderResetButton()}
        </div>
        <input
          key="hidden-input"
          ref={textInputRef}
          type="text"
          className="hidden-input"
          onKeyDown={(e) => handleKeyDown(e)}
          onKeyUp={(e) => handleKeyUp(e)}
          value={currInput}
          onChange={(e) => UpdateInput(e)}
          onCompositionStart={handleComposition}
          onCompositionUpdate={handleComposition}
          onCompositionEnd={handleComposition}
          onTouchStart={() => textInputRef.current && textInputRef.current.focus()}
          onClick={() => textInputRef.current && textInputRef.current.focus()}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="text"
          enterKeyHint="done"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          data-lpignore="true"
          data-form-type="other"
        />
        <Dialog
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
          open={openRestart}
          onKeyDown={EnterkeyPressReset}
        >
          <DialogTitle>
            <div>
              <span className="key-note"> press </span>
              <span className="key-type">Space</span>{" "}
              <span className="key-note">to redo</span>
            </div>
            <div>
              <span className="key-note"> press </span>
              <span className="key-type">Tab</span>{" "}
              <span className="key-note">/</span>{" "}
              <span className="key-type">Enter</span>{" "}
              <span className="key-note">to restart</span>
            </div>
            <span className="key-note"> press </span>
            <span className="key-type">any key </span>{" "}
            <span className="key-note">to exit</span>
          </DialogTitle>
        </Dialog>
      </div>
    </>
  );
};

export default TypeBox;
