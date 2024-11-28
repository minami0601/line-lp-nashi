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
      className="flex flex-col items-center mt-8 mb-4 cursor-pointer animate-bounce"
    >
      <p className="text-gray-600 font-bold mb-1">個別コンサルのご案内！</p>
      <p>スクロールしてチェック</p>
      <ChevronDown className="w-8 h-8 text-blue-600" />
    </div>
  );
};
