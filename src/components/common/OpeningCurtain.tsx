"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

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
      {/* 4K 超高清大图背景与电影级慢镜微缩放 */}
      <div className="absolute inset-0 bg-slate-950">
        <Image
          src="/winter-hero-hd.jpg"
          alt="冬日恋歌主视觉"
          fill
          priority
          quality={100}
          className="object-cover object-center filter brightness-[0.8] scale-100 animate-pulse duration-[10000ms]"
        />
        {/* 电影级晕映渐变 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/80" />
      </div>

      {/* 核心文案水晶卡片 */}
      <div className="relative z-10 max-w-xl mx-4 text-center px-8 py-12 rounded-[2.5rem] bg-slate-950/50 backdrop-blur-2xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-7 animate-fadeIn">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-light tracking-[0.25em] text-sky-200 bg-sky-500/15 border border-sky-400/30 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin" />
          <span>WINTER LOVE · 殿堂级数字恋爱馆</span>
        </div>

        <div className="space-y-3.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-wider text-white drop-shadow-lg font-serif">
            {siteConfig.mainMotto}
          </h1>
          <p className="text-sm sm:text-base text-slate-200/90 font-light tracking-widest leading-relaxed">
            {siteConfig.subMotto}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={handleEnter}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wider text-white bg-gradient-to-r from-rose-500/90 via-pink-500/90 to-indigo-600/90 hover:from-rose-500 hover:to-indigo-600 border border-white/30 shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-200 fill-rose-200 group-hover:scale-125 transition-transform" />
            <span>开启我们的小世界</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleEnter}
            className="text-xs text-slate-400 hover:text-white px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
          >
            直接跳过
          </button>
        </div>
      </div>
    </div>
  );
}
