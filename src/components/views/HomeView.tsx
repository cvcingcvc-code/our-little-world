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
            src={activeSceneInfo.image}
            alt={activeSceneInfo.name}
            fill
            priority
            quality={100}
            className="object-cover object-right lg:object-center filter brightness-100 transition-all duration-1000 scale-[1.01]"
          />

          {/* 电影级微光暗角与左侧文字留白渐变（保证左文案高对比度，右立绘清晰通透） */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent dark:from-slate-950/80 dark:via-slate-950/30" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070b14] via-[#070b14]/50 to-transparent" />
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
            <div className="p-6 rounded-[2rem] glass-crystal border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-4 max-w-lg">
              <div className="flex items-center justify-between text-xs font-serif-sc text-slate-200">
                <span className="flex items-center gap-2 text-rose-300">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
                  <span className="tracking-wider">相伴相守的温暖时光</span>
                </span>
                <button
                  onClick={() => setDateModalOpen(true)}
                  className="flex items-center gap-1.5 text-[11px] text-sky-200 hover:text-white transition cursor-pointer border-none bg-transparent"
                >
                  <Calendar className="w-3 h-3" />
                  <span className="font-cinzel tracking-wider">
                    {startDate ? startDate : "SET ANNIVERSARY"}
                  </span>
                  <Edit3 className="w-2.5 h-2.5 ml-0.5 text-sky-300" />
                </button>
              </div>

              {startDate ? (
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
                  {/* 天数 */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group hover:bg-white/15 transition">
                    <span className="font-cinzel text-2xl sm:text-3xl font-light text-white block tracking-wider group-hover:scale-105 transition-transform">
                      {timeTogether.days}
                    </span>
                    <span className="text-[9px] font-cinzel text-rose-200/80 tracking-[0.2em] uppercase block mt-1">
                      DAYS
                    </span>
                  </div>

                  {/* 小时 */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group hover:bg-white/15 transition">
                    <span className="font-cinzel text-2xl sm:text-3xl font-light text-sky-200 block tracking-wider">
                      {String(timeTogether.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-cinzel text-sky-300/80 tracking-[0.2em] uppercase block mt-1">
                      HOURS
                    </span>
                  </div>

                  {/* 分钟 */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner group hover:bg-white/15 transition">
                    <span className="font-cinzel text-2xl sm:text-3xl font-light text-slate-100 block tracking-wider">
                      {String(timeTogether.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-cinzel text-slate-300/80 tracking-[0.2em] uppercase block mt-1">
                      MINS
                    </span>
                  </div>

                  {/* 秒数实时跳动 */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-400/30 shadow-inner group">
                    <span className="font-cinzel text-2xl sm:text-3xl font-normal text-rose-200 block tracking-wider">
                      {String(timeTogether.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-cinzel text-rose-300 tracking-[0.2em] uppercase block mt-1">
                      SECS
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setDateModalOpen(true)}
                  className="p-5 rounded-2xl bg-white/10 border border-dashed border-white/30 text-center cursor-pointer hover:bg-white/15 transition space-y-1.5"
                >
                  <Calendar className="w-5 h-5 mx-auto text-sky-300 animate-bounce" />
                  <p className="text-xs text-white font-serif-sc">点击此处，设定属于你们的恋爱起点</p>
                  <p className="text-[10px] text-slate-300 font-light">
                    开启相恋天、时、分、秒的精确纪念
                  </p>
                </div>
              )}
            </div>

            {/* 快速入馆按钮 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate("gallery")}
                className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-serif-sc font-medium tracking-widest text-white bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_40px_rgba(244,63,94,0.6)] hover:scale-105 transition-all cursor-pointer border-none flex items-center gap-2.5 group"
              >
                <span>步入可爱相册馆</span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate("starry")}
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-serif-sc tracking-widest text-slate-100 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
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

        {/* 右下角：超高清冬日场景一键切换控制器 (Scene Switcher) */}
        <div className="absolute bottom-8 right-6 lg:right-12 z-20 hidden sm:flex items-center gap-2 p-1.5 rounded-full glass-crystal border border-white/20 shadow-2xl">
          {(["street", "cafe", "gift"] as WinterScene[]).map((scKey) => {
            const sc = SCENE_CONFIG[scKey];
            const Icon = sc.icon;
            const isSelected = currentScene === scKey;
            return (
              <button
                key={scKey}
                onClick={() => setCurrentScene(scKey)}
                title={`切换至【${sc.name}】超清场景`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif-sc tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border-none outline-none ${
                  isSelected
                    ? "bg-white text-slate-950 font-medium shadow-md scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-rose-500" : ""}`} />
                <span>{sc.name}</span>
              </button>
            );
          })}
        </div>

        {/* 底部探索滚动指示器 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-300/80 text-[11px] font-cinzel tracking-[0.25em] pointer-events-none animate-bounce">
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
        </div>
      </section>

      {/* ================= 2. 每日心动微语 · 撕历手账 (Daily Whisper Card) ================= */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <div className="p-6 sm:p-8 rounded-3xl glass-crystal border border-white/20 shadow-2xl relative overflow-hidden group">
          {/* 背景微光 */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-serif-sc tracking-wider">
                <Quote className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>冬日心动微语 · DAILY WHISPER</span>
              </div>
              <p className="text-base sm:text-lg font-serif-sc font-normal text-white leading-relaxed">
                &ldquo;{DAILY_WHISPERS[whisperIndex]}&rdquo;
              </p>
            </div>

            <button
              onClick={nextWhisper}
              title="抽取下一条心动微语"
              className="self-end sm:self-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer border-none"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-300" />
              <span>翻一页</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 3. 殿堂级展览馆：冬日手账与拍立得实体展台 (Handcrafted Exhibitions) ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-24 space-y-16">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-cinzel tracking-[0.25em] text-rose-300 bg-rose-500/10 border border-rose-400/20">
            <span>PERMANENT EXHIBITIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-sc font-light text-white tracking-wider">
            恋爱纪念馆 · 常设展厅
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-sc font-light tracking-wide">
            每一个展厅都收纳着彼此珍视的时光切片，温存着点点滴滴。
          </p>
        </div>

        {/* 4 大核心展厅：实体拟物手账与艺术拍立得 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* 展台 1：可爱收藏馆 (拍立得实体相纸) */}
          <div
            onClick={() => onNavigate("gallery")}
            className="relative cursor-pointer group"
          >
            {/* 仿真和纸胶带 */}
            <div className="washi-tape washi-tape-pink" />

            <div className="polaroid-frame -rotate-2 group-hover:rotate-0 transition-transform duration-500">
              {/* 相纸内部照片窗口 */}
              <div className="relative w-full h-52 rounded-md overflow-hidden bg-slate-900">
                <Image
                  src="/winter-close-hd.jpg"
                  alt="可爱相册缩略"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 text-white text-xs font-serif-sc flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-rose-300" />
                  <span>拍立得胶片记忆</span>
                </div>
              </div>

              {/* 拍立得底部白色留白手写区域 */}
              <div className="pt-3 px-1 space-y-1 text-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-sc text-sm font-semibold tracking-wide text-slate-900 group-hover:text-rose-600 transition-colors">
                    她的可爱收藏馆
                  </h3>
                  <span className="text-[10px] font-cinzel text-slate-400">
                    {stats.photoCount} SHOTS
                  </span>
                </div>
                <p className="text-[11px] font-serif-sc text-slate-500 leading-tight">
                  专属照片背后的故事，全屏灯箱预览。
                </p>
              </div>
            </div>
          </div>

          {/* 展台 2：美食日记 (温暖食谱手账折页) */}
          <div
            onClick={() => onNavigate("food")}
            className="relative cursor-pointer group"
          >
            {/* 暖黄和纸胶带 */}
            <div className="washi-tape" />

            <div className="p-6 rounded-2xl bg-[#fdfbf7] dark:bg-slate-900 border border-amber-200/60 dark:border-white/10 shadow-xl group-hover:-translate-y-2 transition-all duration-300 space-y-5 rotate-1 group-hover:rotate-0">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-300/40">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel text-amber-600 dark:text-amber-400 tracking-wider">
                  CHAPTER 02
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-sc text-base font-semibold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  我们的美食日记
                </h3>
                <p className="text-xs font-serif-sc text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                  三餐四季的美味印记，记录餐厅、真实打分与想吃心愿。
                </p>
              </div>

              <div className="pt-3 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-serif-sc">已打卡餐厅</span>
                <span className="font-cinzel font-medium text-amber-600 dark:text-amber-400">
                  {stats.foodCount} PLACES
                </span>
              </div>
            </div>
          </div>

          {/* 展台 3：礼物与心动博物馆 (丝绒蝴蝶结水晶展柜) */}
          <div
            onClick={() => onNavigate("gifts")}
            className="relative cursor-pointer group"
          >
            <div className="p-6 rounded-2xl glass-crystal border border-rose-300/30 shadow-xl group-hover:-translate-y-2 transition-all duration-300 space-y-5 -rotate-1 group-hover:rotate-0">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-300/40">
                  <Gift className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel text-rose-300 tracking-wider">
                  CHAPTER 03
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-sc text-base font-semibold text-white group-hover:text-rose-300 transition-colors">
                  礼物与惊喜博物馆
                </h3>
                <p className="text-xs font-serif-sc text-slate-300 leading-relaxed font-light">
                  鲜花、信件与礼物背后的心动瞬间，珍藏对方赠予的暖意。
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-serif-sc">收到与送出</span>
                <span className="font-cinzel font-medium text-rose-300">
                  {stats.giftCount} GIFTS
                </span>
              </div>
            </div>
          </div>

          {/* 展台 4：100件小事 (星愿信笺卡) */}
          <div
            onClick={() => onNavigate("wishes")}
            className="relative cursor-pointer group"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900/90 border border-sky-400/30 shadow-xl group-hover:-translate-y-2 transition-all duration-300 space-y-5 rotate-1 group-hover:rotate-0">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-300/40">
                  <ListTodo className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel text-sky-300 tracking-wider">
                  CHAPTER 04
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-sc text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                  我们的100件小事
                </h3>
                <p className="text-xs font-serif-sc text-slate-300 leading-relaxed font-light">
                  携手奔赴的愿望清单，打卡拍照留念并触发浪漫庆祝。
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-serif-sc">已点亮愿望</span>
                <span className="font-cinzel font-medium text-sky-300">
                  {stats.wishCount} / {stats.wishTotal || 100}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. 专属星空与深度探索横幅 (Starry Gateway) ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-16">
        <div
          onClick={() => onNavigate("starry")}
          className="relative p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-950/80 border border-white/20 shadow-2xl overflow-hidden cursor-pointer group hover:border-sky-300/40 transition-all duration-500"
        >
          {/* 漫天微闪星斑背景 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-cinzel tracking-[0.25em] text-sky-200 bg-sky-500/20 border border-sky-400/30">
                <Sparkles className="w-3 h-3 text-sky-300 animate-spin" />
                <span>INTERACTIVE CONSTELLATION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-sc font-light text-white tracking-wider">
                专属恋爱星空 · 将回忆化作永恒星辰
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-serif-sc font-light leading-relaxed">
                轻触连接属于你们的双子星宿，每一颗亮起的星星都温存着一段特别的纪念日或动人故事。
              </p>
            </div>

            <button
              onClick={() => onNavigate("starry")}
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-serif-sc font-medium tracking-widest text-slate-900 bg-white hover:bg-sky-100 shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform group-hover:scale-105 cursor-pointer border-none flex items-center gap-2 shrink-0"
            >
              <span>仰望星空</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 设定恋爱起点模态框 */}
      {dateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5">
            <button
              onClick={() => setDateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer border-none bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-serif-sc">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>设定专属恋爱起点</span>
              </div>
              <h3 className="text-lg font-serif-sc font-medium">你们是哪一天在一起的？</h3>
              <p className="text-xs text-slate-400 font-serif-sc font-light">
                设定后，首页计时器将以此为基准，实时精确计算你们携手走过的天、时、分、秒。
              </p>
            </div>

            <form onSubmit={handleSaveDate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-serif-sc text-slate-300">相恋纪念日 *</label>
                <input
                  type="date"
                  required
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-rose-400 font-cinzel"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-serif-sc text-slate-400 hover:bg-slate-800 transition cursor-pointer border-none bg-transparent"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-xs font-serif-sc font-medium text-white shadow-md transition cursor-pointer border-none"
                >
                  保存纪念日
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
