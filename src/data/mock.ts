import { PhotoItem, TimelineEvent, DiaryEntry, Anniversary, WishItem } from "@/types";

export const initialAnniversaries: Anniversary[] = [
  {
    id: "anniv-1",
    title: "相恋纪念日",
    date: "2024-01-01",
    isRecurringYearly: true,
    description: "从这一天起，我们的世界有了彼此的印记。",
  },
];

export const initialTimeline: TimelineEvent[] = [
  {
    id: "tl-1",
    date: "2024-01-01",
    title: "初次相遇",
    content: "人海茫茫中，命运让我们走到了一起。",
    location: "初见地点",
    mood: "心动",
    tag: "纪念时刻",
  },
];

export const initialPhotos: PhotoItem[] = [
  {
    id: "p-1",
    title: "冬天初雪的合影（示例占位）",
    date: "2024-01-01",
    location: "白雪街头",
    imageUrl: "/placeholder-winter.jpg",
    caption: "初雪降临的那个傍晚",
    tags: ["初雪", "冬季", "散步"],
    isPrivate: false,
  },
];

export const initialDiaries: DiaryEntry[] = [
  {
    id: "d-1",
    date: "2024-01-01",
    title: "关于我们的第一篇记录",
    content: "这里是专属我们的小世界，存放着每一个温暖平淡却又闪闪发光的瞬间。",
    weather: "雪",
    mood: "温暖",
    isPrivate: false,
  },
];

export const initialWishes: WishItem[] = [
  {
    id: "w-1",
    title: "一起看一次极光",
    category: "travel",
    status: "todo",
    notes: "在漫天绿色光幕下依偎在一起",
  },
  {
    id: "w-2",
    title: "在下雪天一起堆一个大雪人",
    category: "life",
    status: "todo",
    notes: "给雪人戴上情侣红围巾",
  },
];
