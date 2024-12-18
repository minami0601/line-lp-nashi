import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ScrollIndicator: React.FC = () => {
  const handleClick = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center mt-10 mb-4 cursor-pointer animate-bounce"
    >
      <p className="text-3xl text-gray-600 font-bold mb-1">個別コンサルのご案内！</p>
      <p className="text-3xl font-bold">スクロールしてチェック</p>
      <ChevronDown className="w-8 h-8 text-blue-600" />
    </div>
  );
};
