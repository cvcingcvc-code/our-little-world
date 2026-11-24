"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { GiftRecord } from "@/types";
import { getGiftRecords, saveGiftRecord, deleteGiftRecord } from "@/lib/storage";
import { processImageFile } from "@/lib/upload";
import {
  Gift,
  Plus,
  Heart,
  Calendar,
  Sparkles,
  Camera,
  Trash2,
  X,
  Mail,
  Flower2,
  Smile,
} from "lucide-react";

export default function GiftsView() {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();
  const [gifts, setGifts] = useState<GiftRecord[]>([]);
  const [filterGiver, setFilterGiver] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [giver, setGiver] = useState<GiftRecord["giver"]>("partner1");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<GiftRecord["type"]>("gift");
  const [story, setStory] = useState("");
  const [mood, setMood] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setGifts(getGiftRecords(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  const filteredGifts = gifts.filter((g) => {
    if (filterGiver !== "all" && g.giver !== filterGiver) return false;
    if (filterType !== "all" && g.type !== filterType) return false;
    return true;
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await processImageFile(files[0]);
      setImageUrl(res.dataUrl);
    } catch (err) {
      alert("照片处理失败：" + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("请输入礼物或心意名称");
      return;
    }

    saveGiftRecord({
      name: name.trim(),
      giver,
      date,
      type,
      imageUrl: imageUrl || undefined,
      story: story.trim() || "珍藏在岁月里的独家心意。",
      mood: mood.trim() || "满心欢喜与感动。",
      isPrivate: false,
    });

    setName("");
    setStory("");
    setMood("");
    setImageUrl("");
    setModalOpen(false);
    triggerRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这份礼物记录吗？")) {
      deleteGiftRecord(id);
      triggerRefresh();
    }
  };

  const getTypeIcon = (t: GiftRecord["type"]) => {
    switch (t) {
      case "flower":
        return <Flower2 className="w-4 h-4 text-rose-400" />;
      case "letter":
        return <Mail className="w-4 h-4 text-sky-400" />;
      case "handcraft":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Gift className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getTypeName = (t: GiftRecord["type"]) => {
    switch (t) {
      case "flower":
        return "鲜花香氛";
      case "letter":
        return "手写信";
      case "handcraft":
        return "手作心意";
      case "surprise":
        return "特别小惊喜";
      default:
        return "精选礼物";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-10 animate-fadeIn">
      {/* 展厅头部 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-light text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 backdrop-blur-md">
            <Gift className="w-3.5 h-3.5" />
            <span>藏在岁月里的心意 · 礼物博物馆</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-800 dark:text-slate-100 font-serif">
            礼物与惊喜博物馆
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light">
            礼物的价值不在于价格标签，而在于你拆开包装时心底荡漾起的微波。当前珍藏 {gifts.length} 份心意。
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 shadow-lg shadow-indigo-500/20 transition cursor-pointer flex items-center gap-1.5 border-none self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>记录一份新心意</span>
        </button>
      </div>

      {gifts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "全部心意" },
              { id: "partner1", label: "TA 送给我的" },
              { id: "partner2", label: "我送给 TA 的" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilterGiver(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border-none outline-none ${
                  filterGiver === item.id
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 真实空状态或礼物卡片 */}
      {filteredGifts.length === 0 ? (
        <div className="p-16 sm:p-20 text-center rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-dashed border-slate-300 dark:border-white/10 text-slate-400 space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 flex items-center justify-center mx-auto text-indigo-400">
            <Gift className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg text-slate-700 dark:text-slate-200 font-medium">
              展馆尚无礼物记录
            </h3>
            <p className="text-xs text-slate-500 font-light max-w-sm mx-auto leading-relaxed">
              无论是生日惊喜、节日花束，还是写在便签上的真情手写信，都可以在这里为它开辟专属展位。
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-xs font-medium shadow-md hover:scale-105 transition cursor-pointer inline-flex items-center gap-1.5 border-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>记录你们的第一件礼物</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white dark:bg-slate-900/90 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-200/80 dark:border-white/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {gift.imageUrl ? (
                  <div className="relative w-full aspect-16/10 bg-slate-100 dark:bg-slate-800">
                    <Image src={gift.imageUrl} alt={gift.name} fill className="object-cover" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] text-white flex items-center gap-1.5">
                      {getTypeIcon(gift.type)}
                      <span>{getTypeName(gift.type)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-16/10 bg-gradient-to-tr from-indigo-50 to-pink-50 dark:from-slate-800 dark:to-slate-850 flex items-center justify-center text-indigo-400/50">
                    <Gift className="w-12 h-12" />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-medium text-slate-800 dark:text-slate-100">
                      {gift.name}
                    </h3>
                    <span className="text-xs text-slate-400 shrink-0 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {gift.date}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-light">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>{gift.giver === "partner1" ? "TA 赠予我" : "我赠予 TA"}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {gift.story}
                  </p>

                  {gift.mood && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5 font-light">
                      <Smile className="w-3.5 h-3.5 shrink-0" />
                      <span>当时心境：{gift.mood}</span>
                    </p>
                  )}
                </div>
              </div>

              {isAuthenticated && (
                <div className="px-6 py-3.5 border-t border-slate-100 dark:border-white/5 flex justify-end">
                  <button
                    onClick={() => handleDelete(gift.id)}
                    className="text-xs text-slate-400 hover:text-rose-500 transition cursor-pointer border-none bg-transparent"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 新增礼物模态框 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer border-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-serif font-medium text-slate-800 dark:text-slate-100">
                收纳一份礼物心意
              </h3>
              <p className="text-xs text-slate-500 font-light">
                记录一件物品背后的温度，无论是惊喜大礼还是温暖的手写小纸条。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full aspect-16/9 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 flex flex-col items-center justify-center overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition"
              >
                {imageUrl ? (
                  <Image src={imageUrl} alt="礼物照片" fill className="object-cover" />
                ) : (
                  <div className="text-center p-4 space-y-1">
                    <Camera className="w-7 h-7 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {isProcessing ? "压缩中..." : "上传礼物实拍照片"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    礼物 / 物品名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如：手织羊绒红围巾"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    日期
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    赠送方向
                  </label>
                  <select
                    value={giver}
                    onChange={(e) => setGiver(e.target.value as GiftRecord["giver"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="partner1">TA 送给我的</option>
                    <option value="partner2">我送给 TA 的</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    心意类型
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as GiftRecord["type"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="gift">精选礼物</option>
                    <option value="flower">鲜花香氛</option>
                    <option value="letter">真情手写信</option>
                    <option value="handcraft">手作心意</option>
                    <option value="surprise">特别小惊喜</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  背后的故事
                </label>
                <textarea
                  rows={2}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="写下送出或收到时的感动故事..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border-none"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-xs font-medium text-white shadow-md hover:from-indigo-600 hover:to-rose-600 transition cursor-pointer disabled:opacity-50 border-none"
                >
                  确认记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
