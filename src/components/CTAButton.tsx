import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  onClick: () => void;
}

export const CTAButton: React.FC<CTAButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 w-full max-w-md mx-auto animate-bounce"
    >
      <span className="text-lg">個別コンサルに申し込む</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};
