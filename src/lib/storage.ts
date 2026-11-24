/**
 * Our Little World - 核心数据持久化与业务逻辑服务
 * 坚持真实性原则：不预设虚构恋爱经历与假照片
 * 支持单机持久化存储，并预留云端数据库与图床对接接口
 */

import {
  PhotoItem,
  FoodRecord,
  GiftRecord,
  WishItem,
  DiaryEntry,
  StarMemory,
  TimeCapsule,
  Anniversary,
  SecretNote,
  RandomDateIdea,
  Achievement,
  TimelineEvent,
} from "@/types";
import {
  initialPhotos,
  initialFoodRecords,
  initialGiftRecords,
  initialWishTemplates,
  initialDiaries,
  initialStarMemories,
  initialTimeCapsules,
  initialAnniversaries,
  initialNotes,
  defaultRandomDates,
} from "@/data/mockData";
import { getActiveSiteConfig } from "@/config/site";

const STORAGE_KEYS = {
  PHOTOS: "olw_store_photos_v2",
  FOOD: "olw_store_food_v2",
  GIFTS: "olw_store_gifts_v2",
  WISHES: "olw_store_wishes_v2",
  DIARIES: "olw_store_diaries_v2",
  STARS: "olw_store_stars_v2",
  CAPSULES: "olw_store_capsules_v2",
  ANNIVERSARIES: "olw_store_anniversaries_v2",
  NOTES: "olw_store_notes_v2",
  MISS_COUNT: "olw_store_miss_count_v2",
};

// 安全读取本地存储
function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
    return fallback;
  }
}

// 安全保存本地存储
function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key}:`, e);
  }
}

// ==================== 1. 照片收藏馆 ====================
export function getPhotos(isAuthenticated = false): PhotoItem[] {
  const all = safeGetItem<PhotoItem[]>(STORAGE_KEYS.PHOTOS, initialPhotos);
  if (isAuthenticated) return all;
  return all.filter((p) => !p.isPrivate);
}

export function savePhoto(photo: Omit<PhotoItem, "id" | "createdAt"> & { id?: string }): PhotoItem {
  const current = getPhotos(true);
  const now = Date.now();
  if (photo.id) {
    const updated = current.map((p) => (p.id === photo.id ? { ...p, ...photo } : p));
    safeSetItem(STORAGE_KEYS.PHOTOS, updated);
    return { ...photo, id: photo.id, createdAt: now } as PhotoItem;
  }
  const newPhoto: PhotoItem = {
    ...photo,
    id: `photo-${now}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
  };
  const updated = [newPhoto, ...current];
  safeSetItem(STORAGE_KEYS.PHOTOS, updated);
  return newPhoto;
}

export function deletePhoto(id: string): void {
  const current = getPhotos(true);
  safeSetItem(STORAGE_KEYS.PHOTOS, current.filter((p) => p.id !== id));
}

export function togglePhotoFavorite(id: string): boolean {
  const current = getPhotos(true);
  let nextState = false;
  const updated = current.map((p) => {
    if (p.id === id) {
      nextState = !p.isFavorite;
      return { ...p, isFavorite: nextState };
    }
    return p;
  });
  safeSetItem(STORAGE_KEYS.PHOTOS, updated);
  return nextState;
}

// ==================== 2. 美食日记 ====================
export function getFoodRecords(isAuthenticated = false): FoodRecord[] {
  const all = safeGetItem<FoodRecord[]>(STORAGE_KEYS.FOOD, initialFoodRecords);
  if (isAuthenticated) return all;
  return all.filter((f) => !f.isPrivate);
}

