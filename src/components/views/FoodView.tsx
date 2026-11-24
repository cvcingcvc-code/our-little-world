"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { FoodRecord } from "@/types";
import { getFoodRecords, saveFoodRecord, deleteFoodRecord, toggleFoodWishlist } from "@/lib/storage";
import { processImageFile } from "@/lib/upload";
import {
  UtensilsCrossed,
  Plus,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  Camera,
  Trash2,
  CheckCircle,
  X,
  Bookmark,
  Heart,
} from "lucide-react";

export default function FoodView() {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();
  const [foods, setFoods] = useState<FoodRecord[]>([]);
  const [tab, setTab] = useState<"history" | "wishlist">("history");

  // 模态框与表单状态
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [restaurant, setRestaurant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [dishes, setDishes] = useState("");
  const [rating, setRating] = useState(5);
  const [price, setPrice] = useState("");
  const [review, setReview] = useState("");
  const [story, setStory] = useState("");
  const [isWishlist, setIsWishlist] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFoods(getFoodRecords(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  // 过滤已打卡与想吃清单
  const historyList = foods.filter((f) => !f.isWishlist);
  const wishlist = foods.filter((f) => f.isWishlist);

  const currentList = tab === "history" ? historyList : wishlist;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await processImageFile(files[0]);
      setImageUrl(res.dataUrl);
    } catch (err) {
      alert("图片处理失败：" + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant.trim()) {
      alert("请输入餐厅或美食名称");
      return;
    }

    const dishList = dishes
      .split(/[,， ]+/)
      .map((d) => d.trim())
      .filter(Boolean);

    saveFoodRecord({
      restaurant: restaurant.trim(),
      date,
      location: location.trim() || "未知坐标",
      dishes: dishList.length > 0 ? dishList : ["特色招牌菜"],
      rating,
      price: price ? parseFloat(price) : undefined,
      imageUrl: imageUrl || undefined,
      review: review.trim() || "人间烟火，幸好有你相伴。",
      story: story.trim() || undefined,
      isWishlist,
      isPrivate: false,
    });

    // 重置
    setRestaurant("");
    setLocation("");
    setDishes("");
    setPrice("");
    setReview("");
    setStory("");
    setImageUrl("");
    setAddModalOpen(false);
    triggerRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条美食记录吗？")) {
      deleteFoodRecord(id);
      triggerRefresh();
    }
  };

  const handleToggleWish = (id: string) => {
    toggleFoodWishlist(id);
    triggerRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 头部区域 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-light text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>三餐四季 · 人间烟火气</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-800 dark:text-slate-100">
            我们的美食日记
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            热气腾腾的饭菜与对坐微笑的眼神。已打卡 {historyList.length} 家美味，还有 {wishlist.length} 个想吃清单待奔赴。
          </p>
        </div>

        <button
          onClick={() => {
            setIsWishlist(tab === "wishlist");
            setAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>记录一次美味</span>
        </button>
      </div>

      {/* 切换选项卡：已打卡 vs 想吃心愿 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
            tab === "history"
              ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>尝过的幸福 ({historyList.length})</span>
        </button>
        <button
          onClick={() => setTab("wishlist")}
          className={`px-4 py-2 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
            tab === "wishlist"
              ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>未来想吃清单 ({wishlist.length})</span>
        </button>
      </div>

      {/* 美食卡片列表 */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <UtensilsCrossed className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-light">
            {tab === "history" ? "还没有记录打卡过的餐厅" : "未来想吃清单还是空的"}
          </p>
          <button
            onClick={() => {
              setIsWishlist(tab === "wishlist");
              setAddModalOpen(true);
            }}
            className="text-xs text-amber-500 hover:underline cursor-pointer"
          >
            立即添加一家想吃的餐厅
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200/80 dark:border-slate-800 transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 封面图片 */}
                {item.imageUrl ? (
                  <div className="relative w-full aspect-16/9 bg-slate-100 dark:bg-slate-800">
                    <Image src={item.imageUrl} alt={item.restaurant} fill className="object-cover" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[11px] text-amber-300 font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating} 星美味</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-16/9 bg-gradient-to-tr from-amber-50 to-rose-50 dark:from-slate-800 dark:to-slate-850 flex items-center justify-center text-amber-400/60">
                    <UtensilsCrossed className="w-10 h-10" />
                  </div>
                )}

                {/* 详情内容 */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-medium text-slate-800 dark:text-slate-100">
                      {item.restaurant}
                    </h3>
                    <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>

                  {/* 菜品标签 */}
                  <div className="flex flex-wrap gap-1.5">
                    {item.dishes.map((dish, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-light border border-amber-200/40"
                      >
                        🍲 {dish}
                      </span>
                    ))}
                  </div>

                  {/* 评价 */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed pt-1">
                    {item.review}
                  </p>

                  {/* 专属小故事 */}
                  {item.story && (
                    <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/50 text-xs text-rose-800 dark:text-rose-200 font-light leading-relaxed">
                      <span className="font-medium text-rose-500 block mb-0.5">当餐回忆小剧场：</span>
                      {item.story}
                    </div>
                  )}
                </div>
              </div>

              {/* 底部操作条 */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => handleToggleWish(item.id)}
                  className="hover:text-amber-500 flex items-center gap-1 transition cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{item.isWishlist ? "标记为已打卡" : "移入想吃清单"}</span>
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="hover:text-rose-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新增美食记录模态框 */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                记录一次美味时刻
              </h3>
              <p className="text-xs text-slate-500">
                记录共同品尝的美食味道，或者加入未来想去的心愿单。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 图片上传 */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full aspect-16/9 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-400 flex flex-col items-center justify-center overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition"
              >
                {imageUrl ? (
                  <Image src={imageUrl} alt="美食预览" fill className="object-cover" />
                ) : (
                  <div className="text-center p-4 space-y-1">
                    <Camera className="w-7 h-7 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {isProcessing ? "压缩中..." : "上传实拍美食照"}
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
                    餐厅 / 美食名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    placeholder="如：雪见町日式寿喜烧"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    打卡日期
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    地点 / 地址
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="如：暖冬小巷 7 号"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    美味评分 (1-5星)
                  </label>
                  <div className="flex items-center gap-1 pt-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  吃过的招牌菜品（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={dishes}
                  onChange={(e) => setDishes(e.target.value)}
                  placeholder="和牛寿喜锅, 温泉蛋, 乌冬面"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  味道评价
                </label>
                <textarea
                  rows={2}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="汤底甜润，热气腾腾..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  餐桌回忆小故事（可选）
                </label>
                <textarea
                  rows={2}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="如：你偷偷把最大的肉夹到了我的碗里..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="wishlistCheck"
                  checked={isWishlist}
                  onChange={(e) => setIsWishlist(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="wishlistCheck" className="text-xs text-slate-600 dark:text-slate-400">
                  作为“未来想吃清单”（未吃过，待去打卡）
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-xs font-medium text-white shadow-md hover:from-amber-600 hover:to-rose-600 transition cursor-pointer disabled:opacity-50"
                >
                  保存记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
