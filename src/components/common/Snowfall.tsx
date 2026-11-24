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

    // 根据屏幕宽度自适应雪花总数
    const flakeCount = width < 768 ? 45 : 90;
    const flakes: Flake[] = [];

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 0.8,
        density: Math.random() * flakeCount,
        alpha: Math.random() * 0.7 + 0.3,
        speedY: Math.random() * 0.9 + 0.5,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.3,
      });
    }

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.008;

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";

      for (let i = 0; i < flakeCount; i++) {
        const f = flakes[i];
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = `rgba(240, 248, 255, ${f.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(224, 242, 254, 0.6)";
        ctx.fill();

        // 飘落逻辑
        f.y += f.speedY;
        f.x += Math.sin(angle + f.density) * 0.6 + f.speedX;

        // 触底或出界重置
        if (f.y > height) {
          flakes[i] = {
            x: Math.random() * width,
            y: -10,
            radius: f.radius,
            density: f.density,
            alpha: f.alpha,
            speedY: f.speedY,
            speedX: f.speedX,
          };
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
      className="fixed inset-0 pointer-events-none z-30"
      aria-hidden="true"
    />
  );
}