export function saveFoodRecord(food: Omit<FoodRecord, "id" | "createdAt"> & { id?: string }): FoodRecord {
  const current = getFoodRecords(true);
  const now = Date.now();
  if (food.id) {
    const updated = current.map((f) => (f.id === food.id ? { ...f, ...food } : f));
    safeSetItem(STORAGE_KEYS.FOOD, updated);
    return { ...food, id: food.id, createdAt: now } as FoodRecord;
  }
  const newFood: FoodRecord = {
    ...food,
    id: `food-${now}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
  };
  const updated = [newFood, ...current];
  safeSetItem(STORAGE_KEYS.FOOD, updated);
  return newFood;
}

export function deleteFoodRecord(id: string): void {
  const current = getFoodRecords(true);
  safeSetItem(STORAGE_KEYS.FOOD, current.filter((f) => f.id !== id));
}

export function toggleFoodWishlist(id: string): void {
  const current = getFoodRecords(true);
  const updated = current.map((f) => (f.id === id ? { ...f, isWishlist: !f.isWishlist } : f));
  safeSetItem(STORAGE_KEYS.FOOD, updated);
}

// ==================== 3. 礼物与惊喜博物馆 ====================
export function getGiftRecords(isAuthenticated = false): GiftRecord[] {
  const all = safeGetItem<GiftRecord[]>(STORAGE_KEYS.GIFTS, initialGiftRecords);
  if (isAuthenticated) return all;
  return all.filter((g) => !g.isPrivate);
}

export function saveGiftRecord(gift: Omit<GiftRecord, "id" | "createdAt"> & { id?: string }): GiftRecord {
  const current = getGiftRecords(true);
  const now = Date.now();
  if (gift.id) {
    const updated = current.map((g) => (g.id === gift.id ? { ...g, ...gift } : g));
    safeSetItem(STORAGE_KEYS.GIFTS, updated);
    return { ...gift, id: gift.id, createdAt: now } as GiftRecord;
  }
  const newGift: GiftRecord = {
    ...gift,
    id: `gift-${now}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
  };
  const updated = [newGift, ...current];
  safeSetItem(STORAGE_KEYS.GIFTS, updated);
  return newGift;
}

export function deleteGiftRecord(id: string): void {
  const current = getGiftRecords(true);
  safeSetItem(STORAGE_KEYS.GIFTS, current.filter((g) => g.id !== id));
}

// ==================== 4. 100件小事 ====================
export function getWishItems(isAuthenticated = false): WishItem[] {
  const all = safeGetItem<WishItem[]>(STORAGE_KEYS.WISHES, initialWishTemplates);
  if (isAuthenticated) return all;
  return all.filter((w) => !w.isPrivate);
}

export function saveWishItem(wish: Omit<WishItem, "id" | "createdAt"> & { id?: string }): WishItem {
  const current = getWishItems(true);
  const now = Date.now();
  if (wish.id) {
    const updated = current.map((w) => (w.id === wish.id ? { ...w, ...wish } : w));
    safeSetItem(STORAGE_KEYS.WISHES, updated);
    return { ...wish, id: wish.id, createdAt: now } as WishItem;
  }
  const newWish: WishItem = {
    ...wish,
    id: `wish-${now}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
  };
  const updated = [newWish, ...current];
  safeSetItem(STORAGE_KEYS.WISHES, updated);
  return newWish;
}

export function updateWishStatus(
  id: string,
  status: 'todo' | 'in_progress' | 'completed',
  extra?: { completedDate?: string; completionPhoto?: string; reflection?: string }
): void {
  const current = getWishItems(true);
  const updated = current.map((w) => {
    if (w.id === id) {
      return {
        ...w,
        status,
        ...(status === "completed" ? { completedDate: extra?.completedDate || new Date().toISOString().split("T")[0] } : {}),
        ...(extra?.completionPhoto ? { completionPhoto: extra.completionPhoto } : {}),
        ...(extra?.reflection ? { reflection: extra.reflection } : {}),
      };
    }
    return w;
  });
  safeSetItem(STORAGE_KEYS.WISHES, updated);
}

export function deleteWishItem(id: string): void {
  const current = getWishItems(true);
  safeSetItem(STORAGE_KEYS.WISHES, current.filter((w) => w.id !== id));
}

// ==================== 5. 恋爱日记 ====================
export function getDiaries(isAuthenticated = false): DiaryEntry[] {
  const all = safeGetItem<DiaryEntry[]>(STORAGE_KEYS.DIARIES, initialDiaries);
  if (isAuthenticated) return all;
  return all.filter((d) => !d.isPrivate);
}

export function saveDiary(diary: Omit<DiaryEntry, "id" | "createdAt"> & { id?: string }): DiaryEntry {
  const current = getDiaries(true);
  const now = Date.now();
  if (diary.id) {
    const updated = current.map((d) => (d.id === diary.id ? { ...d, ...diary } : d));
    safeSetItem(STORAGE_KEYS.DIARIES, updated);
    return { ...diary, id: diary.id, createdAt: now } as DiaryEntry;
  }
  const newDiary: DiaryEntry = {
    ...diary,
    id: `diary-${now}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
  };
  const updated = [newDiary, ...current];
  safeSetItem(STORAGE_KEYS.DIARIES, updated);
  return newDiary;
}

