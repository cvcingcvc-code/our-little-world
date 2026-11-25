"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Navigation, { NavTab } from "@/components/common/Navigation";
import GlobalBackground from "@/components/common/GlobalBackground";
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
    <div className="relative min-h-dvh w-full flex flex-col justify-between transition-colors duration-500 text-[var(--theme-text-primary)] overflow-x-hidden">
      {/* 全站 7 层梦幻童话背景底座 (Layer 01 - Layer 04) */}
      <GlobalBackground />

      {/* 沉浸式冬日开场问候（可跳过） */}
      <OpeningCurtain />

      {/* Layer 05: 少女感复合雪花/星芒/爱心/花瓣/蝴蝶粒子引擎 */}
      <Snowfall />

      {/* 纯净治愈系背景音乐控制器 */}
      <BackgroundAudio />

      {/* 顶部主导航与移动端控制中心 */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Layer 06: 核心视图渲染区 */}
      <main className="relative z-10 flex-1 w-full pb-12">
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

      {/* 童话雪境自然收尾页脚（粉色云海、蕾丝星辰分隔线、暖光爱心轨迹，移动端预留安全区） */}
      <footer className="relative z-10 w-full mt-8 pt-10 pb-28 lg:pb-10 px-4 text-center space-y-3 overflow-hidden">
        {/* 蕾丝与星辰分隔线 */}
        <div className="max-w-xl mx-auto flex items-center justify-center gap-3 text-[#F6A9CD]">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F6A9CD]/70 to-[#FFE3B5]/80" />
          <Sparkles className="w-3.5 h-3.5 text-[#FFE3B5]" />
          <Heart className="w-4 h-4 text-[#F6A9CD] fill-[#F6A9CD]/70" />
          <Sparkles className="w-3.5 h-3.5 text-[#FFE3B5]" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F6A9CD]/70 to-[#FFE3B5]/80" />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-serif-sc font-medium text-[var(--theme-text-primary)] tracking-wider">
          <span>Our Little World</span>
          <span>·</span>
          <span>专属两人的数字恋爱博物馆</span>
          <span className="text-[#F47FA9]">♡</span>
        </div>

        <p className="text-[11px] sm:text-xs font-serif-sc text-[var(--theme-text-secondary)] leading-relaxed">
          冬天很冷，幸好有你。<br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          想把与你有关的每一个瞬间，都偷偷收藏。
        </p>
      </footer>
    </div>
  );
}
