"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { withBasePath } from "@/lib/assets";

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
    <div className="relative z-10 w-full rounded-[2rem] overflow-hidden border border-[#F6A9CD]/45 shadow-[0_18px_45px_-12px_rgba(101,84,141,0.38)] bg-[#292445]/65 backdrop-blur-xl">
      {/* 封面右侧高清原画透出 + 粉紫梦幻渐隐 */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={withBasePath(coverImage)}
          alt={title}
          fill
          priority
          quality={95}
          className={`object-cover ${coverPosition} brightness-100 transition-transform duration-1000`}
        />
        {/* 左侧柔和深暮星紫渐变，确保白字与蜜桃粉标题永远清晰，右侧动漫少女清澈甜美 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#292445]/90 via-[#43376B]/62 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#292445]/55 to-transparent" />
      </div>

      {/* 封面内容区 */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-serif-sc text-[#FFF5EF] bg-[#F6A9CD]/25 backdrop-blur-xl border border-[#FFD1DC]/45 shadow-[0_0_15px_rgba(246,169,205,0.28)]">
              <Sparkles className="w-3 h-3 text-[#FFE3B5]" />
              <span>{badge}</span>
            </span>
            <span className="text-[10px] font-cinzel tracking-[0.25em] text-[#FFD1DC]/85 hidden sm:inline">
              {englishTag}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif-sc font-light tracking-wider text-[#FFF5EF] drop-shadow-[0_4px_14px_rgba(41,36,69,0.85)]">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-[#FFF0F8]/90 font-serif-sc font-light tracking-wide leading-relaxed drop-shadow">
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
  );
}