export function deleteDiary(id: string): void {
  const current = getDiaries(true);
  safeSetItem(STORAGE_KEYS.DIARIES, current.filter((d) => d.id !== id));
}

// ==================== 6. 专属恋爱星空 ====================
export function getStarMemories(isAuthenticated = false): StarMemory[] {
  const all = safeGetItem<StarMemory[]>(STORAGE_KEYS.STARS, initialStarMemories);
  if (isAuthenticated) return all;
  return all.filter((s) => !s.isPrivate);
}

export function saveStarMemory(star: Omit<StarMemory, "id"> & { id?: string }): StarMemory {
  const current = getStarMemories(true);
  if (star.id) {
    const updated = current.map((s) => (s.id === star.id ? { ...s, ...star } : s));
    safeSetItem(STORAGE_KEYS.STARS, updated);
    return star as StarMemory;
  }
  const newStar: StarMemory = {
    ...star,
    id: `star-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };
  const updated = [...current, newStar];
  safeSetItem(STORAGE_KEYS.STARS, updated);
  return newStar;
}

export function deleteStarMemory(id: string): void {
  const current = getStarMemories(true);
  safeSetItem(STORAGE_KEYS.STARS, current.filter((s) => s.id !== id));
}

// ==================== 7. 时光信箱 ====================
export function getTimeCapsules(isAuthenticated = false): TimeCapsule[] {
  const all = safeGetItem<TimeCapsule[]>(STORAGE_KEYS.CAPSULES, initialTimeCapsules);
  return all
    .filter((c) => (isAuthenticated ? true : !c.isPrivate))
    .map((c) => {
      const isPast = new Date(c.unlockAt).getTime() <= new Date().getTime();
      return {
        ...c,
        isSealed: !isPast,
      };
    });
}

export function saveTimeCapsule(capsule: Omit<TimeCapsule, "id" | "isSealed"> & { id?: string }): TimeCapsule {
  const current = safeGetItem<TimeCapsule[]>(STORAGE_KEYS.CAPSULES, initialTimeCapsules);
  const isPast = new Date(capsule.unlockAt).getTime() <= new Date().getTime();
  const fullCapsule: TimeCapsule = {
    ...capsule,
    id: capsule.id || `capsule-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    isSealed: !isPast,
  };
  if (capsule.id) {
    const updated = current.map((c) => (c.id === capsule.id ? fullCapsule : c));
    safeSetItem(STORAGE_KEYS.CAPSULES, updated);
  } else {
    safeSetItem(STORAGE_KEYS.CAPSULES, [fullCapsule, ...current]);
  }
  return fullCapsule;
}

