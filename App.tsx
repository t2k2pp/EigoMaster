
import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, Dictionary } from './types';
import HomeScreen from './components/HomeScreen';
import SpellingQuizScreen from './components/spelling/SpellingQuizScreen';
import DictionaryScreen from './components/dictionary/DictionaryScreen';
import FlashcardScreen from './components/flashcard/FlashcardScreen';
import { dictionaryService } from './services/dictionaryService';
import { db } from './services/db';
import StatsScreen from './components/spelling/StatsScreen';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Home);
  const [dictionaries, setDictionaries] = useState<Record<string, Dictionary>>({});
  const [selectedDictionary, setSelectedDictionary] = useState<Dictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await db.init();
        const loadedDictionaries = await dictionaryService.loadDictionaries();
        setDictionaries(loadedDictionaries);
        if (Object.keys(loadedDictionaries).length > 0) {
            const storedDictName = localStorage.getItem('selectedDictionaryName') || Object.keys(loadedDictionaries)[0];
            setSelectedDictionary(loadedDictionaries[storedDictName]);
        }
      } catch (error) {
        console.error("Failed to initialize the app:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleModeChange = useCallback((newMode: AppMode) => {
    setMode(newMode);
  }, []);

  const handleDictionarySelect = useCallback((dictionaryName: string) => {
    const newDict = dictionaries[dictionaryName];
    if (newDict) {
      setSelectedDictionary(newDict);
      localStorage.setItem('selectedDictionaryName', dictionaryName);
    }
  }, [dictionaries]);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">読み込み中...</div>
        </div>
      );
    }

    switch (mode) {
      case AppMode.SpellingQuiz:
        return <SpellingQuizScreen onBack={() => setMode(AppMode.Home)} dictionaries={dictionaries} initialDictionary={selectedDictionary} onDictionarySelect={handleDictionarySelect} />;
      case AppMode.Dictionary:
        return <DictionaryScreen onBack={() => setMode(AppMode.Home)} dictionaries={dictionaries} initialDictionary={selectedDictionary} onDictionarySelect={handleDictionarySelect} />;
      case AppMode.Flashcards:
        return <FlashcardScreen onBack={() => setMode(AppMode.Home)} dictionaries={dictionaries} initialDictionary={selectedDictionary} onDictionarySelect={handleDictionarySelect} />;
       case AppMode.Stats:
        return <StatsScreen onBack={() => setMode(AppMode.Home)} />;
      case AppMode.Home:
      default:
        return <HomeScreen onModeSelect={handleModeChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <main className="container mx-auto max-w-2xl p-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
