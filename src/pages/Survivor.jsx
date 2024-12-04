import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { Link } from "react-router-dom";
import { RoutePath } from "utils/RouteSetting";
// import bgImage from 'imgs/bg.png';
// import darkKaraageImage from 'imgs/dark_karaage.png';
// import playerImage from 'imgs/karaage.png';


const Survivor = () => {
  const gameAreaRef = useRef(null);
  const [player, setPlayer] = useState({ x: 250, y: 250, direction: 'right' });
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [enemyIntervalTime, setEnemyIntervalTime] = useState(1000);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const playerPosRef = useRef({ x: 250, y: 250, direction: 'right' });

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
    const tweetText = `【からあげサバイバーズ】${timeElapsed}秒間生き残ったぞ・・・`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      `https://kara-arcade.vercel.app/survivor`)}
      &text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank");
};

  // 弾の発射と移動の処理
  useEffect(() => {
    let bulletInterval;
    let bulletMoveInterval;

    if (isGameStarted && !isGameOver) {
      // 1秒おきに弾を発射
      bulletInterval = setInterval(() => {
        const bulletSpeed = 5;
        const newBullet = {
          x: playerPosRef.current.x,
          y: playerPosRef.current.y,
          direction: playerPosRef.current.direction,
        };
        setBullets(prev => [...prev, newBullet]);
      }, 1000);

      // 弾の移動
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
        // 弾と敵の衝突判定
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

        // 敵の移動
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
  };

  return (
    <>
      <header>
        <div className="pt-20 px-10">
          <Link
            to={RoutePath.karaagame.path}
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            ゲームセレクトに戻る
          </Link>
        </div>
      </header>
  <div 
    className="relative w-[500px] h-[500px] mx-auto overflow-hidden bg-gray-800 bg-[url('imgs/bg.png')]" 
    ref={gameAreaRef}
    >
      
    {!isGameStarted ? (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-5xl font-bold text-white mb-8 text-shadow">からあげサバイバー</h1>
        <button 
          className="px-10 py-5 text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleStartGame}
        >
          スタート
        </button>
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
  </>
);
}

export default Survivor;