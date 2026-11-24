"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Lock, Unlock, KeyRound, Sparkles, X, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, login, logout } = useApp();
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!passcode.trim()) {
      setErrorMsg("请输入专属访问口令");
      return;
    }

    const ok = login(passcode);
    if (ok) {
      setSuccessMsg("专属认证成功！已解锁全部私密回忆与记录权限。");
      setTimeout(() => {
        setPasscode("");
        setSuccessMsg("");
        onClose();
      }, 1000);
    } else {
      setErrorMsg("口令不正确，仅专属两人可解锁。默认口令为 love2024");
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-sky-500/20 border border-white/10 text-rose-300">
            {isAuthenticated ? (
              <Unlock className="w-6 h-6 text-emerald-400" />
            ) : (
              <Lock className="w-6 h-6 text-rose-400" />
            )}
          </div>
          <h2 className="text-xl font-medium tracking-tight text-white">
            {isAuthenticated ? "双人专属模式 · 已解锁" : "私人访问权限验证"}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isAuthenticated
              ? "当前拥有最高回忆管理权限，可查看所有私密照片、日记并进行增删改。"
              : "输入专属恋爱口令以解锁私密回忆；未解锁时仅展示公开示例与脱敏内容。"}
          </p>
        </div>

        {isAuthenticated ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                您目前处于专属双人模式。所有真实照片、礼物、愿望清单与日记已全部同步。
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-sm font-medium text-rose-300 hover:text-rose-200 transition cursor-pointer"
            >
              退出专属登录（切回公开访客模式）
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <KeyRound className="w-3.5 h-3.5 text-sky-400" /> 专属访问口令
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="输入专属口令 (默认: love2024)"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-rose-400/80 focus:outline-none text-sm text-white placeholder-slate-500 transition"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-sm font-medium text-white shadow-lg shadow-rose-500/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> 解锁我们的小世界
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-500">
                提示：可在 Vercel 环境变量中设置 NEXT_PUBLIC_SITE_PASSCODE
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
