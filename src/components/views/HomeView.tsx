"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  Heart,
  Sparkles,
  Calendar,
  ArrowRight,
  ChevronDown,
  Camera,
  UtensilsCrossed,
  Gift,
  ListTodo,
  Edit3,
  X,
  Coffee,
  Trees,
  Quote,
  RefreshCw,
  Compass,
  Bookmark,
} from "lucide-react";
import { NavTab } from "../common/Navigation";
import { getActiveSiteConfig, saveActiveSiteStartDate } from "@/config/site";
import { getPhotos, getFoodRecords, getGiftRecords, getWishItems } from "@/lib/storage";
import { withBasePath } from "@/lib/assets";
import RomanticModal from "@/components/common/RomanticModal";

type WinterScene = "street" | "cafe" | "gift";

const SCENE_CONFIG: Record<
  WinterScene,
  {
    name: string;
    icon: React.ElementType;
    image: string;
    tag: string;
    subTag: string;
    motto: string;
    desc: string;
  }
> = {
  street: {
    name: "雪夜漫步",
    icon: Trees,
    image: "/winter-hero-hd.jpg",
    tag: "STREET WALK · 初雪之夜",
    subTag: "COLLECTION N°01 // WINTER CHRONICLE",
    motto: "冬天很冷，幸好有你。",
    desc: "想把与你有关的每一个瞬间，都偷偷收藏。",
  },
  cafe: {
    name: "暖冬咖啡馆",
    icon: Coffee,
    image: "/winter-cafe-hd.jpg",
    tag: "WARM CAFE · 窗边温存",
    subTag: "COLLECTION N°02 // AFTERNOON COFFEE",
    motto: "一杯热拿铁，和你眼底的微光。",
    desc: "炉火微温，玻璃窗上的哈气写满你的名字。",
  },
  gift: {
    name: "心动礼遇",
    icon: Gift,
    image: "/winter-gift-hd.jpg",
    tag: "GIFT MOMENT · 甜蜜惊喜",
    subTag: "COLLECTION N°03 // SPECIAL SURPRISE",
    motto: "拆开礼盒的那一刻，便拥有了整个冬天。",
    desc: "不是因为礼物而开心，是因为送礼物的人是你。",
  },
};

const DAILY_WHISPERS = [
  "今天的天气很冷，但一想到你，心口就是滚烫的。",
  "如果初雪有声音，那一定是我想念你的回音。",
  "无论冬天的风多大，牵着你的手就是我的避风港。",
  "下雪的时候一定要和你在一起，因为一不小心就白了头。",
  "世界很大也很冷，幸好在这个角落，我们拥有彼此的小世界。",
  "三餐四季，年岁并往，愿与你携手看遍人间烟火。",
];

