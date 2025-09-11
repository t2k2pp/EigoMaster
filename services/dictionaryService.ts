
import { Dictionary, Word } from '../types';

const DICTIONARY_FILES = [
  'dictionary-level1.json',
  'dictionary-level2.json',
  'dictionary-level3.json',
];

class DictionaryService {
  async loadDictionaries(): Promise<Record<string, Dictionary>> {
    const dictionaries: Record<string, Dictionary> = {};
    for (const fileName of DICTIONARY_FILES) {
      try {
        const response = await fetch(`/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${fileName}`);
        }
        const data: { name: string; words: Word[] } = await response.json();
        dictionaries[data.name] = { name: data.name, words: data.words };
      } catch (error) {
        console.error(`Error loading dictionary ${fileName}:`, error);
      }
    }
    return dictionaries;
  }
}

export const dictionaryService = new DictionaryService();
