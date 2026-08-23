"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function CreatorProfileCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    cursorX: 50,
    cursorY: 50,
  });

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only apply 3D tilt on mouse / non-touch pointers
    if (e.pointerType === "touch" || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Calculate rotation between -7deg and +7deg for a smooth, subtle parallax
    const normalizedX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normalizedY = (y / rect.height - 0.5) * 2; // -1 to 1

    const rotX = -normalizedY * 7;
    const rotY = normalizedX * 7;

    setTransformStyle({
      rotateX: rotX,
      rotateY: rotY,
      cursorX: Math.round(percentX),
      cursorY: Math.round(percentY),
    });
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTransformStyle({
      rotateX: 0,
      rotateY: 0,
      cursorX: 50,
      cursorY: 50,
    });
  }, []);

  return (
    <div className="relative group/creator-card w-full max-w-[280px] sm:max-w-[320px] flex justify-center perspective-[1000px]">
      {/* Ambient background glow halo behind the portrait */}
      <div
        className={`absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-500/25 via-indigo-500/25 to-violet-500/20 blur-2xl transition-all duration-700 pointer-events-none ${
          isHovered ? "opacity-100 scale-110 blur-3xl" : "opacity-40 scale-95"
        }`}
      />

      {/* 3D Interactive Portrait Container */}
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${transformStyle.rotateX}deg) rotateY(${transformStyle.rotateY}deg) translateY(-6px) scale(1.04)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
          transition: isHovered
            ? "transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease",
          transformStyle: "preserve-3d",
        }}
        className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-3xl p-2 sm:p-2.5 bg-white/80 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-indigo-950/40 backdrop-blur-xl cursor-pointer select-none transition-shadow will-change-transform"
      >
        {/* Dynamic Interactive Border Highlight reacting to cursor angle */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover/creator-card:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${transformStyle.cursorX}% ${transformStyle.cursorY}%, rgba(99, 102, 241, 0.35), transparent 70%)`,
          }}
        />

        {/* Inner Card Framing / Mask */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 via-slate-200/80 to-slate-100 dark:from-slate-900 dark:via-[#0c1220] dark:to-slate-950 border border-slate-200/60 dark:border-white/10 shadow-inner">
          {/* Creator Profile Image */}
          <Image
            src="/creator.jpg"
            alt="Satyveer Yadav - Creator of StudentHub"
            fill
            sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 240px"
            className="object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover/creator-card:scale-105"
            priority
          />

          {/* Dynamic Spotlight Glow following cursor */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover/creator-card:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 140px at ${transformStyle.cursorX}% ${transformStyle.cursorY}%, rgba(255, 255, 255, 0.22), transparent 75%)`,
            }}
          />

          {/* Subtle Diagonal Gloss Sweep Effect on Hover */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover/creator-card:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/15 to-transparent skew-x-12" />

          {/* Subtle Bottom Scrim Overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent transition-opacity duration-300" />

          {/* Subtle Professional Bottom Tag */}
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-center px-3 py-1.5 rounded-xl bg-slate-950/85 dark:bg-black/85 backdrop-blur-md border border-white/15 text-white shadow-xl transition-all duration-300 transform group-hover/creator-card:translate-y-0 translate-y-0.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              <span className="font-heading text-[12px] sm:text-[13px] font-semibold tracking-wider text-slate-100 dark:text-slate-100">
                Satyveer Yadav
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
