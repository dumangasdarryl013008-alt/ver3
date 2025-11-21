import {
  GAME_MODE_NORMAL,
  GAME_MODE_HARD,
  GAME_MODE_SURVIVAL,
  GAME_MODE_COMBO,
} from "./Constants";

export const BADGE_TIERS = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
  STAR: "🌟",
};

export const BADGE_CATEGORIES = {
  NORMAL: {
    id: GAME_MODE_NORMAL,
    label: "🟢 Normal Mode",
    description: "Practice Mode",
  },
  HARD: {
    id: GAME_MODE_HARD,
    label: "🔴 Hard Mode",
    description: "Precision Challenge",
  },
  COMBO: {
    id: GAME_MODE_COMBO,
    label: "🟡 Combo Mode",
    description: "Streak Challenge",
  },
  SURVIVAL: {
    id: GAME_MODE_SURVIVAL,
    label: "🔵 Survival Mode",
    description: "Endurance Challenge",
  },
  TRAINER: {
    id: "TRAINER",
    label: "⌨️ QWERTY Keyboard Practice Mode",
    description: "Typing Practice",
  },
};

export const BADGES = {
  NORMAL: [
    {
      id: "speed_starter",
      name: "Speed Starter",
      tier: BADGE_TIERS.BRONZE,
      description: "Reach 40+ WPM in a round",
      requirement: {
        type: "wpm_single_round",
        target: 40,
      },
      getProgress: (stats) => ({
        current: stats.wpm || 0,
        target: 40,
        percentage: Math.min(100, ((stats.wpm || 0) / 40) * 100),
      }),
    },
    {
      id: "quick_learner",
      name: "Quick Learner",
      tier: BADGE_TIERS.BRONZE,
      description: "Improve your score three rounds in a row",
      requirement: {
        type: "consecutive_improvements",
        target: 3,
      },
      getProgress: (stats) => ({
        current: stats.consecutiveImprovements || 0,
        target: 3,
        percentage: Math.min(100, ((stats.consecutiveImprovements || 0) / 3) * 100),
      }),
    },
    {
      id: "accuracy_ace",
      name: "Accuracy Ace",
      tier: BADGE_TIERS.SILVER,
      description: "Finish with 95% or higher accuracy",
      requirement: {
        type: "accuracy_single_round",
        target: 95,
      },
      getProgress: (stats) => ({
        current: stats.accuracy || 0,
        target: 95,
        percentage: Math.min(100, ((stats.accuracy || 0) / 95) * 100),
      }),
    },
    {
      id: "focus_finder",
      name: "Focus Finder",
      tier: BADGE_TIERS.SILVER,
      description: "Complete a full session without pausing",
      requirement: {
        type: "no_pause",
        target: 1,
      },
      getProgress: (stats) => ({
        current: stats.noPause ? 1 : 0,
        target: 1,
        percentage: stats.noPause ? 100 : 0,
      }),
    },
    {
      id: "score_builder",
      name: "Score Builder",
      tier: BADGE_TIERS.GOLD,
      description: "Earn 200+ points in one session",
      requirement: {
        type: "points_single_session",
        target: 200,
      },
      getProgress: (stats) => ({
        current: stats.points || 0,
        target: 200,
        percentage: Math.min(100, ((stats.points || 0) / 200) * 100),
      }),
    },
    {
      id: "consistency_king",
      name: "Consistency King/Queen",
      tier: BADGE_TIERS.STAR,
      description: "Keep 90%+ accuracy for 5 sessions straight",
      requirement: {
        type: "consecutive_accuracy",
        target: 5,
        accuracy: 90,
      },
      getProgress: (stats) => ({
        current: stats.consecutiveAccuracySessions || 0,
        target: 5,
        percentage: Math.min(100, ((stats.consecutiveAccuracySessions || 0) / 5) * 100),
      }),
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      tier: BADGE_TIERS.BRONZE,
      description: "Reach 60+ WPM in a round",
      requirement: {
        type: "wpm_single_round",
        target: 60,
      },
      getProgress: (stats) => ({
        current: stats.wpm || 0,
        target: 60,
        percentage: Math.min(100, ((stats.wpm || 0) / 60) * 100),
      }),
    },
    {
      id: "marathon_typer",
      name: "Marathon Typer",
      tier: BADGE_TIERS.SILVER,
      description: "Type 300+ words in one session",
      requirement: {
        type: "words_typed",
        target: 300,
      },
      getProgress: (stats) => ({
        current: stats.wordsTyped || 0,
        target: 300,
        percentage: Math.min(100, ((stats.wordsTyped || 0) / 300) * 100),
      }),
    },
    {
      id: "perfect_session",
      name: "Perfect Session",
      tier: BADGE_TIERS.GOLD,
      description: "Complete with 98%+ accuracy",
      requirement: {
        type: "accuracy_single_round",
        target: 98,
      },
      getProgress: (stats) => ({
        current: stats.accuracy || 0,
        target: 98,
        percentage: Math.min(100, ((stats.accuracy || 0) / 98) * 100),
      }),
    },
    {
      id: "elite_performer",
      name: "Elite Performer",
      tier: BADGE_TIERS.STAR,
      description: "Reach 80+ WPM with 95%+ accuracy",
      requirement: {
        type: "wpm_and_accuracy",
        wpmTarget: 80,
        accuracyTarget: 95,
      },
      getProgress: (stats) => ({
        current: stats.wpm || 0,
        target: 80,
        percentage: (stats.wpm >= 80 && stats.accuracy >= 95) ? 100 : Math.min(75, ((stats.wpm || 0) / 80) * 75),
      }),
    },
  ],

  HARD: [
    {
      id: "steady_hands",
      name: "Steady Hands",
      tier: BADGE_TIERS.BRONZE,
      description: "Get 90%+ accuracy in a hard round",
      requirement: {
        type: "accuracy_single_round",
        target: 90,
      },
      getProgress: (stats) => ({
        current: stats.accuracy || 0,
        target: 90,
        percentage: Math.min(100, ((stats.accuracy || 0) / 90) * 100),
      }),
    },
    {
      id: "sharp_shooter",
      name: "Sharp Shooter",
      tier: BADGE_TIERS.SILVER,
      description: "Score 50+ points with fewer than 3 mistakes",
      requirement: {
        type: "points_with_low_errors",
        points: 50,
        maxErrors: 3,
      },
      getProgress: (stats) => ({
        current: stats.points || 0,
        target: 50,
        percentage: Math.min(100, ((stats.points || 0) / 50) * 100),
        errorCheck: (stats.errors || 0) < 3,
      }),
    },
    {
      id: "risk_taker",
      name: "Risk Taker",
      tier: BADGE_TIERS.SILVER,
      description: "Finish with less than 5 seconds left",
      requirement: {
        type: "time_remaining",
        maxTime: 5,
      },
      getProgress: (stats) => ({
        current: stats.timeRemaining || 0,
        target: 5,
        percentage: stats.completed && stats.timeRemaining < 5 ? 100 : 0,
      }),
    },
    {
      id: "flawless_fighter",
      name: "Flawless Fighter",
      tier: BADGE_TIERS.GOLD,
      description: "Complete a round with zero mistakes",
      requirement: {
        type: "no_errors",
        target: 0,
      },
      getProgress: (stats) => ({
        current: stats.errors || 0,
        target: 0,
        percentage: stats.errors === 0 && stats.completed ? 100 : 0,
      }),
    },
    {
      id: "perfect_precisionist",
      name: "Perfect Precisionist",
      tier: BADGE_TIERS.GOLD,
      description: "Achieve 100% accuracy",
      requirement: {
        type: "accuracy_single_round",
        target: 100,
      },
      getProgress: (stats) => ({
        current: stats.accuracy || 0,
        target: 100,
        percentage: Math.min(100, (stats.accuracy || 0)),
      }),
    },
    {
      id: "no_miss_master",
      name: "No-Miss Master",
      tier: BADGE_TIERS.STAR,
      description: "Type 100 words perfectly without any error",
      requirement: {
        type: "perfect_words",
        target: 100,
      },
      getProgress: (stats) => ({
        current: stats.perfectWords || 0,
        target: 100,
        percentage: Math.min(100, ((stats.perfectWords || 0) / 100) * 100),
      }),
    },
    {
      id: "pressure_cooker",
      name: "Pressure Cooker",
      tier: BADGE_TIERS.BRONZE,
      description: "Score 100+ points in hard mode",
      requirement: {
        type: "points_single_session",
        target: 100,
      },
      getProgress: (stats) => ({
        current: stats.points || 0,
        target: 100,
        percentage: Math.min(100, ((stats.points || 0) / 100) * 100),
      }),
    },
    {
      id: "speed_accuracy_combo",
      name: "Speed & Accuracy Combo",
      tier: BADGE_TIERS.SILVER,
      description: "Reach 50+ WPM with 95%+ accuracy in hard mode",
      requirement: {
        type: "wpm_and_accuracy",
        wpmTarget: 50,
        accuracyTarget: 95,
      },
      getProgress: (stats) => ({
        current: stats.wpm || 0,
        target: 50,
        percentage: (stats.wpm >= 50 && stats.accuracy >= 95) ? 100 : Math.min(75, ((stats.wpm || 0) / 50) * 75),
      }),
    },
    {
      id: "error_free_streak",
      name: "Error-Free Streak",
      tier: BADGE_TIERS.GOLD,
      description: "Complete 3 rounds in a row with zero errors",
      requirement: {
        type: "consecutive_perfect_rounds",
        target: 3,
      },
      getProgress: (stats) => ({
        current: stats.consecutivePerfectRounds || 0,
        target: 3,
        percentage: Math.min(100, ((stats.consecutivePerfectRounds || 0) / 3) * 100),
      }),
    },
    {
      id: "hard_mode_legend",
      name: "Hard Mode Legend",
      tier: BADGE_TIERS.STAR,
      description: "Achieve 70+ WPM with 100% accuracy",
      requirement: {
        type: "wpm_and_accuracy",
        wpmTarget: 70,
        accuracyTarget: 100,
      },
      getProgress: (stats) => ({
        current: stats.wpm || 0,
        target: 70,
        percentage: (stats.wpm >= 70 && stats.accuracy === 100) ? 100 : Math.min(75, ((stats.wpm || 0) / 70) * 75),
      }),
    },
  ],

  COMBO: [
    {
      id: "combo_champ",
      name: "Combo Champ",
      tier: BADGE_TIERS.BRONZE,
      description: "Reach a 20-word combo streak",
      requirement: {
        type: "combo_streak",
        target: 20,
      },
      getProgress: (stats) => ({
        current: stats.maxCombo || 0,
        target: 20,
        percentage: Math.min(100, ((stats.maxCombo || 0) / 20) * 100),
      }),
    },
    {
      id: "momentum_master",
      name: "Momentum Master",
      tier: BADGE_TIERS.SILVER,
      description: "Earn 5 separate combos in one session",
      requirement: {
        type: "combo_count",
        target: 5,
      },
      getProgress: (stats) => ({
        current: stats.comboCount || 0,
        target: 5,
        percentage: Math.min(100, ((stats.comboCount || 0) / 5) * 100),
      }),
    },
    {
      id: "precision_streaker",
      name: "Precision Streaker",
      tier: BADGE_TIERS.SILVER,
      description: "Type 50 words correctly in a row",
      requirement: {
        type: "perfect_word_streak",
        target: 50,
      },
      getProgress: (stats) => ({
        current: stats.perfectWordStreak || 0,
        target: 50,
        percentage: Math.min(100, ((stats.perfectWordStreak || 0) / 50) * 100),
      }),
    },
    {
      id: "streak_master",
      name: "Streak Master",
      tier: BADGE_TIERS.GOLD,
      description: "Keep your combo going for 1 full minute",
      requirement: {
        type: "combo_duration",
        target: 60,
      },
      getProgress: (stats) => ({
        current: stats.comboDuration || 0,
        target: 60,
        percentage: Math.min(100, ((stats.comboDuration || 0) / 60) * 100),
      }),
    },
    {
      id: "chain_crusher",
      name: "Chain Crusher",
      tier: BADGE_TIERS.GOLD,
      description: "Complete 10 combos without breaking",
      requirement: {
        type: "combo_count",
        target: 10,
      },
      getProgress: (stats) => ({
        current: stats.comboCount || 0,
        target: 10,
        percentage: Math.min(100, ((stats.comboCount || 0) / 10) * 100),
      }),
    },
    {
      id: "hot_streak_hero",
      name: "Hot Streak Hero",
      tier: BADGE_TIERS.STAR,
      description: "Reach the highest combo multiplier in the game",
      requirement: {
        type: "max_multiplier",
        target: 10,
      },
      getProgress: (stats) => ({
        current: stats.maxMultiplier || 0,
        target: 10,
        percentage: Math.min(100, ((stats.maxMultiplier || 0) / 10) * 100),
      }),
    },
    {
      id: "combo_starter",
      name: "Combo Starter",
      tier: BADGE_TIERS.BRONZE,
      description: "Build a 10-word combo streak",
      requirement: {
        type: "combo_streak",
        target: 10,
      },
      getProgress: (stats) => ({
        current: stats.maxCombo || 0,
        target: 10,
        percentage: Math.min(100, ((stats.maxCombo || 0) / 10) * 100),
      }),
    },
    {
      id: "combo_builder",
      name: "Combo Builder",
      tier: BADGE_TIERS.SILVER,
      description: "Reach a 40-word combo streak",
      requirement: {
        type: "combo_streak",
        target: 40,
      },
      getProgress: (stats) => ({
        current: stats.maxCombo || 0,
        target: 40,
        percentage: Math.min(100, ((stats.maxCombo || 0) / 40) * 100),
      }),
    },
    {
      id: "unstoppable_chain",
      name: "Unstoppable Chain",
      tier: BADGE_TIERS.GOLD,
      description: "Type 100 words correctly in a row",
      requirement: {
        type: "perfect_word_streak",
        target: 100,
      },
      getProgress: (stats) => ({
        current: stats.perfectWordStreak || 0,
        target: 100,
        percentage: Math.min(100, ((stats.perfectWordStreak || 0) / 100) * 100),
      }),
    },
    {
      id: "combo_master_supreme",
      name: "Combo Master Supreme",
      tier: BADGE_TIERS.STAR,
      description: "Maintain combo for 2 full minutes",
      requirement: {
        type: "combo_duration",
        target: 120,
      },
      getProgress: (stats) => ({
        current: stats.comboDuration || 0,
        target: 120,
        percentage: Math.min(100, ((stats.comboDuration || 0) / 120) * 100),
      }),
    },
  ],

  SURVIVAL: [
    {
      id: "time_keeper",
      name: "Time Keeper",
      tier: BADGE_TIERS.BRONZE,
      description: "Survive for 2 minutes",
      requirement: {
        type: "survival_time",
        target: 120,
      },
      getProgress: (stats) => ({
        current: stats.survivalTime || 0,
        target: 120,
        percentage: Math.min(100, ((stats.survivalTime || 0) / 120) * 100),
      }),
    },
    {
      id: "time_warrior",
      name: "Time Warrior",
      tier: BADGE_TIERS.SILVER,
      description: "Gain 30+ bonus seconds in one session",
      requirement: {
        type: "bonus_seconds",
        target: 30,
      },
      getProgress: (stats) => ({
        current: stats.bonusSeconds || 0,
        target: 30,
        percentage: Math.min(100, ((stats.bonusSeconds || 0) / 30) * 100),
      }),
    },
    {
      id: "iron_typer",
      name: "Iron Typer",
      tier: BADGE_TIERS.SILVER,
      description: "Maintain 90%+ accuracy during survival",
      requirement: {
        type: "accuracy_single_round",
        target: 90,
      },
      getProgress: (stats) => ({
        current: stats.accuracy || 0,
        target: 90,
        percentage: Math.min(100, ((stats.accuracy || 0) / 90) * 100),
      }),
    },
    {
      id: "endurance_expert",
      name: "Endurance Expert",
      tier: BADGE_TIERS.GOLD,
      description: "Last 5 minutes or more",
      requirement: {
        type: "survival_time",
        target: 300,
      },
      getProgress: (stats) => ({
        current: stats.survivalTime || 0,
        target: 300,
        percentage: Math.min(100, ((stats.survivalTime || 0) / 300) * 100),
      }),
    },
    {
      id: "last_second_saver",
      name: "Last-Second Saver",
      tier: BADGE_TIERS.GOLD,
      description: "Recover from 5 seconds or less and keep going",
      requirement: {
        type: "close_call_recovery",
        target: 1,
      },
      getProgress: (stats) => ({
        current: stats.closeCallRecoveries || 0,
        target: 1,
        percentage: stats.closeCallRecoveries > 0 ? 100 : 0,
      }),
    },
    {
      id: "survivor_legend",
      name: "Survivor Legend",
      tier: BADGE_TIERS.STAR,
      description: "Reach the top 10 in the leaderboard",
      requirement: {
        type: "leaderboard_rank",
        target: 10,
      },
      getProgress: (stats) => ({
        current: stats.leaderboardRank || 999,
        target: 10,
        percentage: stats.leaderboardRank <= 10 ? 100 : 0,
      }),
    },
    {
      id: "quick_survivor",
      name: "Quick Survivor",
      tier: BADGE_TIERS.BRONZE,
      description: "Survive for 90 seconds",
      requirement: {
        type: "survival_time",
        target: 90,
      },
      getProgress: (stats) => ({
        current: stats.survivalTime || 0,
        target: 90,
        percentage: Math.min(100, ((stats.survivalTime || 0) / 90) * 100),
      }),
    },
    {
      id: "bonus_hunter",
      name: "Bonus Hunter",
      tier: BADGE_TIERS.SILVER,
      description: "Gain 50+ bonus seconds in one session",
      requirement: {
        type: "bonus_seconds",
        target: 50,
      },
      getProgress: (stats) => ({
        current: stats.bonusSeconds || 0,
        target: 50,
        percentage: Math.min(100, ((stats.bonusSeconds || 0) / 50) * 100),
      }),
    },
    {
      id: "ultimate_survivor",
      name: "Ultimate Survivor",
      tier: BADGE_TIERS.GOLD,
      description: "Last 10 minutes or more",
      requirement: {
        type: "survival_time",
        target: 600,
      },
      getProgress: (stats) => ({
        current: stats.survivalTime || 0,
        target: 600,
        percentage: Math.min(100, ((stats.survivalTime || 0) / 600) * 100),
      }),
    },
    {
      id: "survival_perfectionist",
      name: "Survival Perfectionist",
      tier: BADGE_TIERS.STAR,
      description: "Survive 3+ minutes with 95%+ accuracy",
      requirement: {
        type: "survival_time_and_accuracy",
        timeTarget: 180,
        accuracyTarget: 95,
      },
      getProgress: (stats) => ({
        current: stats.survivalTime || 0,
        target: 180,
        percentage: (stats.survivalTime >= 180 && stats.accuracy >= 95) ? 100 : Math.min(75, ((stats.survivalTime || 0) / 180) * 75),
      }),
    },
  ],

  TRAINER: [
    {
      id: "key_explorer",
      name: "Key Explorer",
      tier: BADGE_TIERS.BRONZE,
      description: "Type 50 correct letters in one session",
      requirement: {
        type: "correct_letters",
        target: 50,
      },
      getProgress: (stats) => ({
        current: stats.correctLetters || 0,
        target: 50,
        percentage: Math.min(100, ((stats.correctLetters || 0) / 50) * 100),
      }),
    },
    {
      id: "first_words",
      name: "First Words",
      tier: BADGE_TIERS.BRONZE,
      description: "Type 20 words correctly without major mistakes",
      requirement: {
        type: "correct_words",
        target: 20,
      },
      getProgress: (stats) => ({
        current: stats.correctWords || 0,
        target: 20,
        percentage: Math.min(100, ((stats.correctWords || 0) / 20) * 100),
      }),
    },
    {
      id: "finger_flyer",
      name: "Finger Flyer",
      tier: BADGE_TIERS.SILVER,
      description: "Reach 30+ WPM during practice",
      requirement: {
        type: "wpm_single_round",
        target: 30,
      },
      getProgress: (stats) => ({
        current: stats.wpm || 0,
        target: 30,
        percentage: Math.min(100, ((stats.wpm || 0) / 30) * 100),
      }),
    },
    {
      id: "letter_master",
      name: "Letter Master",
      tier: BADGE_TIERS.SILVER,
      description: "Type every letter of the alphabet correctly at least once",
      requirement: {
        type: "alphabet_coverage",
        target: 26,
      },
      getProgress: (stats) => ({
        current: stats.uniqueLetters?.size || 0,
        target: 26,
        percentage: Math.min(100, ((stats.uniqueLetters?.size || 0) / 26) * 100),
      }),
    },
    {
      id: "accuracy_ace_trainer",
      name: "Accuracy Ace",
      tier: BADGE_TIERS.GOLD,
      description: "Maintain 95%+ accuracy for an entire session",
      requirement: {
        type: "accuracy_single_round",
        target: 95,
      },
      getProgress: (stats) => ({
        current: stats.accuracy || 0,
        target: 95,
        percentage: Math.min(100, ((stats.accuracy || 0) / 95) * 100),
      }),
    },
    {
      id: "speed_typer",
      name: "Speed Typer",
      tier: BADGE_TIERS.GOLD,
      description: "Type 50 words correctly within the time limit",
      requirement: {
        type: "correct_words",
        target: 50,
      },
      getProgress: (stats) => ({
        current: stats.correctWords || 0,
        target: 50,
        percentage: Math.min(100, ((stats.correctWords || 0) / 50) * 100),
      }),
    },
    {
      id: "keyboard_legend",
      name: "Keyboard Legend",
      tier: BADGE_TIERS.STAR,
      description: "Complete 5 sessions with 90%+ accuracy each",
      requirement: {
        type: "consecutive_accuracy",
        target: 5,
        accuracy: 90,
      },
      getProgress: (stats) => ({
        current: stats.consecutiveAccuracySessions || 0,
        target: 5,
        percentage: Math.min(100, ((stats.consecutiveAccuracySessions || 0) / 5) * 100),
      }),
    },
  ],
};

export const getAllBadges = () => {
  return [
    ...BADGES.NORMAL.map((badge) => ({ ...badge, category: GAME_MODE_NORMAL })),
    ...BADGES.HARD.map((badge) => ({ ...badge, category: GAME_MODE_HARD })),
    ...BADGES.COMBO.map((badge) => ({ ...badge, category: GAME_MODE_COMBO })),
    ...BADGES.SURVIVAL.map((badge) => ({ ...badge, category: GAME_MODE_SURVIVAL })),
    ...BADGES.TRAINER.map((badge) => ({ ...badge, category: "TRAINER" })),
  ];
};

export const getBadgesByCategory = (category) => {
  const categoryKey = category === "Normal" ? "NORMAL" :
                      category === "Hard" ? "HARD" :
                      category === "Combo" ? "COMBO" :
                      category === "Survival" ? "SURVIVAL" :
                      category;
  return BADGES[categoryKey] || [];
};
