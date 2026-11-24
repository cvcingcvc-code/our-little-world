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
} from "@/types";

// 真实恋爱数据：全部初始为空，绝不使用虚构冒充数据
export const initialPhotos: PhotoItem[] = [];
export const initialFoodRecords: FoodRecord[] = [];
export const initialGiftRecords: GiftRecord[] = [];
export const initialDiaries: DiaryEntry[] = [];
export const initialStarMemories: StarMemory[] = [];
export const initialTimeCapsules: TimeCapsule[] = [];
export const initialAnniversaries: Anniversary[] = [];
export const initialNotes: SecretNote[] = [];

// 我们的 100 件小事：精选愿望清单参考灵感（全部初始为待完成状态，无任何虚假打卡记录）
export const initialWishTemplates: WishItem[] = [
  {
    id: "wish-tpl-1",
    title: "在冬夜一起漫步看漫天初雪",
    category: "romantic",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-2",
    title: "在下雪天一起堆一个大雪人",
    category: "daily",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-3",
    title: "去冰场牵着手滑冰（不摔倒挑战）",
    category: "challenge",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-4",
    title: "在露天温汤池里一边泡汤一边赏雪景",
    category: "travel",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-5",
    title: "一起去极北之地看一次真正的极光",
    category: "milestone",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-6",
    title: "一起烘焙一整炉姜饼人和草莓蛋糕",
    category: "food",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-7",
    title: "挑选一套情侣围巾和手套",
    category: "daily",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-8",
    title: "拍摄一套冬日胶片双人写真",
    category: "romantic",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-9",
    title: "在山顶支起帐篷看日出云海",
    category: "travel",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
  {
    id: "wish-tpl-10",
    title: "在沙发上盖着同一条毛毯看完一部经典爱情电影",
    category: "daily",
    status: "todo",
    isPrivate: false,
    createdAt: Date.now(),
  },
];

// 约会灵感随机摇奖灵感库
export const defaultRandomDates: RandomDateIdea[] = [
  {
    id: "rd-1",
    title: "冬夜露天滑冰",
    description: "穿上厚厚的羽绒服，牵着手在泛光的冰面上滑行，累了就喝杯热可可。",
    tag: "浪漫冬日",
  },
  {
    id: "rd-2",
    title: "客厅壁炉双人拼图马拉松",
    description: "煮一壶热肉桂苹果茶，挑一幅1000片的冬日童话拼图，谁找得慢谁被刮鼻子。",
    tag: "居家温存",
  },
  {
    id: "rd-3",
    title: "盲盒随机餐厅探险",
    description: "坐上任意一班公交车，在第7站下车，走进看到的第一家冒着热气的暖心小馆。",
    tag: "刺激惊喜",
  },
  {
    id: "rd-4",
    title: "星空观测站看流星",
    description: "带上厚毛毯和保暖壶，驱车前往远离灯光的高地，数今夜落下的星星。",
    tag: "星空约定",
  },
  {
    id: "rd-5",
    title: "烘焙店制作情侣草莓慕斯",
    description: "系上情侣围裙，把面粉蹭在对方鼻尖上，亲手烘焙出甜蜜味道。",
    tag: "甜蜜手作",
  },
];
