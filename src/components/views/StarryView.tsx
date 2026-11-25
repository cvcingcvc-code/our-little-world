"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { StarMemory } from "@/types";
import { getStarMemories, saveStarMemory, deleteStarMemory } from "@/lib/storage";
import ExhibitionCover from "@/components/common/ExhibitionCover";
import { withBasePath } from "@/lib/assets";
import {
  Sparkles,
  Plus,
  Star,
  Calendar,
  X,
  Compass,
  Heart,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
} from "lucide-react";

export default function StarryView() {
  const { isAuthenticated, refreshKey, triggerRefresh, isLowPerformance } = useApp();
  const [stars, setStars] = useState<StarMemory[]>([]);
  const [activeStar, setActiveStar] = useState<StarMemory | null>(null);

  // 添加星星模态框
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [story, setStory] = useState("");
  const [color, setColor] = useState("#f43f5e");
  const [type, setType] = useState<StarMemory["type"]>("memory");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setStars(getStarMemories(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  // Canvas 星空与连线动态渲染
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // 背景背景静态星星
    const bgStarCount = isLowPerformance ? 80 : 160;
    const bgStars: { x: number; y: number; r: number; alpha: number; delta: number }[] = [];
    for (let i = 0; i < bgStarCount; i++) {
      bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        delta: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    let animId: number;
    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseTime += 0.02;

      // 1. 绘制背景微弱银河星辰
      for (const bs of bgStars) {
        bs.alpha += bs.delta;
        if (bs.alpha > 0.95 || bs.alpha < 0.2) bs.delta = -bs.delta;
        ctx.beginPath();
        ctx.arc(bs.x, bs.y, bs.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${bs.alpha})`;
        ctx.fill();
      }

      // 2. 绘制回忆星星之间的虚线星座连线
      if (stars.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(165, 180, 252, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);

        for (let i = 0; i < stars.length - 1; i++) {
          const s1 = stars[i];
          const s2 = stars[i + 1];
          const x1 = (s1.x / 100) * width;
          const y1 = (s1.y / 100) * height;
          const x2 = (s2.x / 100) * width;
          const y2 = (s2.y / 100) * height;
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. 绘制带有呼吸光环的回忆星辰
      stars.forEach((star) => {
        const cx = (star.x / 100) * width;
        const cy = (star.y / 100) * height;
        const baseR = star.size * 3.5;
        const breath = Math.sin(pulseTime + star.x) * 1.5;
        const isHovered = activeStar?.id === star.id;

        // 外层微光光晕
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 3 + breath * 2);
        grad.addColorStop(0, star.color || "#38bdf8");
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(cx, cy, baseR * 3 + breath * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // 核心亮点
        ctx.beginPath();
        ctx.arc(cx, cy, baseR + (isHovered ? 2 : 0), 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.color || "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;

        // 星辰名称标签（小文字）
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "rgba(224, 231, 255, 0.85)";
        ctx.textAlign = "center";
        ctx.fillText(star.title, cx, cy + baseR + 14);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [stars, activeStar, isLowPerformance]);

  // 处理点击星空画布选中某颗星星
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    // 寻找最近的星星（判定半径 24px）
    let found: StarMemory | null = null;
    for (const star of stars) {
      const cx = (star.x / 100) * width;
      const cy = (star.y / 100) * height;
      const dist = Math.hypot(clickX - cx, clickY - cy);
      if (dist <= 26) {
        found = star;
        break;
      }
    }
    setActiveStar(found);
  };

  const handleAddStar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // 随机分配在视野中心区域 (20% - 80%)
    const newX = Math.round(Math.random() * 60 + 20);
    const newY = Math.round(Math.random() * 60 + 20);

    saveStarMemory({
      title: title.trim(),
      date,
      story: story.trim() || "珍藏在深空里的一束光。",
      x: newX,
      y: newY,
      size: 2.5,
      color,
      type,
      isPrivate: false,
    });

    setTitle("");
    setStory("");
    setAddModalOpen(false);
    triggerRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要让这颗回忆之星隐入夜空吗？")) {
      deleteStarMemory(id);
      setActiveStar(null);
      triggerRefresh();
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 4K 动漫主题画报封面 + 全屏沉浸柔焦背景 */}
      <ExhibitionCover
        coverImage="/winter-hero-hd.jpg"
        badge="✨ 星河誓约 · EXCLUSIVE CONSTELLATION"
        englishTag="CHAPTER 05 // STARRY CHRONICLE"
        title="专属恋爱星空 · 星河皆你"
        subtitle="每一次心动，都会在我们的冬夜星河里凝结成一颗璀璨的星辰。轻触星星翻阅专属回忆。"
        actions={
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-shoujo-primary px-6 py-2.5 rounded-full text-xs font-serif-sc font-medium tracking-wider cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            <span>升起一颗新星</span>
          </button>
        }
      />

      {/* 交互式星空画布容器（底层融入冬夜古堡少女梦幻星河） */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-[520px] sm:h-[640px] rounded-[2rem] overflow-hidden bg-[#050814] border border-pink-200/30 shadow-[0_20px_60px_rgba(0,0,0,0.65)] cursor-crosshair select-none"
      >
        {/* 梦幻星夜底图叠加 */}
        <Image
          src={withBasePath("/winter-hero-hd.jpg")}
          alt="冬夜星河底图"
          fill
          className="object-cover object-center opacity-28 filter hue-rotate-15 contrast-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/90 via-indigo-950/45 to-[#050814]/70 pointer-events-none" />

        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative z-10 w-full h-full block"
        />

        {/* 顶部小操作提示 */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none text-xs text-pink-100 bg-slate-950/65 backdrop-blur-xl px-4 py-1.5 rounded-full border border-pink-200/25 flex items-center gap-2 shadow-lg">
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
          <span>星空中共有 {stars.length} 颗心动之星 · 轻触星星查看详情</span>
        </div>

        {/* 悬浮/激活星星回忆弹窗卡片 */}
        {activeStar && (
          <div className="absolute z-20 bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm bg-slate-950/85 backdrop-blur-2xl border border-pink-200/30 rounded-3xl p-5 text-white shadow-2xl animate-fadeIn space-y-3 pointer-events-auto">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: activeStar.color }}
                />
                <span className="text-xs text-indigo-300 font-mono">{activeStar.date}</span>
                <h3 className="font-serif text-lg font-medium text-white leading-tight">
                  {activeStar.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveStar(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeStar.imageUrl && (
              <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-800">
                <Image src={activeStar.imageUrl} alt={activeStar.title} fill className="object-cover" />
              </div>
            )}

            <p className="text-xs text-slate-200 font-light leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
              {activeStar.story}
            </p>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 恒星坐标 ({activeStar.x}%, {activeStar.y}%)
              </span>
              {isAuthenticated && (
                <button
                  onClick={() => handleDelete(activeStar.id)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> 摘下此星
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 升起新星模态框 */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-medium">将回忆化为星辰</h3>
              <p className="text-xs text-slate-400">
                为两人的星空宇宙点亮一颗永久闪烁的星。
              </p>
            </div>

            <form onSubmit={handleAddStar} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">星辰名称 / 心动标题 *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="如：初见的心动回响"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">记录日期</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">星辰光芒色彩</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="#f43f5e">初雪粉红</option>
                    <option value="#38bdf8">冬晴蔚蓝</option>
                    <option value="#a855f7">梦幻紫罗兰</option>
                    <option value="#f59e0b">暖阳琥珀</option>
                    <option value="#10b981">极光之翠</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">回忆故事</label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="写下这颗星星封存的微小秘密..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-xs font-medium text-white shadow-md transition cursor-pointer"
                >
                  点亮星辰 ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
