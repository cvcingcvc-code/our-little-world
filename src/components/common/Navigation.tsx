"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Snowflake,
  Sun,
  Moon,
  Menu,
  X,
  BookHeart,
  ChevronDown,
  Disc,
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
    isBgmPlaying,
    toggleBgm,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  // 核心置顶 5 大展厅
  const primaryNavItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "冬日首页", icon: Heart },
    { id: "gallery", label: "可爱收藏馆", icon: Camera },
    { id: "food", label: "美食日记", icon: UtensilsCrossed },
    { id: "gifts", label: "礼物博物馆", icon: Gift },
    { id: "starry", label: "专属星空", icon: Sparkles },
  ];

  // 更多深度展厅（收纳于优雅子菜单中，告别顶部杂乱拥挤）
  const secondaryNavItems: { id: NavTab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "wishes", label: "100件小事", icon: ListTodo, desc: "共同奔赴的愿望与约会计划" },
    { id: "timeline", label: "恋爱时间轴", icon: Milestone, desc: "依年月排列的岁月记忆画卷" },
    { id: "diary", label: "恋爱日记", icon: BookHeart, desc: "日常絮语、心情与想说的话" },
    { id: "achievements", label: "恋爱成就", icon: Trophy, desc: "根据真实历程解锁的共同里程碑" },
    { id: "capsule", label: "时光信箱", icon: Mail, desc: "寄往未来的倒计时情书" },
    { id: "interactive", label: "双人互动", icon: Users2, desc: "今日想你、秘密留言与回忆盲盒" },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  // 点击外部关闭更多子菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onNavigateTab = (id: NavTab) => {
    onTabChange(id);
    setMobileDrawerOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <>
      {/* 顶部主导航（高定冰晶磨砂浮岛） */}
      <header className="sticky top-0 z-40 w-full transition-all duration-500 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo 区域 */}
          <button
            onClick={() => onNavigateTab("home")}
            className="flex items-center gap-3 text-left group cursor-pointer border-none bg-transparent p-0 outline-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-serif-sc text-base tracking-wider font-normal text-white block leading-tight">
                Our Little World
              </span>
              <span className="text-[10px] text-slate-400 font-cinzel tracking-[0.2em] block leading-none">
                WINTER ARCHIVE ❄️
              </span>
            </div>
          </button>

          {/* 桌面端导航：核心 5 项 + 更多下拉，留白得体，从容高级 */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-serif-sc tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer border-none outline-none ${
                    isActive
                      ? "bg-white/20 text-white font-medium shadow-md shadow-rose-500/10 border border-white/25"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-rose-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* 更多展厅下拉 */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-3 py-1.5 rounded-full text-xs font-serif-sc tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer border-none outline-none ${
                  isSecondaryActive || moreMenuOpen
                    ? "bg-rose-500/20 text-rose-200 border border-rose-400/30"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>更多展馆</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute top-full right-0 mt-2.5 w-64 p-2 rounded-2xl glass-crystal border border-white/20 shadow-2xl animate-fadeIn z-50">
                  <div className="px-3 py-1.5 text-[10px] font-cinzel text-slate-400 tracking-[0.2em] border-b border-white/10 mb-1">
                    SPECIAL EXHIBITIONS
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigateTab(item.id)}
                        className={`w-full px-3 py-2 rounded-xl text-left transition flex items-start gap-2.5 cursor-pointer border-none outline-none ${
                          isActive
                            ? "bg-rose-500/20 text-rose-200"
                            : "hover:bg-white/10 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                        <div>
                          <div className="text-xs font-serif-sc font-medium">{item.label}</div>
                          <div className="text-[10px] text-slate-400 font-light leading-tight">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* 右侧控制中心：黑胶唱片微型播放器 + 环境控制 + 权限状态 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 优雅黑胶唱片迷你播放器 */}
            <button
              onClick={toggleBgm}
              title={isBgmPlaying ? "正在播放: 冬日纯净纯音 (点击暂停)" : "点击播放治愈冬日纯音"}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border outline-none ${
                isBgmPlaying
                  ? "bg-rose-500/20 border-rose-400/40 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Disc
                  className={`w-5 h-5 text-rose-400 ${isBgmPlaying ? "animate-vinyl text-rose-300" : ""}`}
                />
                <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-900 border border-rose-400" />
              </div>
              {/* 音频均衡器小动画柱 */}
              <div className="hidden sm:flex items-end gap-0.5 h-3">
                <span className={`w-0.5 rounded-full bg-rose-400 transition-all ${isBgmPlaying ? "h-3 animate-pulse" : "h-1"}`} />
                <span className={`w-0.5 rounded-full bg-rose-300 transition-all ${isBgmPlaying ? "h-2 animate-bounce" : "h-1"}`} />
                <span className={`w-0.5 rounded-full bg-rose-400 transition-all ${isBgmPlaying ? "h-3.5 animate-pulse" : "h-1"}`} />
              </div>
            </button>

            {/* 漫天飘雪切换 */}
            <button
              onClick={toggleSnow}
              title={isSnowing ? "暂停漫天飘雪" : "开启冬日漫雪"}
              className={`p-2 rounded-full text-xs transition cursor-pointer border outline-none ${
                isSnowing
                  ? "bg-sky-500/20 text-sky-300 border-sky-400/30"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <Snowflake className="w-4 h-4" />
            </button>

            {/* 昼夜氛围 */}
            <button
              onClick={toggleNightMode}
              title={isNightMode ? "切换为晨雪日光模式" : "切换为星夜暗语模式"}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer outline-none"
            >
              {isNightMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>

            {/* 私人权限状态胶囊 */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif-sc transition cursor-pointer border outline-none ${
                isAuthenticated
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30 shadow-sm"
                  : "bg-white/5 text-slate-300 hover:text-white border-white/10"
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>专属模式</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>访客模式</span>
                </>
              )}
            </button>

            {/* 移动端汉堡菜单触发器 */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端全屏抽屉侧边栏 */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-80 max-w-[85vw] h-full bg-slate-950/95 border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span className="font-serif-sc text-sm text-white">恋爱纪念馆 · 展厅导览</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-white border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigateTab(item.id)}
                      className={`w-full px-4 py-3 rounded-2xl text-left text-xs font-serif-sc tracking-wider flex items-center justify-between transition cursor-pointer border-none outline-none ${
                        isActive
                          ? "bg-rose-500/25 text-rose-200 font-medium border border-rose-400/30"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-rose-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 text-xs text-slate-200 flex items-center justify-center gap-2"
              >
                {isAuthenticated ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isAuthenticated ? "当前处于专属模式" : "验证私密通行码"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 移动端底部悬浮药丸胶囊 Dock (仅在移动端展示，常驻 5 项核心) */}
      <nav className="lg:hidden fixed bottom-4 inset-x-4 z-40 h-14 rounded-full bg-slate-950/85 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center justify-around px-2">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigateTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-full transition-all border-none bg-transparent cursor-pointer ${
                isActive ? "text-rose-400 scale-110 font-medium" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-serif-sc leading-none">{item.label.replace("冬日", "").replace("专属", "")}</span>
            </button>
          );
        })}
      </nav>

      {/* 私密鉴权模态框 */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
