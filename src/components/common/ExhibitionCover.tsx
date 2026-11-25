"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface ExhibitionCoverProps {
  coverImage: string;
  coverPosition?: string;
  badge: string;
  englishTag: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export default function ExhibitionCover({
  coverImage,
  coverPosition = "object-right md:object-[center_25%]",
  badge,
  englishTag,
  title,
  subtitle,
  actions,
}: ExhibitionCoverProps) {
  return (
    <>
      {/* 1. 全屏固定柔和沉浸动漫背景层（确保切换至任何展厅都有冬日原画陪伴） */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <Image
          src={coverImage}
          alt={title}
          fill
          priority
          quality={90}
          className="object-cover object-center opacity-30 dark:opacity-25 scale-105 filter blur-[2px] transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-[#070b14]/95" />
        {/* 淡淡少女粉紫氛围光晕 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-400/10 blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      {/* 2. 顶部清晰动漫主题画报封面横幅 (Theme Cover Banner) */}
      <div className="relative z-10 w-full rounded-[2rem] overflow-hidden border border-pink-200/30 shadow-[0_20px_50px_-12px_rgba(244,114,182,0.22)] bg-slate-950/70">
        {/* 封面右侧高清原画透出 */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={coverImage}
            alt={title}
            fill
            priority
            quality={100}
            className={`object-cover ${coverPosition} brightness-100 transition-transform duration-1000`}
          />
          {/* 左侧柔和暗粉紫渐变，保证左边文字极清，右边动漫人物清澈甜美 */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/65 to-slate-950/15" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>

        {/* 封面内容区 */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-serif-sc text-pink-100 bg-pink-400/20 backdrop-blur-xl border border-pink-200/40 shadow-[0_0_15px_rgba(244,114,182,0.25)]">
                <Sparkles className="w-3 h-3 text-pink-300 animate-spin" />
                <span>{badge}</span>
              </span>
              <span className="text-[10px] font-cinzel tracking-[0.25em] text-pink-200/75 hidden sm:inline">
                {englishTag}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif-sc font-light tracking-wider text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.8)]">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-pink-50/85 font-serif-sc font-light tracking-wide leading-relaxed drop-shadow">
              {subtitle}
            </p>
          </div>

          {/* 操作按钮插槽 */}
          {actions && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
