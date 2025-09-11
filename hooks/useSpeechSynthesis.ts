
import { useState, useEffect, useCallback } from 'react';

interface SpeakParams {
  text: string;
  lang: 'en-US' | 'ja-JP';
  onEnd?: () => void;
}

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  const updateVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
  }, []);

  useEffect(() => {
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [updateVoices]);

  const speak = useCallback(({ text, lang, onEnd }: SpeakParams) => {
    if (!text || speaking) return;

    // Prioritize Google voices, then Microsoft, then others
    const voicePriority = (voice: SpeechSynthesisVoice, targetLang: string) => {
      if (voice.lang !== targetLang) return 0;
      if (voice.name.includes('Google')) return 3;
      if (voice.name.includes('Microsoft')) return 2;
      return 1;
    };
    
    const sortedVoices = [...voices].sort((a, b) => voicePriority(b, lang) - voicePriority(a, lang));
    const voice = sortedVoices.find(v => v.lang === lang);

    if (!voice) {
      console.warn(`No voice found for language: ${lang}`);
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = lang;
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror", event);
        setSpeaking(false);
        onEnd?.();
    };

    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(utterance);
  }, [voices, speaking]);

  return { speak, speaking };
};
