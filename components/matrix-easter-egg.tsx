"use client";

import * as React from "react";
import { useLanguage } from "@/components/language-provider";

export const MATRIX_EVENT = "matrix:trigger";
const RAIN_CHARS = "010101XYZ0123456789ABCDEF$#&*%<>[]{}/*~+";

// 溅射水珠物理粒子
interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;  
}

// 击中金属表面的水花扩散涟漪
interface SplashRipple {
  x: number;
  y: number;
  rx: number;
  alpha: number;
  maxRx: number;
}

export function MatrixEasterEgg() {
  const { ui } = useLanguage();
  const [active, setActive] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // 1. ESC 退出（触发方式改为：在终端输入 matrix 后回车）
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. 终端命令监听
  React.useEffect(() => {
    const handleTrigger = () => setActive(true);
    window.addEventListener(MATRIX_EVENT, handleTrigger);
    return () => window.removeEventListener(MATRIX_EVENT, handleTrigger);
  }, []);

  // 3. 锁定页面滚动
  React.useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // 4. Canvas 物理引擎 + 3D 白面幽绿字 + 单字母溅水
  React.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let columns = Math.ceil(window.innerWidth / fontSize);
    let drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    // 物理微粒池
    let particles: SplashParticle[] = [];
    let ripples: SplashRipple[] = [];
    let frameCount = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.ceil(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // 绘制星芒闪烁（收敛为清亮幽绿与白光）
    const drawSparkle = (cx: number, cy: number, size: number, pulse: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      const curSize = size * (0.85 + Math.sin(pulse) * 0.25);

      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, curSize * 2.5);
      glow.addColorStop(0, "rgba(255, 255, 255, 1)");
      glow.addColorStop(0.35, "rgba(74, 222, 128, 0.75)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, curSize * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, -curSize * 2.6);
      ctx.quadraticCurveTo(0, 0, curSize * 2.6, 0);
      ctx.quadraticCurveTo(0, 0, 0, curSize * 2.6);
      ctx.quadraticCurveTo(0, 0, -curSize * 2.6, 0);
      ctx.quadraticCurveTo(0, 0, 0, -curSize * 2.6);
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      frameCount++;

      // 经典半透明黑色拖尾
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- A. 测算 3D 字尺寸与各单字母碰撞盒 ---
      const bannerText = "JUST FOR FUN";
      let bannerFontSize = Math.min(Math.max(canvas.width * 0.065, 32), 76);
      ctx.font = `900 ${bannerFontSize}px "Arial Black", Impact, sans-serif`;

      let totalWidth = ctx.measureText(bannerText).width;
      if (totalWidth > canvas.width * 0.92) {
        bannerFontSize = (canvas.width * 0.9) / (totalWidth / bannerFontSize);
        ctx.font = `900 ${bannerFontSize}px "Arial Black", Impact, sans-serif`;
        totalWidth = ctx.measureText(bannerText).width;
      }

      const textX = (canvas.width - totalWidth) / 2;
      const textY = canvas.height / 2;
      const letterTop = textY - bannerFontSize * 0.74;
      const extrusionDepth = Math.round(bannerFontSize * 0.28); // 3D 厚度

      // 独立测算每个字母（跳过空格，空格自然漏雨）
      const letterHitboxes: { char: string; left: number; right: number }[] = [];
      let cursorX = textX;
      for (let i = 0; i < bannerText.length; i++) {
        const char = bannerText[i];
        const charWidth = ctx.measureText(char).width;
        if (char !== " ") {
          letterHitboxes.push({
            char,
            left: cursorX,
            right: cursorX + charWidth,
          });
        }
        cursorX += charWidth;
      }

      // --- B. 渲染 3D 实体字（白面 + 幽绿侧切与边缘） ---
      ctx.save();

      // 1. 底层背光暗影
      ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetX = -extrusionDepth * 0.6;
      ctx.shadowOffsetY = extrusionDepth * 1.1;
      ctx.fillStyle = "#000000";
      ctx.fillText(bannerText, textX, textY);
      ctx.shadowBlur = 0;

      // 2. 3D 侧切厚度面：从深黑暗绿过渡到幽翠绿
      for (let d = extrusionDepth; d >= 1; d--) {
        const progress = d / extrusionDepth; // 1 为最深层，0 为最靠近正面
        const ox = -d * 0.52;
        const oy = d * 0.72;

        const r = Math.floor(4 + (1 - progress) * 8);
        const g = Math.floor(24 + (1 - progress) * 85);
        const b = Math.floor(12 + (1 - progress) * 35);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillText(bannerText, textX + ox, textY + oy);
      }

      // 3. 正面实体纯白字面
      ctx.fillStyle = "#ffffff";
      ctx.fillText(bannerText, textX, textY);

      // 4. 边缘幽绿微光轮廓（Phantom Green Edge Glow）
      ctx.shadowColor = "rgba(34, 197, 94, 0.85)";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 1.8;
      ctx.strokeText(bannerText, textX, textY);

      // 5. 尖角星芒闪烁（在 J、O、N 顶端点缀）
      const pulseTime = frameCount * 0.08;
      drawSparkle(textX + 6, letterTop + 4, 3.5, pulseTime);
      const oBox = letterHitboxes.find((b) => b.char === "O");
      if (oBox) drawSparkle(oBox.right - 8, letterTop + 6, 4.2, pulseTime + 1.8);
      const lastN = letterHitboxes[letterHitboxes.length - 1];
      if (lastN) drawSparkle(lastN.right - 4, letterTop + 3, 3.8, pulseTime + 3.2);

      ctx.restore();

      // --- C. 代码雨与单字母独立溅水 ---
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = RAIN_CHARS.charAt(Math.floor(Math.random() * RAIN_CHARS.length));
        const dropX = i * fontSize;
        const dropY = drops[i] * fontSize;

        // 头部青白高光，身段经典极客绿
        ctx.fillStyle = drops[i] % 4 === 0 ? "#dcfce7" : "#22c55e";
        ctx.fillText(char, dropX, dropY);

        // 碰撞判断：逐个字母检测顶表面
        for (let b = 0; b < letterHitboxes.length; b++) {
          const box = letterHitboxes[b];
          if (
            dropX >= box.left &&
            dropX <= box.right &&
            dropY >= letterTop - 6 &&
            dropY <= letterTop + fontSize * 1.1
          ) {
            // 1. 幽绿水花扩散涟漪
            ripples.push({
              x: dropX,
              y: letterTop + 1,
              rx: 1.5,
              alpha: 0.9,
              maxRx: Math.random() * 6 + 6,
            });

            // 2. 向上飞溅晶莹水珠（亮白与幽绿）
            const sparkCount = Math.floor(Math.random() * 3) + 3;
            for (let p = 0; p < sparkCount; p++) {
              particles.push({
                x: dropX + (Math.random() - 0.5) * 4,
                y: letterTop,
                vx: (Math.random() - 0.5) * 6,
                vy: -(Math.random() * 3.8 + 1.8),
                alpha: 1,
                size: Math.random() * 1.8 + 0.9,
                color: Math.random() > 0.4 ? "#86efac" : "#ffffff",
              });
            }

            drops[i] = Math.floor(Math.random() * -15);
            break;
          }
        }

        // 自然落出屏幕底部重置
        if (dropY > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // --- D. 渲染表面水花涟漪 ---
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.rx += 0.65;
        r.alpha -= 0.045;

        if (r.alpha <= 0 || r.rx >= r.maxRx) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(r.alpha, 0);
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.rx, r.rx * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // --- E. 渲染飞溅水珠（重力下坠） ---
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24;
        p.alpha -= 0.042;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black select-none">
      {/* 1. 画布：代码雨、白面幽绿 3D 立体字、独立单字母溅水 */}
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />

      {/* 2. 背景海报扩图适配层 + 全屏星光漫反射 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
        {/* A. 漫反射底座：超广角紫芒填满四周 */}
        <img
          src="/images/matrix-figure.jpg"
          alt="Cosmic Ambient"
          className="absolute inset-0 size-full scale-150 object-cover opacity-50 blur-3xl filter saturate-200"
        />

        {/* B. 左右翼扩图延伸 */}
        <div className="absolute inset-0 flex items-center justify-between opacity-35 blur-xl">
          <img
            src="/images/matrix-figure.jpg"
            alt="Left Wing"
            className="h-[95vh] w-auto -translate-x-1/4 scale-x-[-1] object-contain"
          />
          <img
            src="/images/matrix-figure.jpg"
            alt="Right Wing"
            className="h-[95vh] w-auto translate-x-1/4 scale-x-[-1] object-contain"
          />
        </div>

        {/* C. 居中人物主体：渐变羽化遮罩 */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-85"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 75% at 50% 50%, black 45%, transparent 95%)",
            maskImage:
              "radial-gradient(ellipse 65% 75% at 50% 50%, black 45%, transparent 95%)",
          }}
        >
          <img
            src="/images/matrix-figure.jpg"
            alt="Cosmic Figure"
            className="max-h-[92vh] w-auto max-w-full object-contain filter saturate-150 contrast-125"
          />
        </div>
      </div>

      {/* 3. 边缘暗角收敛 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_85%,#000000_100%)]" />

      {/* 4. 退出按钮 */}
      <button
        onClick={() => setActive(false)}
        className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-lg border border-green-500/40 bg-black/60 px-3.5 py-1.5 font-mono text-xs text-green-400 backdrop-blur-md transition-colors hover:border-green-400 hover:bg-green-950/50 hover:text-white"
      >
        <span>{ui.console.exit}</span>
        <kbd className="rounded border border-green-500/40 bg-green-950/60 px-1.5 py-0.5 text-[10px]">
          ESC
        </kbd>
      </button>
    </div>
  );
}