"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GAME_CONFIG } from "./config";
import { GameState } from "./GameStateManager";
import Game from "./Game";

const StairGame = () => {
  const canvasRef = useRef(null);

  const gameRef = useRef(null);

  const [gameStatus, setGameStatus] = useState({
    score: 0,
    highestScore: localStorage.getItem("highScore"),
    health: GAME_CONFIG.initialHealth,
    maxHealth: GAME_CONFIG.initialHealth,
    gameState: GameState.NOT_STARTED,
    isInvincible: false,
    timeElapsed: 0,
  });

  const animationFrameIdRef = useRef(null);
  const keysPressed = useRef({});

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      keysPressed.current[event.key] = true;
    } else if (event.key === " " || event.key === "Enter") {
      const game = gameRef.current;
      if (game && game.stateManager === GameState.NOT_STARTED) {
        startGame();
      } else if (game && game.stateManager.state === GameState.GAME_OVER) {
        startGame();
      }
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      keysPressed.current[event.key] = false;
    }
  };

  useLayoutEffect(() => {
    if (window !== "undefined") {
      console.log("初始化畫布和事件處理器");
    }

    initGame();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const game = gameRef.current;
    if (game) {
      game.stateManager.onStateChange(() => {
        updateGameStatus();
      });
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("遊戲狀態更新：", gameStatus);
  }, [gameStatus]);

  const getGameStateText = () => {
    switch (gameStatus.gameState) {
      case GameState.NOT_STARTED:
        return "準備開始";
      case GameState.PLAYING:
        return "遊戲中";
      case GameState.GAME_OVER:
        return "遊戲結束";
      default:
        return "";
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const initGame = () => {
    console.log("遊戲初始化");

    if (canvasRef.current && !gameRef.current) {
      gameRef.current = new Game(canvasRef.current);
    }

    const game = gameRef.current;
    if (!game) return;

    game.init();

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    const game = gameRef.current;
    if (!game) return;

    game.stateManager.startNewGame();
    updateGameStatus();
  };

  const updateGameStatus = () => {
    const game = gameRef.current;
    if (!game) return;

    setGameStatus({
      score: game.stateManager.stats.score,
      highestScore: game.stateManager.stats.highScore,
      health: game.player.health,
      maxHealth: game.player.maxHealth,
      gameState: game.stateManager.state,
      isInvincible: game.player.invincible,
      timeElapsed: game.stateManager.stats.timeElapsed,
    });
  };

  const gameLoop = () => {
    const game = gameRef.current;
    if (!game) return;

    game.update(keysPressed.current);
    game.render();

    if (game.stateManager.state === GameState.PLAYING) {
      if (game.stateManager.score % 50 === 0) {
        updateGameStatus();
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">小朋友下樓梯</h1>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.canvasWidth}
          height={GAME_CONFIG.canvasHeight}
          className="border-2 border-gray-800 rounded-lg shadow-lg"
        />
      </div>

      <div className="mt-4 space-y-2 w-full max-w-md">
        <div className="flex justify-between text-black items-center">
          <span className="font-bold">遊戲狀態:</span>
          <span className="text-lg">{getGameStateText()}</span>
        </div>

        <div className="flex justify-between text-black items-center">
          <span className="font-bold">分數:</span>
          <span className="text-lg">{gameStatus.score}</span>
        </div>

        <div className="flex justify-between text-black items-center">
          <span className="font-bold">最高分:</span>
          <span className="text-lg">{gameStatus.highestScore}</span>
        </div>

        <div className="flex justify-between text-black items-center">
          <span className="font-bold">時間:</span>
          <span className="text-lg">{formatTime(gameStatus.timeElapsed)}</span>
        </div>

        <div className="flex justify-between text-black items-center">
          <span className="font-bold">生命值:</span>
          <div className="flex">
            {[...Array(gameStatus.maxHealth)].map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${
                  i < gameStatus.health ? "text-red-500" : "text-gray-300"
                } ${gameStatus.isInvincible ? "animate-pulse" : ""}`}
              >
                ♥
              </span>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          {gameStatus.gameState === GameState.NOT_STARTED && (
            <button
              className="flex-1 px-6 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={startGame}
            >
              開始遊戲
            </button>
          )}

          {gameStatus.gameState === GameState.GAME_OVER && (
            <button
              className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={startGame}
            >
              重新開始
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 bg-white text-black p-4 rounded-lg shadow w-full max-w-md">
        <h3 className="font-bold text-lg mb-2">遊戲說明</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>使用鍵盤左右箭頭鍵控制角色移動</li>
          <li>避免碰到頂部邊界，否則會扣血並被彈回</li>
          <li>避免掉落到底部，否則遊戲結束</li>
          <li>小心尖刺樓梯（紅色）會扣血</li>
          <li>不穩定樓梯（黃色）會在站立一段時間後消失</li>
          <li>每個角色有 {GAME_CONFIG.initialHealth} 條命</li>
        </ul>
      </div>
    </div>
  );
};

export default StairGame;
