"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import ExhibitionCover from "@/components/common/ExhibitionCover";
import { Achievement } from "@/types";
import { calculateAchievements } from "@/lib/storage";
import {
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  HeartHandshake,
  CalendarHeart,
  Crown,
  Camera,
  Film,
  UtensilsCrossed,
  Gift,
  BookHeart,
} from "lucide-react";

export default function AchievementsView() {
  const { isAuthenticated, refreshKey } = useApp();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(calculateAchievements(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const unlockRate =
    achievements.length > 0
      ? Math.round((unlockedCount / achievements.length) * 100)
      : 0;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "HeartHandshake":
        return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case "CalendarHeart":
        return <CalendarHeart className="w-5 h-5 text-indigo-500" />;
      case "Crown":
        return <Crown className="w-5 h-5 text-amber-500" />;
      case "Camera":
        return <Camera className="w-5 h-5 text-sky-500" />;
      case "Film":
        return <Film className="w-5 h-5 text-purple-500" />;
      case "UtensilsCrossed":
        return <UtensilsCrossed className="w-5 h-5 text-amber-500" />;
      case "Gift":
        return <Gift className="w-5 h-5 text-pink-500" />;
      case "BookHeart":
        return <BookHeart className="w-5 h-5 text-rose-500" />;
      default:
        return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 4K 动漫主题画报封面 + 全屏沉浸柔焦背景 */}
      <ExhibitionCover
        coverImage="/winter-gift-hd.jpg"
        badge="🏆 荣誉殿堂 · LOVE ACHIEVEMENTS"
        englishTag="CHAPTER 08 // MILESTONE MEDALS"
        title="恋爱成就里程碑"
        subtitle="每一个勋章都由真实的生活点滴淬炼而成。绝不虚构冒充，见证两颗心真真切切的成长。"
      />

      {/* 总体解锁进度卡片 */}
      <div className="relative z-10 p-5 rounded-3xl glass-crystal border border-pink-200/25 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-serif-sc">
          <span className="text-pink-100 font-medium flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>勋章点亮率</span>
          </span>
          <span className="text-pink-300 font-semibold">
            已点亮 {unlockedCount} / {achievements.length} 枚 ({unlockRate}%)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 transition-all duration-700 rounded-full"
            style={{ width: `${unlockRate}%` }}
          />
        </div>
      </div>

      {/* 成就勋章网格 */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const percent = Math.min(
            100,
            Math.round((ach.currentValue / ach.targetValue) * 100)
          );

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl border transition duration-300 flex flex-col justify-between space-y-4 ${
                ach.isUnlocked
                  ? "bg-gradient-to-b from-amber-50/60 to-white dark:from-slate-850 dark:to-slate-900 border-amber-300/80 dark:border-amber-500/40 shadow-lg shadow-amber-500/5 hover:-translate-y-1"
                  : "bg-white/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/80 opacity-75"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                      ach.isUnlocked
                        ? "bg-amber-100 dark:bg-amber-950/60 border border-amber-300/60"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {getIconComponent(ach.icon)}
                  </div>

                  {ach.isUnlocked ? (
                    <span className="text-[11px] px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>已达成</span>
                    </span>
                  ) : (
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>未解锁</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-medium text-slate-800 dark:text-slate-100">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* 条件与真实数据进度 */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">解锁条件：{ach.conditionDescription}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {ach.currentValue} / {ach.targetValue}
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      ach.isUnlocked
                        ? "bg-amber-400"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
