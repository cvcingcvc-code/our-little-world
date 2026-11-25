"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import ExhibitionCover from "@/components/common/ExhibitionCover";
import { TimelineEvent } from "@/types";
import { getTimelineEvents } from "@/lib/storage";
import {
  Milestone,
  Calendar,
  Camera,
  UtensilsCrossed,
  Gift,
  ListTodo,
  Heart,
  Filter,
  Sparkles,
} from "lucide-react";

export default function TimelineView() {
  const { isAuthenticated, refreshKey } = useApp();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setEvents(getTimelineEvents(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  // 提取出现过的年份
  const years = Array.from(
    new Set(events.map((e) => e.date.substring(0, 4)).filter(Boolean))
  ).sort().reverse();

  // 过滤事件
  const filteredEvents = events.filter((e) => {
    if (selectedYear !== "all" && !e.date.startsWith(selectedYear)) return false;
    if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
    return true;
  });

  const getEventIcon = (cat: TimelineEvent["category"]) => {
    switch (cat) {
      case "photo":
        return <Camera className="w-4 h-4 text-rose-500" />;
      case "food":
        return <UtensilsCrossed className="w-4 h-4 text-amber-500" />;
      case "gift":
        return <Gift className="w-4 h-4 text-indigo-500" />;
      case "wish":
        return <ListTodo className="w-4 h-4 text-sky-500" />;
      case "anniversary":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 4K 动漫主题画报封面 + 全屏沉浸柔焦背景 */}
      <ExhibitionCover
        coverImage="/winter-close-hd.jpg"
        badge="🎞️ 时光河流 · TIMELINE ARCHIVE"
        englishTag="CHAPTER 06 // CHRONOLOGICAL STORY"
        title="恋爱时间轴"
        subtitle="自动串联相恋以来的所有瞬间：照片、美食、礼物、愿望打卡与特别纪念日。"
      />

      {/* 筛选控制器 */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        {/* 年份选择 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedYear("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-serif-sc cursor-pointer ${
              selectedYear === "all" ? "btn-shoujo-pill-active" : "btn-shoujo-pill-idle"
            }`}
          >
            全时间线
          </button>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-4 py-1.5 rounded-full text-xs font-serif-sc cursor-pointer ${
                selectedYear === yr ? "btn-shoujo-pill-active" : "btn-shoujo-pill-idle"
              }`}
            >
              {yr} 年
            </button>
          ))}
        </div>

        {/* 类型选择 */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "全部足迹" },
            { id: "photo", label: "照片" },
            { id: "food", label: "美食" },
            { id: "gift", label: "礼物" },
            { id: "wish", label: "愿望打卡" },
            { id: "anniversary", label: "纪念日" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-medium"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 时间轴流水线 */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
          <Milestone className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-light">该时间段暂无回忆足迹</p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-rose-200 dark:border-rose-950 space-y-8 my-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative group">
              {/* 时间轴小节点圆点 */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-rose-300 dark:border-rose-700 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                {getEventIcon(event.category)}
              </div>

              {/* 事件卡片 */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition duration-300 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.date}
                  </span>
                  {event.tag && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {event.tag}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base font-medium text-slate-800 dark:text-slate-100">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  {event.description}
                </p>

                {/* 照片展示 */}
                {event.imageUrl && (
                  <div className="relative w-full max-w-md aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mt-2">
                    <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
