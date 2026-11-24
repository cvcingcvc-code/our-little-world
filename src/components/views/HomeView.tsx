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
} from "lucide-react";
import { NavTab } from "../common/Navigation";
import { getActiveSiteConfig, saveActiveSiteStartDate } from "@/config/site";
import { getPhotos, getFoodRecords, getGiftRecords, getWishItems } from "@/lib/storage";

type WinterScene = "street" | "cafe" | "gift";

const SCENE_CONFIG: Record<
  WinterScene,
  { name: string; icon: React.ElementType; image: string; tag: string; motto: string }
> = {
  street: {
    name: "雪夜漫步",
    icon: Trees,
    image: "/winter-hero-hd.jpg",
    tag: "STREET WALK · 初雪之夜",
    motto: "冬天很冷，幸好有你。",
  },
  cafe: {
    name: "暖冬咖啡馆",
    icon: Coffee,
    image: "/winter-cafe-hd.jpg",
    tag: "WARM CAFE · 窗边温存",
    motto: "一杯热拿铁，和你眼底的微光。",
  },
  gift: {
    name: "心动礼遇",
    icon: Gift,
    image: "/winter-gift-hd.jpg",
    tag: "GIFT MOMENT · 甜蜜惊喜",
    motto: "拆开礼盒的那一刻，便拥有了整个冬天。",
  },
};

