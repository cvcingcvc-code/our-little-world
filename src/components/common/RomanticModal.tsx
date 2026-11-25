"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Heart, AlertCircle } from "lucide-react";

interface RomanticModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badgeText?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

/**
 * 全站统一少女感浪漫磨砂琉璃弹窗组件
 * 通过 Portal 挂载至 document.body，确保永远高于顶部/底部导航栏
 */
export default function RomanticModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeText = "✨ ROMANTIC ARCHIVE",
  maxWidth = "max-w-lg",
  children,
}: RomanticModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#1e1836]/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidth} rounded-[2rem] p-5 sm:p-7 shadow-[0_24px_60px_rgba(19,15,38,0.65)] border border-[#F6A9CD]/60 my-auto max-h-[88dvh] flex flex-col`}
        style={{
          background:
            "linear-gradient(160deg, rgba(255, 245, 248, 0.96) 0%, rgba(246, 224, 240, 0.95) 55%, rgba(226, 214, 245, 0.96) 100%)",
        }}
      >
        {/* 暗夜星紫模式下叠加柔和星紫半透层 */}
        <div
          aria-hidden="true"
          className="hidden dark:block absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            background:
              "linear-gradient(160deg, rgba(58, 48, 96, 0.97) 0%, rgba(41, 36, 69, 0.98) 100%)",
          }}
        />

        {/* 顶部粉色小蝴蝶结丝带装饰 */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#F6A9CD] via-[#F47FA9] to-[#A995D0] text-white text-[10px] font-cinzel tracking-[0.2em] shadow-lg shadow-pink-400/35 border border-[#FFF0F8]/75 flex items-center gap-1.5 whitespace-nowrap">
            <span>🎀</span>
            <span>{badgeText}</span>
          </span>
        </div>

        {/* 标题与关闭按钮 */}
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4 pt-1 shrink-0">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-serif-sc font-medium text-[#3A2C54] dark:text-[#FFF5EF] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F47FA9] shrink-0" />
              <span>{title}</span>
            </h3>
            {subtitle && (
              <p className="text-xs font-serif-sc text-[#68568A] dark:text-[#E6D7F5] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="p-1.5 rounded-full text-[#8C7AA8] dark:text-[#C2B0DC] hover:text-[#F47FA9] hover:bg-pink-200/25 transition cursor-pointer border-none bg-transparent shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单主体（独立滚动区，防止长表单溢出） */}
        <div className="relative z-10 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/** 温柔且高对比度的中文校验错误提示条 */
export function RomanticErrorTip({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFE3EB] dark:bg-[#6A2C4A]/90 border border-[#F47FA9] text-xs font-serif-sc font-medium text-[#8B1E4B] dark:text-[#FFE3EB]">
      <AlertCircle className="w-4 h-4 shrink-0 text-[#D83B75] dark:text-[#FFD1DC]" />
      <span>{message}</span>
    </div>
  );
}

/** 保存成功时的轻量级星光与爱心提示徽章 */
export function RomanticSuccessToast({ message }: { message: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!message || !mounted) return null;

  return createPortal(
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F6A9CD] via-[#F47FA9] to-[#A995D0] text-white text-xs font-serif-sc tracking-wider shadow-[0_10px_30px_rgba(244,127,169,0.5)] border border-[#FFF0F8]/75 flex items-center gap-2 pointer-events-none">
      <Heart className="w-3.5 h-3.5 fill-white" />
      <span>{message}</span>
      <Sparkles className="w-3.5 h-3.5 text-[#FFE3B5]" />
    </div>,
    document.body
  );
}
