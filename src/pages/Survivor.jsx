import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { Link } from "react-router-dom";
import { RoutePath } from "utils/RouteSetting";

const VirtualController = ({ onDirectionPress }) => {
  const handleButtonPress = (direction) => {
    let pressInterval = setInterval(() => {
      onDirectionPress({ key: direction });
    }, 100);

    const handleRelease = () => {
      clearInterval(pressInterval);
      document.removeEventListener('mouseup', handleRelease);
      document.removeEventListener('touchend', handleRelease);
    };

    document.addEventListener('mouseup', handleRelease);
    document.addEventListener('touchend', handleRelease);
    onDirectionPress({ key: direction });
  };
};

const Survivor = () => {
  const [bgmAudio, setBgmAudio] = useState(null);
  const [isBgmEnabled, setIsBgmEnabled] = useState(false);
  const gameAreaRef = useRef(null);
  const [player, setPlayer] = useState({ x: 250, y: 250, direction: 'right' });
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [enemyIntervalTime, setEnemyIntervalTime] = useState(1000);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const playerPosRef = useRef({ x: 250, y: 250, direction: 'right' });
  const [bgm] = useState(new Audio('/sounds/survivor.mp3'));
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleKeyDown = (e) => {
    if (isGameOver || !isGameStarted) return;

    setPlayer((prev) => {
      const speed = 20;
      let newX = prev.x;
      let newY = prev.y;
      let newDirection = prev.direction;

      if (e.key === 'ArrowUp') {
        newY -= speed;
        newDirection = 'up';
      }
      if (e.key === 'ArrowDown') {
        newY += speed;
        newDirection = 'down';
      }
      if (e.key === 'ArrowLeft') {
        newX -= speed;
        newDirection = 'left';
      }
      if (e.key === 'ArrowRight') {
        newX += speed;
        newDirection = 'right';
      }

      newX = Math.max(0, Math.min(500, newX));
      newY = Math.max(0, Math.min(500, newY));

      playerPosRef.current = { x: newX, y: newY, direction: newDirection };
      return { x: newX, y: newY, direction: newDirection };
    });
  };

  const handleTweet = () => {
    const tweetText = `【からあげサバイバーズ】ダーク唐揚げから${timeElapsed}秒間生き残ったぞ・・・`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      'https://kara-arcade.vercel.app/survivor')}
      &text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank");
  };

  // ゲームオーバー時のクリーンアップ処理
const cleanupGame = () => {
  // 配列のクリア
  setBullets([]);
  setEnemies([]);
  
  // オーディオのクリーンアップ
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
  
  
};

