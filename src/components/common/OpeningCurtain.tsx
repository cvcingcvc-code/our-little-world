"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { withBasePath } from "@/lib/assets";

export default function OpeningCurtain({ onFinish }: { onFinish?: () => void }) {
  const [show, setShow] = useState<boolean>(true);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("olw_opening_seen");
    if (hasSeen === "true") {
      setShow(false);
      onFinish?.();
    }
  }, [onFinish]);

  const handleEnter = () => {
    if (fadeOut) return;
    setFadeOut(true);
    sessionStorage.setItem("olw_opening_seen", "true");
    setTimeout(() => {
      setShow(false);
      onFinish?.();
    }, 1000);
  };

  if (!show) return null;

  return (
    <div
      onClick={handleEnter}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-12 sm:py-16 px-6 overflow-hidden cursor-pointer select-none transition-all duration-1000 ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none filter blur-sm" : "opacity-100 scale-100"
      }`}
    >
      {/* 4K 超高清全景背景与电影级慢镜微缩放 */}
      <div className="absolute inset-0 bg-slate-950 -z-10">
        <Image
          src={withBasePath("/winter-hero-hd.jpg")}
          alt="冬日恋歌主视觉"
          fill
          priority
          quality={100}
          className="object-cover object-center filter brightness-[0.78] scale-100 transition-transform duration-[12000ms] ease-out hover:scale-105"
        />
        {/* 电影级微光暗角与漫射柔焦 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
      </div>

      {/* 顶部：极简典雅徽标与可跳过微注 */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between animate-fadeIn">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-cinzel tracking-[0.25em] text-slate-200/90 bg-white/10 backdrop-blur-md border border-white/15">
          <Sparkles className="w-3 h-3 text-rose-300 animate-spin" />
          <span>OUR LITTLE WORLD // WINTER ARCHIVE</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="text-[11px] font-light tracking-widest text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-full bg-black/20 hover:bg-black/40 border border-white/10"
        >
          SKIP ⤑
        </button>
      </div>

      {/* 中央：电影级典雅排版（无死板方框，纯粹光影美感） */}
      <div className="relative z-10 max-w-2xl text-center space-y-6 sm:space-y-8 animate-fadeIn">
        <div className="inline-flex items-center gap-2 text-rose-300/90 text-xs font-serif-sc tracking-[0.3em]">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
          <span>二人の小さな世界 · 永遠の冬</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-sc font-light tracking-wider text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-tight">
            {siteConfig.mainMotto.split("，")[0]}，<br />
            <span className="shimmer-text font-normal font-serif-sc">
              {siteConfig.mainMotto.split("，")[1] || "幸好有你。"}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-200/90 font-cormorant italic tracking-[0.15em] drop-shadow">
            &ldquo;Every precious moment with you, quietly treasured forever.&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-slate-300/80 font-serif-sc font-light tracking-widest">
            {siteConfig.subMotto}
          </p>
        </div>
      </div>

      {/* 底部：微光呼吸提示（引导自然轻触进入） */}
      <div className="relative z-10 flex flex-col items-center gap-3 animate-fadeIn">
        <div className="px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/30 shadow-[0_0_25px_rgba(244,63,94,0.3)] transition-all transform hover:scale-105 flex items-center gap-2.5 text-xs text-white tracking-[0.2em] font-light">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          <span>轻触任意处 · 步入我们的小世界</span>
        </div>
        <span className="text-[10px] text-slate-400/80 tracking-[0.3em] font-cinzel">
          CLICK ANYWHERE TO ENTER
        </span>
      </div>
    </div>
  );
}
