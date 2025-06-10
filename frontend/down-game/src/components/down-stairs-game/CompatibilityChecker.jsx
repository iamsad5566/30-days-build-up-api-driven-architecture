"use client";

import { useEffect, useState } from "react";
import StairGame from "./StairGame";

export default function CompatibilityChecker() {
  const [isCompatible, setIsCompatible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 檢查螢幕寬度和鍵盤支援
    const checkCompatibility = () => {
      const hasWideScreen = window.innerWidth >= 1024;

      // 檢測是否可能是觸控裝置（通常沒有實體鍵盤）
      const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        !!navigator.msMaxTouchPoints;

      setIsCompatible(hasWideScreen && !isTouchDevice);
      setIsLoading(false);
    };

    // 初始檢查
    checkCompatibility();

    // 監聽視窗大小變化
    window.addEventListener("resize", checkCompatibility);

    // 清理函數
    return () => {
      window.removeEventListener("resize", checkCompatibility);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <p>載入中...</p>
      </div>
    );
  }

  if (!isCompatible) {
    return (
      <div className="p-8 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                此遊戲最佳體驗需要電腦和鍵盤！
              </p>
            </div>
          </div>
        </div>

        <div className="text-6xl mb-4 opacity-70">💻</div>

        <h3 className="text-xl font-bold mb-2 text-gray-800">請使用電腦遊玩</h3>
        <p className="text-gray-600 mb-6">
          本遊戲需要使用鍵盤操作，且建議在更大的螢幕上遊玩以獲得最佳體驗。
          請使用筆記型電腦或桌上型電腦訪問此頁面。
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <StairGame />
    </div>
  );
}
