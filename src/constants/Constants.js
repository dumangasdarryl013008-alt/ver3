const DEFAULT_WORDS_COUNT = 200;
const COUNT_DOWN_90 = 90;
const COUNT_DOWN_60 = 60;
const COUNT_DOWN_30 = 30;
const COUNT_DOWN_15 = 15;
const DEFAULT_COUNT_DOWN = COUNT_DOWN_60;

const DEFAULT_DIFFICULTY = "normal";
const HARD_DIFFICULTY = "hard";
const NUMBER_ADDON = "+number";
const SYMBOL_ADDON = "+symbol";
const RESTART_BUTTON_TOOLTIP_TITLE = "[Tab] + [Enter] to quickly restart";
const REDO_BUTTON_TOOLTIP_TITLE = "[Tab] + [Space] to quickly redo";
const RESTART_BUTTON_TOOLTIP_TITLE_WORDSCARD =
  "[Tab] + [Enter] to quick restart the chapter";
const SELECT_ONE_OR_MORE_CHAPTERS =
  "Open to select one or more chapters. Pick the chapters in the typing area.";
const RECITE_MODE_TITLE = "hide the word (默写模式)";
const DEFAULT_DIFFICULTY_TOOLTIP_TITLE =
  "normal mode generates random words from top 1000 most frequently used words in English dataset.";
const HARD_DIFFICULTY_TOOLTIP_TITLE =
  "hard mode generates random words from blog posts words data, so you may encounter longer and less frequently used word.";
const NUMBER_ADDON_TOOLTIP_TITLE =
  "number mode generates word which contains random number";
const SYMBOL_ADDON_TOOLTIP_TITLE =
  "number mode generates word which contains random symbol";
const CHAR_TOOLTIP_TITLE =
  "correct/incorrect/missing/extra\n extras are recorded even if deleted.";
const SENTENCE_CHAR_TOOLTIP_TITLE = "correct/incorrect/extra\n";
const ENGLISH_MODE_TOOLTIP_TITLE = "English Mode";
const TAGALOG_MODE_TOOLTIP_TITLE = "Tagalog Mode";
const DEFAULT_DIFFICULTY_TOOLTIP_TITLE_TAGALOG =
  "normal mode generates random words from top 5000 most frequently used words in Tagalog dataset.";
const HARD_DIFFICULTY_TOOLTIP_TITLE_TAGALOG =
  "hard mode generates random words from common Tagalog phrases.";

const GITHUB_TOOLTIP_TITLE =
  "Dear visitors: \n For feature requests or bug reports, please submit an issue to the github repo. \n Welcome contributing with a fork. \n If you like my works, please star the project. \n Thanks! \n";
const SUPPORT_TOOLTIP_TITLE =
  "Help me keep the site live with your support : D \n Appreciate with love! \n";
const AUTHOR = "author: @Muyang Guo\n";
const GITHUB_REPO_LINK = "project: @Github\n";

const FOCUS_MODE = "Focus mode";

const ULTRA_ZEN_MODE = "Ultra Zen Mode";

const MUSIC_MODE =
  "Spotify player. You will need to login spotify first to use the full feature.";
const FREE_MODE =
  "Free typing mode\nType any thing, no pressure, it's coffee time! \n ";

const ENGLISH_MODE = "ENGLISH_MODE";
const TAGALOG_MODE = "TAGALOG_MODE";

const GAME_MODE = "GAME_MODE";
const GAME_MODE_DEFAULT = "WORD_MODE";
const GAME_MODE_SENTENCE = "SENTENCE_MODE";
const GAME_MODE_NORMAL = "Normal";
const GAME_MODE_HARD = "Hard";
const GAME_MODE_SURVIVAL = "Survival";
const GAME_MODE_COMBO = "Combo";
const WORD_MODE_LABEL = "word";
const SENTENCE_MODE_LABEL = "sentence";
const TRAINER_MODE = "QWERTY keyboard practice mode";

const DEFAULT_SENTENCES_COUNT = 5;
const TEN_SENTENCES_COUNT = 10;
const FIFTEEN_SENTENCES_COUNT = 15;

const ENGLISH_SENTENCE_MODE_TOOLTIP_TITLE = "English Sentence Mode";
const TAGALOG_SENTENCE_MODE_TOOLTIP_TITLE = "Tagalog Sentence Mode";

const WORDS_CARD_MODE = "Words Card mode, learn something in typing!";

const PACING_CARET = "caret";
const PACING_PULSE = "pulse";

const PACING_CARET_TOOLTIP =
  'type the word with a caret "|" , character by character.';
const PACING_PULSE_TOOLTIP =
  'type the word with a pulse "____", this helps improving wpm and your speed typing pace habit.';

const NUMBER_ADDON_KEY = "number";
const SYMBOL_ADDON_KEY = "symbol";

export {
  DEFAULT_WORDS_COUNT,
  DEFAULT_COUNT_DOWN,
  COUNT_DOWN_60,
  COUNT_DOWN_30,
  COUNT_DOWN_15,
  COUNT_DOWN_90,
  DEFAULT_DIFFICULTY,
  HARD_DIFFICULTY,
  NUMBER_ADDON,
  SYMBOL_ADDON,
  DEFAULT_DIFFICULTY_TOOLTIP_TITLE,
  HARD_DIFFICULTY_TOOLTIP_TITLE,
  NUMBER_ADDON_TOOLTIP_TITLE,
  SYMBOL_ADDON_TOOLTIP_TITLE,
  CHAR_TOOLTIP_TITLE,
  SENTENCE_CHAR_TOOLTIP_TITLE,
  GITHUB_TOOLTIP_TITLE,
  SUPPORT_TOOLTIP_TITLE,
  FOCUS_MODE,
  MUSIC_MODE,
  ENGLISH_MODE,
  TAGALOG_MODE,
  RESTART_BUTTON_TOOLTIP_TITLE,
  REDO_BUTTON_TOOLTIP_TITLE,
  ENGLISH_MODE_TOOLTIP_TITLE,
  TAGALOG_MODE_TOOLTIP_TITLE,
  DEFAULT_DIFFICULTY_TOOLTIP_TITLE_TAGALOG,
  HARD_DIFFICULTY_TOOLTIP_TITLE_TAGALOG,
  FREE_MODE,
  GAME_MODE,
  GAME_MODE_DEFAULT,
  GAME_MODE_SENTENCE,
  GAME_MODE_NORMAL,
  GAME_MODE_HARD,
  GAME_MODE_SURVIVAL,
  GAME_MODE_COMBO,
  WORD_MODE_LABEL,
  SENTENCE_MODE_LABEL,
  DEFAULT_SENTENCES_COUNT,
  TEN_SENTENCES_COUNT,
  FIFTEEN_SENTENCES_COUNT,
  ENGLISH_SENTENCE_MODE_TOOLTIP_TITLE,
  TAGALOG_SENTENCE_MODE_TOOLTIP_TITLE,
  AUTHOR,
  GITHUB_REPO_LINK,
  TRAINER_MODE,
  WORDS_CARD_MODE,
  RESTART_BUTTON_TOOLTIP_TITLE_WORDSCARD,
  SELECT_ONE_OR_MORE_CHAPTERS,
  RECITE_MODE_TITLE,
  PACING_CARET,
  PACING_PULSE,
  PACING_CARET_TOOLTIP,
  PACING_PULSE_TOOLTIP,
  NUMBER_ADDON_KEY,
  SYMBOL_ADDON_KEY,
  ULTRA_ZEN_MODE,
};
