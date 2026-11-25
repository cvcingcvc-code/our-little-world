"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import ExhibitionCover from "@/components/common/ExhibitionCover";
import { TimeCapsule } from "@/types";
import { getTimeCapsules, saveTimeCapsule } from "@/lib/storage";
import {
  Mail,
  Plus,
  Lock,
  Unlock,
  Calendar,
  Hourglass,
  Sparkles,
  X,
  Send,
  Eye,
  EyeOff,
} from "lucide-react";

export default function TimeCapsuleView() {
  const { isAuthenticated, refreshKey, triggerRefresh } = useApp();
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);

  // 模态框与表单
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);

  const [sender, setSender] = useState("我");
  const [recipient, setRecipient] = useState("TA");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [unlockAt, setUnlockAt] = useState("");

  useEffect(() => {
    setCapsules(getTimeCapsules(isAuthenticated));
  }, [isAuthenticated, refreshKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !unlockAt) {
      alert("请完整填写信件标题、内容与未来解锁时间");
      return;
    }

    saveTimeCapsule({
      sender,
      recipient,
      title: title.trim(),
      content: content.trim(),
      writtenAt: new Date().toISOString().split("T")[0],
      unlockAt: `${unlockAt}T00:00:00`,
      isPrivate: false,
    });

    setTitle("");
    setContent("");
    setUnlockAt("");
    setModalOpen(false);
    triggerRefresh();
  };

  const getRemainingDays = (unlockDateStr: string) => {
    const diff = new Date(unlockDateStr).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* 4K 动漫主题画报封面 + 全屏沉浸柔焦背景 */}
      <ExhibitionCover
        coverImage="/winter-hero-hd.jpg"
        badge="✉️ 慢递情书 · TIME CAPSULE"
        englishTag="CHAPTER 09 // LETTERS TO FUTURE"
        title="给未来的慢速情书"
        subtitle="写下一封信投递给未来的彼此，设置解锁之期。未到解封时刻，信件将严格封存保密。"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="btn-shoujo-primary px-6 py-2.5 rounded-full text-xs font-serif-sc font-medium tracking-wider cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>撰写未来信件</span>
          </button>
        }
      />

      {/* 信件网格卡片 */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {capsules.map((capsule) => {
          const isLocked = capsule.isSealed;
          const remain = getRemainingDays(capsule.unlockAt);

          return (
            <div
              key={capsule.id}
              onClick={() => setSelectedCapsule(capsule)}
              className={`p-6 sm:p-7 rounded-3xl border transition duration-300 flex flex-col justify-between space-y-4 cursor-pointer relative overflow-hidden ${
                isLocked
                  ? "bg-slate-900/60 border-indigo-500/30 text-white shadow-xl hover:border-indigo-400"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg"
              }`}
            >
              {/* 信件顶部火漆印章 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-medium ${
                      isLocked
                        ? "bg-indigo-950/80 text-indigo-300 border border-indigo-500/40"
                        : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300"
                    }`}
                  >
                    {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-light">
                      从 {capsule.sender} 寄往 {capsule.recipient}
                    </span>
                    <span className="text-[11px] text-slate-400/80">
                      撰写于 {capsule.writtenAt}
                    </span>
                  </div>
                </div>

                {isLocked ? (
                  <span className="text-[11px] px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1 font-mono">
                    <Hourglass className="w-3 h-3 animate-spin" />
                    <span>倒计时 {remain} 天</span>
                  </span>
                ) : (
                  <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
                    已解封可读 ✨
                  </span>
                )}
              </div>

              {/* 标题与信封正文遮蔽 */}
              <div className="space-y-2 py-2">
                <h3 className="font-serif text-lg font-medium tracking-tight">
                  {capsule.title}
                </h3>

                {isLocked ? (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200/70 text-xs font-light leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>信件正处于时光封印中</span>
                    </div>
                    <p className="filter blur-[3px] select-none text-[11px]">
                      这里封存着写信时最真挚滚烫的承诺与小心愿，将在指定日期来临时揭开面纱……
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed line-clamp-3">
                    {capsule.content}
                  </p>
                )}
              </div>

              {/* 解锁日期底栏 */}
              <div className="pt-3 border-t border-slate-200/40 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>指定解封日：{capsule.unlockAt.split("T")[0]}</span>
                </span>
                <span className="text-indigo-400 text-xs font-medium">
                  {isLocked ? "查看封印信息" : "完整展开信纸 →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 信件详情弹窗 */}
      {selectedCapsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-2xl">
            <button
              onClick={() => setSelectedCapsule(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-slate-800 pb-3">
              <span className="text-xs text-indigo-400 font-mono">
                投递时间：{selectedCapsule.writtenAt}
              </span>
              <h3 className="text-xl font-serif font-light">{selectedCapsule.title}</h3>
              <p className="text-xs text-slate-400">
                寄信人：{selectedCapsule.sender} ➔ 收信人：{selectedCapsule.recipient}
              </p>
            </div>

            {selectedCapsule.isSealed ? (
              <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-3">
                <Lock className="w-8 h-8 mx-auto text-indigo-400" />
                <h4 className="text-sm font-medium text-indigo-200">此情书受时光封印保护</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  信件将在{" "}
                  <span className="text-indigo-300 font-mono font-medium">
                    {selectedCapsule.unlockAt.split("T")[0]}
                  </span>{" "}
                  当天自动解封。在此之前，服务端与界面严格锁定，保护属于未来的惊喜。
                </p>
                <div className="pt-2">
                  <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-400/30">
                    距离开启还剩约 {getRemainingDays(selectedCapsule.unlockAt)} 天
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-sm font-light leading-relaxed whitespace-pre-wrap text-slate-200">
                  {selectedCapsule.content}
                </div>
                <p className="text-[11px] text-right text-slate-400">
                  信封解印于：{selectedCapsule.unlockAt.split("T")[0]}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 撰写未来信件模态框 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                写一封给未来的信
              </h3>
              <p className="text-xs text-slate-500">
                封存现在的温柔誓言，设置一个未来特殊的日子开启。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    寄信人
                  </label>
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    收信人
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  信件标题 *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="如：写给一周年相恋纪念日你的密信"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  设置解封日期 *
                </label>
                <input
                  type="date"
                  required
                  value={unlockAt}
                  onChange={(e) => setUnlockAt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  信件正文 *
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="亲爱的，当你解锁这封信的时候，说明我们已经走过了漫长的岁月..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-xs font-medium text-white shadow-md transition cursor-pointer"
                >
                  投入时光信箱 📮
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
