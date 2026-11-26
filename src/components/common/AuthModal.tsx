"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Heart,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { getActiveSiteConfig, saveActiveSiteStartDate, saveActiveCoupleNames } from "@/config/site";
import RomanticModal from "./RomanticModal";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { triggerRefresh } = useApp();

  const [customStartDate, setCustomStartDate] = useState("");
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getActiveSiteConfig();
      setCustomStartDate(cfg.startDate);
      setPartner1(cfg.coupleNames.partner1);
      setPartner2(cfg.coupleNames.partner2);
      setSettingsSaved(false);
    }
  }, [isOpen]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStartDate) saveActiveSiteStartDate(customStartDate);
    if (partner1 && partner2) saveActiveCoupleNames(partner1, partner2);
    setSettingsSaved(true);
    triggerRefresh();
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <RomanticModal
      isOpen={isOpen}
      onClose={onClose}
      title="双人专属空间 · 纪念设置"
      subtitle="已取消访客登录限制，打开网站即可直接体验上传照片、点亮星辰与全部管理功能。"
      badgeText="♡ OUR LITTLE WORLD"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 max-h-[72vh] overflow-y-auto pr-1">
        {/* 已直接登录提示 */}
        <div className="p-3.5 rounded-2xl bg-[#FFD1DC]/35 dark:bg-[#F6A9CD]/18 border border-[#F6A9CD]/55 text-[#7A234E] dark:text-[#FFE3EB] text-xs flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-[#F47FA9] fill-[#F47FA9] shrink-0" />
          <span>已直接进入双人完整体验态，所有增删改与互动功能均已开放。</span>
        </div>

        {/* 自定义纪念日与称谓设置 */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-serif-sc font-medium text-[var(--theme-text-primary)] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F47FA9]" />
            <span>专属纪念日与昵称设置</span>
          </h4>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] text-[var(--theme-text-secondary)]">
                相恋纪念日（用于首页计时）
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="romantic-input font-cinzel text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[var(--theme-text-secondary)]">TA 的昵称</label>
                <input
                  type="text"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  placeholder="如：宝贝"
                  className="romantic-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[var(--theme-text-secondary)]">我的昵称</label>
                <input
                  type="text"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  placeholder="如：先生"
                  className="romantic-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-shoujo-primary py-2.5 rounded-full text-xs font-serif-sc font-medium cursor-pointer flex items-center justify-center gap-1.5"
            >
              {settingsSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>设置已保存生效 ♡</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>保存专属纪念日与称谓</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 数据隐私说明 */}
        <div className="p-3.5 rounded-2xl bg-[var(--theme-surface-glass)] border border-[#F6A9CD]/40 text-xs text-[var(--theme-text-secondary)] space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[var(--theme-text-primary)] font-medium">
            <ShieldAlert className="w-4 h-4 text-[#F47FA9] shrink-0" />
            <span>本地存储与隐私说明</span>
          </div>
          <p>• 您上传的照片、日记与星辰回忆均仅保存在当前浏览器的本地存储中，不会上传到 GitHub 仓库或泄露给他人。</p>
        </div>
      </div>
    </RomanticModal>
  );
}
