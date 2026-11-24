"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";

export default function BackgroundAudio() {
  const { isBgmPlaying } = useApp();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isBgmPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // 温暖安静的冬日音乐和弦频率 (C大调与柔和七和弦频率)
      // 模拟八音盒与轻钢琴清脆音色
      const melodyNotes = [
        523.25, 587.33, 659.25, 783.99, 880.0, 987.77, 1046.5, 783.99,
        659.25, 587.33, 523.25, 659.25, 783.99, 587.33, 523.25, 440.0,
      ];
      let noteIndex = 0;

      const playTone = (freq: number) => {
        if (!ctx || ctx.state === "closed") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 柔和正弦波音色
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // 细腻的包络起伏
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.85);
      };

      // 每 1.2 秒弹奏一颗轻柔音符
      timerRef.current = setInterval(() => {
        const note = melodyNotes[noteIndex % melodyNotes.length];
        playTone(note);
        noteIndex++;
      }, 1200);
    } catch (e) {
      console.warn("Web Audio not supported or blocked by autoplay policy", e);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, [isBgmPlaying]);

  return null;
}
