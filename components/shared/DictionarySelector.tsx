import React from 'react';
import { Dictionary } from '../../types';

interface DictionarySelectorProps {
  dictionaries: Record<string, Dictionary>;
  selectedDictionaryName: string;
  onSelect: (name: string) => void;
}

const DictionarySelector: React.FC<DictionarySelectorProps> = ({ dictionaries, selectedDictionaryName, onSelect }) => {
  return (
    <div className="mb-6">
      <label htmlFor="dictionary-select" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
        辞書を選択
      </label>
      <select
        id="dictionary-select"
        value={selectedDictionaryName}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm py-2 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        {/* FIX: Explicitly cast the result of Object.values to Dictionary[] to provide type information to the map function. */}
        {(Object.values(dictionaries) as Dictionary[]).map((dict) => (
          <option key={dict.name} value={dict.name}>
            {dict.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DictionarySelector;