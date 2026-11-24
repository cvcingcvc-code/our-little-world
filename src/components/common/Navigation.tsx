"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Heart,
  Camera,
  UtensilsCrossed,
  Gift,
  ListTodo,
  Milestone,
  Sparkles,
  Trophy,
  Mail,
  Users2,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Snowflake,
  Sun,
  Moon,
  Menu,
  X,
  Gauge,
  BookHeart,
} from "lucide-react";
import AuthModal from "./AuthModal";

export type NavTab =
  | "home"
  | "gallery"
  | "food"
  | "gifts"
  | "wishes"
  | "timeline"
  | "diary"
  | "starry"
  | "achievements"
  | "capsule"
  | "interactive";

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const {
    isAuthenticated,
    isNightMode,
    toggleNightMode,
    isSnowing,
    toggleSnow,
    isLowPerformance,
    toggleLowPerformance,
    isBgmPlaying,
    toggleBgm,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "冬日首屏", icon: Heart },
    { id: "gallery", label: "可爱收藏馆", icon: Camera },
    { id: "food", label: "美食日记", icon: UtensilsCrossed },
    { id: "gifts", label: "礼物博物馆", icon: Gift },
    { id: "wishes", label: "100件小事", icon: ListTodo },
    { id: "timeline", label: "恋爱时间轴", icon: Milestone },
    { id: "diary", label: "恋爱日记", icon: BookHeart },
    { id: "starry", label: "专属星空", icon: Sparkles },
    { id: "achievements", label: "成就系统", icon: Trophy },
    { id: "capsule", label: "时光信箱", icon: Mail },
    { id: "interactive", label: "双人互动", icon: Users2 },
  ];

  return (
    <>
      {/* 顶部主导航（沉浸式磨砂浮岛） */}
      <header className="sticky top-0 z-40 w-full transition-all duration-500 bg-white/70 dark:bg-slate-950/75 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo 区域 */}
          <button
            onClick={() => onNavigateTab("home")}
            className="flex items-center gap-3 text-left group cursor-pointer border-none bg-transparent p-0 outline-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-serif text-base tracking-tight font-medium text-slate-800 dark:text-slate-100 block leading-tight">
                Our Little World
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light block leading-none tracking-wider">
                冬日恋爱纪念馆 ❄️
              </span>
            </div>
          </button>

          {/* 桌面端导航（仅在 lg 及以上大屏展示，与手机端彻底隔离，绝不重复） */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1.5 rounded-full border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer border-none outline-none ${
                    isActive
                      ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-300 shadow-sm font-semibold scale-[1.02]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-rose-500" : ""}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 右侧全局控制按钮组 */}
          <div className="flex items-center gap-2">
            {/* 背景音乐 */}
            <button
              onClick={toggleBgm}
              title={isBgmPlaying ? "关闭背景音乐" : "播放治愈冬日纯音"}
              className={`p-2 rounded-full text-xs transition cursor-pointer border border-transparent outline-none ${
                isBgmPlaying
                  ? "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border-rose-300/40 animate-pulse"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {isBgmPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* 漫天飘雪 */}
            <button
              onClick={toggleSnow}
              title={isSnowing ? "暂停漫天飘雪" : "开启冬日漫雪"}
              className={`p-2 rounded-full text-xs transition cursor-pointer border border-transparent outline-none ${
                isSnowing
                  ? "bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 border-sky-300/40"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Snowflake className="w-4 h-4" />
            </button>

            {/* 昼夜切换 */}
            <button
              onClick={toggleNightMode}
              title={isNightMode ? "切换为晨雪日光模式" : "切换为星夜暗语模式"}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border-none outline-none"
            >
              {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* 节能模式 */}
            <button
              onClick={toggleLowPerformance}
              title={isLowPerformance ? "关闭节能" : "开启节能模式"}
              className={`hidden sm:flex p-2 rounded-full text-xs transition cursor-pointer border border-transparent outline-none ${
                isLowPerformance
                  ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 border-emerald-300/40"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Gauge className="w-4 h-4" />
            </button>

            {/* 权限锁状态按钮 */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border outline-none ${
                isAuthenticated
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-300/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300/40"
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">专属模式</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">访客演示</span>
                </>
              )}
            </button>

            {/* 移动端菜单开关（仅在 < lg 时出现） */}
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border-none outline-none"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 移动端折叠抽屉菜单（仅手机端展开） */}
        {mobileDrawerOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-2xl animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id);
                      setMobileDrawerOpen(false);
                    }}
                    className={`p-3 rounded-2xl text-left text-xs font-medium flex items-center gap-2.5 transition cursor-pointer border-none outline-none ${
                      isActive
                        ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-rose-500" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* 移动端悬浮底部极简药丸 Dock（仅手机端显示，桌面端彻底隐藏 hidden lg:hidden） */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center pointer-events-none">
        <div className="bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-full px-4 py-2.5 flex items-center gap-4 pointer-events-auto">
          {[
            { id: "home", label: "首页", icon: Heart },
            { id: "gallery", label: "相册", icon: Camera },
            { id: "starry", label: "星空", icon: Sparkles },
            { id: "food", label: "美食", icon: UtensilsCrossed },
            { id: "wishes", label: "愿望", icon: ListTodo },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab(item.id as NavTab)}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition cursor-pointer border-none outline-none ${
                  isActive
                    ? "text-rose-400 font-semibold scale-110"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );

  function onNavigateTab(tab: NavTab) {
    onTabChange(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