export default function HomeView({ onNavigate }: { onNavigate: (tab: NavTab) => void }) {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();

  const [currentScene, setCurrentScene] = useState<WinterScene>("street");
  const [startDate, setStartDate] = useState<string>("");
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [inputDate, setInputDate] = useState("");

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

  const activeSceneInfo = SCENE_CONFIG[currentScene];

  return (
    <div className="relative w-full">
      {/* ================= 1. 4K 超高清全景首屏 (Hero Stage) ================= */}
      <section className="relative w-full h-[calc(100vh-4.5rem)] min-h-[660px] max-h-[1100px] flex items-center overflow-hidden">
        {/* 全屏超高清背景图片容器与平滑切换过渡 */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <Image
            key={currentScene}
            src={activeSceneInfo.image}
            alt={activeSceneInfo.name}
            fill
            priority
            quality={100}
            className="object-cover object-right lg:object-center filter brightness-100 dark:brightness-[0.95] transition-all duration-1000 scale-[1.01]"
          />

          {/* 电影级微光暗角与左侧文字留白渐变（保证左文案高对比度，右立绘清晰无阻、晶莹剔透） */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent dark:from-slate-950/70 dark:via-slate-950/25" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* 左侧留白文案与晶体卡片区 */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full flex">
          <div className="max-w-xl lg:max-w-2xl space-y-6 sm:space-y-8 animate-fadeIn">
            {/* 顶栏冰晶微光徽章 */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-light tracking-[0.25em] text-white bg-white/15 backdrop-blur-2xl border border-white/25 shadow-lg shadow-black/20">
              <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-spin" />
              <span>{activeSceneInfo.tag}</span>
            </div>

            {/* 电影诗意中文主副标题 */}
            <div className="space-y-3.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-wider text-white leading-tight font-serif drop-shadow-xl">
                {activeSceneInfo.motto.split("，")[0]}，<br />
                <span className="font-light bg-gradient-to-r from-rose-200 via-white to-sky-200 bg-clip-text text-transparent">
                  {activeSceneInfo.motto.split("，")[1] || "幸好有你。"}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-200/95 font-light tracking-widest leading-relaxed drop-shadow">
                想把与你有关的每一个瞬间，都偷偷收藏。
              </p>
            </div>

            {/* 水晶冰雕质感恋爱计时牌 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/45 backdrop-blur-2xl border border-white/25 dark:border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.4)] space-y-3 max-w-lg">
              <div className="flex items-center justify-between text-xs text-slate-200 font-light">
                <span className="flex items-center gap-1.5 text-rose-300">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  <span>携手走过的温暖时光</span>
                </span>
                <button
                  onClick={() => setDateModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-sky-200 hover:text-white transition cursor-pointer border-none bg-transparent"
                >
                  <Calendar className="w-3 h-3" />
                  <span>{startDate ? `相恋日: ${startDate}` : "设置纪念日起点"}</span>
                  <Edit3 className="w-2.5 h-2.5 ml-0.5 text-sky-300" />
                </button>
              </div>

              {startDate ? (
                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                  <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                    <span className="block text-2xl sm:text-3xl font-light text-white font-mono drop-shadow">
                      {timeTogether.days}
                    </span>
                    <span className="text-[10px] text-slate-300 font-light tracking-widest">DAYS</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                    <span className="block text-2xl sm:text-3xl font-light text-white font-mono drop-shadow">
                      {String(timeTogether.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-300 font-light tracking-widest">HOURS</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                    <span className="block text-2xl sm:text-3xl font-light text-white font-mono drop-shadow">
                      {String(timeTogether.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-300 font-light tracking-widest">MINS</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                    <span className="block text-2xl sm:text-3xl font-light text-rose-300 font-mono drop-shadow animate-pulse">
                      {String(timeTogether.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-300 font-light tracking-widest">SECS</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setDateModalOpen(true)}
                  className="p-4 rounded-2xl bg-white/10 border border-dashed border-white/35 text-center cursor-pointer hover:bg-white/15 transition group"
                >
                  <p className="text-xs text-white/95 font-light flex items-center justify-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-300" />
                    <span>点击设定你们真实的相恋纪念日起点</span>
                  </p>
                  <span className="text-[10px] text-slate-300 mt-1 block">
                    绝无固定假日期，随分随秒记录属于你们的真实陪伴
                  </span>
                </div>
              )}
            </div>

            {/* 灵动高光主行动按钮组 */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => onNavigate("gallery")}
                className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wider text-white bg-gradient-to-r from-rose-500/90 via-pink-500/90 to-indigo-600/90 hover:from-rose-500 hover:to-indigo-600 border border-white/30 shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-200 fill-rose-200 group-hover:scale-125 transition-transform" />
                <span>漫游回忆展厅</span>
                <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate("starry")}
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wider text-slate-100 bg-white/15 hover:bg-white/25 backdrop-blur-2xl border border-white/25 shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>仰望专属恋爱星空</span>
              </button>
            </div>
          </div>
        </div>

        {/* 右下角：超高清冬日场景一键切换控制器 (Scene Switcher) */}
        <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 p-1.5 rounded-full bg-slate-950/60 backdrop-blur-2xl border border-white/20 shadow-2xl">
          {(["street", "cafe", "gift"] as WinterScene[]).map((scKey) => {
            const sc = SCENE_CONFIG[scKey];
            const Icon = sc.icon;
            const isSelected = currentScene === scKey;
            return (
              <button
                key={scKey}
                onClick={() => setCurrentScene(scKey)}
                title={`切换至【${sc.name}】超清场景`}
                className={`px-3 py-1.5 rounded-full text-xs font-light transition-all flex items-center gap-1.5 cursor-pointer border-none outline-none ${
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-300 text-xs font-light tracking-widest pointer-events-none animate-bounce">
          <span>EXPLORE OUR MUSEUM</span>
          <ChevronDown className="w-4 h-4 text-slate-300" />
        </div>
      </section>

      {/* ================= 2. 殿堂级展览馆四大常设展厅导览区 ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-24 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-rose-500 dark:text-rose-400 font-medium">
            MUSEUM EXHIBITIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-slate-800 dark:text-slate-100 font-serif">
            恋爱纪念馆 · 常设展厅
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light">
            每一个展厅都收纳着彼此珍视的时光切片，温存着点点滴滴。
          </p>
        </div>

        {/* 4 大核心常设展厅卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 展厅 1：可爱收藏馆 */}
          <div
            onClick={() => onNavigate("gallery")}
            className="group relative p-6 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-pink-500/10 text-rose-500 flex items-center justify-center border border-rose-200/50 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>她的可爱收藏馆</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-rose-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                拍立得画廊、专属照片背后的故事、全屏大图预览灯箱。
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>已珍藏胶片</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{stats.photoCount} 张</span>
            </div>
          </div>

          {/* 展厅 2：美食日记 */}
          <div
            onClick={() => onNavigate("food")}
            className="group relative p-6 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 text-amber-500 flex items-center justify-center border border-amber-200/50 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>我们的美食日记</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                三餐四季的美味印记，记录餐厅、评价与未来想吃清单。
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>已打卡餐厅</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{stats.foodCount} 处</span>
            </div>
          </div>

          {/* 展厅 3：礼物博物馆 */}
          <div
            onClick={() => onNavigate("gifts")}
            className="group relative p-6 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 text-indigo-500 flex items-center justify-center border border-indigo-200/50 group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>礼物与惊喜馆</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                鲜花、信件与礼物背后的心动瞬间，珍藏对方赠予的暖意。
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>收到与送出</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{stats.giftCount} 份</span>
            </div>
          </div>

          {/* 展厅 4：100件小事 */}
          <div
            onClick={() => onNavigate("wishes")}
            className="group relative p-6 rounded-3xl bg-white/75 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-cyan-500/10 text-sky-500 flex items-center justify-center border border-sky-200/50 group-hover:scale-110 transition-transform">
                <ListTodo className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span>我们的100件小事</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                携手奔赴的愿望清单，打卡拍照留念并触发浪漫庆祝。
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>已点亮愿望</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{stats.wishCount} 项</span>
            </div>
          </div>
        </div>
      </section>

      {/* 设定恋爱起点模态框 */}
      {dateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 dark:text-slate-100 space-y-5">
            <button
              onClick={() => setDateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full cursor-pointer border-none bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-medium">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>设定专属恋爱起点</span>
              </div>
              <h3 className="text-lg font-serif font-medium">你们是哪一天在一起的？</h3>
              <p className="text-xs text-slate-500 font-light">
                设定后，首页计时器将以此为基准，实时精确计算你们携手走过的天、时、分、秒。
              </p>
            </div>

            <form onSubmit={handleSaveDate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">相恋纪念日 *</label>
                <input
                  type="date"
                  required
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border-none bg-transparent"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-xs font-medium text-white shadow-md transition cursor-pointer border-none"
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