// ==================== 8. 双人互动状态 ====================
export function getInteractiveState(): {
  missCountPartner1: number;
  missCountPartner2: number;
  notes: SecretNote[];
  randomDates: RandomDateIdea[];
} {
  const miss = safeGetItem<{ p1: number; p2: number }>(STORAGE_KEYS.MISS_COUNT, { p1: 0, p2: 0 });
  const notes = safeGetItem<SecretNote[]>(STORAGE_KEYS.NOTES, initialNotes);
  return {
    missCountPartner1: miss.p1,
    missCountPartner2: miss.p2,
    notes,
    randomDates: defaultRandomDates,
  };
}

export function addMissCount(partner: 'partner1' | 'partner2'): { p1: number; p2: number } {
  const miss = safeGetItem<{ p1: number; p2: number }>(STORAGE_KEYS.MISS_COUNT, { p1: 0, p2: 0 });
  if (partner === 'partner1') miss.p1 += 1;
  else miss.p2 += 1;
  safeSetItem(STORAGE_KEYS.MISS_COUNT, miss);
  return miss;
}

export function addSecretNote(author: string, content: string, color?: string): SecretNote {
  const current = safeGetItem<SecretNote[]>(STORAGE_KEYS.NOTES, initialNotes);
  const newNote: SecretNote = {
    id: `note-${Date.now()}`,
    author,
    content,
    color: color || "from-rose-50 to-pink-100 border-rose-200 text-rose-800",
    date: new Date().toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    isRead: false,
  };
  const updated = [newNote, ...current];
  safeSetItem(STORAGE_KEYS.NOTES, updated);
  return newNote;
}

// ==================== 9. 真实成就计算引擎 ====================
export function calculateAchievements(isAuthenticated = false): Achievement[] {
  const photos = getPhotos(isAuthenticated);
  const foods = getFoodRecords(isAuthenticated);
  const gifts = getGiftRecords(isAuthenticated);
  const wishes = getWishItems(isAuthenticated);
  const diaries = getDiaries(isAuthenticated);

  const cfg = getActiveSiteConfig();
  let diffDays = 0;
  if (cfg.startDate) {
    const start = new Date(cfg.startDate).getTime();
    if (!isNaN(start) && Date.now() >= start) {
      diffDays = Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
    }
  }

  const completedWishesCount = wishes.filter((w) => w.status === "completed").length;
  const wishFoodsCount = foods.filter((f) => !f.isWishlist).length;

  const definitions: Omit<Achievement, "currentValue" | "isUnlocked">[] = [
    {
      id: "ach-1",
      title: "相恋启程",
      description: "在小世界中记录下你们相恋的起点",
      category: "days",
      icon: "HeartHandshake",
      conditionDescription: "设定恋爱纪念日起点",
      targetValue: 1,
    },
    {
      id: "ach-2",
      title: "百日相伴",
      description: "走过彼此陪伴的第一个一百天",
      category: "days",
      icon: "CalendarHeart",
      conditionDescription: "相恋天数达到 100 天",
      targetValue: 100,
    },
    {
      id: "ach-3",
      title: "携手四季",
      description: "看遍春夏秋冬，一整年的温柔陪伴",
      category: "days",
      icon: "Crown",
      conditionDescription: "相恋天数达到 365 天",
      targetValue: 365,
    },
    {
      id: "ach-4",
      title: "初次定格",
      description: "在可爱相册馆收藏第一张真实回忆合影",
      category: "gallery",
      icon: "Camera",
      conditionDescription: "上传并保存至少 1 张真实照片",
      targetValue: 1,
    },
    {
      id: "ach-5",
      title: "光影胶片室",
      description: "点滴累积，记录 5 个精彩瞬间",
      category: "gallery",
      icon: "Film",
      conditionDescription: "保存至少 5 张回忆照片",
      targetValue: 5,
    },
    {
      id: "ach-6",
      title: "美食搭子",
      description: "一同探店并打卡 3 家美味餐厅",
      category: "food",
      icon: "UtensilsCrossed",
      conditionDescription: "记录至少 3 顿美食",
      targetValue: 3,
    },
    {
      id: "ach-7",
      title: "心动礼物收藏家",
      description: "用心记录彼此赠予的温暖礼物或手写信",
      category: "gifts",
      icon: "Gift",
      conditionDescription: "记录至少 2 份心意物品",
      targetValue: 2,
    },
    {
      id: "ach-8",
      title: "心愿奔赴者",
      description: "携手打卡完成第 1 项共同愿望",
      category: "wishes",
      icon: "Sparkles",
      conditionDescription: "完成至少 1 件 100 件小事",
      targetValue: 1,
    },
    {
      id: "ach-9",
      title: "心愿大师",
      description: "携手打卡完成至少 5 项共同愿望",
      category: "wishes",
      icon: "Trophy",
      conditionDescription: "完成至少 5 件 100 件小事",
      targetValue: 5,
    },
    {
      id: "ach-10",
      title: "纸短情长",
      description: "写下属于两人的真情日记",
      category: "diary",
      icon: "BookHeart",
      conditionDescription: "记录至少 2 篇恋爱日记",
      targetValue: 2,
    },
  ];

  return definitions.map((def) => {
    let currentVal = 0;
    if (def.id === "ach-1") {
      currentVal = cfg.startDate ? 1 : 0;
    } else if (def.id === "ach-2" || def.id === "ach-3") {
      currentVal = diffDays;
    } else if (def.id === "ach-4" || def.id === "ach-5") {
      currentVal = photos.length;
    } else if (def.id === "ach-6") {
      currentVal = wishFoodsCount;
    } else if (def.id === "ach-7") {
      currentVal = gifts.length;
    } else if (def.id === "ach-8" || def.id === "ach-9") {
      currentVal = completedWishesCount;
    } else if (def.id === "ach-10") {
      currentVal = diaries.length;
    }

    const isUnlocked = currentVal >= def.targetValue;
    return {
      ...def,
      currentValue: currentVal,
      isUnlocked,
    };
  });
}

