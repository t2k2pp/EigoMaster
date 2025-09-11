
import React, { useState, useEffect, useMemo } from 'react';
import { Dictionary, Word } from '../../types';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { db } from '../../services/db';
import DictionarySelector from '../shared/DictionarySelector';
import Button from '../ui/Button';
import Keyboard from '../shared/Keyboard';
import SpeakerIcon from '../shared/SpeakerIcon';

interface SpellingQuizScreenProps {
  onBack: () => void;
  dictionaries: Record<string, Dictionary>;
  initialDictionary: Dictionary | null;
  onDictionarySelect: (name: string) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SpellingQuizScreen: React.FC<SpellingQuizScreenProps> = ({ onBack, dictionaries, initialDictionary, onDictionarySelect }) => {
  const [selectedDict, setSelectedDict] = useState<Dictionary | null>(initialDictionary);
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'none'>('none');
  const [score, setScore] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const { speak, speaking } = useSpeechSynthesis();

  const currentWord = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  useEffect(() => {
    if (isQuizActive && currentWord) {
      speak({ text: currentWord.english, lang: 'en-US' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord, isQuizActive]);

  const handleStartQuiz = () => {
    if (selectedDict) {
      const shuffledWords = shuffleArray(selectedDict.words);
      setQuestions(shuffledWords.slice(0, 10)); // 10 questions per session
      setCurrentQuestionIndex(0);
      setUserInput('');
      setFeedback('none');
      setScore(0);
      setIsQuizFinished(false);
      setIsQuizActive(true);
    }
  };

  const handleKeyPress = (key: string) => {
    if (feedback !== 'none') return;
    setUserInput(prev => prev + key);
  };

  const handleBackspace = () => {
    if (feedback !== 'none') return;
    setUserInput(prev => prev.slice(0, -1));
  };
  
  const handleEnter = async () => {
    if (feedback !== 'none' || !currentWord) return;
    
    const isCorrect = userInput.toLowerCase() === currentWord.english.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    await db.updateWordStat(currentWord.english, isCorrect);
    
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserInput('');
        setFeedback('none');
      } else {
        setIsQuizFinished(true);
        setIsQuizActive(false);
        db.addQuizHistory({
          date: new Date(),
          dictionaryName: selectedDict?.name || 'Unknown',
          score: score + (isCorrect ? 1 : 0),
          total: questions.length,
          streak: 0, // Streak logic can be enhanced here
        });
      }
    }, 1500);
  };
  
  const renderQuiz = () => (
    <div className="flex flex-col items-center text-center">
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg p-2 mb-4">
        <div 
            className="bg-sky-400 h-4 rounded-lg transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
        ></div>
      </div>
      <p className="mb-2 text-slate-500 dark:text-slate-400">以下の日本語の単語を英語で入力してください:</p>
      <h2 className="text-4xl font-bold mb-4">{currentWord?.japanese}</h2>
      
      <SpeakerIcon onClick={() => speak({ text: currentWord.english, lang: 'en-US' })} isSpeaking={speaking} size={32} />

      <div className={`my-6 p-4 w-full text-center text-3xl font-bold tracking-widest h-16 rounded-lg border-2 ${
        feedback === 'correct' ? 'bg-green-100 dark:bg-green-900 border-green-500' : 
        feedback === 'incorrect' ? 'bg-red-100 dark:bg-red-900 border-red-500' : 
        'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
      }`}>
        {feedback === 'incorrect' ? currentWord.english : userInput}
      </div>

      <Keyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} onEnter={handleEnter} />
    </div>
  );
  
  const renderResults = () => (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">クイズ終了！</h2>
      <p className="text-5xl font-bold my-8">{score} / {questions.length}</p>
      <div className="space-y-4">
        <Button onClick={handleStartQuiz}>もう一度挑戦</Button>
        <Button onClick={() => setIsQuizActive(false)} variant="secondary">辞書を選び直す</Button>
        <Button onClick={onBack} variant="ghost">ホームに戻る</Button>
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-6">スペリングクイズ</h2>
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
      <Button onClick={handleStartQuiz} disabled={!selectedDict}>
        スタート
      </Button>
       <button onClick={onBack} className="mt-4 text-slate-500 hover:text-sky-500">
        &larr; ホームに戻る
      </button>
    </div>
  );
  
  return (
    <div className="p-4">
      {isQuizFinished ? renderResults() : isQuizActive ? renderQuiz() : renderSetup()}
    </div>
  );
};

export default SpellingQuizScreen;
