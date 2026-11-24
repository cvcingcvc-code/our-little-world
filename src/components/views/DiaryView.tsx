"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { DiaryEntry } from "@/types";
import { getDiaries, saveDiary, deleteDiary } from "@/lib/storage";
import {
  BookHeart,
  Plus,
  Heart,
  Calendar,
  CloudSun,
  CloudRain,
  Snowflake,
  Sun,
  Sparkles,
  Trash2,
  Lock,
  X,
  MessageCircleHeart,
} from "lucide-react";

export default function DiaryView() {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  // 模态框与表单
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weather, setWeather] = useState<DiaryEntry["weather"]>("snowy");
  const [mood, setMood] = useState<DiaryEntry["mood"]>("sweet");
  const [content, setContent] = useState("");
  const [reasonILoveYou, setReasonILoveYou] = useState("");
  const [whisperToYou, setWhisperToYou] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    setDiaries(getDiaries(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    saveDiary({
      title: title.trim(),
      date,
      weather,
      mood,
      content: content.trim(),
      reasonILoveYou: reasonILoveYou.trim() || undefined,
      whisperToYou: whisperToYou.trim() || undefined,
      isPrivate,
    });

    // 重置
    setTitle("");
    setContent("");
    setReasonILoveYou("");
    setWhisperToYou("");
    setModalOpen(false);
    triggerRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这篇恋爱日记吗？")) {
      deleteDiary(id);
      triggerRefresh();
    }
  };

  const getWeatherIcon = (w: DiaryEntry["weather"]) => {
    switch (w) {
      case "snowy":
        return <Snowflake className="w-4 h-4 text-sky-400" />;
      case "rainy":
        return <CloudRain className="w-4 h-4 text-indigo-400" />;
      case "starry":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Sun className="w-4 h-4 text-amber-500" />;
    }
  };

  const getWeatherName = (w: DiaryEntry["weather"]) => {
    switch (w) {
      case "snowy":
        return "雪落";
      case "rainy":
        return "雨滴";
      case "starry":
        return "星夜";
      case "cloudy":
        return "多云";
      default:
        return "晴好";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 头部区 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-light text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50">
            <BookHeart className="w-3.5 h-3.5" />
            <span>笔下生香 · 纸短情长的日常</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-800 dark:text-slate-100">
            恋爱温暖日记
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            记录日常小事、心情，以及今天又多喜欢你一点的理由。共记录 {diaries.length} 篇日记。
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 shadow-md shadow-rose-500/20 transition flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>写下一篇心语</span>
        </button>
      </div>

      {/* 日记列表 */}
      {diaries.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
          <BookHeart className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-light">还没有写下日记呢，赶紧记录第一份心情吧</p>
        </div>
      ) : (
        <div className="space-y-6">
          {diaries.map((diary) => (
            <div
              key={diary.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition space-y-4"
            >
              {/* 日记顶栏 */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-rose-500 dark:text-rose-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {diary.date}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    {getWeatherIcon(diary.weather)}
                    <span>{getWeatherName(diary.weather)}</span>
                  </span>
                  {diary.isPrivate && (
                    <span className="p-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-500">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() => handleDelete(diary.id)}
                    className="text-xs text-slate-400 hover:text-rose-500 transition cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 日记标题与正文 */}
              <div className="space-y-2.5">
                <h3 className="font-serif text-xl font-medium text-slate-800 dark:text-slate-100">
                  {diary.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                  {diary.content}
                </p>
              </div>

              {/* 喜欢你的理由 & 悄悄话 */}
              {(diary.reasonILoveYou || diary.whisperToYou) && (
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {diary.reasonILoveYou && (
                    <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/50 space-y-1">
                      <span className="text-rose-600 dark:text-rose-300 font-medium flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                        <span>今天喜欢你的理由：</span>
                      </span>
                      <p className="text-slate-700 dark:text-slate-200 font-light leading-relaxed">
                        {diary.reasonILoveYou}
                      </p>
                    </div>
                  )}

                  {diary.whisperToYou && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/50 space-y-1">
                      <span className="text-indigo-600 dark:text-indigo-300 font-medium flex items-center gap-1">
                        <MessageCircleHeart className="w-3 h-3 text-indigo-500" />
                        <span>悄悄对你说的话：</span>
                      </span>
                      <p className="text-slate-700 dark:text-slate-200 font-light leading-relaxed">
                        {diary.whisperToYou}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 新增日记模态框 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                写下一篇恋爱日记
              </h3>
              <p className="text-xs text-slate-500">把当下的心动与琐碎，珍藏在彼此的小世界里。</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    日记标题 *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="如：雪落下的声音"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    记录日期
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    今日天气
                  </label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value as DiaryEntry["weather"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  >
                    <option value="snowy">❄️ 飘雪</option>
                    <option value="sunny">☀️ 晴好</option>
                    <option value="starry">✨ 星夜</option>
                    <option value="rainy">🌧️ 雨天</option>
                    <option value="cloudy">⛅ 多云</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    当下心情
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as DiaryEntry["mood"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  >
                    <option value="sweet">🍬 甜蜜微醺</option>
                    <option value="peaceful">🌿 安宁踏实</option>
                    <option value="miss_you">💌 极度想你</option>
                    <option value="happy">🥳 雀跃开怀</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  日记正文 *
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写下今天发生的故事、微小细节或触动你的瞬间..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  喜欢你的理由（可选）
                </label>
                <input
                  type="text"
                  value={reasonILoveYou}
                  onChange={(e) => setReasonILoveYou(e.target.value)}
                  placeholder="如：喜欢你在冬日奔向我时眼睛里的亮光..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  悄悄想对你说的话（可选）
                </label>
                <input
                  type="text"
                  value={whisperToYou}
                  onChange={(e) => setWhisperToYou(e.target.value)}
                  placeholder="如：无论冬天有多冷，我都会一直在你身边..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="diaryPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <label htmlFor="diaryPrivate" className="text-xs text-slate-600 dark:text-slate-400">
                  设为私密日记（仅在专属双人认证后可见）
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-xs font-medium text-white shadow-md transition cursor-pointer"
                >
                  封存日记
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
