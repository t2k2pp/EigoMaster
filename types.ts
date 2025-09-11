
export interface Word {
  english: string;
  japanese: string;
}

export interface Dictionary {
  name: string;
  words: Word[];
}

export enum AppMode {
  Home = 'home',
  SpellingQuiz = 'spelling_quiz',
  Dictionary = 'dictionary',
  Flashcards = 'flashcards',
  Stats = 'stats',
}

export interface WordStat {
  english: string;
  correct: number;
  incorrect: number;
  lastAttempt: Date;
  accuracy: number;
}

export interface QuizHistory {
  id?: number;
  date: Date;
  dictionaryName: string;
  score: number;
  total: number;
  streak: number;
}
