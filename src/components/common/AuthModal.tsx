"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Lock,
  Unlock,
  KeyRound,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { getActiveSiteConfig, saveActiveSiteStartDate, saveActiveCoupleNames } from "@/config/site";
import RomanticModal, { RomanticErrorTip } from "./RomanticModal";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, login, logout, triggerRefresh } = useApp();
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!passcode.trim()) {
      setErrorMsg("请先输入专属访问暗号口令 ♡");
      return;
    }

    const ok = login(passcode);
    if (ok) {
      setSuccessMsg("专属认证成功！已解锁完整记录与管理权限。");
      setTimeout(() => {
        setPasscode("");
        setSuccessMsg("");
        onClose();
      }, 900);
    } else {
      setErrorMsg("口令不正确哦，默认演示口令为 love2024");
    }
  };

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
      title={isAuthenticated ? "双人专属模式 · 已激活" : "访问控制与纪念设置"}
      subtitle="当前阶段为本地安全存储演示版本，您的数据仅保存在当前设备中。"
      badgeText={isAuthenticated ? "♡ UNLOCKED" : "🔒 PRIVATE SPACE"}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 max-h-[72vh] overflow-y-auto pr-1">
        {/* 隐私说明 */}
        <div className="p-3.5 rounded-2xl bg-[var(--theme-surface-glass)] border border-[#F6A9CD]/40 text-xs text-[var(--theme-text-secondary)] space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[var(--theme-text-primary)] font-medium">
            <ShieldAlert className="w-4 h-4 text-[#F47FA9] shrink-0" />
            <span>数据存储与隐私保护提示</span>
          </div>
          <p>• 当前照片与记录均保存在本地浏览器（IndexedDB / LocalStorage），不会上传到公网。</p>
          <p>• 演示预览期间请勿将极度隐私的个人文件公开托管。</p>
        </div>

        {/* 解锁区域 */}
        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-700 dark:text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-300 shrink-0" />
              <span>专属管理权限已就绪，可自由增删真实照片、礼物与心愿。</span>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full btn-shoujo-glass py-2.5 rounded-full text-xs font-serif-sc cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-[#F47FA9]" />
              <span>退出专属管理（切回访客模式）</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} noValidate className="space-y-3">
            <RomanticErrorTip message={errorMsg} />

            <div className="space-y-1.5">
              <label className="text-xs text-[var(--theme-text-secondary)] flex items-center gap-1.5 font-serif-sc font-medium">
                <KeyRound className="w-3.5 h-3.5 text-[#F47FA9]" />
                <span>专属解锁口令</span>
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="默认演示口令: love2024"
                className="romantic-input"
              />
            </div>

            {successMsg && (
              <p className="text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {successMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full btn-shoujo-primary py-2.5 rounded-full text-xs font-serif-sc font-medium cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>解锁专属空间</span>
            </button>
          </form>
        )}

        {/* 自定义信息设置 */}
        <div className="pt-4 border-t border-[#F6A9CD]/30 space-y-3.5">
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
              className="w-full btn-shoujo-glass py-2.5 rounded-full text-xs font-serif-sc cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F47FA9]" />
              <span>{settingsSaved ? "设置已生效 ♡" : "保存专属纪念日与称谓"}</span>
            </button>
          </form>
        </div>
      </div>
    </RomanticModal>
  );
}
