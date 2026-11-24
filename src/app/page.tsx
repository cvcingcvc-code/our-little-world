"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Navigation, { NavTab } from "@/components/common/Navigation";
import Snowfall from "@/components/common/Snowfall";
import BackgroundAudio from "@/components/common/BackgroundAudio";
import OpeningCurtain from "@/components/common/OpeningCurtain";

// 10 大核心业务模块视图
import HomeView from "@/components/views/HomeView";
import GalleryView from "@/components/views/GalleryView";
import FoodView from "@/components/views/FoodView";
import GiftsView from "@/components/views/GiftsView";
import WishesView from "@/components/views/WishesView";
import TimelineView from "@/components/views/TimelineView";
import StarryView from "@/components/views/StarryView";
import AchievementsView from "@/components/views/AchievementsView";
import DiaryView from "@/components/views/DiaryView";
import TimeCapsuleView from "@/components/views/TimeCapsuleView";
import InteractiveView from "@/components/views/InteractiveView";
import { Heart, Sparkles } from "lucide-react";

export default function AppHome() {
  const { isNightMode } = useApp();
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  // 同步 dark 属性到 html 根元素
  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isNightMode]);

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* 沉浸式冬日开场问候（可跳过） */}
      <OpeningCurtain />

      {/* 缓慢飘落雪花粒子（可随时在导航栏关闭或进入节能模式） */}
      <Snowfall />

      {/* 纯净治愈系背景音乐控制器（Web Audio API 无断流） */}
      <BackgroundAudio />

      {/* 顶部主导航与移动端控制中心 */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 核心视图渲染区 */}
      <main className="flex-1 pb-24 lg:pb-12">
        {activeTab === "home" && <HomeView onNavigate={setActiveTab} />}
        {activeTab === "gallery" && <GalleryView />}
        {activeTab === "food" && <FoodView />}
        {activeTab === "gifts" && <GiftsView />}
        {activeTab === "wishes" && <WishesView />}
        {activeTab === "timeline" && <TimelineView />}
        {activeTab === "diary" && <DiaryView />}
        {activeTab === "starry" && <StarryView />}
        {activeTab === "achievements" && <AchievementsView />}
        {activeTab === "capsule" && <TimeCapsuleView />}
        {activeTab === "interactive" && <InteractiveView />}
      </main>

      {/* 优雅温暖的页脚 */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-6 px-4 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-light">
          <span>Our Little World</span>
          <span>·</span>
          <span>专属两人的数字恋爱博物馆</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/60" />
        </div>
        <p className="text-[11px] text-slate-400/80">
          冬天很冷，幸好有你。想把与你有关的每一个瞬间，都偷偷收藏。
        </p>
      </footer>
    </div>
  );
}
