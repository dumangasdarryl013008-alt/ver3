import { useState, useEffect, useCallback } from "react";
import { getAllBadges } from "../constants/BadgeConfig";

const useBadgeTracking = () => {
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = window.localStorage.getItem("unlockedBadges");
    return saved ? JSON.parse(saved) : [];
  });

  const [badgeStats, setBadgeStats] = useState(() => {
    const saved = window.localStorage.getItem("badgeStats");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        uniqueLetters: new Set(parsed.uniqueLetters || []),
        lastSessionTimestamp: parsed.lastSessionTimestamp || null,
      };
    }
    return {
      consecutiveImprovements: 0,
      lastWpm: 0,
      consecutiveAccuracySessions: 0,
      perfectWords: 0,
      maxCombo: 0,
      comboCount: 0,
      perfectWordStreak: 0,
      comboDuration: 0,
      maxMultiplier: 0,
      survivalTime: 0,
      bonusSeconds: 0,
      closeCallRecoveries: 0,
      correctLetters: 0,
      correctWords: 0,
      uniqueLetters: new Set(),
      lastSessionTimestamp: null,
    };
  });

  const [recentlyUnlocked, setRecentlyUnlocked] = useState(null);

  useEffect(() => {
    window.localStorage.setItem("unlockedBadges", JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    const statsToSave = {
      ...badgeStats,
      uniqueLetters: Array.from(badgeStats.uniqueLetters || []),
    };
    window.localStorage.setItem("badgeStats", JSON.stringify(statsToSave));
  }, [badgeStats]);

  const checkAndUnlockBadges = useCallback((gameMode, currentStats) => {
    // Enhanced time-based validation to prevent cheating
    const MIN_SESSION_TIME = 30; // Minimum 30 seconds to unlock badges (increased from 10)
    const MAX_REALISTIC_WPM = 200; // Cap WPM to realistic maximum
    const MIN_REALISTIC_WPM = 5; // Minimum realistic WPM
    const now = Date.now();
    const MIN_TIME_BETWEEN_SESSIONS = 5000; // 5 seconds minimum between badge-eligible sessions
    
    // Validate session timing
    const sessionTime = currentStats.sessionTime || 0;
    if (sessionTime < MIN_SESSION_TIME) {
      console.log(`Session too short to unlock badges (minimum ${MIN_SESSION_TIME} seconds required)`);
      return [];
    }
    
    // Prevent rapid session farming by requiring time between sessions
    const lastSessionTime = badgeStats.lastSessionTimestamp || 0;
    const timeSinceLastSession = now - lastSessionTime;
    if (lastSessionTime > 0 && timeSinceLastSession < MIN_TIME_BETWEEN_SESSIONS) {
      console.log('Sessions too close together, please wait before earning more badges');
      return [];
    }
    
    // Validate WPM is within realistic range (don't mutate currentStats)
    if (currentStats.wpm) {
      if (currentStats.wpm > MAX_REALISTIC_WPM) {
        console.log('WPM exceeds realistic maximum, rejecting badge unlock');
        return [];
      }
      if (currentStats.wpm < MIN_REALISTIC_WPM && currentStats.wpm > 0) {
        console.log('WPM too low, session may be invalid');
        return [];
      }
    }
    
    // Validate accuracy is realistic (not manipulated)
    if (currentStats.accuracy > 100) {
      console.log('Invalid accuracy detected');
      return [];
    }
    
    const allBadges = getAllBadges();
    const modeBadges = allBadges.filter((badge) => badge.category === gameMode);
    const newlyUnlocked = [];

    modeBadges.forEach((badge) => {
      if (unlockedBadges.includes(badge.id)) {
        return;
      }

      let shouldUnlock = false;

      switch (badge.requirement.type) {
        case "wpm_single_round":
          shouldUnlock = currentStats.wpm >= badge.requirement.target;
          break;
        case "accuracy_single_round":
          shouldUnlock = currentStats.accuracy >= badge.requirement.target;
          break;
        case "consecutive_improvements":
          shouldUnlock = currentStats.consecutiveImprovements >= badge.requirement.target;
          break;
        case "no_pause":
          shouldUnlock = currentStats.noPause === true;
          break;
        case "points_single_session":
          shouldUnlock = currentStats.points >= badge.requirement.target;
          break;
        case "consecutive_accuracy":
          shouldUnlock = currentStats.consecutiveAccuracySessions >= badge.requirement.target;
          break;
        case "points_with_low_errors":
          shouldUnlock = currentStats.points >= badge.requirement.points && 
                         currentStats.errors < badge.requirement.maxErrors;
          break;
        case "time_remaining":
          shouldUnlock = currentStats.completed && currentStats.timeRemaining < badge.requirement.maxTime;
          break;
        case "no_errors":
          shouldUnlock = currentStats.errors === 0 && currentStats.completed;
          break;
        case "perfect_words":
          shouldUnlock = currentStats.perfectWords >= badge.requirement.target;
          break;
        case "combo_streak":
          shouldUnlock = currentStats.maxCombo >= badge.requirement.target;
          break;
        case "combo_count":
          shouldUnlock = currentStats.comboCount >= badge.requirement.target;
          break;
        case "perfect_word_streak":
          shouldUnlock = currentStats.perfectWordStreak >= badge.requirement.target;
          break;
        case "combo_duration":
          shouldUnlock = currentStats.comboDuration >= badge.requirement.target;
          break;
        case "max_multiplier":
          shouldUnlock = currentStats.maxMultiplier >= badge.requirement.target;
          break;
        case "survival_time":
          shouldUnlock = currentStats.survivalTime >= badge.requirement.target;
          break;
        case "bonus_seconds":
          shouldUnlock = currentStats.bonusSeconds >= badge.requirement.target;
          break;
        case "close_call_recovery":
          shouldUnlock = currentStats.closeCallRecoveries >= badge.requirement.target;
          break;
        case "leaderboard_rank":
          shouldUnlock = currentStats.leaderboardRank <= badge.requirement.target;
          break;
        case "correct_letters":
          shouldUnlock = currentStats.correctLetters >= badge.requirement.target;
          break;
        case "correct_words":
          shouldUnlock = currentStats.correctWords >= badge.requirement.target;
          break;
        case "alphabet_coverage":
          shouldUnlock = (currentStats.uniqueLetters?.size || 0) >= badge.requirement.target;
          break;
        case "words_typed":
          shouldUnlock = currentStats.wordsTyped >= badge.requirement.target;
          break;
        case "wpm_and_accuracy":
          shouldUnlock = currentStats.wpm >= badge.requirement.wpmTarget && 
                         currentStats.accuracy >= badge.requirement.accuracyTarget;
          break;
        case "consecutive_perfect_rounds":
          shouldUnlock = currentStats.consecutivePerfectRounds >= badge.requirement.target;
          break;
        case "survival_time_and_accuracy":
          shouldUnlock = currentStats.survivalTime >= badge.requirement.timeTarget && 
                         currentStats.accuracy >= badge.requirement.accuracyTarget;
          break;
        default:
          shouldUnlock = false;
      }

      if (shouldUnlock) {
        newlyUnlocked.push(badge);
      }
    });

    if (newlyUnlocked.length > 0) {
      // Only update the session timestamp when badges are actually unlocked
      setBadgeStats((prev) => ({
        ...prev,
        lastSessionTimestamp: now,
      }));
      
      setUnlockedBadges((prev) => [...prev, ...newlyUnlocked.map((b) => b.id)]);
      newlyUnlocked.forEach((badge) => {
        setRecentlyUnlocked(badge);
        setTimeout(() => setRecentlyUnlocked(null), 5000);
      });
    }

    return newlyUnlocked;
  }, [unlockedBadges, badgeStats]);

  const updateBadgeStats = useCallback((updates) => {
    setBadgeStats((prev) => {
      const newStats = { ...prev, ...updates };
      if (updates.uniqueLetters) {
        newStats.uniqueLetters = new Set([...prev.uniqueLetters, ...updates.uniqueLetters]);
      }
      return newStats;
    });
  }, []);

  const resetBadgeProgress = useCallback((statKey) => {
    setBadgeStats((prev) => ({
      ...prev,
      [statKey]: 0,
    }));
  }, []);

  const isBadgeUnlocked = useCallback((badgeId) => {
    return unlockedBadges.includes(badgeId);
  }, [unlockedBadges]);

  const getUnlockedCount = useCallback((category) => {
    const allBadges = getAllBadges();
    const categoryBadges = allBadges.filter((badge) => badge.category === category);
    const unlocked = categoryBadges.filter((badge) => unlockedBadges.includes(badge.id));
    return { unlocked: unlocked.length, total: categoryBadges.length };
  }, [unlockedBadges]);

  return {
    unlockedBadges,
    badgeStats,
    recentlyUnlocked,
    checkAndUnlockBadges,
    updateBadgeStats,
    resetBadgeProgress,
    isBadgeUnlocked,
    getUnlockedCount,
  };
};

export default useBadgeTracking;
