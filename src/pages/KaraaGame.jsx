import React, { useState, useEffect } from 'react';
import { RoutePath } from "utils/RouteSetting";
import { Link } from "react-router-dom";
import KaraageStatements from "../assets/KaraageStatements";

const KaraaGame = () => {
  const [statement, setStatement] = useState(null);

  useEffect(() => {
    const fetchRandomStatement = () => {
      const randomId = Math.floor(Math.random() * 50);
      setStatement(KaraageStatements[randomId]);
    };

    fetchRandomStatement();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };
  
  // サンプルデータ
  const GamePath = [
    {
      title: "からあげめくり",
      image_url: "/assets/imgs/game/karaagemekuri.png",
      description:
        "からあげは「めくるか、めくられるか」。秘密のレシピを発見するため、からあげめくり名人の旅が始まる",
      url: RoutePath.mekuri.path,
      isDevelopment: false,
    },
    {
      title: "からあげ積み増しタワー",
      image_url: "/assets/imgs/game/karaagetower.jpg",
      description:
        "天を衝く巨大な塔の前に、神々しき翼を広げる巨大なからあげの守護者。積み上げられたからあげの塔は、挑戦者たちの魂と技を試す場となる",
      url: RoutePath.tower.path,
      isDevelopment: false,
    },
    {
      title: "リストランテからあげ",
      image_url: "/assets/imgs/game/retrogame.png",
      description:
        "プレイヤーは、レシピに従って迅速にからあげを調理するシェフとなります。タイムマネジメントと正確なレシピが成功の鍵。",
      url: RoutePath.recipegame.path,
      isDevelopment: false,
    },
    {
      title: "からあげ様は揚げられたい",
      image_url: "/assets/imgs/game/karaagesama.png",
      description:
        "恋愛は揚げた方が負けなのである。己を燃やすは情熱の油か、それとも永遠の冷凍庫か――！？",
      url: "https://karaageotoko.vercel.app/",
      isDevelopment: false,
    },
    {
      title: "からあげサバイバーズ",
      image_url: "/assets/imgs/game/Karaagesurvivor.png",
      description:
        "押し寄せる吸血ダーク唐揚げの猛襲から生き延びろ",
      url: RoutePath.survivor.path,
      isDevelopment: false,
    },
    {
      title: "からあげ出口（開発予定）",
      image_url: "/assets/imgs/game/karaageexit.jpg",
      description:
        "からあげが揚がったら引き返せ。からあげが揚がっていなければ引き返さないこと。",
      url: "#",
      isDevelopment: true,
    },
    {
      title: "KARAAGE SOULS（開発予定）",
      image_url: "/assets/imgs/game/karaagesoul.png",
      description:
        "古の神々が去り、人々が不死としてさまよう、朽ち果てた王国。絶望に満ちたこの地では、力を求める亡者たちが「不死のからあげ」を篝火に焚べる",
      url: "#",
      isDevelopment: true,
    },
    {
      title: "唐揚の野望（開発予定）",
      image_url: "/assets/imgs/game/karaagenoyabo.png",
      description:
        "戦国時代のからあげ大名となり、戦略的な外交、軍事、経済の管理を通じて日本統一を目指す歴史シミュレーション。",
      url: "#",
      isDevelopment: true,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-5 px-4 md:px-20">
      <h1 className="text-2xl font-semibold text-gray-800 pb-2 pt-5">
        からあゲーム
      </h1>
      
      {statement && (
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
    <h3 className="text-2xl font-bold text-gray-800 pt-5 mb-4 text-center">
      今日のポジティブからあげ
    </h3>
    <p className="text-lg font-medium text-gray-700 mb-4 text-center">
      <em>{statement.statement_en}</em>
    </p>
    <p className="text-center text-lg text-gray-600">{statement.statement_ja}</p>
    <div className="flex justify-center mt-4">
      <button
        onClick={() => speak(statement.statement_en)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center"
      >
        からあげを読み上げる
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="ml-2"
          viewBox="0 0 16 16"
        >
          <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5" />
        </svg>
      </button>
      <button
        onClick={() => window.location.reload()}
        className="ml-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 flex items-center"
      >
        シャッフル
        
          <path d="M11.534 7h-5V6h5a.5.5 0 0 0 .5-.5v-.732a.5.5 0 0 0-.707-.454l-3.182 1.592a.5.5 0 0 0 0 .89l3.182 1.592a.5.5 0 0 0 .707-.454V7.5a.5.5 0 0 0-.5-.5z"/>
          <path d="M4.466 9h5v1h-5a.5.5 0 0 0-.5.5v.732a.5.5 0 0 0 .707.454l3.182-1.592a.5.5 0 0 0 0-.89l-3.182-1.592a.5.5 0 0 0-.707.454V8.5a.5.5 0 0 0 .5.5z"/>
      
      </button>
    </div>
  </div>
      )}
      <div className="my-5 text-center">
        <h2 className="font-semibold text-gray-800">※スペシャルリスペクト</h2>
        <a
          href="https://start-your-day-right-8g2b.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Start Your Day Right
        </a>
      </div>



      <div className="flex flex-wrap -m-4 pt-10">
        {GamePath.map((game, index) => (
          <div key={index} className="p-4 w-full md:w-1/3">
            <div className={`flex flex-col h-full bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7] ${game.isDevelopment ? 'opacity-50' : ''}`}>
              <Link to={game.url}>
                <img
                  className="w-full h-48 md:h-64 rounded-t-xl cursor-pointer object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                  src={game.image_url}
                  alt="Image Description"
                />
              </Link>
              <div className="p-4 md:p-5 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {game.title}
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {game.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 text-right text-md text-gray-800">
        ※実際は開発予定すらない場合があります
      </div>

      
    </div>
  );
};

export default KaraaGame;
