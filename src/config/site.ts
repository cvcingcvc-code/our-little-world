import { SiteConfig } from "@/types";

export const defaultSiteConfig: SiteConfig = {
  name: "Our Little World",
  coupleNames: {
    partner1: "TA",
    partner2: "我",
  },
  startDate: "", // 初始留空，由用户在界面上自主设定，杜绝伪造
  mainMotto: "冬天很冷，幸好有你。",
  subMotto: "想把与你有关的每一个瞬间，都偷偷收藏。",
  bgmTitle: "冬日恋歌 (Winter Snow Melodies)",
  bgmArtist: "八音盒微风纯音",
};

export const siteConfig = defaultSiteConfig;

export const SITE_STORAGE_KEYS = {
  START_DATE: "olw_custom_start_date",
  COUPLE_P1: "olw_custom_partner1",
  COUPLE_P2: "olw_custom_partner2",
};

/**
 * 动态获取用户设定的站点配置
 */
export function getActiveSiteConfig(): SiteConfig {
  if (typeof window === "undefined") return defaultSiteConfig;
  const savedDate = localStorage.getItem(SITE_STORAGE_KEYS.START_DATE);
  const p1 = localStorage.getItem(SITE_STORAGE_KEYS.COUPLE_P1);
  const p2 = localStorage.getItem(SITE_STORAGE_KEYS.COUPLE_P2);

  return {
    ...defaultSiteConfig,
    startDate: savedDate || "",
    coupleNames: {
      partner1: p1 || defaultSiteConfig.coupleNames.partner1,
      partner2: p2 || defaultSiteConfig.coupleNames.partner2,
    },
  };
}

export function saveActiveSiteStartDate(dateStr: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SITE_STORAGE_KEYS.START_DATE, dateStr);
}

export function saveActiveCoupleNames(p1: string, p2: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SITE_STORAGE_KEYS.COUPLE_P1, p1);
  localStorage.setItem(SITE_STORAGE_KEYS.COUPLE_P2, p2);
}
