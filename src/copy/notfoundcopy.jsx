import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // 游戏配置
  const config = {
    width: 600,
    height: 150,
    gravity: 0.6,
    jumpStrength: -12,
    groundY: 130,
    spawnRate: 0.015,
    speed: 3,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // 游戏状态变量
    let dino = { x: 50, y: config.groundY, vy: 0, width: 30, height: 30 };
    let obstacles = [];
    let currentScore = 0;
    let gameSpeed = config.speed;

    const handleJump = (e) => {
      if ((e.code === 'Space' || e.type === 'touchstart') && !isGameOver) {
        if (!gameStarted) {
          setGameStarted(true);
        }
        if (dino.y === config.groundY) {
          dino.vy = config.jumpStrength;
        }
        // 阻止空格键滚动页面
        if (e.code === 'Space') e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleJump);
    window.addEventListener('touchstart', handleJump);

    const update = () => {
      if (!gameStarted || isGameOver) return;

      // 恐龙物理
      dino.vy += config.gravity;
      dino.y += dino.vy;
      if (dino.y > config.groundY) {
        dino.y = config.groundY;
        dino.vy = 0;
      }

      // 生成障碍物
      if (Math.random() < config.spawnRate) {
        obstacles.push({ x: config.width, width: 20, height: 20 + Math.random() * 20 });
      }

      // 移动障碍物
      obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;
        
        // 碰撞检测
        if (
          dino.x < obs.x + obs.width &&
          dino.x + dino.width > obs.x &&
          dino.y < config.groundY &&
          dino.y + dino.height > config.groundY - obs.height
        ) {
          setIsGameOver(true);
        }

        // 移除越界障碍
        if (obs.x + obs.width < 0) {
          obstacles.splice(index, 1);
          currentScore++;
          setScore(currentScore);
          gameSpeed += 0.1; // 逐渐加速
        }
      });

      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    const draw = () => {
      ctx.clearRect(0, 0, config.width, config.height);

      // 画地面
      ctx.strokeStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.moveTo(0, config.groundY + dino.height);
      ctx.lineTo(config.width, config.groundY + dino.height);
      ctx.stroke();

      // 画恐龙 (简约像素块)
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

      // 画障碍物 (仙人掌)
      ctx.fillStyle = '#9ca3af';
      obstacles.forEach(obs => {
        ctx.fillRect(obs.x, config.groundY + dino.height - obs.height, obs.width, obs.height);
      });
    };

    // 初始画面
    draw();
    if (gameStarted && !isGameOver) {
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('touchstart', handleJump);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, isGameOver]);

  const resetGame = () => {
    setIsGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-mono text-slate-700">
      {/* 404 头部 */}
      <div className="text-center mb-8">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <p className="text-xl mt-4">This is not the web page you are looking for.</p>
        <p className="text-sm text-slate-400 mt-2 italic">
          {gameStarted ? "Press Space to Jump!" : "Press Space to Play Game"}
        </p>
      </div>

      {/* 游戏区域 */}
      <div className="relative border-b-2 border-slate-100 overflow-hidden bg-slate-50 rounded-lg shadow-inner">
        <canvas
          ref={canvasRef}
          width={config.width}
          height={config.height}
          className="max-w-full"
        />
        
        {/* 游戏结束覆盖层 */}
        {isGameOver && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-slate-800 mb-4">G A M E  O V E R</p>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={18} /> Retry
            </button>
          </div>
        )}

        {/* 分数显示 */}
        <div className="absolute top-2 right-4 text-slate-500 font-bold">
          {score.toString().padStart(5, '0')}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-12 flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold"
        >
          <Home size={20} /> Back to Home
        </button>
      </div>

      {/* GitHub 风格的页脚提示 */}
      <div className="mt-20 text-slate-400 text-xs flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        All systems operational.
      </div>
    </div>
  );
};

export default NotFound;