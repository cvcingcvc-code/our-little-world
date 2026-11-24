/**
 * Our Little World - 核心数据结构与业务实体定义
 */

// 1. 照片收藏馆实体
export interface PhotoItem {
  id: string;
  title: string;
  date: string;
  category: 'dating' | 'snapshot' | 'daily' | 'travel' | 'funny';
  location?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
  story?: string; // 照片背后的专属故事
  tags: string[];
  isFavorite: boolean; // 是否收藏
  isPrivate: boolean; // 是否私密
  createdAt: number;
}

// 2. 美食日记实体
export interface FoodRecord {
  id: string;
  restaurant: string;
  date: string;
  location: string;
  dishes: string[];
  rating: number; // 1-5星
  price?: number;
  imageUrl?: string;
  review: string; // 个人评价
  story?: string; // 相关的甜蜜故事
  isWishlist: boolean; // 是否是未来想吃清单
  isPrivate: boolean;
  createdAt: number;
}

// 3. 礼物与惊喜博物馆实体
export interface GiftRecord {
  id: string;
  name: string;
  giver: 'partner1' | 'partner2'; // 赠送者
  date: string;
  type: 'gift' | 'flower' | 'letter' | 'handcraft' | 'surprise';
  imageUrl?: string;
  story: string; // 礼物背后的故事
  mood: string; // 当时收到/赠送的心情
  isPrivate: boolean;
  createdAt: number;
}

// 4. 我们的100件小事（愿望清单）实体
export interface WishItem {
  id: string;
  title: string;
  category: 'romantic' | 'travel' | 'food' | 'daily' | 'challenge' | 'milestone';
  status: 'todo' | 'in_progress' | 'completed';
  targetDate?: string;
  completedDate?: string;
  completionPhoto?: string;
  reflection?: string; // 完成后的回忆描述
  isPrivate: boolean;
  createdAt: number;
}

// 5. 恋爱日记实体
export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'starry';
  mood: 'happy' | 'touched' | 'miss_you' | 'peaceful' | 'sweet';
  reasonILoveYou?: string; // 喜欢你的理由
  whisperToYou?: string; // 悄悄对你说的话
  photos?: string[];
  isPrivate: boolean;
  createdAt: number;
}

// 6. 专属恋爱星空（回忆之星）实体
export interface StarMemory {
  id: string;
  title: string;
  date: string;
  story: string;
  imageUrl?: string;
  x: number; // 星空中的相对横坐标百分比 (0-100)
  y: number; // 相对纵坐标百分比 (0-100)
  size: number; // 星星大小 (1-3)
  color: string; // 星星主色调
  type: 'memory' | 'milestone' | 'promise' | 'food' | 'travel';
  isPrivate: boolean;
}

// 7. 恋爱成就系统实体
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'days' | 'gallery' | 'food' | 'gifts' | 'wishes' | 'diary';
  icon: string;
  conditionDescription: string;
  currentValue: number;
  targetValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

// 8. 时光信箱实体
export interface TimeCapsule {
  id: string;
  sender: string; // 发信人昵称
  recipient: string; // 收信人昵称
  title: string;
  content: string;
  writtenAt: string; // 撰写时间
  unlockAt: string; // 解锁时间 (YYYY-MM-DDTHH:mm:ss)
  isSealed: boolean; // 是否处于封印状态（服务端与客户端安全隐藏）
  imageUrl?: string;
  isPrivate: boolean;
}

// 9. 双人互动状态实体
export interface InteractiveState {
  missCountPartner1: number; // partner1 累计想你次数
  missCountPartner2: number; // partner2 累计想你次数
  todayMissed: boolean;
  notes: SecretNote[];
  randomDates: RandomDateIdea[];
}

export interface SecretNote {
  id: string;
  author: string;
  content: string;
  color: string;
  date: string;
  isRead: boolean;
}

export interface RandomDateIdea {
  id: string;
  title: string;
  description: string;
  tag: string;
}

// 10. 纪念日实体
export interface Anniversary {
  id: string;
  title: string;
  date: string;
  isRecurringYearly: boolean;
  icon?: string;
  description?: string;
}

// 聚合时间轴事件
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'photo' | 'food' | 'gift' | 'wish' | 'anniversary' | 'diary' | 'milestone';
  sourceId?: string;
  imageUrl?: string;
  tag?: string;
}

// 网站核心配置
export interface SiteConfig {
  name: string;
  coupleNames: {
    partner1: string;
    partner2: string;
  };
  startDate: string; // 恋爱起点
  mainMotto: string;
  subMotto: string;
  bgmTitle: string;
  bgmArtist: string;
}

// 用户认证状态
export interface AuthState {
  isAuthenticated: boolean;
  role: 'guest' | 'couple';
  token?: string;
  loginTime?: number;
}
