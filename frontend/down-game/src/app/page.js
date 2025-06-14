import CompatibilityChecker from "@/components/down-stairs-game/CompatibilityChecker";
import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-y-auto">
      <Head>
        <title>小朋友下樓梯</title>
        <meta
          name="description"
          content="小朋友下樓梯遊戲 - Next.js & TypeScript 版本"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          小朋友下樓梯
        </h1>

        {/* 遊戲區域 */}
        <div className="mb-8">
          <CompatibilityChecker />
        </div>

        {/* 遊戲說明區域 */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">
              遊戲說明
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                使用鍵盤的左右箭頭鍵控制角色移動
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                避免碰到畫面上方邊界
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                在階梯上行走，注意不要掉落
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                遊戲速度會隨著分數增加而加快
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
