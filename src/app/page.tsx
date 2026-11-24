import { siteConfig } from "@/config/site";
import { Heart, Sparkles, ShieldCheck, Compass, GitBranch, Layers } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/30 to-indigo-50/20 text-slate-700 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
        {/* 顶部标题区 */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/80 text-sky-800 border border-sky-200/50">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>私人恋爱纪念空间 · 基础架构已就绪</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-800">
            {siteConfig.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-light">
            {siteConfig.mainMotto}
          </p>
          <p className="text-xs sm:text-sm text-slate-400">
            {siteConfig.subMotto}
          </p>
        </div>

        {/* 核心规划模块预览清单 */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> 核心功能规划与模块骨架
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">恋爱首页与纪念日</p>
                <p className="text-xs text-slate-500">唯美冬日治愈氛围、相恋天数倒计时</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Compass className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">恋爱时间轴 & 愿望清单</p>
                <p className="text-xs text-slate-500">点滴足迹、心动时刻与共同奔赴的梦想</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Layers className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">照片收藏馆 & 恋爱日记</p>
                <p className="text-xs text-slate-500">拍立得/手账式画廊，温存文字记录</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-slate-800">私人访问权限保护</p>
                <p className="text-xs text-slate-500">私密相册与日记密码校验与防泄露</p>
              </div>
            </div>
          </div>
        </div>

        {/* 状态说明与部署信息 */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            <span>GitHub 仓库已连接: cvcingcvc-code/our-little-world</span>
          </div>
          <span className="text-slate-400">Vercel Ready</span>
        </div>
      </div>
    </main>
  );
}
