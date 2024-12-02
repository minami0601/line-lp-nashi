import { useState, useEffect, useRef, useCallback } from 'react';
import { Countdown } from './components/Countdown';
import { VideoPlayer } from './components/VideoPlayer';
import { CTAButton } from './components/CTAButton';
import { ScrollIndicator } from './components/ScrollIndicator';
import {
  TrendingUp,
  FileEdit,
  Users,
  Target,
  Briefcase,
  Network,
  Gift,
} from 'lucide-react';

function App() {
  const [isExpired, setIsExpired] = useState(false);
  const [showElement, setShowElement] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  // データ送信フラグ
  const dataSent = useRef(false);

  const SPREADSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzTZLsFuo-1rQVUtq3Uk361__o2Hg3zj_EaCLYIq6V-hTUAFJhhwMd8nyX5aYMBEPky/exec';

  const [sessionId] = useState(() => crypto.randomUUID()); // ユニークなセッションID
  const [startTime] = useState(new Date()); // セッション開始時間

  const MAX_SESSION_DURATION = 20 * 60; // 最大30分（秒単位）
  const [shouldStopTracking, setShouldStopTracking] = useState(false);

  const sendData = useCallback(() => {
    const data = {
      sessionId, // セッションIDを追加
      timestamp: new Date().toISOString(),
      scrollPercentage: Math.round(scrollPercentage),
      scrollHeight,
      clientHeight,
      scrollTop,
      playedSeconds,
      showElement,
      userAgent: navigator.userAgent,
      sessionDuration: (new Date().getTime() - startTime.getTime()) / 1000, // セッション時間（秒）
    };

    try {
      const jsonData = JSON.stringify(data);

      if (navigator.sendBeacon) {
        navigator.sendBeacon(SPREADSHEET_WEBHOOK_URL, jsonData);
        console.log('データ送信完了 (sendBeacon)');
      } else {
        fetch(SPREADSHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: jsonData,
        });
        console.log('データ送信完了 (fetch fallback)');
      }
    } catch (error) {
      console.error('データ送信エラー:', error);
    }
  }, [sessionId, scrollPercentage, scrollHeight, clientHeight, scrollTop, playedSeconds, showElement, startTime]);

  useEffect(() => {
    // 最初の1分間は10秒ごとに送信
    const initialInterval = setInterval(() => {
      const sessionDuration = (new Date().getTime() - startTime.getTime()) / 1000;

      if (sessionDuration > MAX_SESSION_DURATION) {
        setShouldStopTracking(true);
        return;
      }

      if (sessionDuration <= 60) {
        sendData();
      }
    }, 10000);

    // 1分後から30秒ごとに送信
    const regularInterval = setInterval(() => {
      const sessionDuration = (new Date().getTime() - startTime.getTime()) / 1000;

      if (sessionDuration > MAX_SESSION_DURATION) {
        setShouldStopTracking(true);
        return;
      }

      if (sessionDuration > 60) {
        sendData();
      }
    }, 30000);

    return () => {
      clearInterval(initialInterval);
      clearInterval(regularInterval);
    };
  }, [sendData, startTime]);

  // インターバルのクリーンアップ
  useEffect(() => {
    if (shouldStopTracking) {
      // 最後のデータを送信
      sendData();
      console.log('トラッキングを終了しました（最大記録時間に到達）');
    }
  }, [shouldStopTracking, sendData]);

  const handleCTAClick = () => {
    if (dataSent.current) return;
    const body = JSON.stringify({
      sessionId,
      timestamp: new Date().toISOString(),
      scrollPercentage: Math.round(scrollPercentage),
      scrollHeight,
      clientHeight,
      scrollTop,
      playedSeconds,
      showElement,
      userAgent: navigator.userAgent,
      sessionDuration: (new Date().getTime() - startTime.getTime()) / 1000,
    });

    fetch(SPREADSHEET_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then(() => {
        console.log('リクエスト送信成功 (no-cors モード)');
      })
      .catch((error) => {
        console.error('リクエスト送信エラー:', error);
      });
    dataSent.current = true; // データ送信済み
    window.open('https://line.me/R/oaMessage/@952zkzfj/?12%2F1%2017%3A00~19%3A00%0D%0A12%2F3%2011%3A00~12%3A00%2C%2019%3A00~%0D%0A12%2F10%209%3A%3A00~12%3A00', '_blank');
  };

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      sendData();
    }
  }, [sendData]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;

    setScrollPercentage(scrolled);
    setScrollHeight(scrollHeight);
    setClientHeight(clientHeight);
    setScrollTop(scrollTop);
  }, []);

  const handleVideoProgress = (seconds: number) => {
    setPlayedSeconds(seconds); // 再生秒数を更新
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    handleScroll,
    handleVisibilityChange
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-blue-900 text-white py-2 sm:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-relaxed mb-4">
            <p>PM/PL経験なしでも</p>
            <p>実務経験3年で</p>
            <p>
              <span className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                月単価100万円
              </span>
              を
            </p>
            達成した方法
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        <section className="mb-6 sm:mb-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6">
              この動画は
              <br />
              <span className="text-3xl sm:text-4xl font-extrabold underline text-yellow-500">
                24時間
              </span>
              で見れなくなります
            </h2>
          </div>

          <Countdown onExpire={() => setIsExpired(true)} />
          {showElement && <ScrollIndicator />}
          <VideoPlayer
            isExpired={isExpired}
            onReachTime={() => setShowElement(true)}
            onProgress={handleVideoProgress}
          />
        </section>

        {showElement && (
          <div>
            <section className="mb-12 sm:mb-16">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="inline-block text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-900 mb-2">
                  個別コンサルのご案内
                </h2>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-900"></div>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 sm:mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-blue-900 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    個別コンサルに申し込むと...
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          自分の適正単価が分かる
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          あなたのスキルをお聞きして最高どのくらいの単価が貰えるのか見積もりします
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          単価が上がりやすいエージェントを紹介
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          厳選された信頼できるエージェントをご紹介
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileEdit className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          単価アップのためのロードマップ
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          具体的な目標と実現のための行動計画をご提供
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 sm:mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-blue-900 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    個別コンサルで何をするのか
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          単価10万円アップのロードマップ作り
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          あなたのスキルをお聞きして具体的なロードマップを作成
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Briefcase className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          スキルシートの添削
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          単価アップを実現するための効果的なスキルシート作成支援
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Network className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          単価が上がりやすいエージェントをご紹介
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          既に単価が上がりやすいエージェントを紹介します
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
                個別コンサルの実績
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <img
                  src="https://d27rnpuamwvieu.cloudfront.net/0lBGI9ly4BCwp4NRD7jeK5AXX/normal"
                  alt="実績者の声1"
                />
                <img
                  src="https://d27rnpuamwvieu.cloudfront.net/0SO67UrlrzIbX1jlvKb8tygXX/normal"
                  alt="実績者の声2"
                />
                <img
                  src="https://d27rnpuamwvieu.cloudfront.net/0uKuWFK9yRj0C127IJ9jbxQXX/normal"
                  alt="実績者の声3"
                />
                <img
                  src="https://d27rnpuamwvieu.cloudfront.net/0tPiRPpWAOhTzY6oAAbVAvgXX/normal"
                  alt="実績者の声4"
                />
              </div>
            </section>

            <section className="mb-12 sm:mb-16">
              <div className="text-center mb-8">
                <h2 className="inline-block text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                  🎁 個別コンサル参加特典 🎁
                </h2>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-600 to-pink-600"></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                {[
                  {
                    title: '月単価100万円達成者のスキルシート',
                    description:
                      '実際に月単価100万円を達成したエンジニアが使用したスキルシート',
                  },
                  {
                    title: '案件管理シート',
                    description: '8つの項目で将来につながる案件を選定する方法',
                  },
                  {
                    title: '月単価130万エンジニアとの対談動画',
                    description: '月単価130万円エンジニアとの特別対談',
                  },
                  {
                    title: 'なっしーコミュニティ招待',
                    description:
                      '平均単価70万円のエンジニアが集まるコミュニティへの招待',
                  },
                ].map((bonus, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-400"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Gift className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {bonus.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600">{bonus.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
                最後に
              </h2>
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                <p className="text-sm sm:text-base text-gray-800 mb-4">
                  エンジニアの単価が上がったことで時間にゆとりができ、家族で幸せに暮らせています！
                </p>
                <p className="text-sm sm:text-base text-gray-800 mb-4">
                  他にも趣味に時間を使ったり、平日に旅行に行ったりという生活をしております！
                </p>
                <p className="text-sm sm:text-base text-gray-800 mb-4">
                  このような暮らしを体験してほしいので、
                  <br />
                  ぜひ、あなたの単価を上げたいと思っています！
                </p>
                <p className="font-bold text-gray-800">
                  個別コンサルでお会いできるのを楽しみにしています！
                </p>
              </div>
              <img
                src="https://d27rnpuamwvieu.cloudfront.net/0kAVFNS6nrKiGT9FEEKpK0wXX/normal"
                alt=""
              />
            </section>

            <section className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
                申し込み方法
              </h2>
              <ol className="text-left max-w-2xl mx-auto mb-6 sm:mb-8 space-y-4 text-sm sm:text-base">
                <li className="bg-white shadow-lg rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <span className="font-bold text-gray-800">
                      「個別コンサルに申し込む」ボタンをクリックしてください
                    </span>
                  </div>
                  <div className="mt-4">
                    <img
                      src="https://d27rnpuamwvieu.cloudfront.net/0Fwc4Xe7gfwtOzrIQfnJuUwXX/normal"
                      alt="Step 1"
                      className="w-full rounded-lg"
                    />
                  </div>
                </li>
                <li className="bg-white shadow-lg rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <span className="font-bold text-gray-800">
                      LINEに送られている「申し込む▶︎」をタップしてください
                    </span>
                  </div>
                  <div className="mt-4">
                    <img
                      src="https://d27rnpuamwvieu.cloudfront.net/06GxLGMwL8F7hUbdezGYkiwXX/normal"
                      alt="Step 2"
                      className="w-full rounded-lg"
                    />
                  </div>
                </li>
              </ol>
              <CTAButton onClick={handleCTAClick} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
