"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { PhotoItem } from "@/types";
import { getPhotos, savePhoto, deletePhoto, togglePhotoFavorite } from "@/lib/storage";
import { processImageFile } from "@/lib/upload";
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  Heart,
  Sparkles,
  Maximize2,
  X,
  Shuffle,
  Calendar,
  MapPin,
  Tag,
  Lock,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function GalleryView() {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [favoriteOnly, setFavoriteOnly] = useState<boolean>(false);

  // 模态框状态
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [randomModalPhoto, setRandomModalPhoto] = useState<PhotoItem | null>(null);

  // 表单状态
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCategory, setFormCategory] = useState<PhotoItem["category"]>("dating");
  const [formLocation, setFormLocation] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStory, setFormStory] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formIsPrivate, setFormIsPrivate] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const list = getPhotos(isAuthenticated);
    setPhotos(list);
  }, [isAuthenticated, refreshKey]);

  // 筛选相片
  const filteredPhotos = photos.filter((p) => {
    if (favoriteOnly && !p.isFavorite) return false;
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    return true;
  });

  // 处理文件上传选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await processImageFile(files[0]);
      setPreviewUrl(result.dataUrl);
    } catch (err) {
      alert("照片处理失败：" + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 提交上传新照片
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      alert("请先选择或上传一张照片");
      return;
    }
    if (!formTitle.trim()) {
      alert("请输入照片标题");
      return;
    }

    const tagsArray = formTags
      .split(/[,， ]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    savePhoto({
      title: formTitle.trim(),
      date: formDate,
      category: formCategory,
      location: formLocation.trim() || undefined,
      description: formDesc.trim() || undefined,
      story: formStory.trim() || undefined,
      imageUrl: previewUrl,
      tags: tagsArray.length > 0 ? tagsArray : ["回忆"],
      isFavorite: false,
      isPrivate: formIsPrivate,
    });

    // 重置并关闭
    setFormTitle("");
    setFormLocation("");
    setFormDesc("");
    setFormStory("");
    setFormTags("");
    setPreviewUrl("");
    setUploadModalOpen(false);
    triggerRefresh();
  };

  // 删除照片
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("确定要删除这张珍贵的照片回忆吗？")) {
      deletePhoto(id);
      triggerRefresh();
      if (lightboxIndex !== null) setLightboxIndex(null);
    }
  };

  // 切换收藏
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    togglePhotoFavorite(id);
    triggerRefresh();
  };

  // 随机回忆抽卡
  const handleRandomMemory = () => {
    if (photos.length === 0) return;
    const randomIndex = Math.floor(Math.random() * photos.length);
    setRandomModalPhoto(photos[randomIndex]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 顶部标题与操作栏 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-light text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50">
            <Camera className="w-3.5 h-3.5" />
            <span>定格心动瞬间 · 拍立得画廊</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-slate-800 dark:text-slate-100">
            她的可爱收藏馆
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            按下快门的那一刻，浪漫与爱意变成了永恒。共珍藏 {photos.length} 张回忆胶片。
          </p>
        </div>

        {/* 顶部按钮组：上传照片、随机抽卡 */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRandomMemory}
            className="px-4 py-2.5 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>随机回忆抽卡</span>
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 shadow-md shadow-rose-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>珍藏新照片</span>
          </button>
        </div>
      </div>

      {/* 筛选与分类 Tab */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: "all", label: "全部回忆" },
            { id: "dating", label: "约会记录" },
            { id: "snapshot", label: "可爱抓拍" },
            { id: "daily", label: "日常温存" },
            { id: "travel", label: "旅行足迹" },
            { id: "funny", label: "搞怪瞬间" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFavoriteOnly(!favoriteOnly)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
            favoriteOnly
              ? "bg-rose-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favoriteOnly ? "fill-white" : ""}`} />
          <span>只看心动特别收藏</span>
        </button>
      </div>

      {/* 照片网格展示（精致拍立得手账风） */}
      {filteredPhotos.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
          <Camera className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-light">暂无该分类下的相片回忆</p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="text-xs text-rose-500 hover:underline cursor-pointer"
          >
            立即点击上传第一张
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative bg-white dark:bg-slate-900 p-3 pb-4 rounded-2xl shadow-md hover:shadow-xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* 照片主体框 */}
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* 私密角标 */}
                {photo.isPrivate && (
                  <span className="absolute top-2 left-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-rose-300">
                    <Lock className="w-3 h-3" />
                  </span>
                )}

                {/* 快捷悬浮收藏与删除 */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleToggleFavorite(photo.id, e)}
                    className="p-1.5 rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-sm hover:scale-110 transition cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        photo.isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600 dark:text-slate-300"
                      }`}
                    />
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={(e) => handleDelete(photo.id, e)}
                      className="p-1.5 rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-sm text-slate-500 hover:text-rose-500 hover:scale-110 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 手账拍立得文字区 */}
              <div className="pt-3 px-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-1">
                    {photo.title}
                  </h3>
                  <span className="text-[10px] text-slate-400">{photo.date}</span>
                </div>

                {photo.location && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{photo.location}</span>
                  </p>
                )}

                {photo.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-light">
                    {photo.description}
                  </p>
                )}

                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {photo.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 上传照片模态框 */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                定格美好回忆
              </h3>
              <p className="text-xs text-slate-500">
                支持手机拍照与本地照片上传，将在本地与专属空间持久化保存。
              </p>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              {/* 照片选择与预览框 */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full aspect-16/9 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-400 flex flex-col items-center justify-center overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition"
              >
                {previewUrl ? (
                  <Image src={previewUrl} alt="预览照片" fill className="object-cover" />
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <Camera className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {isProcessing ? "正在压缩画质..." : "点击选择照片 / 手机拍照上传"}
                    </p>
                    <p className="text-[10px] text-slate-400">自动压缩画质，保护隐私，不上载 GitHub</p>
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
                    回忆标题 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="如：冬日初雪漫步"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    日期
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    相册分类
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PhotoItem["category"])}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  >
                    <option value="dating">约会记录</option>
                    <option value="snapshot">可爱抓拍</option>
                    <option value="daily">日常温存</option>
                    <option value="travel">旅行足迹</option>
                    <option value="funny">搞怪瞬间</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    拍摄地点
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="如：雪花飘落的林荫道"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  照片描述 / 当时在做什么
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="写下一两句当下的心情或场景..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  照片背后的专属故事（可选）
                </label>
                <textarea
                  rows={2}
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  placeholder="只有我们两个人知道的小秘密与悄悄话..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="初雪, 红围巾, 牵手"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="photoPrivate"
                  checked={formIsPrivate}
                  onChange={(e) => setFormIsPrivate(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <label htmlFor="photoPrivate" className="text-xs text-slate-600 dark:text-slate-400">
                  设为私密相片（仅在专属双人认证后可见）
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-xs font-medium text-white shadow-md hover:from-rose-600 hover:to-indigo-700 transition cursor-pointer disabled:opacity-50"
                >
                  确认珍藏
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 全屏灯箱预览组件 */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 上一张 / 下一张控制 */}
          {lightboxIndex > 0 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {lightboxIndex < filteredPhotos.length - 1 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row bg-slate-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* 照片大图 */}
            <div className="relative flex-1 min-h-[300px] md:min-h-[500px] bg-black">
              <Image
                src={filteredPhotos[lightboxIndex].imageUrl}
                alt={filteredPhotos[lightboxIndex].title}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* 侧边专属故事手账详情 */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 text-slate-200 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rose-300 font-light flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {filteredPhotos[lightboxIndex].date}
                  </span>
                  <button
                    onClick={(e) => handleToggleFavorite(filteredPhotos[lightboxIndex].id, e)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        filteredPhotos[lightboxIndex].isFavorite ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-lg font-serif font-medium text-white">
                  {filteredPhotos[lightboxIndex].title}
                </h3>

                {filteredPhotos[lightboxIndex].location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {filteredPhotos[lightboxIndex].location}
                  </p>
                )}

                {filteredPhotos[lightboxIndex].description && (
                  <div className="pt-2 text-xs text-slate-300 leading-relaxed font-light border-t border-white/10">
                    <p className="text-[10px] text-slate-400 mb-1 font-medium">照片随记</p>
                    {filteredPhotos[lightboxIndex].description}
                  </div>
                )}

                {filteredPhotos[lightboxIndex].story && (
                  <div className="pt-2 text-xs text-rose-200/90 leading-relaxed font-light bg-rose-500/10 p-3 rounded-xl border border-rose-400/20">
                    <p className="text-[10px] text-rose-300 font-medium mb-1">专属独家故事</p>
                    {filteredPhotos[lightboxIndex].story}
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    onClick={(e) => handleDelete(filteredPhotos[lightboxIndex].id, e)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 删除这张照片
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 随机回忆盲盒弹窗 */}
      {randomModalPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
            <button
              onClick={() => setRandomModalPhoto(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5" /> 时光机抽中了一段心动回忆
              </span>
              <h3 className="text-lg font-serif font-light">{randomModalPhoto.title}</h3>
              <p className="text-[11px] text-slate-400">{randomModalPhoto.date}</p>
            </div>

            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-800">
              <Image
                src={randomModalPhoto.imageUrl}
                alt={randomModalPhoto.title}
                fill
                className="object-cover"
              />
            </div>

            {randomModalPhoto.story ? (
              <p className="text-xs text-rose-200/90 bg-rose-500/10 p-3 rounded-xl border border-rose-400/20 font-light leading-relaxed">
                {randomModalPhoto.story}
              </p>
            ) : (
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {randomModalPhoto.description || "一段珍藏的二人美好瞬间。"}
              </p>
            )}

            <button
              onClick={handleRandomMemory}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-xs font-medium text-white shadow transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Shuffle className="w-3.5 h-3.5" /> 再抽一张回忆
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