export default function HomeView({ onNavigate }: { onNavigate: (tab: NavTab) => void }) {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();

  const [currentScene, setCurrentScene] = useState<WinterScene>("street");
  const [startDate, setStartDate] = useState<string>("");
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [inputDate, setInputDate] = useState("");
  const [whisperIndex, setWhisperIndex] = useState(0);

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
    wishTotal: 0,
  });

  useEffect(() => {
    const cfg = getActiveSiteConfig();
    setStartDate(cfg.startDate);
    setInputDate(cfg.startDate || new Date().toISOString().split("T")[0]);
  }, [refreshKey]);

  useEffect(() => {
    if (!startDate) return;
    const startTimestamp = new Date(startDate).getTime();
    if (isNaN(startTimestamp)) return;

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
  }, [startDate]);

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
      wishTotal: wishes.length,
    });
  }, [isAuthenticated, refreshKey]);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDate) return;
    saveActiveSiteStartDate(inputDate);
    setStartDate(inputDate);
    setDateModalOpen(false);
    triggerRefresh();
  };

  const nextWhisper = () => {
    setWhisperIndex((prev) => (prev + 1) % DAILY_WHISPERS.length);
  };

  const activeSceneInfo = SCENE_CONFIG[currentScene];

  return (
    <div className="relative w-full">
      {/* ================= 1. 4K 电影级画报首屏 (The Cinematic Hero Stage) ================= */}
      <section className="relative w-full min-h-[720px] lg:h-[calc(100vh-4rem)] lg:min-h-[780px] max-h-[1180px] flex items-center overflow-hidden">
        {/* 全屏超高清背景图片容器与自然呼吸景深 */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <Image
            key={currentScene}
            src={withBasePath(activeSceneInfo.image)}
            alt={activeSceneInfo.name}
            fill
            priority
            quality={100}
            className="object-cover object-right lg:object-center filter brightness-100 transition-all duration-1000 scale-[1.01]"
          />

          {/* 电影级粉紫微光暗角与柔和底边渐隐，与全局童话背景自然衔接 */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#292445]/82 via-[#43376B]/38 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#292445]/45 via-[#65548D]/20 to-transparent" />
        </div>

        {/* 左侧日系画报排版与冰晶纪年徽章区 */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full flex items-center justify-between">
          <div className="max-w-xl lg:max-w-2xl space-y-6 sm:space-y-8 animate-fadeIn">
            {/* 顶部：极细电影比例标尺与和风徽章 */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-cinzel tracking-[0.25em] text-white/90 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
                <Sparkles className="w-3 h-3 text-rose-300 animate-spin" />
                <span>{activeSceneInfo.tag}</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-cinzel tracking-[0.3em] text-slate-300/80">
                {activeSceneInfo.subTag}
              </span>
            </div>

            {/* 电影诗意中文主副标题 + 英文手写注释 */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-sc font-light tracking-wider text-white leading-[1.15] drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                {activeSceneInfo.motto.split("，")[0]}，<br />
                <span className="shimmer-text font-normal">
                  {activeSceneInfo.motto.split("，")[1] || "幸好有你。"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-200/90 font-cormorant italic tracking-[0.18em] drop-shadow">
                &ldquo;Every precious moment with you, quietly treasured forever.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-serif-sc font-light tracking-widest leading-relaxed">
                {activeSceneInfo.desc}
              </p>
            </div>

            {/* 核心特色：【冰晶琉璃时光纪年徽章 (The Crystal Chrono Badge)】 */}
            <div className="p-6 rounded-[2rem] bg-[#292445]/78 backdrop-blur-2xl border border-[#F6A9CD]/45 shadow-[0_20px_50px_rgba(41,36,69,0.48)] space-y-4 max-w-lg">
              <div className="flex items-center justify-between text-xs font-serif-sc text-[#FFF5EF]">
                <span className="flex items-center gap-2 text-[#FFD1DC]">
                  <Heart className="w-3.5 h-3.5 fill-[#F6A9CD] text-[#F6A9CD] animate-pulse" />
                  <span className="tracking-wider">相伴相守的温暖时光</span>
                </span>
                <button
                  onClick={() => setDateModalOpen(true)}
                  className="flex items-center gap-1.5 text-[11px] text-[#FFE3B5] hover:text-white transition cursor-pointer border-none bg-transparent"
                >
                  <Calendar className="w-3 h-3" />
                  <span className="font-cinzel tracking-wider">
                    {startDate ? startDate : "SET ANNIVERSARY"}
                  </span>
                  <Edit3 className="w-2.5 h-2.5 ml-0.5 text-[#FFE3B5]" />
                </button>
              </div>

              {startDate ? (
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  {/* 天数 */}
                  <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#F6A9CD]/30 shadow-inner group hover:bg-white/15 transition overflow-hidden">
                    <span className="font-cinzel text-lg sm:text-2xl lg:text-3xl font-light text-[#FFF5EF] block tracking-tight sm:tracking-wider tabular-nums group-hover:scale-105 transition-transform">
                      {timeTogether.days}
                    </span>
                    <span className="text-[9px] font-cinzel text-[#FFD1DC] tracking-[0.2em] uppercase block mt-1">
                      DAYS
                    </span>
                  </div>

                  {/* 小时 */}
                  <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A995D0]/35 shadow-inner group hover:bg-white/15 transition overflow-hidden">
                    <span className="font-cinzel text-lg sm:text-2xl lg:text-3xl font-light text-[#FFF0F8] block tracking-tight sm:tracking-wider tabular-nums">
                      {String(timeTogether.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-cinzel text-[#E6D7F5] tracking-[0.2em] uppercase block mt-1">
                      HOURS
                    </span>
                  </div>

                  {/* 分钟 */}
                  <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A995D0]/35 shadow-inner group hover:bg-white/15 transition overflow-hidden">
                    <span className="font-cinzel text-lg sm:text-2xl lg:text-3xl font-light text-[#FFF5EF] block tracking-tight sm:tracking-wider tabular-nums">
                      {String(timeTogether.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-cinzel text-[#E6D7F5] tracking-[0.2em] uppercase block mt-1">
                      MINS
                    </span>
                  </div>

                  {/* 秒数实时跳动 */}
                  <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#F6A9CD]/22 backdrop-blur-md border border-[#F6A9CD]/50 shadow-inner group overflow-hidden">
                    <span className="font-cinzel text-lg sm:text-2xl lg:text-3xl font-normal text-[#FFE3B5] block tracking-tight sm:tracking-wider tabular-nums">
                      {String(timeTogether.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-cinzel text-[#FFD1DC] tracking-[0.2em] uppercase block mt-1">
                      SECS
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setDateModalOpen(true)}
                  className="p-5 rounded-2xl bg-white/10 border border-dashed border-[#FFD1DC]/55 text-center cursor-pointer hover:bg-white/15 transition space-y-1.5"
                >
                  <Calendar className="w-5 h-5 mx-auto text-[#FFE3B5]" />
                  <p className="text-xs text-[#FFF5EF] font-serif-sc">点击此处，设定属于你们的恋爱起点</p>
                  <p className="text-[11px] text-[#FFD1DC] font-light">
                    开启相恋天、时、分、秒的精确纪念
                  </p>
                </div>
              )}
            </div>

            {/* 快速入馆按钮（少女感糖果果冻按钮） */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate("gallery")}
                className="btn-shoujo-primary px-8 py-3.5 rounded-full text-xs sm:text-sm font-serif-sc font-medium tracking-widest cursor-pointer flex items-center gap-2.5 group"
              >
                <Heart className="w-4 h-4 fill-white/90 text-white" />
                <span>步入可爱相册馆</span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate("starry")}
                className="btn-shoujo-glass !text-[#FFF5EF] px-7 py-3.5 rounded-full text-xs sm:text-sm font-serif-sc tracking-widest cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFE3B5]" />
                <span>仰望专属恋爱星空</span>
              </button>
            </div>
          </div>

          {/* 右侧垂直日系诗意装饰文字（仅在大屏幕展示） */}
          <div className="hidden xl:flex items-center gap-4 text-slate-300/60 pointer-events-none select-none">
            <div className="writing-mode-vertical text-xs font-serif-sc tracking-[0.5em] leading-loose opacity-70">
              冬の雪 · 君と出会えた奇跡 · 永遠の記録
            </div>
            <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          </div>
        </div>

        {/* 右下角：超高清冬日场景一键切换控制器 (仅桌面宽屏显示，彻底避免平板遮挡滚动提示) */}
        <div className="absolute bottom-7 right-10 z-20 hidden lg:flex items-center gap-1.5 p-1.5 rounded-full shoujo-bottom-nav shadow-2xl">
          {(["street", "cafe", "gift"] as WinterScene[]).map((scKey) => {
            const sc = SCENE_CONFIG[scKey];
            const Icon = sc.icon;
            const isSelected = currentScene === scKey;
            return (
              <button
                key={scKey}
                onClick={() => setCurrentScene(scKey)}
                title={`切换至【${sc.name}】超清场景`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif-sc tracking-wider transition-all flex items-center gap-1.5 cursor-pointer outline-none ${
                  isSelected
                    ? "btn-shoujo-pill-active scale-105"
                    : "text-[#E6D7F5] hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#FFD1DC]"}`} />
                <span>{sc.name}</span>
              </button>
            );
          })}
        </div>

        {/* 底部探索滚动指示器（仅 lg 桌面端居中展示，手机端与平板彻底避免碰撞） */}
        <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-[#FFF5EF]/80 text-[11px] font-cinzel tracking-[0.25em] pointer-events-none animate-bounce">
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#FFD1DC]" />
        </div>
      </section>

      {/* ================= 2. 每日心动微语 · 撕历手账 (Daily Whisper Card) ================= */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <div className="p-6 sm:p-8 rounded-3xl fairy-card relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#F6A9CD]/20 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-[#D85F91] dark:text-[#FFD1DC] text-xs font-serif-sc tracking-wider">
                <Quote className="w-3.5 h-3.5 fill-[#F6A9CD] text-[#F6A9CD]" />
                <span>冬日心动微语 · DAILY WHISPER</span>
              </div>
              <p className="text-base sm:text-lg font-serif-sc font-normal text-[var(--theme-text-primary)] leading-relaxed">
                &ldquo;{DAILY_WHISPERS[whisperIndex]}&rdquo;
              </p>
            </div>

            <button
              onClick={nextWhisper}
              title="抽取下一条心动微语"
              className="self-end sm:self-center btn-shoujo-glass px-4 py-2 rounded-full text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F47FA9] dark:text-[#FFE3B5]" />
              <span>翻一页</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 3. 殿堂级展览馆：冬日童话常设展厅 (Handcrafted Exhibitions) ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-20 space-y-14">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-cinzel tracking-[0.25em] text-[var(--theme-text-primary)] bg-[var(--theme-surface-glass)] border border-[#F6A9CD]/50 shadow-sm">
            <span className="text-[#F47FA9]">✦</span>
            <span>PERMANENT EXHIBITIONS</span>
            <span className="text-[#F47FA9]">✦</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-sc font-light text-[var(--theme-text-primary)] tracking-wider">
            恋爱纪念馆 · 常设展厅
          </h2>
          <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] font-serif-sc font-light tracking-wide">
            每一个展厅都收纳着彼此珍视的时光切片，温存着点点滴滴。
          </p>
        </div>

        {/* 4 大核心展厅：统一和谐的粉紫奶油童话质感 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-stretch">
          {/* 展台 1：可爱收藏馆 (奶油白拍立得 + 粉色胶带 + 珍珠花瓣) */}
          <div
            onClick={() => onNavigate("gallery")}
            className="relative cursor-pointer group flex flex-col"
          >
            <div className="washi-tape washi-tape-pink" />

            <div className="polaroid-frame -rotate-2 group-hover:rotate-0 transition-transform duration-500 flex-1 flex flex-col justify-between">
              <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#292445]">
                <Image
                  src={withBasePath("/winter-close-hd.jpg")}
                  alt="可爱相册缩略"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#292445]/65 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-[#FFF5EF] text-xs font-serif-sc flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#FFD1DC]" />
                  <span>拍立得胶片记忆</span>
                </div>
              </div>

              <div className="pt-3 px-1 space-y-1 text-[#3A2C54]">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-sc text-sm font-semibold tracking-wide text-[#3A2C54] group-hover:text-[#D85F91] transition-colors">
                    她的可爱收藏馆
                  </h3>
                  <span className="text-[10px] font-cinzel text-[#8C7AA8]">
                    {stats.photoCount} SHOTS
                  </span>
                </div>
                <p className="text-[11px] font-serif-sc text-[#68568A] leading-tight">
                  奶油白拍立得，珍珠花瓣与灯箱故事。
                </p>
              </div>
            </div>
          </div>

          {/* 展台 2：美食日记 (奶油蜜桃色 + 草莓蛋糕下午茶手账) */}
          <div
            onClick={() => onNavigate("food")}
            className="relative cursor-pointer group flex flex-col"
          >
            <div className="washi-tape" />

            <div className="p-6 rounded-[1.75rem] border border-[#FFD1DC]/70 dark:border-[#F6A9CD]/40 shadow-[0_14px_38px_-10px_rgba(101,84,141,0.28)] group-hover:-translate-y-2 transition-all duration-300 flex-1 flex flex-col justify-between space-y-5 rotate-1 group-hover:rotate-0 backdrop-blur-xl bg-[#FFF3EE]/88 dark:bg-[#5E4B7C]/80">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#FFD1DC]/45 dark:bg-[#F6A9CD]/25 text-[#D85F91] dark:text-[#FFE3B5] flex items-center justify-center border border-[#F6A9CD]/50">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel text-[#C46B8E] dark:text-[#FFE3B5] tracking-wider">
                  CHAPTER 02
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-sc text-base font-semibold text-[#3A2C54] dark:text-[#FFF5EF] group-hover:text-[#D85F91] dark:group-hover:text-[#FFD1DC] transition-colors">
                  我们的美食日记
                </h3>
                <p className="text-xs font-serif-sc text-[#68568A] dark:text-[#EADCF8] leading-relaxed font-light">
                  奶油蜜桃下午茶手账，记录三餐四季、草莓蛋糕与想吃心愿。
                </p>
              </div>

              <div className="pt-3 border-t border-[#F6A9CD]/30 flex items-center justify-between text-xs">
                <span className="text-[#8C7AA8] dark:text-[#D2C4E1] font-serif-sc">已打卡餐厅</span>
                <span className="font-cinzel font-medium text-[#D85F91] dark:text-[#FFE3B5]">
                  {stats.foodCount} PLACES
                </span>
              </div>
            </div>
          </div>

          {/* 展台 3：礼物与心动博物馆 (粉色丝绸 + 蝴蝶结 + 水晶礼盒) */}
          <div
            onClick={() => onNavigate("gifts")}
            className="relative cursor-pointer group flex flex-col"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <span className="px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#F6A9CD] via-[#F47FA9] to-[#A995D0] text-white text-[10px] font-cinzel shadow-md shadow-pink-400/40 border border-[#FFF0F8]/70 tracking-wider flex items-center gap-1 whitespace-nowrap">
                <span>🎀 SILK RIBBON</span>
              </span>
            </div>

            <div className="p-6 rounded-[1.75rem] border border-[#F6A9CD]/65 dark:border-[#F6A9CD]/45 shadow-[0_14px_38px_-10px_rgba(246,169,205,0.32)] group-hover:-translate-y-2 transition-all duration-300 flex-1 flex flex-col justify-between space-y-5 -rotate-1 group-hover:rotate-0 backdrop-blur-xl bg-[#FFEAF2]/86 dark:bg-[#6A4E86]/78">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#F6A9CD]/30 text-[#D85F91] dark:text-[#FFD1DC] flex items-center justify-center border border-[#F6A9CD]/55">
                  <Gift className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel text-[#C46B8E] dark:text-[#FFD1DC] tracking-wider">
                  CHAPTER 03
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-sc text-base font-semibold text-[#3A2C54] dark:text-[#FFF5EF] group-hover:text-[#D85F91] dark:group-hover:text-[#FFD1DC] transition-colors">
                  礼物与惊喜博物馆
                </h3>
                <p className="text-xs font-serif-sc text-[#68568A] dark:text-[#EADCF8] leading-relaxed font-light">
                  粉色丝绸与蝴蝶结水晶礼盒，珍藏鲜花、信件与每一份暖意。
                </p>
              </div>

              <div className="pt-3 border-t border-[#F6A9CD]/30 flex items-center justify-between text-xs">
                <span className="text-[#8C7AA8] dark:text-[#D2C4E1] font-serif-sc">收到与送出</span>
                <span className="font-cinzel font-medium text-[#D85F91] dark:text-[#FFD1DC]">
                  {stats.giftCount} GIFTS
                </span>
              </div>
            </div>
          </div>

          {/* 展台 4：100件小事 (薰衣草紫 + 星光手账 + 爱心印章) */}
          <div
            onClick={() => onNavigate("wishes")}
            className="relative cursor-pointer group flex flex-col"
          >
            <div className="p-6 rounded-[1.75rem] border border-[#A995D0]/65 dark:border-[#A995D0]/50 shadow-[0_14px_38px_-10px_rgba(101,84,141,0.3)] group-hover:-translate-y-2 transition-all duration-300 flex-1 flex flex-col justify-between space-y-5 rotate-1 group-hover:rotate-0 backdrop-blur-xl bg-[#EFE8FB]/86 dark:bg-[#52437B]/80">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#A995D0]/30 text-[#65548D] dark:text-[#FFF0F8] flex items-center justify-center border border-[#A995D0]/55">
                  <ListTodo className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel text-[#65548D] dark:text-[#FFE3B5] tracking-wider">
                  CHAPTER 04
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-sc text-base font-semibold text-[#3A2C54] dark:text-[#FFF5EF] group-hover:text-[#65548D] dark:group-hover:text-[#FFE3B5] transition-colors">
                  我们的100件小事
                </h3>
                <p className="text-xs font-serif-sc text-[#68568A] dark:text-[#EADCF8] leading-relaxed font-light">
                  薰衣草星光手账与爱心印章，携手点亮每一项浪漫约定。
                </p>
              </div>

              <div className="pt-3 border-t border-[#A995D0]/30 flex items-center justify-between text-xs">
                <span className="text-[#8C7AA8] dark:text-[#D2C4E1] font-serif-sc">已点亮愿望</span>
                <span className="font-cinzel font-medium text-[#65548D] dark:text-[#FFE3B5]">
                  {stats.wishCount} / {stats.wishTotal || 100}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. 专属星空与深度探索横幅 (Starry Gateway) ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-10">
        <div
          onClick={() => onNavigate("starry")}
          className="relative p-8 sm:p-12 rounded-[2.5rem] fairy-card overflow-hidden cursor-pointer group hover:border-[#F6A9CD]/80 transition-all duration-500"
        >
          <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-[#A995D0]/20 blur-3xl pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#F6A9CD]/25 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-cinzel tracking-[0.25em] text-[#D85F91] dark:text-[#FFD1DC] bg-[#FFD1DC]/35 dark:bg-[#F6A9CD]/20 border border-[#F6A9CD]/45">
                <Sparkles className="w-3 h-3 text-[#F47FA9] dark:text-[#FFE3B5]" />
                <span>INTERACTIVE CONSTELLATION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-sc font-light text-[var(--theme-text-primary)] tracking-wider">
                专属恋爱星空 · 将回忆化作永恒星辰
              </h3>
              <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] font-serif-sc font-light leading-relaxed">
                轻触连接属于你们的双子星宿，粉紫星云与极光之下，每一颗星星都温存着动人故事。
              </p>
            </div>

            <button
              onClick={() => onNavigate("starry")}
              className="btn-shoujo-primary px-8 py-3.5 rounded-full text-xs sm:text-sm font-serif-sc font-medium tracking-widest cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>仰望星空</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 设定恋爱起点模态框 (统一 RomanticModal) */}
      <RomanticModal
        isOpen={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        title="你们是哪一天在一起的？"
        subtitle="设定后，首页冰晶计时器将以此为起点，精确记录携手走过的每一天与每一秒。"
        badgeText="♡ ANNIVERSARY"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveDate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif-sc font-medium text-[var(--theme-text-secondary)]">
              相恋纪念日 *
            </label>
            <input
              type="date"
              required
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="romantic-input font-cinzel"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setDateModalOpen(false)}
              className="btn-shoujo-glass px-5 py-2.5 rounded-full text-xs font-serif-sc cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-shoujo-primary px-6 py-2.5 rounded-full text-xs font-serif-sc font-medium cursor-pointer"
            >
              保存纪念日 ♡
            </button>
          </div>
        </form>
      </RomanticModal>
    </div>
  );
}
