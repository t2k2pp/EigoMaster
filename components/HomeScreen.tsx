
import React from 'react';
import { AppMode } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';

interface HomeScreenProps {
  onModeSelect: (mode: AppMode) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600 mb-2">
          Eigo Master
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">英語学習を、もっと楽しく。</p>
      </header>
      
      <Card className="w-full max-w-md">
        <div className="space-y-4">
          <Button onClick={() => onModeSelect(AppMode.SpellingQuiz)}>
            スペリングクイズ
          </Button>
          <Button onClick={() => onModeSelect(AppMode.Flashcards)} variant="secondary">
            フラッシュカード
          </Button>
          <Button onClick={() => onModeSelect(AppMode.Dictionary)} variant="ghost">
            辞書モード
          </Button>
          <Button onClick={() => onModeSelect(AppMode.Stats)} variant="ghost">
            学習記録
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