// ゲームオーバー時に呼び出す
useEffect(() => {
  if (isGameOver) {
    cleanupGame();
  }
}, [isGameOver]);

  const toggleBgm = () => {
    setIsBgmEnabled(prev => !prev);
    if (!bgmAudio) return;
    
    if (!isBgmEnabled) {
      bgmAudio.play().catch(e => console.log('BGM playback failed:', e));
    } else {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    }
  };

  useEffect(() => {
    let bulletInterval;
    let bulletMoveInterval;

    if (isGameStarted && !isGameOver) {
      bulletInterval = setInterval(() => {
        const bulletSpeed = 5;
        const newBullet = {
          x: playerPosRef.current.x,
          y: playerPosRef.current.y,
          direction: playerPosRef.current.direction,
        };
        setBullets(prev => [...prev, newBullet]);
      }, 1000);

      bulletMoveInterval = setInterval(() => {
        setBullets(prevBullets => {
          return prevBullets
            .map(bullet => {
              let newX = bullet.x;
              let newY = bullet.y;
              const speed = 5;

              switch (bullet.direction) {
                case 'up':
                  newY -= speed;
                  break;
                case 'down':
                  newY += speed;
                  break;
                case 'left':
                  newX -= speed;
                  break;
                case 'right':
                  newX += speed;
                  break;
              }

              return { ...bullet, x: newX, y: newY };
            })
            .filter(bullet =>
              bullet.x >= 0 && bullet.x <= 500 &&
              bullet.y >= 0 && bullet.y <= 500
            );
        });
      }, 16);
    }

    return () => {
      clearInterval(bulletInterval);
      clearInterval(bulletMoveInterval);
    };
  }, [isGameOver, isGameStarted]);

  useEffect(() => {
    const audio = new Audio('/sounds/survivor_bgm.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    setBgmAudio(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isGameStarted]);

  useEffect(() => {
    let enemyInterval;
    let moveInterval;
    let increaseDifficultyInterval;

    if (isGameStarted && !isGameOver) {
      enemyInterval = setInterval(() => {
        const enemy = {
          x: Math.random() * 500,
          y: Math.random() * 500,
        };
        setEnemies(prev => [...prev, enemy]);
      }, enemyIntervalTime);

      moveInterval = setInterval(() => {
        setBullets(prevBullets => {
          setEnemies(prevEnemies => {
            const survivingEnemies = prevEnemies.filter(enemy => {
              return !prevBullets.some(bullet => {
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                return Math.hypot(dx, dy) < 20;
              });
            });
            return survivingEnemies;
          });
          return prevBullets;
        });

        setEnemies(prevEnemies =>
          prevEnemies.map(enemy => {
            const dx = playerPosRef.current.x - enemy.x;
            const dy = playerPosRef.current.y - enemy.y;
            const dist = Math.hypot(dx, dy);
            const speed = 1;

            if (dist === 0) return enemy;

            return {
              x: enemy.x + (dx / dist) * speed,
              y: enemy.y + (dy / dist) * speed,
            };
          })
        );
      }, 16);

      increaseDifficultyInterval = setInterval(() => {
        setEnemyIntervalTime(prevTime => Math.max(200, prevTime - 200));
      }, 10000);
    }

    return () => {
      clearInterval(enemyInterval);
      clearInterval(moveInterval);
      clearInterval(increaseDifficultyInterval);
    };
  }, [isGameOver, isGameStarted, enemyIntervalTime]);

  useEffect(() => {
    let timerInterval;

    if (isGameStarted && !isGameOver) {
      timerInterval = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isGameOver, isGameStarted]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    enemies.forEach(enemy => {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 20) {
        setIsGameOver(true);
      }
    });
  }, [enemies, player, isGameStarted, isGameOver]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setEnemies([]);
    setBullets([]);
    setPlayer({ x: 250, y: 250, direction: 'right' });
    playerPosRef.current = { x: 250, y: 250, direction: 'right' };
    setTimeElapsed(0);
    setEnemyIntervalTime(1000);
    if (isBgmEnabled && bgmAudio) {
      bgmAudio.play().catch(e => console.log('BGM playback failed:', e));
    }
  };

  useEffect(() => {
    if (isGameOver && bgmAudio) {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    }
  }, [isGameOver, bgmAudio]);

  return (
    <div className="pt-20">
      
      <div
        className="relative w-[500px] h-[500px] mx-auto overflow-hidden bg-gray-800 bg-[url('imgs/bg.png')]"
        ref={gameAreaRef}
      >
        {!isGameStarted ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-5xl font-bold text-white mb-8 text-shadow">からあげサバイバーズ</h1>
            <p className="text-xl text-white mb-6">矢印キーで移動 → ← ↑ ↓</p>
            <button
              className="px-10 py-5 text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
              onClick={handleStartGame}
            >
              スタート
            </button>
            <div>
              <button
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                onClick={toggleBgm}
              >
                BGM: {isBgmEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        ) : !isGameOver ? (
          <>
            <div className="absolute top-2.5 left-2.5 text-2xl text-white">
              時間: {timeElapsed} 秒
            </div>
            <div
              className={`absolute w-8 h-8 bg-contain bg-no-repeat bg-[url('imgs/karaage.png')] transition-transform duration-100`}
              style={{
                left: player.x,
                top: player.y,
                transform: `translate(-50%, -50%) rotate(${
                  player.direction === 'up' ? '-90deg' :
                  player.direction === 'down' ? '90deg' :
                  player.direction === 'left' ? '180deg' : '0deg'
                })`
              }}
            />
            {enemies.map((enemy, index) => (
              <div
                key={index}
                className="absolute w-8 h-8 bg-contain bg-no-repeat bg-[url('imgs/dark_karaage.png')] -translate-x-1/2 -translate-y-1/2"
                style={{ left: enemy.x, top: enemy.y }}
              />
            ))}
            {bullets.map((bullet, index) => (
              <div
                key={`bullet-${index}`}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ left: bullet.x, top: bullet.y }}
              />
            ))}
            <VirtualController onDirectionPress={handleKeyDown} />
          </>
        ) : (
          <div className="text-center pt-48 text-white">
            <p className="text-4xl mb-4">ゲームオーバー</p>
            <p className="text-2xl mb-8">生存時間: {timeElapsed} 秒</p>
            <div className="space-x-4">
              <button
                onClick={handleStartGame}
                className="px-4 py-2 text-lg bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                再スタート
              </button>
              <button
                onClick={handleTweet}
                className="px-4 py-2 text-lg bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Xでシェア
              </button>
            </div>
          </div>
        )}
      </div>
     
      {isGameStarted && !isGameOver && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 grid grid-cols-3 gap-2">
          <div></div>
          <button
            className="w-16 h-16 bg-gray-700/50 rounded-lg active:bg-gray-600 text-white text-3xl"
            onMouseDown={() => handleKeyDown({ key: 'ArrowUp' })}
            onTouchStart={() => handleKeyDown({ key: 'ArrowUp' })}
          >
            ↑
          </button>
          <div></div>
          <button
            className="w-16 h-16 bg-gray-700/50 rounded-lg active:bg-gray-600 text-white text-3xl"
            onMouseDown={() => handleKeyDown({ key: 'ArrowLeft' })}
            onTouchStart={() => handleKeyDown({ key: 'ArrowLeft' })}
          >
            ←
          </button>
          <div></div>
          <button
            className="w-16 h-16 bg-gray-700/50 rounded-lg active:bg-gray-600 text-white text-3xl"
            onMouseDown={() => handleKeyDown({ key: 'ArrowRight' })}
            onTouchStart={() => handleKeyDown({ key: 'ArrowRight' })}
          >
            →
          </button>
          <div></div>
          <button
            className="w-16 h-16 bg-gray-700/50 rounded-lg active:bg-gray-600 text-white text-3xl"
            onMouseDown={() => handleKeyDown({ key: 'ArrowDown' })}
            onTouchStart={() => handleKeyDown({ key: 'ArrowDown' })}
          >
            ↓
          </button>
          <div></div>
        </div>
      )}
      <header>
        <div className="pt-1 sm:pt-1 px-4 sm:px-10">
          <Link
            to={RoutePath.karaagame.path}
            className="py-1 px-4 inline-flex items-center gap-x-2 text-sm font-medium border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            ゲームセレクトに戻る
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Survivor;