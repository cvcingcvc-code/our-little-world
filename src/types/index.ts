/**
 * Our Little World - 核心数据结构与业务实体定义
 */

// 照片实体（可爱照片收藏馆）
export interface PhotoItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  tags?: string[];
  isPrivate: boolean; // 是否属于私密照片（需授权查看）
}

// 时间轴实体（恋爱时间轴）
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  content: string;
  location?: string;
  photos?: string[];
  mood?: string;
  tag?: string;
}

// 恋爱日记实体
export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  weather?: string;
  mood?: string;
  isPrivate: boolean; // 是否私密日记
  coverImage?: string;
}

// 纪念日实体
export interface Anniversary {
  id: string;
  title: string;
  date: string; // 初始日期 YYYY-MM-DD
  isRecurringYearly: boolean; // 是否每年循环提醒
  description?: string;
  icon?: string;
}

// 共同愿望清单实体
export interface WishItem {
  id: string;
  title: string;
  category: 'travel' | 'food' | 'life' | 'milestone' | 'other';
  status: 'todo' | 'completed';
  targetDate?: string;
  completedDate?: string;
  notes?: string;
}

// 网站基础配置接口
export interface SiteConfig {
  name: string;
  coupleNames: {
    partner1: string;
    partner2: string;
  };
  startDate: string; // 在一起的纪念日起点
  mainMotto: string;
  subMotto: string;
}

// 访问权限状态接口
export interface AuthState {
  isAuthenticated: boolean;
  role?: 'guest' | 'couple';
}
