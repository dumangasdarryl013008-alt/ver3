import { TAGALOG_MODE, ENGLISH_MODE } from "../constants/Constants";
import {
  ENGLISH_SENTENCES,
  TAGALOG_SENTENCES,
} from "../constants/SentencesCollection";
import { randomIntFromRange } from "./randomUtils";

const sentencesGenerator = (sentencesCount, language) => {
  if (language === ENGLISH_MODE) {
    const EnglishSentencesList = [];
    for (let i = 0; i < sentencesCount; i++) {
      const rand = randomIntFromRange(0, 50);
      EnglishSentencesList.push(ENGLISH_SENTENCES[rand]);
    }
    return EnglishSentencesList;
  }
  if (language === TAGALOG_MODE) {
    const TagalogSentencesList = [];
    for (let i = 0; i < sentencesCount; i++) {
      const rand = randomIntFromRange(0, 57);
      TagalogSentencesList.push(TAGALOG_SENTENCES[rand]);
    }
    return TagalogSentencesList;
  }
};

export { sentencesGenerator };
