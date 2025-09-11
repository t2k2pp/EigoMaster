
import React, { useState, useEffect, useCallback } from 'react';
import { Dictionary, Word } from '../../types';
import DictionarySelector from '../shared/DictionarySelector';
import Button from '../ui/Button';
import FlashcardPlayer from './FlashcardPlayer';

enum FlashcardMode {
    Silent = 'silent',
    EnglishAudio = 'english_audio',
    JapaneseAudio = 'japanese_audio',
}

interface FlashcardScreenProps {
  onBack: () => void;
  dictionaries: Record<string, Dictionary>;
  initialDictionary: Dictionary | null;
  onDictionarySelect: (name: string) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const FlashcardScreen: React.FC<FlashcardScreenProps> = ({ onBack, dictionaries, initialDictionary, onDictionarySelect }) => {
  const [selectedDict, setSelectedDict] = useState<Dictionary | null>(initialDictionary);
  const [mode, setMode] = useState<FlashcardMode>(FlashcardMode.Silent);
  const [words, setWords] = useState<Word[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleStart = () => {
      if (selectedDict) {
          setWords(shuffleArray(selectedDict.words));
          setIsPlaying(true);
      }
  };

  const handleStop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  if (isPlaying) {
      return <FlashcardPlayer words={words} mode={mode} onStop={handleStop} />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">フラッシュカード</h1>
        <button onClick={onBack} className="text-slate-500 hover:text-sky-500 text-sm">
          &larr; ホームに戻る
        </button>
      </div>

      <div className="space-y-6">
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

        <div>
            <h2 className="text-lg font-semibold mb-2">モード選択</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => setMode(FlashcardMode.Silent)} className={`p-4 rounded-lg border-2 ${mode === FlashcardMode.Silent ? 'border-sky-500 bg-sky-100 dark:bg-sky-900' : 'border-slate-300 dark:border-slate-600'}`}>
                    <p className="font-bold">サイレント</p>
                    <p className="text-sm text-slate-500">一定時間で次々表示</p>
                </button>
                <button onClick={() => setMode(FlashcardMode.EnglishAudio)} className={`p-4 rounded-lg border-2 ${mode === FlashcardMode.EnglishAudio ? 'border-sky-500 bg-sky-100 dark:bg-sky-900' : 'border-slate-300 dark:border-slate-600'}`}>
                    <p className="font-bold">英語音声</p>
                    <p className="text-sm text-slate-500">英語の発音後に次へ</p>
                </button>
                <button onClick={() => setMode(FlashcardMode.JapaneseAudio)} className={`p-4 rounded-lg border-2 ${mode === FlashcardMode.JapaneseAudio ? 'border-sky-500 bg-sky-100 dark:bg-sky-900' : 'border-slate-300 dark:border-slate-600'}`}>
                    <p className="font-bold">日本語音声</p>
                    <p className="text-sm text-slate-500">日本語の発音後に次へ</p>
                </button>
            </div>
        </div>

        <Button onClick={handleStart} disabled={!selectedDict}>
            スタート
        </Button>
      </div>
    </div>
  );
};

export default FlashcardScreen;
