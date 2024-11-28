import React, { useEffect, useState } from 'react';

interface CountdownProps {
  onExpire: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const stored = localStorage.getItem('countdownEndTime');
    if (stored) {
      const endTime = parseInt(stored, 10);
      const now = Date.now();
      return Math.max(0, endTime - now);
    }
    // Set initial 48 hours countdown
    const endTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('countdownEndTime', endTime.toString());
    return 24 * 60 * 60 * 1000;
  });

  useEffect(() => {
    if (timeLeft === 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="bg-red-600 text-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md mx-auto mb-8">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-red-700 rounded-lg p-2">
          <div className="text-2xl sm:text-3xl font-bold">{days}</div>
          <div className="text-xs sm:text-sm">日</div>
        </div>
        <div className="bg-red-700 rounded-lg p-2">
          <div className="text-2xl sm:text-3xl font-bold">{hours}</div>
          <div className="text-xs sm:text-sm">時間</div>
        </div>
        <div className="bg-red-700 rounded-lg p-2">
          <div className="text-2xl sm:text-3xl font-bold">{minutes}</div>
          <div className="text-xs sm:text-sm">分</div>
        </div>
        <div className="bg-red-700 rounded-lg p-2">
          <div className="text-2xl sm:text-3xl font-bold">{seconds}</div>
          <div className="text-xs sm:text-sm">秒</div>
        </div>
      </div>
    </div>
  );
};
