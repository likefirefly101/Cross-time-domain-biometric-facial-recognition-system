import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, Play } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // 使用 Ref 存储游戏核心数据，避免 React 渲染延迟导致的碰撞失效
  const gameState = useRef({
    dino: { x: 50, y: 100, vy: 0, width: 30, height: 30 },
    obstacles: [],
    frame: 0,
    speed: 2,
    currentScore: 0,
    gameActive: false
  });

  const config = {
    width: 600,
    height: 150,
    gravity: 0.6,
    jumpStrength: -12,
    groundY: 100, // 恐龙站在地面的 Y 轴位置
  };

  const startGame = () => {
    gameState.current = {
      dino: { x: 50, y: config.groundY, vy: 0, width: 30, height: 30 },
      obstacles: [],
      frame: 0,
      speed: 5,
      currentScore: 0,
      gameActive: true
    };
    setIsGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const update = () => {
      const state = gameState.current;
      if (!state.gameActive) return;

      // 1. 恐龙物理逻辑
      state.dino.vy += config.gravity;
      state.dino.y += state.dino.vy;

      // 落地判断
      if (state.dino.y > config.groundY) {
        state.dino.y = config.groundY;
        state.dino.vy = 0;
      }

      // 2. 障碍物生成 (每 80 帧尝试生成一个)
      if (state.frame % 80 === 0) {
        state.obstacles.push({
          x: config.width,
          width: 20,
          height: 25 + Math.random() * 20,
        });
      }

      // 3. 移动和碰撞检测
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= state.speed;

        // 【核心修复】标准的 AABB 矩形碰撞检测
        // 检测恐龙的四个边界是否与障碍物的四个边界重叠
        const dinoRight = state.dino.x + state.dino.width;
        const dinoBottom = state.dino.y + state.dino.height;
        const obsRight = obs.x + obs.width;
        const obsTop = (config.groundY + state.dino.height) - obs.height;
        const obsBottom = config.groundY + state.dino.height;

        if (
          state.dino.x < obsRight &&
          dinoRight > obs.x &&
          state.dino.y < obsBottom &&
          dinoBottom > obsTop
        ) {
          // 撞到了！游戏结束
          state.gameActive = false;
          setIsGameOver(true);
          return;
        }

        // 移除越界障碍物并加分
        if (obs.x + obs.width < 0) {
          state.obstacles.splice(i, 1);
          state.currentScore += 1;
          setScore(state.currentScore); // 仅在得分时触发 UI 更新
          state.speed += 0.05; // 逐渐加速
        }
      }

      state.frame++;
      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    const draw = () => {
      const state = gameState.current;
      ctx.clearRect(0, 0, config.width, config.height);

      // 画地面线
      ctx.strokeStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(0, config.groundY + state.dino.height);
      ctx.lineTo(config.width, config.groundY + state.dino.height);
      ctx.stroke();

      // 画恐龙 (深色方块)
      ctx.fillStyle = '#475569';
      ctx.fillRect(state.dino.x, state.dino.y, state.dino.width, state.dino.height);

      // 画障碍物 (浅色方块)
      ctx.fillStyle = '#94a3b8';
      state.obstacles.forEach(obs => {
        ctx.fillRect(
          obs.x,
          (config.groundY + state.dino.height) - obs.height,
          obs.width,
          obs.height
        );
      });
    };

    const handleInput = (e) => {
      if (e.code === 'Space' || e.type === 'touchstart') {
        e.preventDefault();
        if (!gameState.current.gameActive && !isGameOver) {
          startGame();
        } else if (gameState.current.dino.y === config.groundY) {
          gameState.current.dino.vy = config.jumpStrength;
        }
      }
    };

    window.addEventListener('keydown', handleInput);
    window.addEventListener('touchstart', handleInput);

    // 初始绘制
    draw();
    if (gameStarted && !isGameOver) {
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, isGameOver]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-mono text-slate-700 select-none">
      <div className="text-center mb-8">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <p className="text-xl mt-4">This is not the web page you are looking for.</p>
        <p className="text-sm text-slate-400 mt-2">
          {!gameStarted ? "Press Space to Start" : isGameOver ? "Game Over!" : "Press Space to Jump"}
        </p>
      </div>

      <div className="relative border-b-2 border-slate-100 bg-slate-50/50 rounded-xl overflow-hidden shadow-sm">
        <canvas
          ref={canvasRef}
          width={config.width}
          height={config.height}
          className="max-w-full cursor-pointer"
          onClick={() => !gameStarted && startGame()}
        />

        {/* 未开始遮罩 */}
        {!gameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <button
              onClick={startGame}
              className="bg-slate-800 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-slate-700 transition-transform active:scale-95"
            >
              <Play size={18} fill="currentColor" /> Start Game
            </button>
          </div>
        )}

        {/* 游戏结束遮罩 */}
        {isGameOver && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center transition-opacity">
            <p className="text-xl font-bold text-slate-800 mb-4 tracking-widest">G A M E  O V E R</p>
            <button
              onClick={startGame}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        )}

        <div className="absolute top-3 right-4 text-slate-400 font-bold tracking-widest text-sm">
          HI {score.toString().padStart(5, '0')}
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 border-2 border-slate-200 rounded-lg hover:border-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-200 flex items-center gap-2 font-bold"
        >
          <Home size={18} /> BACK TO HOME
        </button>
      </div>
      <div className="mt-20 text-slate-400 text-xs flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        All systems operational.
      </div>
    </div>
  );
};

export default NotFound;