
import React, { useState, useEffect, useCallback } from 'react';
import { Word } from '../../types';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import Button from '../ui/Button';

enum FlashcardMode {
    Silent = 'silent',
    EnglishAudio = 'english_audio',
    JapaneseAudio = 'japanese_audio',
}

interface FlashcardPlayerProps {
    words: Word[];
    mode: FlashcardMode;
    onStop: () => void;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ words, mode, onStop }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { speak, speaking } = useSpeechSynthesis();
    const [isFlipping, setIsFlipping] = useState(false);

    const currentWord = words[currentIndex];

    const nextCard = useCallback(() => {
        setIsFlipping(true);
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % words.length);
          setIsFlipping(false);
        }, 300); // Animation duration
    }, [words.length]);

    useEffect(() => {
        if (!currentWord) return;

        let timeoutId: number;

        const playAudio = () => {
            if (mode === FlashcardMode.EnglishAudio) {
                speak({ text: currentWord.english, lang: 'en-US', onEnd: nextCard });
            } else if (mode === FlashcardMode.JapaneseAudio) {
                speak({ text: currentWord.japanese, lang: 'ja-JP', onEnd: nextCard });
            }
        };

        if (mode === FlashcardMode.Silent) {
            timeoutId = window.setTimeout(nextCard, 3000); // 3 seconds for silent mode
        } else {
            // Give a brief moment before playing audio
            timeoutId = window.setTimeout(playAudio, 500);
        }

        return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, currentWord, mode, nextCard]);

    if (!currentWord) {
        return (
            <div className="text-center p-8">
                <p>単語リストが空です。</p>
                <Button onClick={onStop} className="mt-4">戻る</Button>
            </div>
        );
    }
    
    const cardContent = () => {
        const primaryClass = "text-5xl font-bold";
        const secondaryClass = "text-3xl text-slate-500 dark:text-slate-400";
        
        switch(mode) {
            case FlashcardMode.EnglishAudio:
                return <>
                    <p className={primaryClass}>{currentWord.english}</p>
                    <p className={secondaryClass}>{currentWord.japanese}</p>
                </>;
            case FlashcardMode.JapaneseAudio:
            case FlashcardMode.Silent:
            default:
                 return <>
                    <p className={primaryClass}>{currentWord.japanese}</p>
                    <p className={secondaryClass}>{currentWord.english}</p>
                </>;
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className={`w-full max-w-md h-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col justify-center items-center text-center p-6 transition-transform duration-300 ${isFlipping ? 'transform rotate-y-90' : ''}`}>
                {cardContent()}
            </div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
                <p className="text-center text-slate-500 mb-4">{currentIndex + 1} / {words.length}</p>
                <Button onClick={onStop} variant="ghost">終了する</Button>
            </div>
        </div>
    );
};

export default FlashcardPlayer;
