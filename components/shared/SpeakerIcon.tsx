
import React from 'react';

interface SpeakerIconProps {
  onClick: () => void;
  isSpeaking: boolean;
  size?: number;
}

const SpeakerIcon: React.FC<SpeakerIconProps> = ({ onClick, isSpeaking, size = 24 }) => {
  return (
    <button onClick={onClick} disabled={isSpeaking} className="p-2 rounded-full hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-sky-500 ${isSpeaking ? 'animate-pulse' : ''}`}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    </button>
  );
};

export default SpeakerIcon;
