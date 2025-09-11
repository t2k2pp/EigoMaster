
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = "w-full text-center font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variantClasses = {
    primary: "bg-sky-500 hover:bg-sky-600 text-white border-b-4 border-sky-700 active:border-b-2",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white border-b-4 border-emerald-700 active:border-b-2",
    ghost: "bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 text-sky-500 dark:text-sky-400 border-2 border-sky-500",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
