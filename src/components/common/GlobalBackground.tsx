"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

/**
 * 全站多层梦幻童话全局背景组件 (Layer 01 - Layer 04)
 * 固定铺满 100dvh 视口，彻底消除左右/底部白边，不拦截任何鼠标交互
 */
export default function GlobalBackground() {
  const { isLowPerformance } = useApp();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 min-h-[100dvh] w-full pointer-events-none overflow-hidden select-none"
    >
      {/* ================= Layer 01: 全局粉紫星空渐变底色 ================= */}
      {/* 浅色童话模式（奶油粉 × 薰衣草淡紫） */}
      <div
        className="absolute inset-0 transition-opacity duration-700 opacity-100 dark:opacity-0"
        style={{
          background:
            "linear-gradient(180deg, #C7B8EA 0%, #DFC5EB 28%, #F6CFE3 62%, #FFE5EC 84%, #FFF5EF 100%)",
        }}
      />
      {/* 深色梦幻星夜模式（深暮星紫 → 梦幻星紫 → 薰衣草紫 → 樱粉云雾） */}
      <div
        className="absolute inset-0 transition-opacity duration-700 opacity-0 dark:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, #292445 0%, #43376B 28%, #65548D 56%, #9478B8 80%, #C98BB8 100%)",
        }}
      />

      {/* ================= Layer 02: 梦幻星云、极光与柔软云层 ================= */}
      <div
        className="absolute -top-32 left-1/4 w-[65vw] h-[55vh] rounded-full blur-[90px] opacity-45 dark:opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(246,169,205,0.65) 0%, rgba(169,149,208,0.35) 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-24 w-[50vw] h-[50vh] rounded-full blur-[100px] opacity-40 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(255,227,181,0.45) 0%, rgba(255,209,220,0.35) 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-56 sm:h-72 opacity-80 dark:opacity-45"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 20% 100%, rgba(255,245,239,0.85), transparent 70%), radial-gradient(ellipse 75% 65% at 82% 100%, rgba(255,209,220,0.8), transparent 72%), radial-gradient(ellipse 90% 55% at 50% 100%, rgba(255,240,248,0.72), transparent 75%)",
        }}
      />

      {/* ================= Layer 03: 冬日童话边缘场景装饰 (聚焦角落与边缘，中心留白) ================= */}
      {/* 左上角：粉樱落雪花枝 + 悬垂暖光小灯笼 */}
      <svg
        viewBox="0 0 320 260"
        fill="none"
        className="absolute top-14 -left-4 w-48 sm:w-64 lg:w-80 opacity-85 dark:opacity-90 drop-shadow-[0_6px_18px_rgba(246,169,205,0.25)]"
      >
        {/* 弯曲花枝 */}
        <path
          d="M-10 38 C55 54, 118 46, 198 18 M88 46 C126 70, 160 76, 192 70 M142 36 C172 18, 210 12, 236 22"
          stroke="#9D7BA8"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* 积雪点缀 */}
        <path
          d="M25 41 C65 49, 100 45, 145 31"
          stroke="#FFF5EF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* 樱花簇 */}
        {[
          [42, 42, 11],
          [78, 52, 9],
          [116, 40, 12],
          [154, 68, 10],
          [194, 24, 11],
          [226, 20, 8],
        ].map(([cx, cy, r], idx) => (
          <g key={idx}>
            <circle cx={cx} cy={cy} r={r} fill="#FFD1DC" opacity="0.92" />
            <circle cx={cx + 3} cy={cy - 3} r={r * 0.65} fill="#FFF0F8" opacity="0.85" />
            <circle cx={cx} cy={cy} r={2.2} fill="#FFE3B5" />
          </g>
        ))}
        {/* 悬垂丝带与暖光玻璃灯笼 */}
        <line x1="94" y1="50" x2="94" y2="112" stroke="#F6A9CD" strokeWidth="1.6" />
        {/* 小蝴蝶结 */}
        <path
          d="M94 96 C80 86, 78 104, 94 98 C110 104, 108 86, 94 96 Z"
          fill="#F6A9CD"
          stroke="#FFF0F8"
          strokeWidth="1"
        />
        <g>
          <circle cx="94" cy="142" r="34" fill="url(#lanternGlow)" />
          <rect x="82" y="114" width="24" height="6" rx="3" fill="#B49BE5" />
          <path
            d="M80 120 h28 l-3 36 h-22 Z"
            fill="rgba(255,240,248,0.45)"
            stroke="#FFE3B5"
            strokeWidth="1.6"
          />
          <circle cx="94" cy="138" r="7" fill="#FFE3B5" />
          <rect x="83" y="156" width="22" height="5" rx="2.5" fill="#B49BE5" />
        </g>
        <defs>
          <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE3B5" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFE3B5" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* 右上角：爱心星座、弯月与复古系蝴蝶结冬日路灯 */}
      <svg
        viewBox="0 0 340 300"
        fill="none"
        className="absolute top-16 -right-2 w-48 sm:w-64 lg:w-80 opacity-85 dark:opacity-95"
      >
        {/* 爱心星座连线 */}
        <path
          d="M128 84 L104 62 L76 68 L68 96 L128 144 L188 96 L180 68 L152 62 Z"
          stroke="#FFE3B5"
          strokeWidth="1.1"
          strokeDasharray="3 4"
          opacity="0.7"
        />
        {[
          [128, 84],
          [104, 62],
          [76, 68],
          [68, 96],
          [128, 144],
          [188, 96],
          [180, 68],
          [152, 62],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="#FFF0F8" />
        ))}
        {/* 梦幻弯月 */}
        <path
          d="M214 38 A24 24 0 1 0 242 74 A20 20 0 1 1 214 38 Z"
          fill="#FFE3B5"
          opacity="0.88"
        />
        {/* 复古路灯柱与暖光灯罩 */}
        <circle cx="282" cy="108" r="46" fill="url(#lampGlow)" />
        <path
          d="M282 130 L282 295"
          stroke="#A995D0"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M266 86 h32 l-5 36 h-22 Z"
          fill="rgba(255,245,239,0.55)"
          stroke="#FFE3B5"
          strokeWidth="1.8"
        />
        <path d="M262 86 L282 72 L302 86 Z" fill="#65548D" stroke="#FFD1DC" strokeWidth="1.2" />
        <circle cx="282" cy="104" r="9" fill="#FFE3B5" />
        {/* 路灯粉色蝴蝶结 */}
        <path
          d="M282 162 C258 148, 256 176, 282 166 C308 176, 306 148, 282 162 Z"
          fill="#F6A9CD"
          stroke="#FFF0F8"
          strokeWidth="1.2"
        />
        <path d="M282 165 L270 198 M282 165 L294 198" stroke="#F6A9CD" strokeWidth="2.4" strokeLinecap="round" />
        <defs>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE3B5" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFE3B5" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* 左下角：冬日雪地暖光灯笼 */}
      <svg
        viewBox="0 0 240 220"
        fill="none"
        className="hidden sm:block absolute bottom-2 left-2 w-40 lg:w-52 opacity-85"
      >
        <circle cx="88" cy="146" r="52" fill="url(#bottomLanternGlow)" />
        <path d="M64 114 L88 94 L112 114 Z" fill="#8C7AA8" stroke="#FFD1DC" strokeWidth="1.5" />
        <rect
          x="68"
          y="114"
          width="40"
          height="54"
          rx="6"
          fill="rgba(255,245,239,0.5)"
          stroke="#FFE3B5"
          strokeWidth="1.6"
        />
        <path
          d="M88 150c-1.5-1-10-6-10-11.5a5.5 5.5 0 0 1 10-3.2 5.5 5.5 0 0 1 10 3.2c0 5.5-8.5 10.5-10 11.5Z"
          fill="#FFE3B5"
        />
        <rect x="64" y="168" width="48" height="8" rx="4" fill="#8C7AA8" />
        {/* 粉色花瓣点缀 */}
        <ellipse cx="42" cy="176" rx="9" ry="5" transform="rotate(-18 42 176)" fill="#F6A9CD" opacity="0.85" />
        <ellipse cx="136" cy="184" rx="8" ry="4.5" transform="rotate(14 136 184)" fill="#FFD1DC" opacity="0.85" />
        <defs>
          <radialGradient id="bottomLanternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE3B5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFE3B5" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* 右下角：童话玻璃水晶雪球 (内有雪夜暖光小屋，底座系着粉色丝带) */}
      <svg
        viewBox="0 0 240 240"
        fill="none"
        className="hidden sm:block absolute bottom-2 right-2 w-40 lg:w-52 opacity-90"
      >
        <circle cx="122" cy="108" r="68" fill="rgba(255,240,248,0.22)" stroke="#FFF0F8" strokeWidth="2" />
        <circle cx="122" cy="108" r="62" fill="url(#globeInner)" />
        {/* 球内雪坡与小屋 */}
        <path d="M68 136 Q122 118 176 136 A62 62 0 0 1 68 136 Z" fill="#FFF5EF" opacity="0.92" />
        <path d="M100 128 L122 108 L144 128 Z" fill="#F6A9CD" stroke="#FFF5EF" strokeWidth="1.5" />
        <rect x="105" y="128" width="34" height="22" rx="2" fill="#FFF0F8" />
        <rect x="118" y="135" width="8" height="10" rx="1.5" fill="#FFE3B5" />
        {/* 水晶高光弧线 */}
        <path d="M78 82 A48 48 0 0 1 118 52" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        {/* 水晶球底座与粉色蝴蝶结 */}
        <path d="M84 166 h76 l8 24 h-92 Z" fill="#A995D0" stroke="#FFD1DC" strokeWidth="1.5" />
        <path
          d="M122 178 C98 164, 96 192, 122 182 C148 192, 146 164, 122 178 Z"
          fill="#F6A9CD"
          stroke="#FFF0F8"
          strokeWidth="1.2"
        />
        <defs>
          <radialGradient id="globeInner" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#A995D0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#292445" stopOpacity="0.45" />
          </radialGradient>
        </defs>
      </svg>

      {/* ================= Layer 04: 半透明丝带与发光蝴蝶 ================= */}
      {!isLowPerformance && (
        <>
          <svg
            viewBox="0 0 1440 420"
            preserveAspectRatio="none"
            className="absolute top-1/4 inset-x-0 w-full h-72 opacity-40 dark:opacity-35"
          >
            <path
              d="M-40 120 C260 20, 480 280, 820 150 C1100 40, 1280 210, 1490 110"
              stroke="url(#ribbonGrad)"
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M-40 120 C260 20, 480 280, 820 150 C1100 40, 1280 210, 1490 110"
              stroke="#FFF0F8"
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />
            <defs>
              <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F6A9CD" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#FFD1DC" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#A995D0" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F6A9CD" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          {/* 边缘发光蝴蝶 1 */}
          <svg
            viewBox="0 0 48 48"
            className="hidden md:block absolute top-40 left-12 w-9 h-9 animate-butterfly drop-shadow-[0_0_12px_rgba(255,209,220,0.85)]"
          >
            <path
              d="M24 24 C12 8, 2 18, 12 28 C4 34, 14 42, 24 30 C34 42, 44 34, 36 28 C46 18, 36 8, 24 24 Z"
              fill="rgba(255,209,220,0.75)"
              stroke="#FFF0F8"
              strokeWidth="1.4"
            />
          </svg>

          {/* 边缘发光蝴蝶 2 */}
          <svg
            viewBox="0 0 48 48"
            className="hidden md:block absolute top-1/3 right-14 w-10 h-10 animate-butterfly drop-shadow-[0_0_14px_rgba(255,240,248,0.85)]"
            style={{ animationDelay: "1.6s" }}
          >
            <path
              d="M24 24 C12 8, 2 18, 12 28 C4 34, 14 42, 24 30 C34 42, 44 34, 36 28 C46 18, 36 8, 24 24 Z"
              fill="rgba(246,169,205,0.68)"
              stroke="#FFE3B5"
              strokeWidth="1.4"
            />
          </svg>
        </>
      )}
    </div>
  );
}
