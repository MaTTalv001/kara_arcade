import React, { useState } from 'react';
import Sketch from '../components/Sketch';
import { Link } from "react-router-dom";
import { RoutePath } from "utils/RouteSetting";

function KaraageTower() {

  const handleLeftArrowClick = () => {
    dispatchKeyboardEvent('ArrowLeft');
  };

  const handleRightArrowClick = () => {
    dispatchKeyboardEvent('ArrowRight');
  };

  const dispatchKeyboardEvent = (key) => {
    const event = new CustomEvent('keydown', { detail: { key } });
    window.dispatchEvent(event);
  };

  return (
    <div className="App min-h-screen bg-base-200">
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
      <div className="flex justify-center items-center mt-10">      
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="hidden md:block"> {/*画面が大きい時はスマホモック*/}
            <div className="mockup-phone">
              <div className="camera"></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1 relative">
                  <Sketch />               
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden relative">
            <Sketch />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between">
        <button className="btn btn-primary btn-lg" onClick={handleLeftArrowClick}>
          ←Left
        </button>
        <button className="btn btn-primary btn-lg" onClick={handleRightArrowClick}>
          Right→
        </button>
      </div>
    </div>
  );
}

export default KaraageTower;