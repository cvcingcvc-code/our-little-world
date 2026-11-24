"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Lock,
  Unlock,
  KeyRound,
  Sparkles,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";
import { getActiveSiteConfig, saveActiveSiteStartDate, saveActiveCoupleNames } from "@/config/site";

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

  // 自定义信息设置
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

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!passcode.trim()) {
      setErrorMsg("请输入访问暗号口令");
      return;
    }

    const ok = login(passcode);
    if (ok) {
      setSuccessMsg("专属认证成功！已解锁本设备完整记录与管理权限。");
      setTimeout(() => {
        setPasscode("");
        setSuccessMsg("");
        onClose();
      }, 1000);
    } else {
      setErrorMsg("口令不正确。默认演示口令为 love2024");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer border-none bg-transparent"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 顶部标题区 */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-sky-500/20 border border-white/10 text-rose-300">
            {isAuthenticated ? (
              <Unlock className="w-6 h-6 text-emerald-400" />
            ) : (
              <Lock className="w-6 h-6 text-rose-400" />
            )}
          </div>
          <h2 className="text-xl font-serif font-medium tracking-tight text-white">
            {isAuthenticated ? "双人专属模式 · 已激活" : "访问控制与个人信息设置"}
          </h2>
          <span className="text-[11px] px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 inline-flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>当前阶段：本地安全存储 · 演示预览版本</span>
          </span>
        </div>

        {/* 隐私透明说明栏 */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 space-y-1.5 font-light leading-relaxed">
          <div className="flex items-center gap-1.5 text-slate-200 font-medium">
            <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
            <span>数据存储与跨设备机制告知</span>
          </div>
          <p>
            • <strong>单设备本地存储</strong>：当前上传的照片与真实记录均加密保存在您当前浏览器的本地持久化存储（IndexedDB / LocalStorage）中，不会跨设备或同步给其他外人。
          </p>
          <p>
            • <strong>保护隐私安全</strong>：在后续真正接入安全服务端数据库与私人加密云存储之前，严禁将极其绝密的个人隐私信息暴露在公网。
          </p>
        </div>

        {/* 密码解锁区域 */}
        <div className="space-y-4 pt-1">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>专属管理权限已就绪，可自由增删真实照片、礼物与心愿。</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-rose-300 border border-slate-700 transition cursor-pointer"
              >
                退出专属管理（切回访客演示状态）
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                  <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                  <span>专属解锁口令</span>
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="默认演示口令: love2024"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {errorMsg}
                </p>
              )}

              {successMsg && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {successMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 text-xs font-medium text-white shadow-md hover:from-rose-600 hover:to-indigo-700 transition cursor-pointer flex items-center justify-center gap-2 border-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>解锁专属空间</span>
              </button>
            </form>
          )}
        </div>

        {/* 自定义真实信息配置区 */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>专属纪念日与昵称设置</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">相恋纪念日（用于首页计时）</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">TA 的专属昵称</label>
                <input
                  type="text"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  placeholder="如：宝贝 / 昵称"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">我的专属昵称</label>
                <input
                  type="text"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  placeholder="如：先生 / 昵称"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settingsSaved ? "设置已生效！" : "保存专属纪念日与称谓"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
