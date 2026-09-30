<div align="center">

# Donovan Su — Resume

**Embedded Software & Edge AI Engineer**
嵌入式软件 & 边缘 AI 工程师

*Specializing in low-latency IoT systems and Edge AI — bridging low-level microcontroller firmware with multimodal cloud AI pipelines.*
*专攻低延迟物联网系统与边缘 AI，桥接底层 MCU 固件与多模态云端 AI 管线。*

</div>

---

## Live Demo · 在线体验

<!-- TODO: 部署至 Vercel 后替换为真实地址 · Replace with the deployed URL after deploying to Vercel -->
`https://<your-deployment>.vercel.app`

## Tech Stack · 技术栈

| Layer | Stack |
| --- | --- |
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| UI | Tailwind CSS v4 · shadcn/ui · Radix · Framer Motion · next-themes |
| Graphics | Native Canvas 2D physics · 原生 Canvas 2D 物理模拟 |
| PDF | pdf-lib + @pdf-lib/fontkit · Node.js runtime |

## Highlights · 技术壁垒

**Physics-based paper-tear theme switch · Canvas 物理撕纸主题切换**

Toggling the theme swaps the real DOM instantly; a top layer of the old theme's "paper" is punctured at the click point into a tear with fibrous, jagged edges, then ripped along a diagonal. The two halves break away under tear-resistance trembling, asymmetric rotational inertia, shear deformation and gravity, flinging out polygonal scraps driven by gravity, air drag and angular velocity.

切换明暗主题时，真实 DOM 即刻切换；顶层旧主题「纸张」从点击点戳出带纤维毛刺的破洞，再沿对角线撕裂。两半纸片在抗撕阻力震颤、非对称旋转惯性、剪切形变与重力拖拽下脱离，撕口抛出受重力 / 空气阻力 / 角速度驱动的多边形碎纸粒子。

**Terminal-triggered Matrix rain · 终端召唤代码雨**

The hero ships an interactive terminal (`help` / `whoami` / `skills` / `matrix` / `clear`); typing `matrix` summons a full-screen Canvas code rain — 3D character streams collide with the "metal surface", splashing out physical water-droplet particles and expanding ripples. `ESC` to exit.

Hero 内置交互式终端（`help` / `whoami` / `skills` / `matrix` / `clear`），输入 `matrix` 触发全屏 Canvas 代码雨：3D 字符瀑布与金属表面碰撞，溅出物理水珠粒子与扩散涟漪，`ESC` 退出。

**Lossless PDF export (EN / ZH) · 无损 PDF 导出（中英文）**

An A4 resume is laid out server-side with pdf-lib — vector text, selectable and copyable. The full Noto Sans SC character set ships with the repo and is re-subsetted per PDF at save time to stay compact; CJK text without spaces is measured character-by-character for wrapping, so both English and Chinese resumes export losslessly.

服务端用 pdf-lib 手动排版 A4 简历，矢量文字、可选中复制。内置完整 Noto Sans SC 全字符集，保存时按 PDF 重新子集化保持体积紧凑；针对 CJK 无空格文本实现逐字测量换行，中英双语简历均无损导出。

**Hydration-safe bilingual · 双语言 · 无水合闪烁**

Fully bilingual EN / ZH content built on `useSyncExternalStore` hydration-safe state management — zero hydration mismatch for both theme and language.

EN / 中文双语内容，基于 `useSyncExternalStore` 的水合安全状态管理，主题与语言零 hydration mismatch。

---

<div align="center">

Built with Next.js 16 · React 19 · TypeScript · Tailwind CSS v4

</div>
