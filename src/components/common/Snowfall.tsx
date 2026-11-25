"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

interface Flake {
  x: number;
  y: number;
  radius: number;
  density: number;
  alpha: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayOffset: number;
}

interface BokehOrb {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedY: number;
  speedX: number;
  color: string;
}

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isSnowing, isLowPerformance } = useApp();

  useEffect(() => {
    if (!isSnowing || isLowPerformance) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // 1. 常规飘雪粒子（包含细钻粉雪与轻柔雪花）
    const isMobile = width < 768;
    const flakeCount = isMobile ? 40 : 85;
    const flakes: Flake[] = [];

    for (let i = 0; i < flakeCount; i++) {
      const isDiamondDust = Math.random() < 0.25;
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isDiamondDust ? Math.random() * 1.2 + 0.6 : Math.random() * 2.8 + 1.2,
        density: Math.random() * flakeCount,
        alpha: Math.random() * 0.7 + 0.25,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.25,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. 电影级大光圈前景光斑 (Bokeh Orbs) - 暖金与冰粉弥散光球
    const bokehCount = isMobile ? 3 : 7;
    const bokehColors = [
      "rgba(253, 230, 138, ", // 暖金
      "rgba(244, 208, 222, ", // 樱粉
      "rgba(224, 242, 254, ", // 冰蓝
    ];
    const bokehOrbs: BokehOrb[] = [];

    for (let i = 0; i < bokehCount; i++) {
      bokehOrbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 28 + 14,
        alpha: Math.random() * 0.12 + 0.05,
        speedY: Math.random() * 0.3 + 0.15,
        speedX: (Math.random() - 0.5) * 0.2,
        color: bokehColors[i % bokehColors.length],
      });
    }

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // 绘制前景大光斑 (Bokeh)
      for (let i = 0; i < bokehCount; i++) {
        const b = bokehOrbs[i];
        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        gradient.addColorStop(0, `${b.color}${b.alpha * 1.6})`);
        gradient.addColorStop(0.5, `${b.color}${b.alpha})`);
        gradient.addColorStop(1, `${b.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        b.y += b.speedY;
        b.x += b.speedX;

        if (b.y > height + b.radius) {
          b.y = -b.radius;
          b.x = Math.random() * width;
        }
      }

      // 绘制细致飘雪与粉雪
      for (let i = 0; i < flakeCount; i++) {
        const f = flakes[i];
        const sway = Math.sin(time * f.swaySpeed + f.swayOffset) * 0.8;

        ctx.beginPath();
        ctx.arc(f.x + sway, f.y, f.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = `rgba(245, 250, 255, ${f.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(224, 242, 254, 0.45)";
        ctx.fill();

        f.y += f.speedY;
        f.x += f.speedX;

        // 触底或左右出界重置
        if (f.y > height + 8) {
          f.y = -8;
          f.x = Math.random() * width;
        }
        if (f.x > width + 10) f.x = -10;
        else if (f.x < -10) f.x = width + 10;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSnowing, isLowPerformance]);

  if (!isSnowing || isLowPerformance) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
