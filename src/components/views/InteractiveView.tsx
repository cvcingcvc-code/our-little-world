"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useApp } from "@/context/AppContext";
import { SecretNote, RandomDateIdea, PhotoItem } from "@/types";
import { getInteractiveState, addMissCount, addSecretNote, getPhotos } from "@/lib/storage";
import {
  Users2,
  Heart,
  Sparkles,
  Shuffle,
  Compass,
  MessageSquare,
  Plus,
  Send,
  HelpCircle,
  Flame,
  Calendar,
} from "lucide-react";

export default function InteractiveView() {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();
  const [missStats, setMissStats] = useState({ p1: 120, p2: 135 });
  const [notes, setNotes] = useState<SecretNote[]>([]);
  const [randomDates, setRandomDates] = useState<RandomDateIdea[]>([]);
  const [selectedDateIdea, setSelectedDateIdea] = useState<RandomDateIdea | null>(null);

  // 盲盒回忆
  const [blindBoxPhoto, setBlindBoxPhoto] = useState<PhotoItem | null>(null);
  const [isOpeningBox, setIsOpeningBox] = useState(false);

  // 新留言
  const [authorName, setAuthorName] = useState("我");
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState("from-rose-50 to-pink-100 border-rose-200 text-rose-800");

  useEffect(() => {
    const data = getInteractiveState();
    setMissStats({ p1: data.missCountPartner1, p2: data.missCountPartner2 });
    setNotes(data.notes);
    setRandomDates(data.randomDates);
    if (data.randomDates.length > 0 && !selectedDateIdea) {
      setSelectedDateIdea(data.randomDates[0]);
    }
  }, [refreshKey]);

  // 点击“今日想你”
  const handleMiss = (partner: "partner1" | "partner2") => {
    const updated = addMissCount(partner);
    setMissStats(updated);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#f43f5e", "#fb7185", "#fda4af"],
      });
    } catch {
      // ignore
    }
  };

  // 抽取回忆盲盒
  const handleOpenBlindBox = () => {
    const photos = getPhotos(isAuthenticated);
    if (photos.length === 0) return;
    setIsOpeningBox(true);
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * photos.length);
      setBlindBoxPhoto(photos[randomIdx]);
      setIsOpeningBox(false);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#6366f1", "#a855f7", "#ec4899"],
        });
      } catch {
        // ignore
      }
    }, 600);
  };

  // 随机约会灵感抽取
  const handleRollDateIdea = () => {
    if (randomDates.length === 0) return;
    const randomIdx = Math.floor(Math.random() * randomDates.length);
    setSelectedDateIdea(randomDates[randomIdx]);
  };

  // 提交秘密留言
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    addSecretNote(authorName, noteContent.trim(), noteColor);
    setNoteContent("");
    triggerRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 animate-fadeIn">
      {/* 头部区 */}
      <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-light text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50">
          <Users2 className="w-3.5 h-3.5" />
          <span>两颗心的互动桥梁 · 双人互动空间</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-800 dark:text-slate-100">
          双人互动乐园
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          心跳想念计数、秘密便利贴、回忆盲盒抽卡与周末约会灵感转盘。
        </p>
      </div>

      {/* 1. 今日想你 心动双向计数牌 */}
      <div className="bg-gradient-to-tr from-rose-50/80 via-white to-indigo-50/80 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-6 sm:p-8 rounded-3xl border border-rose-200/70 dark:border-slate-800 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs text-rose-500 font-medium flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
            <span>心动频段实时连线</span>
          </span>
          <h3 className="text-xl font-serif font-light text-slate-800 dark:text-slate-100">
            今天，你有多想 TA？
          </h3>
          <p className="text-xs text-slate-400">轻触心跳按钮，为彼此的想念心电图注入能量</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* partner 1 计数 */}
          <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-rose-200/60 dark:border-slate-700 text-center space-y-3">
            <span className="text-xs text-slate-500 font-medium">TA 累计想我的次数</span>
            <div className="text-4xl font-extralight text-rose-500 font-mono">
              {missStats.p1}
            </div>
            <button
              onClick={() => handleMiss("partner1")}
              className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-medium border border-rose-200/60 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>给 TA 发送一份想念</span>
            </button>
          </div>

          {/* partner 2 计数 */}
          <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-indigo-200/60 dark:border-slate-700 text-center space-y-3">
            <span className="text-xs text-slate-500 font-medium">我累计想 TA 的次数</span>
            <div className="text-4xl font-extralight text-indigo-500 font-mono">
              {missStats.p2}
            </div>
            <button
              onClick={() => handleMiss("partner2")}
              className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300 text-xs font-medium border border-indigo-200/60 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-indigo-500" />
              <span>记录一次想你的瞬间</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 回忆盲盒 & 随机约会灵感（双卡片并排） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 回忆盲盒抽卡机 */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200/50">
                <Sparkles className="w-3.5 h-3.5" /> 回忆盲盒机
              </span>
            </div>
            <h3 className="font-serif text-lg font-medium text-slate-800 dark:text-slate-100">
              摇一摇，重温心动时光
            </h3>
            <p className="text-xs text-slate-500">从珍藏的记忆库中随机拆开一份过去的美好。</p>
          </div>

          {/* 盲盒展示区 */}
          <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-slate-850 border border-purple-100 dark:border-slate-800 min-h-[140px] flex items-center justify-center text-center">
            {isOpeningBox ? (
              <div className="space-y-2 animate-pulse">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-spin" />
                <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">
                  正在时光机中抽取回忆胶片...
                </p>
              </div>
            ) : blindBoxPhoto ? (
              <div className="space-y-2 text-left w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-medium text-slate-800 dark:text-slate-100">
                    {blindBoxPhoto.title}
                  </span>
                  <span className="text-[11px] text-purple-500 font-mono">
                    {blindBoxPhoto.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                  {blindBoxPhoto.story || blindBoxPhoto.description || "一段珍藏的美丽回忆。"}
                </p>
              </div>
            ) : (
              <div className="text-slate-400 text-xs font-light space-y-1">
                <HelpCircle className="w-7 h-7 mx-auto text-purple-300/60" />
                <span>点击下方按钮开箱抽卡</span>
              </div>
            )}
          </div>

          <button
            onClick={handleOpenBlindBox}
            disabled={isOpeningBox}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-xs font-medium text-white shadow-md hover:from-purple-600 hover:to-indigo-700 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>开启回忆盲盒</span>
          </button>
        </div>

        {/* 随机约会灵感转盘 */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-200/50">
              <Compass className="w-3.5 h-3.5" /> 约会灵感摇奖机
            </span>
            <h3 className="font-serif text-lg font-medium text-slate-800 dark:text-slate-100">
              今天/周末去哪儿约会？
            </h3>
            <p className="text-xs text-slate-500">告别选择困难症，交给命运的灵感罗盘吧！</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-850 border border-amber-100 dark:border-slate-800 min-h-[140px] flex flex-col justify-center text-center space-y-2">
            {selectedDateIdea ? (
              <div className="space-y-1.5 text-center">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-medium">
                  {selectedDateIdea.tag}
                </span>
                <h4 className="text-base font-serif font-medium text-slate-800 dark:text-slate-100">
                  {selectedDateIdea.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-light max-w-sm mx-auto leading-relaxed">
                  {selectedDateIdea.description}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">点击下方按钮抽取灵感</p>
            )}
          </div>

          <button
            onClick={handleRollDateIdea}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-xs font-medium text-white shadow-md hover:from-amber-600 hover:to-rose-600 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>摇出一个约会计划</span>
          </button>
        </div>
      </div>

      {/* 3. 秘密便利贴留言墙 */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs text-sky-600 dark:text-sky-400 font-medium flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>心动便签墙</span>
            </span>
            <h3 className="text-xl font-serif font-light text-slate-800 dark:text-slate-100">
              贴在冰箱贴上的秘密留言
            </h3>
            <p className="text-xs text-slate-400">写下一句温柔的叮嘱或悄悄话，留给对方发现。</p>
          </div>
        </div>

        {/* 输入新便签 */}
        <form onSubmit={handleAddNote} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="署名（如：我 / TA）"
              className="w-full sm:w-36 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
            />
            <input
              type="text"
              required
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="写下一张便签小纸条（如：出门穿厚点，今天有初雪...）"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-xs font-medium text-white dark:text-slate-900 shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>贴上便签</span>
            </button>
          </div>
        </form>

        {/* 便签列表展示（手账便签风格） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-2xl border bg-gradient-to-br ${note.color} shadow-xs hover:shadow-md transition space-y-2`}
            >
              <div className="flex items-center justify-between text-[11px] opacity-80">
                <span className="font-medium font-serif">{note.author} 的便签</span>
                <span>{note.date}</span>
              </div>
              <p className="text-xs font-light leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
