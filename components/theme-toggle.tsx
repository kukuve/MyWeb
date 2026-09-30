"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/language-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Point {
  x: number;
  y: number;
}

// 物理纸屑碎片粒子
interface Scrap {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  rotSpeed: number;
  size: number;
  color: string;
  points: Point[]; // 碎片多边形顶点
  alpha: number;
  life: number;
  maxLife: number;
  gravity: number;
  drag: number;
}

/**
 * Theme toggle with a physical "paper tearing" transition:
 * 1. 点击瞬间底层立即 setTheme(nextTheme)，页面真实 DOM 立刻变为新模式；
 * 2. 顶层覆盖旧模式"纸张层"：0-220ms 屏幕中心戳破一道带纤维毛刺的撕裂
 *    纸洞，透过洞第一时间看到新模式界面；220-900ms 沿穿过破洞的对角线
 *    撕开，两半纸片在抗撕阻力震颤、非对称旋转惯性、剪切形变与自重拖拽
 *    下向两角撕裂脱离，撕口抛出多边形碎纸与纤维粒子，受重力、空气阻力
 *    与角速度翻滚飘落。
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { ui } = useLanguage();
  const [isAnimating, setIsAnimating] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Hydration-safe mounted flag (false on the server, true on the client) —
  // same pattern as the rest of the app, avoids hydration mismatches from
  // next-themes' undefined server-side resolvedTheme.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const triggerTearTransition = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const currentTheme = (resolvedTheme || theme || "dark") as "dark" | "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    // 1. 瞬间切换主题（洞后窥视新主题）
    setTheme(nextTheme);

    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsAnimating(false);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsAnimating(false);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 物理纸张及纤维颜色
      const paperColor = currentTheme === "dark" ? "#0b0f19" : "#f1f3f5";
      const fiberColor = currentTheme === "dark" ? "#64748b" : "#e2e8f0";
      const shadowColor = "rgba(0, 0, 0, 0.52)";

      const center: Point = { x: w / 2, y: h / 2 };
      const maxHoleRadius = Math.min(Math.max(w * 0.12, 90), 150);

      // 撕裂对角线：左上 -> 右下
      const pStart: Point = { x: -50, y: -50 };
      const pEnd: Point = { x: w + 50, y: h + 50 };
      const diagDx = pEnd.x - pStart.x;
      const diagDy = pEnd.y - pStart.y;
      const diagLen = Math.hypot(diagDx, diagDy);

      // 撕裂面法线（右上方向）
      const normX = diagDy / diagLen;
      const normY = -diagDx / diagLen;

      // 生成带纸张粗糙毛刺的预设噪点序列
      const noiseTable: number[] = Array.from(
        { length: 150 },
        () => (Math.random() - 0.5) * 18,
      );

      // 破洞边缘的纸浆纤维毛刺（预生成，吸附在各自纸片边缘随纸片移动）
      const fiberCount = 72;
      const fibers = Array.from({ length: fiberCount }, (_, k) => {
        const side: 1 | -1 = k % 2 === 0 ? 1 : -1;
        const u = Math.random();
        // 右上半张环绕 45°→-135°，左下半张环绕 45°→225°
        const angle =
          side === 1 ? Math.PI / 4 - u * Math.PI : Math.PI / 4 + u * Math.PI;
        return {
          side,
          angle,
          radiusFrac: 0.92 + Math.random() * 0.16,
          len: 4 + Math.random() * 12,
          alpha: 0.35 + Math.random() * 0.45,
        };
      });

      // --- 物理碎片粒子池 ---
      const scraps: Scrap[] = [];

      const spawnScraps = (
        originX: number,
        originY: number,
        count: number,
        forceMultiplier: number,
      ) => {
        for (let i = 0; i < count; i++) {
          const scrapSize = Math.random() * 9 + 4;
          // 生成随机不规则多边形碎片顶点
          const points: Point[] = [];
          const ptsCount = 3 + Math.floor(Math.random() * 3);
          for (let p = 0; p < ptsCount; p++) {
            const vertexAngle = (p / ptsCount) * Math.PI * 2 + Math.random() * 0.5;
            const r = scrapSize * (0.5 + Math.random() * 0.5);
            points.push({ x: Math.cos(vertexAngle) * r, y: Math.sin(vertexAngle) * r });
          }

          // 撕裂碎片沿切线与法线向外崩飞，具有空气阻力和重力
          const launchAngle =
            Math.atan2(diagDy, diagDx) + (Math.random() - 0.5) * Math.PI;
          const speed = (Math.random() * 11 + 3) * forceMultiplier;

          scraps.push({
            x: originX,
            y: originY,
            vx: Math.cos(launchAngle) * speed + (Math.random() - 0.5) * 5,
            vy: Math.sin(launchAngle) * speed - (Math.random() * 4 + 2), // 略向上飞
            angle: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.28,
            size: scrapSize,
            color: Math.random() > 0.4 ? paperColor : fiberColor,
            points,
            alpha: 1,
            life: 0,
            maxLife: 60 + Math.random() * 40,
            gravity: 0.38 + Math.random() * 0.2, // 受重力下落
            drag: 0.965, // 空气阻力
          });
        }
      };

      // 动画时间
      const startTime = performance.now();
      const holeDuration = 220; // 破洞破裂耗时
      const tearDuration = 680; // 物理崩断分离耗时
      const totalDuration = holeDuration + tearDuration;

      // 物理状态：位移、旋转角
      let vTopRight = { x: 0, y: 0 };
      let vBottomLeft = { x: 0, y: 0 };
      let angleTopRight = 0;
      let angleBottomLeft = 0;

      // 干净对角线坐标（用于计算到中心的距离）
      const rawX = (t: number) => pStart.x + diagDx * t;
      const rawY = (t: number) => pStart.y + diagDy * t;
      const steps = 60;

      const render = (now: number) => {
        const elapsed = now - startTime;
        ctx.clearRect(0, 0, w, h);

        // --- 1. 计算破洞破裂与微小拉扯阻尼 (Stage 1) ---
        let holeProgress = Math.min(elapsed / holeDuration, 1);
        // 破洞快速、不规则扩张
        const jolt =
          1 + Math.sin(holeProgress * Math.PI * 5) * 0.05 * (1 - holeProgress); // 物理微振
        holeProgress = 1 - Math.pow(1 - holeProgress, 4.5);
        const curHoleR = maxHoleRadius * holeProgress * jolt;

        // 破洞扩展时，在边缘高频激发微尘与碎纤维粒子
        if (elapsed < holeDuration && Math.random() > 0.3) {
          const scrapAngle = Math.random() * Math.PI * 2;
          const sx = center.x + Math.cos(scrapAngle) * curHoleR;
          const sy = center.y + Math.sin(scrapAngle) * curHoleR;
          spawnScraps(sx, sy, Math.floor(Math.random() * 2) + 1, 0.75);
        }

        // --- 2. 物理崩断与不规则角位移 (Stage 2) ---
        let tearProgress = 0;
        if (elapsed > holeDuration) {
          const tTime = elapsed - holeDuration;
          tearProgress = Math.min(tTime / tearDuration, 1);

          // 物理抗拉力曲线：初期挣扎断裂 -> 加速扯断 -> 自重/角速度滑逸
          const rawPhysProgress = Math.pow(tearProgress, 2.5); // 加速
          const resistanceShudder =
            Math.sin(tearProgress * Math.PI * 8) * 0.015 * (1 - tearProgress); // 被撕裂时的震颤
          const activeProgress = Math.min(rawPhysProgress + resistanceShudder, 1);

          const baseForce = Math.hypot(w, h) * 0.72;
          const currentTearDist = activeProgress * baseForce;

          // 带有空气阻力和非对称旋转
          vTopRight = {
            x: normX * currentTearDist + Math.pow(tearProgress, 1.5) * 75,
            y: normY * currentTearDist - Math.pow(tearProgress, 1.8) * 45,
          };
          vBottomLeft = {
            x: -normX * currentTearDist - Math.pow(tearProgress, 1.5) * 45,
            y: -normY * currentTearDist + Math.pow(tearProgress, 1.8) * 65,
          };

          // 由于双手撕扯非绝对对称、自重、空气力学，两半纸片随位移产生旋转（不均匀扭矩）
          angleTopRight =
            Math.sin(tearProgress * 1.3) * 0.055 + tearProgress * 0.062;
          angleBottomLeft =
            -Math.sin(tearProgress * 1.5) * 0.048 - tearProgress * 0.055;

          // 爆裂物理碎纸：崩断瞬间爆发式喷射粒子
          if (tearProgress < 0.25 && Math.random() > 0.1) {
            const splitRatio = Math.random();
            const px = pStart.x + diagDx * splitRatio;
            const py = pStart.y + diagDy * splitRatio;
            spawnScraps(px, py, Math.floor(Math.random() * 3) + 2, 1.25);
          }
        }

        // 3D卷边与透视倾斜矩阵（Skew/Curl）
        const skewTop = tearProgress * 0.045;
        const skewBottom = -tearProgress * 0.045;

        // 沿对角线从右下往回（t=1 → t=0）构建撕裂边缘：
        // 远离中心处为对角线锯齿毛刺，进入破洞范围后环绕洞缘弧线。
        // side = 1 右上半张，side = -1 左下半张。
        const buildEdge = (side: 1 | -1): Point[] => {
          // 落入破洞范围的参数区间 [tLo, tHi]
          let tLo = 0;
          let tHi = 0;
          let found = false;
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            if (Math.hypot(rawX(t) - center.x, rawY(t) - center.y) < curHoleR) {
              if (!found) {
                tLo = t;
                found = true;
              }
              tHi = t;
            }
          }

          const edge: Point[] = [];
          for (let i = steps; i >= 0; i--) {
            const t = i / steps;
            const dist = Math.hypot(rawX(t) - center.x, rawY(t) - center.y);

            if (found && dist < curHoleR) {
              // 绕行破洞弧线：从 45° 起扫过半边圆弧，附剥离卷曲
              const u = tHi > tLo ? (tHi - t) / (tHi - tLo) : 0;
              const angle =
                side === 1 ? Math.PI / 4 - u * Math.PI : Math.PI / 4 + u * Math.PI;
              const peelBack = 12 * Math.sin(u * Math.PI); // 撕口向后剥离
              const edgeR =
                curHoleR + (noiseTable[i % noiseTable.length] || 0) + peelBack;
              edge.push({
                x: center.x + Math.cos(angle) * edgeR + normX * 8 * side,
                y: center.y + Math.sin(angle) * edgeR + normY * 8 * side,
              });
            } else {
              // 锯齿断裂缝
              const jagged =
                noiseTable[i % noiseTable.length] * (1 + tearProgress * 0.15);
              edge.push({
                x: rawX(t) + normX * jagged * side,
                y: rawY(t) + normY * jagged * side,
              });
            }
          }
          return edge;
        };

        // 渲染一张发生物理撕裂扭曲的厚纸瓣
        const drawFlap = (
          edge: Point[],
          shift: Point,
          rotation: number,
          skew: number,
          isTopRight: boolean,
        ) => {
          ctx.save();
          // 应用旋转、平移和由于扯力产生的剪切形变 (物理倾斜)
          ctx.translate(center.x + shift.x, center.y + shift.y);
          ctx.rotate(rotation);
          ctx.transform(1, skew, 0, 1, 0, 0); // 纸张拉扯形变
          ctx.translate(-center.x, -center.y);

          // 物理纸质重叠投影：阴影随撕裂进程放大和偏转
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = 32 + tearProgress * 24;
          ctx.shadowOffsetX =
            (isTopRight ? normX * 14 + tearProgress * 30 : -normX * 14 - tearProgress * 15) *
            (1 - tearProgress * 0.5);
          ctx.shadowOffsetY =
            (isTopRight ? normY * 14 - tearProgress * 10 : -normY * 14 + tearProgress * 30) *
            (1 - tearProgress * 0.5);

          ctx.beginPath();
          if (isTopRight) {
            // 右上半张外框
            ctx.moveTo(pStart.x, pStart.y);
            ctx.lineTo(w + 60, -60);
            ctx.lineTo(w + 60, pEnd.y);
          } else {
            // 左下半张外框
            ctx.moveTo(pStart.x, pStart.y);
            ctx.lineTo(-60, h + 60);
            ctx.lineTo(pEnd.x, h + 60);
          }
          for (const pt of edge) ctx.lineTo(pt.x, pt.y);
          ctx.closePath();
          ctx.fillStyle = paperColor;
          ctx.fill();

          // 撕扯出的纤维毛边 (Deckle Layer)
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.strokeStyle = fiberColor;
          ctx.lineWidth = 4 + (1 - tearProgress) * 2; // 纤维拉伸感
          ctx.stroke();

          // 撕口卷边的高光与背影（营造 3D 撕纸剥离反光）
          ctx.strokeStyle =
            currentTheme === "dark"
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.08)";
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // 破洞边缘的纸浆纤维毛刺（吸附在各自纸片上）
          if (curHoleR > 2) {
            for (const fiber of fibers) {
              if (fiber.side !== (isTopRight ? 1 : -1)) continue;
              const r = curHoleR * fiber.radiusFrac;
              const sx = center.x + Math.cos(fiber.angle) * r;
              const sy = center.y + Math.sin(fiber.angle) * r;
              const ex = sx + Math.cos(fiber.angle) * fiber.len;
              const ey = sy + Math.sin(fiber.angle) * fiber.len;
              ctx.save();
              ctx.globalAlpha = fiber.alpha * holeProgress;
              ctx.strokeStyle = fiberColor;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(ex, ey);
              ctx.stroke();
              ctx.restore();
            }
          }

          ctx.restore();
        };

        // 渲染两大撕裂纸瓣（底层会投影在新页面上）
        drawFlap(buildEdge(1), vTopRight, angleTopRight, skewTop, true);
        drawFlap(buildEdge(-1), vBottomLeft, angleBottomLeft, skewBottom, false);

        // --- 更新与物理渲染空中飘飞的碎片与纸屑粒子 (Gravity & Drag & Tumbling) ---
        for (let i = scraps.length - 1; i >= 0; i--) {
          const s = scraps[i];
          s.vx *= s.drag;
          s.vy *= s.drag;
          s.vy += s.gravity; // 物理重力
          s.x += s.vx;
          s.y += s.vy;
          s.angle += s.rotSpeed; // 旋转动量

          s.life++;
          if (s.life >= s.maxLife) {
            s.alpha -= 0.04;
          }

          if (s.alpha <= 0 || s.y > h + 40 || s.x < -40 || s.x > w + 40) {
            scraps.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.angle);
          ctx.globalAlpha = Math.max(s.alpha, 0);

          // 碎片微弱的环境遮蔽投影
          ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetY = 2;

          ctx.beginPath();
          ctx.moveTo(s.points[0].x, s.points[0].y);
          for (let p = 1; p < s.points.length; p++) {
            ctx.lineTo(s.points[p].x, s.points[p].y);
          }
          ctx.closePath();
          ctx.fillStyle = s.color;
          ctx.fill();

          // 纸屑纤维边缘
          ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
          ctx.lineWidth = 0.6;
          ctx.stroke();

          ctx.restore();
        }

        if (elapsed < totalDuration || scraps.length > 0) {
          requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, w, h);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(render);
    });
  };

  if (!mounted) {
    return <div className="size-9 rounded-lg" />;
  }

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={triggerTearTransition}
            disabled={isAnimating}
            aria-label={
              isDark ? ui.themeToggle.switchToLight : ui.themeToggle.switchToDark
            }
            className="group relative flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/80 p-2 text-foreground backdrop-blur transition-colors hover:border-foreground/40 hover:bg-muted disabled:cursor-default disabled:opacity-70"
          >
            {isDark ? (
              <svg
                className="size-4.5 transition-transform duration-300 group-hover:-rotate-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                className="size-4.5 transition-transform duration-300 group-hover:rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDark ? ui.themeToggle.light : ui.themeToggle.dark}</p>
        </TooltipContent>
      </Tooltip>

      {/* 挂载到全屏最高层级的撕纸 Canvas */}
      {isAnimating &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
            <canvas ref={canvasRef} className="block size-full" />
          </div>,
          document.body,
        )}
    </>
  );
}
