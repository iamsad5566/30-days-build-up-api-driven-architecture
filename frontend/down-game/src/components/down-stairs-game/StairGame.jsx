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
    highestScore:
      typeof window !== "undefined" ? localStorage.getItem("highScore") : 0,
    health: GAME_CONFIG.initialHealth,
    maxHealth: GAME_CONFIG.initialHealth,
    gameState: GameState.NOT_STARTED,
    isInvincible: false,
    timeElapsed: 0,
    timeElapsedInSeconds: 0,
  });

  const animationFrameIdRef = useRef(null);
  const keysPressed = useRef({});

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      keysPressed.current[event.key] = true;
    } else if (event.key === " " || event.key === "Enter") {
      const game = gameRef.current;
      if (game && game.stateManager.state === GameState.NOT_STARTED) {
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
    if (typeof window !== "undefined") {
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

    game.init();
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
      timeElapsedInSeconds: game.stateManager.stats.timeElapsedInSeconds,
    });
  };

  const gameLoop = () => {
    const game = gameRef.current;
    if (!game) return;

    game.update(keysPressed.current);
    game.render();

    if (game.stateManager.state === GameState.PLAYING) {
      if (game.stateManager.stats.score % 50 === 0) {
        updateGameStatus();
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <div className="flex flex-col items-center p-5">
      {/* 遊戲畫布 */}
      <div className="relative bg-white rounded-lg shadow-xl p-4">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.canvasWidth}
          height={GAME_CONFIG.canvasHeight}
          className="border-2 border-gray-800 rounded-lg"
        />
      </div>

      {/* 遊戲資訊面板 */}
      <div className="mt-6 bg-gray-50 rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500 block">遊戲狀態</span>
            <span className="text-xl font-bold text-gray-900">
              {getGameStateText()}
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500 block">分數</span>
            <span className="text-xl font-bold text-blue-600">
              {gameStatus.score}
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500 block">最高分</span>
            <span className="text-xl font-bold text-purple-600">
              {gameStatus.highestScore}
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500 block">時間</span>
            <span className="text-xl font-bold text-green-600">
              {formatTime(gameStatus.timeElapsedInSeconds)}
            </span>
          </div>
        </div>

        {/* 生命值顯示 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
          <span className="text-sm text-gray-500 block mb-2">生命值</span>
          <div className="flex gap-1">
            {[...Array(gameStatus.maxHealth)].map((_, i) => (
              <span
                key={i}
                className={`text-3xl ${
                  i < gameStatus.health ? "text-red-500" : "text-gray-300"
                } ${gameStatus.isInvincible ? "animate-pulse" : ""}`}
              >
                ♥
              </span>
            ))}
          </div>
        </div>

        {/* 控制按鈕保持不變 */}
        <div className="flex justify-center">
          {gameStatus.gameState === GameState.NOT_STARTED && (
            <button
              className="px-8 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={startGame}
            >
              開始遊戲
            </button>
          )}

          {gameStatus.gameState === GameState.GAME_OVER && (
            <button
              className="px-8 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={startGame}
            >
              重新開始
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StairGame;