// ==================== 10. 恋爱时间轴聚合 ====================
export function getTimelineEvents(isAuthenticated = false): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  getPhotos(isAuthenticated).forEach((p) => {
    events.push({
      id: `tl-photo-${p.id}`,
      date: p.date,
      title: p.title,
      description: p.description || p.story || "珍藏的照片瞬间",
      category: "photo",
      sourceId: p.id,
      imageUrl: p.imageUrl,
      tag: "照片收藏",
    });
  });

  getFoodRecords(isAuthenticated)
    .filter((f) => !f.isWishlist)
    .forEach((f) => {
      events.push({
        id: `tl-food-${f.id}`,
        date: f.date,
        title: `打卡 ${f.restaurant}`,
        description: `${f.review} (${f.dishes.join("、")})`,
        category: "food",
        sourceId: f.id,
        imageUrl: f.imageUrl,
        tag: "美食足迹",
      });
    });

  getGiftRecords(isAuthenticated).forEach((g) => {
    events.push({
      id: `tl-gift-${g.id}`,
      date: g.date,
      title: `${g.giver === "partner1" ? "收到" : "送出"}：${g.name}`,
      description: g.story,
      category: "gift",
      sourceId: g.id,
      imageUrl: g.imageUrl,
      tag: "惊喜礼物",
    });
  });

  getWishItems(isAuthenticated)
    .filter((w) => w.status === "completed" && w.completedDate)
    .forEach((w) => {
      events.push({
        id: `tl-wish-${w.id}`,
        date: w.completedDate!,
        title: `愿望打卡：${w.title}`,
        description: w.reflection || "共同完成了这件小事！",
        category: "wish",
        sourceId: w.id,
        imageUrl: w.completionPhoto,
        tag: "100件小事",
      });
    });

  // 排序
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
