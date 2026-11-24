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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "冬日首页", icon: Heart },
    { id: "gallery", label: "可爱收藏馆", icon: Camera },
    { id: "food", label: "美食日记", icon: UtensilsCrossed },
    { id: "gifts", label: "礼物博物馆", icon: Gift },
    { id: "wishes", label: "100件小事", icon: ListTodo },
    { id: "timeline", label: "恋爱时间轴", icon: Milestone },
    { id: "diary", label: "恋爱日记", icon: BookHeart },
    { id: "starry", label: "恋爱星空", icon: Sparkles },
    { id: "achievements", label: "成就系统", icon: Trophy },
    { id: "capsule", label: "时光信箱", icon: Mail },
    { id: "interactive", label: "双人互动", icon: Heart },
  ];

  return (
    <>
      {/* 顶部主导航栏（桌面与大屏） */}
      <header className="sticky top-0 z-40 w-full transition-colors duration-500 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo 区域 */}
          <button
            onClick={() => onTabChange("home")}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-serif text-base tracking-tight font-medium text-slate-800 dark:text-slate-100 block leading-tight">
                Our Little World
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light block leading-none">
                我们的小世界 ❄️
              </span>
            </div>
          </button>

          {/* 桌面端中间导航项 */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-rose-500/10 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-rose-500 dark:text-rose-400" : ""}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 右侧功能控制组：音乐、昼夜、雪花、性能、权限 */}
          <div className="flex items-center gap-2">
            {/* 背景音乐开关 */}
            <button
              onClick={toggleBgm}
              title={isBgmPlaying ? "关闭背景音乐" : "播放治愈冬日纯音"}
              className={`p-2 rounded-full text-xs transition cursor-pointer ${
                isBgmPlaying
                  ? "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 animate-pulse"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {isBgmPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* 飘雪开关 */}
            <button
              onClick={toggleSnow}
              title={isSnowing ? "暂停漫天飘雪" : "开启冬日漫雪"}
              className={`p-2 rounded-full text-xs transition cursor-pointer ${
                isSnowing
                  ? "bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Snowflake className="w-4 h-4" />
            </button>

            {/* 昼夜/星空模式 */}
            <button
              onClick={toggleNightMode}
              title={isNightMode ? "切换为晨雪日光模式" : "切换为星夜暗语模式"}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* 低动效/节能模式 */}
            <button
              onClick={toggleLowPerformance}
              title={isLowPerformance ? "关闭节能（开启全部动效）" : "开启低性能节能模式"}
              className={`p-2 rounded-full text-xs transition cursor-pointer ${
                isLowPerformance
                  ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Gauge className="w-4 h-4" />
            </button>

            {/* 权限状态按钮 */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isAuthenticated
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-300/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300/40"
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
                  <span className="hidden sm:inline">访客展示</span>
                </>
              )}
            </button>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 移动端折叠抽屉菜单 */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-medium flex items-center gap-2.5 transition cursor-pointer ${
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

      {/* 移动端底部高频快捷栏 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 px-3 py-2 flex items-center justify-around">
        {[
          { id: "home", label: "首页", icon: Heart },
          { id: "gallery", label: "收藏馆", icon: Camera },
          { id: "starry", label: "星空", icon: Sparkles },
          { id: "food", label: "美食", icon: UtensilsCrossed },
          { id: "wishes", label: "愿望", icon: ListTodo },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavTab)}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer ${
                isActive
                  ? "text-rose-600 dark:text-rose-400 font-semibold scale-105"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
