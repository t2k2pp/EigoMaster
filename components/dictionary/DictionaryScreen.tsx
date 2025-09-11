
import React, { useState, useMemo } from 'react';
import { Dictionary, Word } from '../../types';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import DictionarySelector from '../shared/DictionarySelector';
import SpeakerIcon from '../shared/SpeakerIcon';
import Card from '../ui/Card';

interface DictionaryScreenProps {
  onBack: () => void;
  dictionaries: Record<string, Dictionary>;
  initialDictionary: Dictionary | null;
  onDictionarySelect: (name: string) => void;
}

const DictionaryScreen: React.FC<DictionaryScreenProps> = ({ onBack, dictionaries, initialDictionary, onDictionarySelect }) => {
  const [selectedDict, setSelectedDict] = useState<Dictionary | null>(initialDictionary);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<'en' | 'ja'>('en');
  const { speak, speaking } = useSpeechSynthesis();

  const filteredWords = useMemo(() => {
    if (!selectedDict) {
      return [];
    }
    if (!searchTerm) {
      return selectedDict.words;
    }
    const term = searchTerm.toLowerCase();
    return selectedDict.words.filter(word => {
      if (searchMode === 'en') {
        return word.english.toLowerCase().includes(term);
      }
      return word.japanese.includes(term);
    });
  }, [selectedDict, searchTerm, searchMode]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">辞書</h1>
        <button onClick={onBack} className="text-slate-500 hover:text-sky-500 text-sm">
          &larr; ホームに戻る
        </button>
      </div>

      <Card>
        {selectedDict && <DictionarySelector 
            dictionaries={dictionaries}
            selectedDictionaryName={selectedDict.name}
            onSelect={(name) => {
                const newDict = dictionaries[name];
                if (newDict) {
                    setSelectedDict(newDict);
                    onDictionarySelect(name);
                }
            }}
        />}

        <div className="flex space-x-2 mb-4">
          <button 
            onClick={() => setSearchMode('en')}
            className={`flex-1 py-2 rounded-lg transition-colors ${searchMode === 'en' ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            英→日
          </button>
          <button 
            onClick={() => setSearchMode('ja')}
            className={`flex-1 py-2 rounded-lg transition-colors ${searchMode === 'ja' ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            日→英
          </button>
        </div>
        
        <input
          type="text"
          placeholder={searchMode === 'en' ? '英語で検索...' : '日本語で検索...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-sky-500 focus:outline-none transition-colors"
        />

        <div className="mt-6 max-h-96 overflow-y-auto space-y-3">
          {filteredWords.map((word, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="text-lg font-semibold">{word.english}</p>
                <p className="text-slate-600 dark:text-slate-400">{word.japanese}</p>
              </div>
              <div className="flex">
                <SpeakerIcon isSpeaking={speaking} onClick={() => speak({ text: word.english, lang: 'en-US' })} />
                <SpeakerIcon isSpeaking={speaking} onClick={() => speak({ text: word.japanese, lang: 'ja-JP' })} />
              </div>
            </div>
          ))}
          {searchTerm && filteredWords.length === 0 && (
            <p className="text-center text-slate-500 mt-4">見つかりませんでした。</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DictionaryScreen;