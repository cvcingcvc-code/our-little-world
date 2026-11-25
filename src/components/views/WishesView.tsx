"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useApp } from "@/context/AppContext";
import { WishItem } from "@/types";
import { getWishItems, saveWishItem, updateWishStatus, deleteWishItem } from "@/lib/storage";
import { processImageFile } from "@/lib/upload";
import ExhibitionCover from "@/components/common/ExhibitionCover";
import RomanticModal from "@/components/common/RomanticModal";
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Trash2,
  Edit2,
  Calendar,
  X,
  Trophy,
} from "lucide-react";

export default function WishesView() {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "in_progress" | "todo">("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // 打卡完成模态框
  const [completeModalItem, setCompleteModalItem] = useState<WishItem | null>(null);
  const [completionReflection, setCompletionReflection] = useState("");
  const [completionPhoto, setCompletionPhoto] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 新增小事模态框
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<WishItem["category"]>("romantic");
  const [targetDate, setTargetDate] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setWishes(getWishItems(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  // 统计完成度
  const completedCount = wishes.filter((w) => w.status === "completed").length;
  const inProgressCount = wishes.filter((w) => w.status === "in_progress").length;
  const todoCount = wishes.filter((w) => w.status === "todo").length;
  const progressPercent = wishes.length > 0 ? Math.round((completedCount / wishes.length) * 100) : 0;

  // 过滤
  const filteredWishes = wishes.filter((w) => {
    if (activeTab !== "all" && w.status !== activeTab) return false;
    if (activeCategory !== "all" && w.category !== activeCategory) return false;
    return true;
  });

  const handleStatusChange = (item: WishItem, nextStatus: WishItem["status"]) => {
    if (nextStatus === "completed") {
      // 弹出打卡纪念弹窗
      setCompleteModalItem(item);
      setCompletionReflection("");
      setCompletionPhoto("");
    } else {
      updateWishStatus(item.id, nextStatus);
      triggerRefresh();
    }
  };

  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeModalItem) return;

    updateWishStatus(completeModalItem.id, "completed", {
      completedDate: new Date().toISOString().split("T")[0],
      completionPhoto: completionPhoto || undefined,
      reflection: completionReflection.trim() || undefined,
    });

    // 浪漫打卡撒花
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fb7185", "#38bdf8", "#c084fc", "#fde047"],
      });
    } catch {
      // ignore
    }

    setCompleteModalItem(null);
    triggerRefresh();
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveWishItem({
      title: title.trim(),
      category,
      status: "todo",
      targetDate: targetDate || undefined,
      isPrivate: false,
    });

    setTitle("");
    setTargetDate("");
    setAddModalOpen(false);
    triggerRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这项共同愿望吗？")) {
      deleteWishItem(id);
      triggerRefresh();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await processImageFile(files[0]);
      setCompletionPhoto(res.dataUrl);
    } catch (err) {
      alert("照片处理失败：" + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryLabel = (cat: WishItem["category"]) => {
    switch (cat) {
      case "romantic":
        return "浪漫心动";
      case "travel":
        return "远方旅行";
      case "food":
        return "人间美食";
      case "challenge":
        return "双人挑战";
      case "milestone":
        return "人生里程碑";
      default:
        return "日常生活";
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 4K 动漫主题画报封面 + 全屏沉浸柔焦背景 */}
      <ExhibitionCover
        coverImage="/winter-hero-hd.jpg"
        badge="🌠 星愿清单 · 100 ROMANTIC WISHES"
        englishTag="CHAPTER 04 // BUCKET LIST"
        title="想和你一起完成的100件小事"
        subtitle="一辈子很长，但有了你，每一件微小的事情都变成了闪闪发光的期盼。"
        actions={
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-shoujo-primary px-6 py-2.5 rounded-full text-xs font-serif-sc font-medium tracking-wider cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>写下一件小事</span>
          </button>
        }
      />

      {/* 进度条卡片 */}
      <div className="relative z-10 p-5 rounded-3xl fairy-card space-y-2.5">
        <div className="flex items-center justify-between text-xs font-serif-sc">
          <span className="text-[var(--theme-text-primary)] font-medium flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#F47FA9] dark:text-[#FFE3B5]" />
            <span>共同奔赴进度</span>
          </span>
          <span className="text-[#D85F91] dark:text-[#FFD1DC] font-semibold">
            已点亮 {completedCount} / {wishes.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[var(--theme-surface-glass)] overflow-hidden border border-[#F6A9CD]/40">
          <div
            className="h-full bg-gradient-to-r from-[#F6A9CD] via-[#F47FA9] to-[#A995D0] transition-all duration-700 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 状态与分类筛选 */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: "all", label: `全部 (${wishes.length})` },
            { id: "completed", label: `已点亮 (${completedCount})` },
            { id: "in_progress", label: `进行中 (${inProgressCount})` },
            { id: "todo", label: `待奔赴 (${todoCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-1.5 rounded-full text-xs font-serif-sc cursor-pointer ${
                activeTab === tab.id ? "btn-shoujo-pill-active" : "btn-shoujo-pill-idle"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "全部分类" },
            { id: "romantic", label: "浪漫" },
            { id: "daily", label: "日常" },
            { id: "travel", label: "旅行" },
            { id: "challenge", label: "挑战" },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-1 rounded-full text-xs font-serif-sc cursor-pointer ${
                activeCategory === c.id ? "btn-shoujo-pill-active" : "btn-shoujo-pill-idle"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 愿望卡片网格 */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWishes.map((wish, index) => {
          const isDone = wish.status === "completed";
          const isInProgress = wish.status === "in_progress";

          return (
            <div
              key={wish.id}
              className={`p-5 rounded-3xl fairy-card flex flex-col justify-between space-y-4 ${
                isDone ? "border-emerald-300/60" : isInProgress ? "border-[#A995D0]/70" : ""
              }`}
            >
              <div className="space-y-3">
                {/* 顶部标签与序号 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-cinzel text-[var(--theme-text-muted)]">#{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFD1DC]/40 dark:bg-[#F6A9CD]/20 text-[var(--theme-text-secondary)]">
                      {getCategoryLabel(wish.category)}
                    </span>
                    {isDone && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-700 dark:text-emerald-200 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 已点亮
                      </span>
                    )}
                    {isInProgress && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#A995D0]/30 text-[var(--theme-text-primary)] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 进行中
                      </span>
                    )}
                    {wish.status === "todo" && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--theme-surface-glass)] text-[var(--theme-text-muted)] font-medium">
                        待奔赴
                      </span>
                    )}
                  </div>
                </div>

                {/* 愿望标题 */}
                <h3 className="font-serif-sc text-base font-medium text-[var(--theme-text-primary)]">
                  {wish.title}
                </h3>

                {/* 打卡照片与完成感言 */}
                {isDone && (
                  <div className="pt-2 space-y-2 border-t border-emerald-200/40 dark:border-emerald-800/40">
                    {wish.completionPhoto && (
                      <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={wish.completionPhoto}
                          alt="打卡照片"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {wish.reflection && (
                      <p className="text-xs text-emerald-800 dark:text-emerald-200 bg-emerald-100/40 dark:bg-emerald-950/40 p-2.5 rounded-xl font-light leading-relaxed">
                        “{wish.reflection}”
                      </p>
                    )}
                    {wish.completedDate && (
                      <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>点亮于 {wish.completedDate}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 底部操作行 */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                {/* 状态切换按钮 */}
                <div className="flex items-center gap-2">
                  {!isDone && (
                    <button
                      onClick={() => handleStatusChange(wish, "completed")}
                      className="btn-shoujo-primary px-3.5 py-1.5 rounded-full font-serif-sc font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>打卡点亮</span>
                    </button>
                  )}
                  {wish.status === "todo" && (
                    <button
                      onClick={() => handleStatusChange(wish, "in_progress")}
                      className="btn-shoujo-glass px-3 py-1.5 rounded-full text-xs font-serif-sc cursor-pointer"
                    >
                      设为进行中
                    </button>
                  )}
                  {isInProgress && (
                    <button
                      onClick={() => handleStatusChange(wish, "todo")}
                      className="btn-shoujo-glass px-3 py-1.5 rounded-full text-xs font-serif-sc cursor-pointer"
                    >
                      重置为待完成
                    </button>
                  )}
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() => handleDelete(wish.id)}
                    className="text-slate-400 hover:text-rose-500 transition cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 打卡完成纪念模态框 (统一 RomanticModal) */}
      <RomanticModal
        isOpen={Boolean(completeModalItem)}
        onClose={() => setCompleteModalItem(null)}
        title={completeModalItem ? `点亮心愿 · ${completeModalItem.title}` : "点亮心愿"}
        subtitle="上传一张打卡合影，写下一句心动回忆吧 ♡"
        badgeText="✨ WISH COMPLETED"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmCompletion} className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full aspect-16/9 rounded-2xl border-2 border-dashed border-[#F6A9CD]/60 hover:border-[#F47FA9] flex flex-col items-center justify-center overflow-hidden cursor-pointer bg-[var(--theme-surface-glass)] transition"
          >
            {completionPhoto ? (
              <Image src={completionPhoto} alt="打卡合影" fill className="object-cover" />
            ) : (
              <div className="text-center p-4 space-y-1">
                <Camera className="w-7 h-7 mx-auto text-[#F47FA9]" />
                <p className="text-xs text-[var(--theme-text-primary)] font-medium">
                  {isProcessing ? "压缩中..." : "上传打卡合影凭证（可选）"}
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-serif-sc font-medium text-[var(--theme-text-secondary)]">
              完成感言 / 回忆小记
            </label>
            <textarea
              rows={3}
              value={completionReflection}
              onChange={(e) => setCompletionReflection(e.target.value)}
              placeholder="如：我们真的做到了！在飘雪的路灯下，那一刻好幸福..."
              className="romantic-input text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full btn-shoujo-primary py-2.5 rounded-full text-xs font-serif-sc font-medium cursor-pointer"
          >
            确定点亮愿望 ✨
          </button>
        </form>
      </RomanticModal>

      {/* 新增小事模态框 (统一 RomanticModal) */}
      <RomanticModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="写下一件想一起做的事"
        subtitle="添加新的愿望或约会计划，以后一件一件慢慢打卡。"
        badgeText="♡ NEW WISH"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddWish} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-serif-sc font-medium text-[var(--theme-text-secondary)]">
              愿望小事 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如：一起在冬夜漫步看初雪"
              className="romantic-input text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-serif-sc font-medium text-[var(--theme-text-secondary)]">
              分类
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WishItem["category"])}
              className="romantic-input text-xs"
            >
              <option value="romantic">浪漫心动</option>
              <option value="daily">日常生活</option>
              <option value="travel">远方旅行</option>
              <option value="food">人间美食</option>
              <option value="challenge">双人挑战</option>
              <option value="milestone">人生里程碑</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-serif-sc font-medium text-[var(--theme-text-secondary)]">
              目标期待日期（可选）
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="romantic-input font-cinzel text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="btn-shoujo-glass px-5 py-2 rounded-full text-xs font-serif-sc cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-shoujo-primary px-6 py-2 rounded-full text-xs font-serif-sc font-medium cursor-pointer"
            >
              加入愿望清单 ♡
            </button>
          </div>
        </form>
      </RomanticModal>
    </div>
  );
}
