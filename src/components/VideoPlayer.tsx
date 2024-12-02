import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  isExpired: boolean;
  onReachTime: () => void;
  onProgress: (playedSeconds: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  isExpired,
  onReachTime,
  onProgress,
}) => {
  const [hasReachedTime, setHasReachedTime] = useState(() => {
    return localStorage.getItem('hasReachedTime') === 'true';
  });

  useEffect(() => {
    if (hasReachedTime) {
      onReachTime();
    }
  }, [hasReachedTime, onReachTime]);

  const handleProgress = (state: { playedSeconds: number }) => {
    const currentTime = state.playedSeconds;

    // 親コンポーネントに再生秒数を送信
    onProgress(currentTime);

    // 特定の秒数に到達した場合の処理
    if (currentTime >= 540 && !hasReachedTime) {
      setHasReachedTime(true);
      localStorage.setItem('hasReachedTime', 'true');
      onReachTime();
    }
  };

  if (isExpired) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <img
          src="https://d27rnpuamwvieu.cloudfront.net/0sZaXqkH98qXtndVyVbFj2AXX/normal"
          alt="Step 2"
          className="w-full rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
      <ReactPlayer
        url="https://player.vimeo.com/video/1035028905?badge=0&autopause=0&player_id=0&app_id=58479"
        width="100%"
        height="100%"
        controls
        playing={false}
        onProgress={handleProgress}
        config={{
          youtube: {
            playerVars: { showinfo: 1 },
          },
        }}
      />
    </div>
  );
};
