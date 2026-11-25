"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

type ParticleKind = "snowflake" | "star" | "heart" | "petal" | "butterfly";

interface RomanticParticle {
  kind: ParticleKind;
  x: number;
  y: number;
  size: number;
  alpha: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  swayOffset: number;
  swaySpeed: number;
  color: string;
}

/**
 * 少女感复合浪漫雪花粒子引擎 (RomanticSnow - Layer 05)
 * 配比：45% 六角/蕾丝水晶雪花 · 25% 四角星芒与珍珠光点 · 15% 粉色爱心 · 10% 樱花花瓣 · 5% 梦幻蝴蝶
 */
export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isSnowing, isLowPerformance } = useApp();

  useEffect(() => {
    if (!isSnowing || isLowPerformance) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

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

    const isMobile = width < 768;
    const totalCount = isMobile ? 34 : 68;

    const pickKind = (): ParticleKind => {
      const r = Math.random();
      if (r < 0.45) return "snowflake"; // 45%
      if (r < 0.70) return "star";      // 25%
      if (r < 0.85) return "heart";     // 15%
      if (r < 0.95) return "petal";     // 10%
      return "butterfly";               // 5%
    };

    const particles: RomanticParticle[] = [];
    for (let i = 0; i < totalCount; i++) {
      const kind = pickKind();
      const depthLayer = Math.random(); // 0=远景, 1=近景
      const baseSize =
        kind === "butterfly"
          ? 7 + depthLayer * 5
          : kind === "snowflake"
          ? 4 + depthLayer * 6
          : kind === "petal"
          ? 4 + depthLayer * 4
          : 3.5 + depthLayer * 4.5;

      const palette =
        kind === "heart"
          ? "#F6A9CD"
          : kind === "petal"
          ? "#FFD1DC"
          : kind === "butterfly"
          ? "#E9D5FF"
          : kind === "star"
          ? "#FFE3B5"
          : "#FFF0F8";

      particles.push({
        kind,
        x: Math.random() * width,
        y: Math.random() * height,
        size: baseSize,
        alpha: 0.35 + depthLayer * 0.5,
        speedY:
          kind === "butterfly"
            ? 0.25 + depthLayer * 0.35
            : 0.35 + depthLayer * 0.65,
        speedX: (Math.random() - 0.5) * 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.015,
        color: palette,
      });
    }

    const drawSnowflake = (p: RomanticParticle) => {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(0.8, p.size * 0.12);
      ctx.lineCap = "round";
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -p.size);
        // 蕾丝分支
        ctx.moveTo(0, -p.size * 0.55);
        ctx.lineTo(-p.size * 0.28, -p.size * 0.78);
        ctx.moveTo(0, -p.size * 0.55);
        ctx.lineTo(p.size * 0.28, -p.size * 0.78);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawStar = (p: RomanticParticle) => {
      ctx.fillStyle = p.color;
      const r = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.fill();
    };

    const drawHeart = (p: RomanticParticle) => {
      ctx.fillStyle = p.color;
      const s = p.size * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.7);
      ctx.bezierCurveTo(-s * 1.4, -s * 0.2, -s * 0.9, -s * 1.4, 0, -s * 0.45);
      ctx.bezierCurveTo(s * 0.9, -s * 1.4, s * 1.4, -s * 0.2, 0, s * 0.7);
      ctx.fill();
    };

    const drawPetal = (p: RomanticParticle) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.75, p.size * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawButterfly = (p: RomanticParticle, tick: number) => {
      const flap = 0.55 + Math.abs(Math.sin(tick * 0.06 + p.swayOffset)) * 0.45;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = "#FFF0F8";
      ctx.lineWidth = 0.7;
      const s = p.size * 0.65;
      ctx.save();
      ctx.scale(flap, 1);
      // 左翼
      ctx.beginPath();
      ctx.ellipse(-s * 0.5, -s * 0.2, s * 0.6, s * 0.4, -0.4, 0, Math.PI * 2);
      ctx.ellipse(-s * 0.35, s * 0.35, s * 0.42, s * 0.28, 0.4, 0, Math.PI * 2);
      // 右翼
      ctx.ellipse(s * 0.5, -s * 0.2, s * 0.6, s * 0.4, 0.4, 0, Math.PI * 2);
      ctx.ellipse(s * 0.35, s * 0.35, s * 0.42, s * 0.28, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    let animId = 0;
    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 1;

      for (const p of particles) {
        const swayX = Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.55;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x + swayX * 8, p.y);
        ctx.rotate(p.rotation);

        if (p.kind === "snowflake") drawSnowflake(p);
        else if (p.kind === "star") drawStar(p);
        else if (p.kind === "heart") drawHeart(p);
        else if (p.kind === "petal") drawPetal(p);
        else drawButterfly(p, tick);

        ctx.restore();

        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > height + 16) {
          p.y = -16;
          p.x = Math.random() * width;
        }
        if (p.x > width + 16) p.x = -16;
        else if (p.x < -16) p.x = width + 16;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSnowing, isLowPerformance]);

  if (!isSnowing || isLowPerformance) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
    />
  );
}
