# Our Little World（我们的小世界）❄️

> **冬天很冷，幸好有你。**  
> **想把与你有关的每一个瞬间，都偷偷收藏。**

一个专注于记录恋爱点滴、温存回忆与未来愿望的私人纪念网站。  
采用现代、轻量、高可维护的技术架构，完美契合 Vercel 持续自动化部署，兼顾手机与桌面端体验。

---

## 🌟 核心功能规划

- **恋爱首页 (Home)**：沉浸式情绪氛围主视觉、相恋时间记录、纪念日提醒
- **可爱照片收藏馆 (Gallery)**：精致拍立得/手账式画廊，支持照片细腻展开与多维回忆标签
- **恋爱时间轴 (Timeline)**：以时间流的形式记录一路走来的心动瞬间与成长轨迹
- **恋爱日记 (Diary)**：细腻温柔的心情文字、天气与生活琐碎记录
- **纪念日管理 (Anniversaries)**：专属纪念日倒数与整年循环提醒
- **共同愿望清单 (Wishlist)**：记录两个人共同奔赴的梦想清单与点亮状态
- **私人访问权限控制 (Security & Privacy)**：
  - 私密日记与照片安全鉴权防护
  - 真实照片物理隔离，绝不上载至公开 Git 仓库

---

## 🛠️ 技术选型

- **框架**：[Next.js](https://nextjs.org/) (App Router, React 19)
- **开发语言**：TypeScript
- **样式与动效**：Tailwind CSS + 硬件加速轻量 CSS 动效（支持一键降级与节电）
- **图标库**：Lucide React
- **部署平台**：Vercel（连接 GitHub 自动触发 CI/CD 构建）

---

## 📂 项目结构规范

```text
our-little-world/
├── public/                 # 公共静态资源与占位素材
├── src/
│   ├── app/                # App Router 路由页面及布局
│   │   ├── layout.tsx      # 全局根布局
│   │   ├── page.tsx        # 首页入口
│   │   └── globals.css     # 全局样式与主题变量
│   ├── config/             # 网站站点元信息及文案配置
│   ├── data/               # 本地模型骨架与示例结构
│   ├── lib/                # 工具函数与密码鉴权模块
│   └── types/              # TypeScript 核心业务实体类型定义
├── .env.example            # 环境变量配置模板
├── .gitignore              # 严格隔离真实敏感照片与环境变量
├── PROJECT_STATUS.md       # 项目实施进度与阶段追踪
└── README.md
```

---

## 🔒 隐私与安全规范

1. **真实照片不上传 GitHub**：`.gitignore` 已严密配置 `/public/photos/private/` 与 `/public/uploads/` 等规则，防止误提交。
2. **访问口令保护**：私密日记与照片需输入专属访问密码后方可解密展示。
3. **敏感凭证防泄露**：所有访问 Token 与密钥严格通过环境变量注入，不在代码中硬编码。

---

## 🚀 本地开发指南

```bash
# 1. 安装依赖
npm install

# 2. 复制环境配置
cp .env.example .env.local

# 3. 启动本地开发服务
npm run dev

# 4. 浏览器访问
http://localhost:3000
```

---

## 🌐 Vercel 自动化部署

1. 登录 [Vercel](https://vercel.com)。
2. 点击 **Add New...** -> **Project**，导入 GitHub 仓库 `cvcingcvc-code/our-little-world`。
3. 在 **Environment Variables** 中设置 `NEXT_PUBLIC_SITE_PASSCODE`（访问口令）。
4. 点击 **Deploy**，后续每一次向 `main` 分支推送代码，Vercel 均会自动触发秒级构建上线。
