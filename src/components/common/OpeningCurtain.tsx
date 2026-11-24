"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function OpeningCurtain({ onFinish }: { onFinish?: () => void }) {
  const [show, setShow] = useState<boolean>(true);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    // 检查是否本次会话已经看过开场
    const hasSeen = sessionStorage.getItem("olw_opening_seen");
    if (hasSeen === "true") {
      setShow(false);
      onFinish?.();
    }
  }, [onFinish]);

  const handleEnter = () => {
    setFadeOut(true);
    sessionStorage.setItem("olw_opening_seen", "true");
    setTimeout(() => {
      setShow(false);
      onFinish?.();
    }, 900);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* 背景图与微光渐变层 */}
      <div className="absolute inset-0 bg-slate-950">
        <Image
          src="/winter-anime-hero.jpg"
          alt="冬日恋歌主视觉"
          fill
          priority
          className="object-cover object-center filter brightness-60 scale-105 animate-pulse duration-[7000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-950/80" />
      </div>

      {/* 核心文案卡片 */}
      <div className="relative z-10 max-w-xl mx-4 text-center px-6 py-10 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/15 shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-light tracking-widest text-sky-200 bg-sky-500/10 border border-sky-400/30">
          <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin" />
          <span>WINTER LOVE · 私人恋爱纪念博物馆</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wider text-slate-50 drop-shadow-md">
            {siteConfig.mainMotto}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light tracking-wide leading-relaxed">
            {siteConfig.subMotto}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleEnter}
            className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-medium tracking-wide text-white bg-gradient-to-r from-rose-500/80 to-indigo-600/80 hover:from-rose-500 hover:to-indigo-600 border border-white/20 shadow-lg hover:shadow-rose-500/25 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-200 fill-rose-300 group-hover:scale-110 transition-transform" />
            <span>开启我们的小世界</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleEnter}
            className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 transition-colors cursor-pointer"
          >
            直接跳过
          </button>
        </div>
      </div>
    </div>
  );
}
