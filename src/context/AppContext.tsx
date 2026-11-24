"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { verifyPasscode, checkClientAuth, setClientAuth } from "@/lib/auth";

interface AppContextType {
  // 权限与模式
  isAuthenticated: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;
  // 视觉与体验控制
  isNightMode: boolean;
  toggleNightMode: () => void;
  isSnowing: boolean;
  toggleSnow: () => void;
  isLowPerformance: boolean;
  toggleLowPerformance: () => void;
  isBgmPlaying: boolean;
  toggleBgm: () => void;
  // 数据更新通知
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [isSnowing, setIsSnowing] = useState<boolean>(true);
  const [isLowPerformance, setIsLowPerformance] = useState<boolean>(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // 初始化读取本地偏好与登录态
  useEffect(() => {
    setIsAuthenticated(checkClientAuth());

    const savedNight = localStorage.getItem("olw_theme_night");
    if (savedNight) setIsNightMode(savedNight === "true");

    const savedSnow = localStorage.getItem("olw_theme_snow");
    if (savedSnow) setIsSnowing(savedSnow === "true");

    const savedPerf = localStorage.getItem("olw_theme_low_perf");
    if (savedPerf) setIsLowPerformance(savedPerf === "true");
  }, []);

  const login = (passcode: string): boolean => {
    if (verifyPasscode(passcode)) {
      setClientAuth(true);
      setIsAuthenticated(true);
      triggerRefresh();
      return true;
    }
    return false;
  };

  const logout = () => {
    setClientAuth(false);
    setIsAuthenticated(false);
    triggerRefresh();
  };

  const toggleNightMode = () => {
    setIsNightMode((prev) => {
      const next = !prev;
      localStorage.setItem("olw_theme_night", String(next));
      return next;
    });
  };

  const toggleSnow = () => {
    setIsSnowing((prev) => {
      const next = !prev;
      localStorage.setItem("olw_theme_snow", String(next));
      return next;
    });
  };

  const toggleLowPerformance = () => {
    setIsLowPerformance((prev) => {
      const next = !prev;
      localStorage.setItem("olw_theme_low_perf", String(next));
      // 开启性能模式时自动关闭高频动效
      if (next) setIsSnowing(false);
      return next;
    });
  };

  const toggleBgm = () => {
    setIsBgmPlaying((prev) => !prev);
  };

  const triggerRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isNightMode,
        toggleNightMode,
        isSnowing,
        toggleSnow,
        isLowPerformance,
        toggleLowPerformance,
        isBgmPlaying,
        toggleBgm,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
