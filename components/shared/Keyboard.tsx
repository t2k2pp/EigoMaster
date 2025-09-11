
import React from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  disabledKeys?: string[];
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onBackspace, onEnter, disabledKeys = [] }) => {
  const keys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  const KeyButton: React.FC<{ keyValue: string }> = ({ keyValue }) => {
    const isDisabled = disabledKeys.includes(keyValue);
    return (
      <button
        onClick={() => onKeyPress(keyValue)}
        disabled={isDisabled}
        className="h-12 md:h-14 flex-1 m-1 bg-slate-200 dark:bg-slate-600 rounded-md font-bold text-lg text-slate-800 dark:text-slate-200 shadow-sm transition-colors duration-150 hover:bg-slate-300 dark:hover:bg-slate-500 active:bg-sky-400 disabled:opacity-30 disabled:hover:bg-slate-200"
      >
        {keyValue.toUpperCase()}
      </button>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 p-2 bg-slate-300 dark:bg-slate-700 rounded-lg">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((key) => <KeyButton key={key} keyValue={key} />)}
        </div>
      ))}
      <div className="flex justify-center">
        <button
          onClick={onEnter}
          className="h-12 md:h-14 flex-[2] m-1 bg-sky-500 text-white rounded-md font-bold text-lg shadow-sm transition-colors hover:bg-sky-600"
        >
          ENTER
        </button>
        <button
          onClick={onBackspace}
          className="h-12 md:h-14 flex-1 m-1 bg-slate-400 dark:bg-slate-500 text-white rounded-md font-bold text-lg shadow-sm transition-colors hover:bg-slate-500 dark:hover:bg-slate-400"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
