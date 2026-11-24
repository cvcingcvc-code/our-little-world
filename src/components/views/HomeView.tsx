"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useApp } from "@/context/AppContext";
import {
  Heart,
  Sparkles,
  Camera,
  UtensilsCrossed,
  Gift,
  ListTodo,
  Milestone,
  ArrowRight,
  Clock,
  Calendar,
  Compass,
} from "lucide-react";
import { NavTab } from "../common/Navigation";
import { getPhotos, getFoodRecords, getGiftRecords, getWishItems } from "@/lib/storage";

export default function HomeView({ onNavigate }: { onNavigate: (tab: NavTab) => void }) {
  const { isAuthenticated, refreshKey } = useApp();
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [stats, setStats] = useState({
    photoCount: 0,
    foodCount: 0,
    giftCount: 0,
    wishCount: 0,
  });

  // 动态更新相恋时间（精确至秒）
  useEffect(() => {
    const startTimestamp = new Date(siteConfig.startDate).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, now - startTimestamp);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 统计数据
  useEffect(() => {
    const photos = getPhotos(isAuthenticated);
    const foods = getFoodRecords(isAuthenticated);
    const gifts = getGiftRecords(isAuthenticated);
    const wishes = getWishItems(isAuthenticated);

    setStats({
      photoCount: photos.length,
      foodCount: foods.filter((f) => !f.isWishlist).length,
      giftCount: gifts.length,
      wishCount: wishes.filter((w) => w.status === "completed").length,
    });
  }, [isAuthenticated, refreshKey]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* 沉浸式冬日动漫全景背景层 */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <Image
          src="/winter-anime-hero.jpg"
          alt="冬日恋歌主视觉"
          fill
          priority
          className="object-cover object-center filter brightness-90 dark:brightness-60 scale-100 transition-all duration-700"
        />
        {/* 日夜两套微光滤镜 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-sky-950/20 to-slate-950/80 dark:from-slate-950/60 dark:via-slate-950/80 dark:to-slate-950/95" />
      </div>

      {/* 核心内容区 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 flex flex-col justify-center space-y-10 sm:space-y-14">
        {/* 顶部浪漫徽章与主副标 */}
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-light tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>冬日恋歌 · 专属两人的数字博物馆</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight text-white leading-tight drop-shadow-md">
            {siteConfig.mainMotto}
          </h1>

          <p className="text-base sm:text-lg text-slate-200/90 font-light tracking-wide leading-relaxed drop-shadow-sm max-w-xl">
            {siteConfig.subMotto}
          </p>
        </div>

        {/* 恋爱时间动态走动计时牌 */}
        <div className="max-w-xl p-5 sm:p-7 rounded-3xl bg-white/15 dark:bg-slate-900/40 backdrop-blur-xl border border-white/25 dark:border-white/10 shadow-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-200 font-light">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-300" />
              <span>我们已经携手走过</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-300/80">
              <Calendar className="w-3 h-3" />
              <span>相恋起点：{siteConfig.startDate}</span>
            </div>
          </div>

          {/* 数字格 */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="p-2 sm:p-3 rounded-2xl bg-white/20 dark:bg-slate-800/50 backdrop-blur-md border border-white/20">
              <span className="block text-2xl sm:text-3xl font-light text-white tracking-tight">
                {timeTogether.days}
              </span>
              <span className="text-[10px] text-slate-200/80 font-light">天</span>
            </div>
            <div className="p-2 sm:p-3 rounded-2xl bg-white/20 dark:bg-slate-800/50 backdrop-blur-md border border-white/20">
              <span className="block text-2xl sm:text-3xl font-light text-white tracking-tight">
                {String(timeTogether.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-slate-200/80 font-light">时</span>
            </div>
            <div className="p-2 sm:p-3 rounded-2xl bg-white/20 dark:bg-slate-800/50 backdrop-blur-md border border-white/20">
              <span className="block text-2xl sm:text-3xl font-light text-white tracking-tight">
                {String(timeTogether.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-slate-200/80 font-light">分</span>
            </div>
            <div className="p-2 sm:p-3 rounded-2xl bg-white/20 dark:bg-slate-800/50 backdrop-blur-md border border-white/20">
              <span className="block text-2xl sm:text-3xl font-light text-rose-300 tracking-tight">
                {String(timeTogether.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-slate-200/80 font-light">秒</span>
            </div>
          </div>
        </div>

        {/* 核心四个快捷入口卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
          <button
            onClick={() => onNavigate("gallery")}
            className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/15 hover:border-white/40 hover:bg-white/20 dark:hover:bg-slate-800/60 transition-all duration-300 text-left group cursor-pointer shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-white flex items-center justify-between">
              <span>可爱收藏馆</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </p>
            <p className="text-[11px] text-slate-300/80 mt-0.5">
              已珍藏 {stats.photoCount} 个瞬间
            </p>
          </button>

          <button
            onClick={() => onNavigate("food")}
            className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/15 hover:border-white/40 hover:bg-white/20 dark:hover:bg-slate-800/60 transition-all duration-300 text-left group cursor-pointer shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-white flex items-center justify-between">
              <span>美食日记</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </p>
            <p className="text-[11px] text-slate-300/80 mt-0.5">
              品尝过 {stats.foodCount} 顿烟火
            </p>
          </button>

          <button
            onClick={() => onNavigate("gifts")}
            className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/15 hover:border-white/40 hover:bg-white/20 dark:hover:bg-slate-800/60 transition-all duration-300 text-left group cursor-pointer shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Gift className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-white flex items-center justify-between">
              <span>礼物博物馆</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </p>
            <p className="text-[11px] text-slate-300/80 mt-0.5">
              记录 {stats.giftCount} 份惊喜爱意
            </p>
          </button>

          <button
            onClick={() => onNavigate("wishes")}
            className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/15 hover:border-white/40 hover:bg-white/20 dark:hover:bg-slate-800/60 transition-all duration-300 text-left group cursor-pointer shadow-lg"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <ListTodo className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-white flex items-center justify-between">
              <span>100件小事</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </p>
            <p className="text-[11px] text-slate-300/80 mt-0.5">
              已点亮 {stats.wishCount} 个愿望
            </p>
          </button>
        </div>
      </div>

      {/* 底部小标签与特色入口：恋爱星空 */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300/70">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/50" />
          <span>两颗心在寒冬中的共鸣 · Our Little World</span>
        </div>

        <button
          onClick={() => onNavigate("starry")}
          className="px-4 py-2 rounded-full bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-400/30 text-indigo-200 flex items-center gap-1.5 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
          <span>仰望专属恋爱星空</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
