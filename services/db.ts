
import { WordStat, QuizHistory } from '../types';

const DB_NAME = 'EigoMasterDB';
const DB_VERSION = 1;
const WORD_STATS_STORE = 'wordStats';
const QUIZ_HISTORY_STORE = 'quizHistory';

class IndexedDBService {
  private db: IDBDatabase | null = null;

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(WORD_STATS_STORE)) {
          db.createObjectStore(WORD_STATS_STORE, { keyPath: 'english' });
        }
        if (!db.objectStoreNames.contains(QUIZ_HISTORY_STORE)) {
          db.createObjectStore(QUIZ_HISTORY_STORE, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }
  
  private getStore(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) {
        throw new Error('Database not initialized');
    }
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async updateWordStat(english: string, isCorrect: boolean): Promise<void> {
    const store = this.getStore(WORD_STATS_STORE, 'readwrite');
    const request = store.get(english);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const data: WordStat = request.result || { english, correct: 0, incorrect: 0 };
            if (isCorrect) {
                data.correct += 1;
            } else {
                data.incorrect += 1;
            }
            data.lastAttempt = new Date();
            
            const total = data.correct + data.incorrect;
            data.accuracy = total > 0 ? (data.correct / total) * 100 : 0;

            const updateRequest = store.put(data);
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
  }

  async getWordStats(): Promise<WordStat[]> {
    const store = this.getStore(WORD_STATS_STORE, 'readonly');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
  }
  
  async addQuizHistory(history: Omit<QuizHistory, 'id'>): Promise<void> {
      const store = this.getStore(QUIZ_HISTORY_STORE, 'readwrite');
      const request = store.add(history);

      return new Promise((resolve, reject) => {
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
      });
  }

  async getQuizHistory(): Promise<QuizHistory[]> {
      const store = this.getStore(QUIZ_HISTORY_STORE, 'readonly');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result.sort((a, b) => b.date.getTime() - a.date.getTime()));
          request.onerror = () => reject(request.error);
      });
  }
}

export const db = new IndexedDBService();
