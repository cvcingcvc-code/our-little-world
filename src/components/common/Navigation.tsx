"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Heart,
  Milestone,
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
import {
  ShoujoHomeIcon,
  ShoujoAlbumIcon,
  ShoujoStarsIcon,
  ShoujoFoodIcon,
  ShoujoWishesIcon,
  ShoujoGiftIcon,
} from "@/components/icons/ShoujoNavIcons";
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
  const [clickedTab, setClickedTab] = useState<NavTab | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  // 核心 6 大少女感 SVG 图标入口（严格对应：首页爱心小屋、相册蝴蝶结相机、星空月亮星星、美食草莓蛋糕、愿望少女手账、礼物丝带礼盒）
  const primaryNavItems: {
    id: NavTab;
    label: string;
    shortLabel: string;
    Icon: React.ComponentType<{ className?: string }>;
    particleColor: string;
  }[] = [
    { id: "home", label: "冬日首页", shortLabel: "首页", Icon: ShoujoHomeIcon, particleColor: "#F47FA9" },
    { id: "gallery", label: "可爱相册", shortLabel: "相册", Icon: ShoujoAlbumIcon, particleColor: "#FFB9D1" },
    { id: "starry", label: "专属星空", shortLabel: "星空", Icon: ShoujoStarsIcon, particleColor: "#FFE6A6" },
    { id: "food", label: "美食日记", shortLabel: "美食", Icon: ShoujoFoodIcon, particleColor: "#F47FA9" },
    { id: "wishes", label: "愿望手账", shortLabel: "愿望", Icon: ShoujoWishesIcon, particleColor: "#E3D6FF" },
    { id: "gifts", label: "丝带礼盒", shortLabel: "礼物", Icon: ShoujoGiftIcon, particleColor: "#FFD1E6" },
  ];

  // 更多深度展厅（收纳于优雅子菜单中）
  const secondaryNavItems: { id: NavTab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "timeline", label: "恋爱时间轴", icon: Milestone, desc: "依年月排列的岁月记忆画卷" },
    { id: "diary", label: "恋爱日记", icon: BookHeart, desc: "日常絮语、心情与想说的话" },
    { id: "achievements", label: "恋爱成就", icon: Trophy, desc: "根据真实历程解锁的共同里程碑" },
    { id: "capsule", label: "时光信箱", icon: Mail, desc: "寄往未来的倒计时情书" },
    { id: "interactive", label: "双人互动", icon: Users2, desc: "今日想你、秘密留言与回忆盲盒" },
  ];

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
    setClickedTab(id);
    setTimeout(() => setClickedTab(null), 380);
    onTabChange(id);
    setMobileDrawerOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <>
      {/* 顶部主导航（半透明薰衣草紫玻璃 + 粉色水晶描边） */}
      <header className="sticky top-0 z-40 w-full transition-all duration-500 shoujo-top-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo 区域 */}
          <button
            onClick={() => onNavigateTab("home")}
            className="flex items-center gap-2.5 text-left group cursor-pointer border-none bg-transparent p-0 outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#F6A9CD] via-[#F47FA9] to-[#A995D0] flex items-center justify-center text-white shadow-md shadow-pink-400/25 group-hover:scale-105 transition-transform shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="whitespace-nowrap">
              <span className="font-serif-sc text-sm sm:text-base tracking-wider font-medium text-[#3A2C54] dark:text-[#FFF5EF] block leading-tight">
                Our Little World
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#68568A] dark:text-[#E6D7F5] font-cinzel tracking-[0.18em] block leading-none">
                WINTER ARCHIVE ❄️
              </span>
            </div>
          </button>

          {/* 桌面端导航：6 大少女感定制 SVG 入口 + 更多展馆下拉 */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#FFF5EF]/60 dark:bg-[#292445]/75 border border-[#F6A9CD]/45 backdrop-blur-xl">
            {primaryNavItems.map((item) => {
              const { Icon } = item;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigateTab(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-serif-sc tracking-wider flex items-center gap-1.5 cursor-pointer outline-none shoujo-nav-item group ${
                    isActive
                      ? "btn-shoujo-pill-active font-medium text-white shadow-[0_0_18px_rgba(246,169,205,0.45)]"
                      : "text-[#4A386B] dark:text-[#FFF0F8] hover:text-[#292445] dark:hover:text-white hover:bg-[#F6A9CD]/25"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? "scale-110 -translate-y-0.5" : "opacity-90 group-hover:opacity-100 group-hover:-translate-y-0.5"
                    }`}
                  />
                  <span>{item.shortLabel}</span>
                </button>
              );
            })}

            {/* 更多展厅下拉 */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-3 py-1.5 rounded-full text-xs font-serif-sc tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer outline-none shoujo-nav-item ${
                  isSecondaryActive || moreMenuOpen
                    ? "btn-shoujo-pill-active text-white"
                    : "text-[#4A386B] dark:text-[#FFF0F8] hover:text-[#292445] dark:hover:text-white hover:bg-[#F6A9CD]/25"
                }`}
              >
                <span>更多展馆</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute top-full right-0 mt-2.5 w-64 p-2 rounded-3xl shoujo-bottom-nav animate-fadeIn z-50">
                  <div className="px-3 py-1.5 text-[10px] font-cinzel text-[#beb2d2] tracking-[0.2em] border-b border-[#efa6c9]/20 mb-1">
                    SPECIAL EXHIBITIONS
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigateTab(item.id)}
                        className={`w-full px-3 py-2 rounded-2xl text-left transition flex items-start gap-2.5 cursor-pointer border-none outline-none ${
                          isActive
                            ? "bg-pink-400/20 text-[#ffdbeb]"
                            : "hover:bg-white/10 text-[#d2c4e1] hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 text-pink-300 shrink-0" />
                        <div>
                          <div className="text-xs font-serif-sc font-medium">{item.label}</div>
                          <div className="text-[10px] text-[#beb2d2] font-light leading-tight">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* 右侧控制中心：黑胶唱片微型播放器 + 环境控制 + 权限状态 */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 优雅黑胶唱片迷你播放器 */}
            <button
              onClick={toggleBgm}
              title={isBgmPlaying ? "正在播放: 冬日纯净纯音 (点击暂停)" : "点击播放治愈冬日纯音"}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border outline-none ${
                isBgmPlaying
                  ? "bg-pink-400/25 border-pink-300/60 text-[var(--theme-text-primary)] shadow-[0_0_15px_rgba(244,114,182,0.3)]"
                  : "bg-[var(--theme-surface-glass)] border-[var(--theme-border-crystal)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]"
              }`}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Disc
                  className={`w-5 h-5 text-[#F47FA9] ${isBgmPlaying ? "animate-vinyl text-[#F6A9CD]" : ""}`}
                />
                <span className="absolute w-1.5 h-1.5 rounded-full bg-[#292445] border border-[#F6A9CD]" />
              </div>
              <div className="hidden sm:flex items-end gap-0.5 h-3">
                <span className={`w-0.5 rounded-full bg-[#F47FA9] transition-all ${isBgmPlaying ? "h-3 animate-pulse" : "h-1"}`} />
                <span className={`w-0.5 rounded-full bg-[#F6A9CD] transition-all ${isBgmPlaying ? "h-2 animate-bounce" : "h-1"}`} />
                <span className={`w-0.5 rounded-full bg-[#F47FA9] transition-all ${isBgmPlaying ? "h-3.5 animate-pulse" : "h-1"}`} />
              </div>
            </button>

            {/* 漫天飘雪切换 */}
            <button
              onClick={toggleSnow}
              title={isSnowing ? "暂停漫天飘雪" : "开启冬日漫雪"}
              className={`p-2 rounded-full text-xs transition cursor-pointer border outline-none ${
                isSnowing
                  ? "bg-[#F6A9CD]/30 dark:bg-[#A995D0]/35 text-[#8B2B5C] dark:text-[#FFF0F8] border-[#F6A9CD]/65"
                  : "bg-[var(--theme-surface-glass)] border-[var(--theme-border-crystal)] text-[#68568A] dark:text-[#E6D7F5]"
              }`}
            >
              <Snowflake className="w-4 h-4" />
            </button>

            {/* 昼夜氛围 */}
            <button
              onClick={toggleNightMode}
              title={isNightMode ? "切换为奶油晨雪浅色主题" : "切换为深暮星紫星空主题"}
              className="p-2 rounded-full bg-[var(--theme-surface-glass)] border border-[var(--theme-border-crystal)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition cursor-pointer outline-none"
            >
              {isNightMode ? <Sun className="w-4 h-4 text-[#FFE3B5]" /> : <Moon className="w-4 h-4 text-[#65548D]" />}
            </button>

            {/* 私人权限状态胶囊 */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif-sc transition cursor-pointer border outline-none ${
                isAuthenticated
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-200 border-emerald-400/45 shadow-sm"
                  : "bg-[var(--theme-surface-glass)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] border-[var(--theme-border-crystal)]"
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-300" />
                  <span>专属模式</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#F47FA9]" />
                  <span>访客模式</span>
                </>
              )}
            </button>

            {/* 移动端汉堡菜单触发器 */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="展开更多展厅菜单"
              className="lg:hidden p-2 rounded-xl bg-[var(--theme-surface-glass)] border border-[var(--theme-border-crystal)] text-[var(--theme-text-primary)] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端全屏抽屉侧边栏 */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-80 max-w-[85vw] h-full bg-[#17162c]/95 border-l border-[#efa6c9]/30 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#efa6c9]/20">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                  <span className="font-serif-sc text-sm text-[#fce5f0]">恋爱纪念馆 · 全部展厅</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-[#beb2d2] hover:text-white border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {primaryNavItems.map((item) => {
                  const { Icon } = item;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigateTab(item.id)}
                      className={`w-full px-4 py-2.5 rounded-2xl text-left text-xs font-serif-sc tracking-wider flex items-center justify-between transition cursor-pointer outline-none ${
                        isActive
                          ? "shoujo-nav-item-active font-medium"
                          : "text-[#d2c4e1] hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-pink-300" />}
                    </button>
                  );
                })}

                <div className="pt-3 pb-1 px-2 text-[10px] font-cinzel text-[#beb2d2] tracking-[0.2em]">
                  MORE EXHIBITIONS
                </div>

                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigateTab(item.id)}
                      className={`w-full px-4 py-2.5 rounded-2xl text-left text-xs font-serif-sc tracking-wider flex items-center justify-between transition cursor-pointer outline-none ${
                        isActive
                          ? "shoujo-nav-item-active font-medium"
                          : "text-[#d2c4e1] hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-pink-300" : "text-[#beb2d2]"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-pink-300" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#efa6c9]/20 space-y-3">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-full btn-shoujo-glass text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAuthenticated ? <Unlock className="w-3.5 h-3.5 text-emerald-300" /> : <Lock className="w-3.5 h-3.5 text-pink-300" />}
                <span>{isAuthenticated ? "当前处于专属模式" : "验证私密通行码"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 移动端底部少女感深紫磨砂悬浮导航栏 ================= */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-2.5 sm:px-4 pointer-events-none"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
      >
        <nav
          aria-label="纪念馆底部导航"
          className="shoujo-bottom-nav pointer-events-auto max-w-md mx-auto rounded-[28px] px-1.5 py-2 flex items-center justify-between gap-0.5"
        >
          {primaryNavItems.map((item) => {
            const { Icon } = item;
            const isActive = activeTab === item.id;
            const isClicked = clickedTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onNavigateTab(item.id)}
                className={`relative flex-1 min-w-0 py-1.5 px-0.5 rounded-[18px] flex flex-col items-center justify-center gap-0.5 cursor-pointer outline-none select-none shoujo-nav-item ${
                  isActive
                    ? "shoujo-nav-item-active"
                    : "text-[#d2c4e1] hover:text-[#ffdbeb] bg-transparent"
                }`}
              >
                {/* 选中状态：柔和微光微型粒子动效（星芒与光点） */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none overflow-visible">
                    <span
                      className="absolute -top-0.5 right-2 w-1.5 h-1.5 rounded-full animate-micro-particle-1"
                      style={{ backgroundColor: item.particleColor, boxShadow: `0 0 6px ${item.particleColor}` }}
                    />
                    <span
                      className="absolute top-1 left-2 text-[8px] leading-none animate-micro-particle-2"
                      style={{ color: "#FFE6A6" }}
                    >
                      ✦
                    </span>
                  </div>
                )}

                {/* 点击瞬间的独立柔和粉紫涟漪反馈 */}
                {isClicked && (
                  <span className="absolute inset-0 rounded-[18px] bg-pink-300/25 animate-ping pointer-events-none" />
                )}

                {/* 定制马卡龙 SVG 图标（选中轻微放大上浮） */}
                <Icon
                  className={`w-7 h-7 max-[370px]:w-6 max-[370px]:h-6 transition-all duration-300 ${
                    isActive
                      ? "opacity-100 -translate-y-0.5 scale-110 drop-shadow-[0_4px_10px_rgba(244,143,181,0.45)]"
                      : "opacity-80 group-hover:opacity-100"
                  }`}
                />

                {/* 清晰可读的标签文案 */}
                <span
                  className={`text-[11px] max-[370px]:text-[10px] font-serif-sc leading-none tracking-tight whitespace-nowrap transition-colors ${
                    isActive ? "text-[#ffdbeb] font-medium" : "text-[#d2c4e1]/90 font-light"
                  }`}
                >
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 私密鉴权模态框 */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
