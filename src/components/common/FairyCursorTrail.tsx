"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

type SparkleType = "star" | "heart" | "snow" | "pearl";

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

interface SparkleParticle {
  type: SparkleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  color: string;
}

const SPARKLE_COLORS = [
  "#F6A9CD", // 樱花粉
  "#FFD1DC", // 蜜桃粉
  "#FFE3B5", // 香槟金
  "#FFF0F8", // 水晶白
  "#CFAEE8", // 薰衣草淡紫
];

/**
 * 仙女棒流光丝带与星尘爱心鼠标滑动/点击特效
 * 单一高分屏 Canvas 渲染，支持空闲自动休眠与低性能/无障碍自动降级
 */
export default function FairyCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isLowPerformance } = useApp();

  useEffect(() => {
    if (isLowPerformance) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const trail: TrailPoint[] = [];
    const particles: SparkleParticle[] = [];
    const MAX_PARTICLES = 110;

    let pointerX = -100;
    let pointerY = -100;
    let pointerGlowAlpha = 0;
    let lastSpawnX = -999;
    let lastSpawnY = -999;
    let animId: number | null = null;

    const pickType = (): SparkleType => {
      const r = Math.random();
      if (r < 0.45) return "star";
      if (r < 0.75) return "heart";
      if (r < 0.90) return "snow";
      return "pearl";
    };

    const spawnParticle = (x: number, y: number, isBurst = false) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }
      const type = pickType();
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst ? 1.4 + Math.random() * 2.4 : 0.3 + Math.random() * 0.9;
      const color =
        type === "heart"
          ? Math.random() > 0.4
            ? "#F6A9CD"
            : "#FFD1DC"
          : type === "star"
          ? Math.random() > 0.35
            ? "#FFE3B5"
            : "#FFF0F8"
          : SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];

      particles.push({
        type,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isBurst ? 0.4 : 0.15),
        size: isBurst ? 4.2 + Math.random() * 3.8 : 3.2 + Math.random() * 3.4,
        life: 1,
        decay: isBurst ? 0.018 + Math.random() * 0.012 : 0.022 + Math.random() * 0.014,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        color,
      });
    };

    const drawFourPointStar = (size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size * 0.85, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size * 0.85, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.fill();
    };

    const drawMiniHeart = (size: number, color: string) => {
      ctx.fillStyle = color;
      const s = size * 0.62;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.75);
      ctx.bezierCurveTo(-s * 1.45, -s * 0.15, -s * 0.9, -s * 1.35, 0, -s * 0.42);
      ctx.bezierCurveTo(s * 0.9, -s * 1.35, s * 1.45, -s * 0.15, 0, s * 0.75);
      ctx.fill();
    };

    const drawMiniSnow = (size: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      const r = size * 0.78;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);
        ctx.stroke();
        ctx.restore();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. 绘制指尖柔和仙女光晕
      if (pointerGlowAlpha > 0.01) {
        const grad = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 22);
        grad.addColorStop(0, `rgba(255, 240, 248, ${pointerGlowAlpha * 0.55})`);
        grad.addColorStop(0.45, `rgba(246, 169, 205, ${pointerGlowAlpha * 0.28})`);
        grad.addColorStop(1, "rgba(246, 169, 205, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointerX, pointerY, 22, 0, Math.PI * 2);
        ctx.fill();
        pointerGlowAlpha *= 0.93;
      }

      // 2. 绘制平滑渐变仙女棒流光丝带
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= 0.055;
        if (trail[i].life <= 0) {
          trail.splice(i, 1);
        }
      }

      if (trail.length > 1) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const alpha = Math.max(0, p1.life);

          // 外层樱粉柔光描边
          ctx.strokeStyle = `rgba(246, 169, 205, ${alpha * 0.52})`;
          ctx.lineWidth = alpha * 4.5;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();

          // 内芯香槟白高光细丝
          ctx.strokeStyle = `rgba(255, 245, 239, ${alpha * 0.85})`;
          ctx.lineWidth = alpha * 1.6;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      }

      // 3. 更新并绘制星尘/爱心/微雪粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy = p.vy * 0.97 + 0.025; // 轻柔飘落重力
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const scale = 0.4 + p.life * 0.6;
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.15);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;

        if (p.type === "star") {
          drawFourPointStar(p.size * scale, p.color);
        } else if (p.type === "heart") {
          drawMiniHeart(p.size * scale, p.color);
        } else if (p.type === "snow") {
          drawMiniSnow(p.size * scale, p.color);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 若场上仍有轨迹、粒子或光晕，继续下一帧；否则自动休眠释放 CPU
      if (trail.length > 0 || particles.length > 0 || pointerGlowAlpha > 0.01) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    };

    const ensureLoop = () => {
      if (animId === null) {
        animId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      // 忽略触摸滚动时多指干扰，主指针才绘制
      if (!e.isPrimary) return;
      const x = e.clientX;
      const y = e.clientY;
      pointerX = x;
      pointerY = y;
      pointerGlowAlpha = 1;

      trail.push({ x, y, life: 1 });
      if (trail.length > 18) {
        trail.shift();
      }

      const dist = Math.hypot(x - lastSpawnX, y - lastSpawnY);
      if (dist >= 10) {
        lastSpawnX = x;
        lastSpawnY = y;
        spawnParticle(
          x + (Math.random() - 0.5) * 6,
          y + (Math.random() - 0.5) * 6,
          false
        );
      }

      ensureLoop();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      const x = e.clientX;
      const y = e.clientY;
      pointerX = x;
      pointerY = y;
      pointerGlowAlpha = 1;

      for (let i = 0; i < 9; i++) {
        spawnParticle(x, y, true);
      }
      ensureLoop();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isLowPerformance]);

  if (isLowPerformance) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[120] w-full h-full"
    />
  );
}
