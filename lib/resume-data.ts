export type Language = "en" | "zh";

export type SocialLink = {
  label: string;
  href: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type Project = {
  badge?: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  source: string;
  featured?: boolean;
  gradient: string;
};

export type ResumeData = {
  name: string;
  firstName: string;
  role: string;
  tagline: string;
  email: string;
  location: string;
  availability: string;
  about: string[];
  socials: SocialLink[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  projects: Project[];
  education: {
    degree: string;
    school: string;
    period: string;
  }[];
};

/** File name used by every PDF download entry point. */
export const RESUME_FILE_NAME = "Donovan-Su-Resume.pdf";

// ---- English content ------------------------------------------------------

export const resumeEn: ResumeData = {
  name: "Donovan Su",
  firstName: "Donovan",
  role: "Embedded Software & Edge AI Engineer",
  tagline:
    "Specializing in low-latency IoT systems and Edge AI — bridging low-level microcontroller firmware with multimodal cloud AI pipelines.",
  email: "adnegveill66@gmail.com",
  location: "Guangdong, China",
  availability: "Open to internships & project collaborations",
  about: [
    "Currently focused on embedded firmware, edge-cloud collaborative AI, and hardware-software system design. Experienced in ESP32 firmware development, FreeRTOS multitasking and concurrent scheduling, as well as end-to-end IoT system delivery spanning device, cloud, and application layers.",
    "Specialized in resource-constrained ESP32 real-time systems (ISR deferral, peripheral concurrency, and image pipelines), backed by strong mathematical foundations, database tuning, and modern web toolchains.",
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/kukuve" },
    { label: "LinkedIn", href: "https://linkedin.com/in/kukuve" },
    { label: "Email", href: "mailto:adnegveill66@gmail.com" },
  ],
  experience: [
    {
      role: "Database & Systems Optimization Intern",
      company: "Healthcare Clinic Business Systems",
      period: "2024",
      location: "Guangdong, China",
      summary:
        "Led schema refactoring and query optimization for clinical outpatient records and prescription management workflows.",
      highlights: [
        "Normalized legacy denormalized schemas into strict Third Normal Form (3NF), resolving data insertion anomalies and redundancy.",
        "Profiled slow multi-table joins using EXPLAIN and deployed composite indexes, significantly reducing query response latency.",
        "Implemented automated database backup scripts and data integrity verification workflows to guarantee reliable disaster recovery.",
      ],
    },
  ],
  skills: [
    {
      title: "Embedded & IoT",
      skills: [
        "ESP32 / ESP32-CAM",
        "STM32",
        "FreeRTOS",
        "TinyML / Edge AI",
        "UART / SPI / I2C",
        "Low-Power Design",
      ],
    },
    {
      title: "Languages",
      skills: ["C", "C++", "Java", "Python", "TypeScript", "SQL"],
    },
    {
      title: "Dev & Toolchains",
      skills: ["PlatformIO", "VS Code", "Git", "Linux CLI", "Docker", "MySQL"],
    },
    {
      title: "Web & Systems",
      skills: [
        "Next.js",
        "Tailwind CSS",
        "shadcn/ui",
        "RESTful APIs",
        "System Architecture",
      ],
    },
    {
      title: "Backend & Cloud",
      skills: [
        "FastAPI",
        "Python",
        "SQLAlchemy",
        "Docker / Docker Compose",
        "Serverless (CloudBase)",
      ],
    },
    {
      title: "Data & AI Pipelines",
      skills: [
        "ETL & RSS Scraping",
        "OpenAI API Integration",
        "RESTful API Design",
      ],
    },
  ],
  projects: [
    {
      title: "Finical — HK Stock & Web3 Intelligence Capsule",
      badge: "FIN", 
      description:
        "An automated financial intelligence platform delivering curated daily market capsules via WeChat Mini Program. Features a dual-backend architecture (WeChat CloudBase Serverless & containerized FastAPI), scheduled multi-source RSS ingestion, CoinGecko market telemetry, and an LLM summarization pipeline with zero-cost extractive fallback resilience.",
      tags: [
        "WeChat Mini Program",
        "FastAPI",
        "Python",
        "Docker",
        "CloudBase Serverless",
        "OpenAI GPT-4o",
        "ETL Pipeline",
      ],
      link: "https://github.com/kukuve/FinicalWeb3",
      source: "https://github.com/kukuve/FinicalWeb3",
      featured: true,
      gradient: "from-cyan-500/25 via-blue-500/10 to-transparent",
    },
    {
      title: "Smart Vision IoT Glasses (MVP)",
      badge: "IoT",
      description:
        "Wearable Edge AI hardware prototype based on ESP32-CAM. Implements FreeRTOS task scheduling for low-power frame acquisition, asynchronous cloud vision model streaming, and real-time multimodal feedback.",
      tags: ["ESP32-CAM", "FreeRTOS", "C/C++", "PlatformIO", "Edge AI API"],
      link: "https://github.com/kukuve/Aiglasses",
      source: "https://github.com/kukuve/Aiglasses",
      featured: true,
      gradient: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    },
    {
      title: "Clinical Mini Program",
      badge: "Medical",
      description:
        "Full-stack serverless retail platform for chain pharmacies built with Vue 3, uni-app, and WeChat CloudBase. Implements atomic NoSQL transactions for high-concurrency order settlement and stock consistency, strict finite state machine transitions for order lifecycles, and automated unit testing achieving 80%+ coverage with Jest.",
      tags: ["Vue 3", "uni-app", "CloudBase", "Node.js", "Jest", "NoSQL"],
      link: "https://github.com/kukuve/Pharmacy-Mini-program",
      source: "https://github.com/kukuve/Pharmacy-Mini-program",
      featured: true,
      gradient: "from-sky-500/25 via-cyan-500/10 to-transparent",
    },
    {
      title: "Modern Engineering Portfolio & Resume Engine",
      badge: "Portfolio",
      description:
        "High-performance personal website built with Next.js App Router and Tailwind CSS, featuring decoupled data architecture, instant dark-mode persistence, and dedicated zero-loss print styling for PDF export.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      link: "https://github.com/kukuve/MyWeb",
      source: "https://github.com/kukuve/MyWeb",
      featured: false,
      gradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
    },
  ],
  education: [
    {
      degree: "",
      school: "",
      period: "",
    },
  ],
};

// ---- Chinese content --------------------------------------------------------

export const resumeZh: ResumeData = {
  name: "苏栋",
  firstName: "栋",
  role: "嵌入式软件与边缘智能工程师",
  tagline:
    "专注低延迟物联网系统与边缘智能 —— 打通微控制器底层固件与多模态云端 AI 管道。",
  email: "adnegveill66@gmail.com",
  location: "中国 广东",
  availability: "开放实习与项目合作机会",
  about: [
    "目前聚焦嵌入式固件、端云协同 AI 与软硬件系统设计。具备 ESP32 平台固件开发、FreeRTOS 多任务并发调度，以及从设备端到云端再到应用端的完整物联网系统落地经验。",
    "关注约束下的系统权衡：以中断只做入队、重活交给任务的模型保障实时性，用互斥量串行化共享外设访问，在内存有限的 ESP32 上完成图像采集与上行。在硬件实验之余，深入探索数学底座、数据库慢查询调优与现代 Web 工程工具链。",
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/kukuve" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your_username" },
    { label: "邮箱", href: "mailto:adnegveill66@gmail.com" },
  ],
  experience: [
    {
      role: "数据库与系统架构优化实习生",
      company: "医疗门诊业务系统",
      period: "2024",
      location: "中国 广东",
      summary:
        "主导门诊病案与中药处方流转系统的关系数据库架构重构与多表查询性能调优。",
      highlights: [
        "重构历史冗余宽表，严格实现第三范式（3NF）建模，消除了并发写入冲突与数据更新异常。",
        "使用 EXPLAIN 深入分析慢查询执行计划，针对高频病历检索建立复合索引，大幅削减查询响应延迟。",
        "编写自动化数据库定期冷备脚本与校验机制，保障医疗数据的完整性与灾备能力。",
      ],
    },
  ],
  skills: [
    {
      title: "嵌入式与物联网",
      skills: [
        "ESP32 / ESP32-CAM",
        "STM32",
        "FreeRTOS",
        "TinyML / Edge AI",
        "UART / SPI / I2C",
        "低功耗设计",
      ],
    },
    {
      title: "编程语言",
      skills: ["C", "C++", "Java", "Python", "TypeScript", "SQL"],
    },
    {
      title: "工具链与平台",
      skills: [
        "PlatformIO",
        "VS Code",
        "Git",
        "Linux 终端",
        "Docker",
        "MySQL",
      ],
    },
    {
      title: "Web 与系统基础",
      skills: [
        "Next.js",
        "Tailwind CSS",
        "shadcn/ui",
        "RESTful 接口",
        "系统架构",
      ],
    },
    {
      title: "后端与云原生",
      skills: [
        "FastAPI",
        "Python",
        "SQLAlchemy",
        "Docker / Docker Compose",
        "Serverless（云开发）",
      ],
    },
    {
      title: "数据与 AI 管线",
      skills: [
        "ETL 与 RSS 采集",
        "OpenAI API 集成",
        "RESTful API 设计",
      ],
    },
  ],
  projects: [
    {
      title: "Finical — 港股与 Web3 每日智能情报胶囊",
      badge: "金融",
      description:
        "面向港股与 Web3 领域的自动化金融情报聚合分发平台。采用微信小程序前端配合双轨后端（微信云开发 Serverless 与独立 FastAPI 容器化服务）；构建了多源 RSS 定时清洗与 CoinGecko 行情采集管线；集成 GPT-4o-mini 实现每日智能研报生成，并设计了 API 熔断自动降级的启发式摘要容灾策略。",
      tags: [
        "微信小程序",
        "FastAPI",
        "Python",
        "Docker",
        "云开发 Serverless",
        "OpenAI GPT-4o",
        "ETL 数据管线",
      ],
      link: "https://github.com/kukuve/FinicalWeb3",
      source: "https://github.com/kukuve/FinicalWeb3",
      featured: true,
      gradient: "from-cyan-500/25 via-blue-500/10 to-transparent",
    },
    {
      title: "智能视觉 IoT 交互眼镜 (MVP)",
      badge: "智能",
      description:
        "基于 ESP32-CAM 构建的可穿戴边缘智能原型。采用 FreeRTOS 进行低功耗图像采集调度，打通 Wi-Fi 异步图像推流至云端多模态视觉模型，实现毫秒级端侧视觉识别。",
      tags: ["ESP32-CAM", "FreeRTOS", "C/C++", "PlatformIO", "Edge AI API"],
      link: "https://github.com/your_username/vision-glasses",
      source: "https://github.com/your_username/vision-glasses",
      featured: true,
      gradient: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    },
    {
      title: "门诊医疗小程序",
      badge: "医疗",
      description:
        "基于 Vue 3 + uni-app 与微信云开发打造的医药新零售全栈电商方案。核心采用 NoSQL 事务机制保障高并发下单库存原子扣减与卡券核销一致性，结合状态机严谨控制订单生命周期流转，并引入覆盖率达 80%+ 的 Jest 自动化测试保障资金结算安全。",
      tags: ["Vue 3", "uni-app", "微信云开发", "Node.js", "事务一致性", "Jest"],
      link: "https://github.com/kukuve/Pharmacy-Mini-program",
      source: "https://github.com/kukuve/Pharmacy-Mini-program",
      featured: true,
      gradient: "from-sky-500/25 via-cyan-500/10 to-transparent",
    },
    {
      title: "现代工程风个人履历主页",
      badge: "个人",
      description:
        "基于 Next.js App Router 与 Tailwind CSS 开发的高性能个人主页，实现数据与 UI 完全解耦、暗色模式自动记忆，并内置免额外插件的一键无损 PDF 简历打印排版系统。",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      link: "https://github.com/kukuve/MyWeb",
      source: "https://github.com/kukuve/MyWeb",
      featured: false,
      gradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
    },
  ],
  education: [
    {
      degree: "",
      school: "",
      period: "",
    },
  ],
};

// ---- Unified dictionaries ------------------------------------------------------

export const resumeData: Record<Language, ResumeData> = {
  en: resumeEn,
  zh: resumeZh,
};

// ---- UI chrome text ------------------------------------------------------------

export type UiText = {
  nav: {
    links: { label: string; href: string }[];
    resume: string;
    backToTop: string;
    mainNav: string;
    mobileNav: string;
    toggleMenu: string;
  };
  themeToggle: {
    switchToLight: string;
    switchToDark: string;
    light: string;
    dark: string;
  };
  languageToggle: { title: string };
  hero: {
    greeting: string;
    downloadPdf: string;
    viewProjects: string;
    scrollToAbout: string;
  };
  console: {
    codeTab: string;
    terminalTab: string;
    bashTitle: string;
    hint: string;
    placeholder: string;
    help: string;
    whoami: string;
    skills: string;
    matrix: string;
    notFound: string;
    exit: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    stats: { value: string; label: string }[];
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
  };
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    exploringPrefix: string;
    exploringTopics: [string, string];
    exploringAnd: string;
    exploringSuffix: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    featured: string;
    featuredHint: string;
    viewSource: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    sayHello: string;
    downloadPdf: string;
  };
  footer: {
    rights: string;
    builtWith: string;
  };
};

export const uiText: Record<Language, UiText> = {
  en: {
    nav: {
      links: [
        { label: "About", href: "#about" },
        { label: "Experience", href: "#experience" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Contact", href: "#contact" },
      ],
      resume: "Resume",
      backToTop: "Back to top",
      mainNav: "Main",
      mobileNav: "Mobile",
      toggleMenu: "Toggle menu",
    },
    themeToggle: {
      switchToLight: "Switch to light mode",
      switchToDark: "Switch to dark mode",
      light: "Light mode",
      dark: "Dark mode",
    },
    languageToggle: { title: "Switch language / 切换语言" },
    hero: {
      greeting: "Hi, I'm",
      downloadPdf: "Download PDF",
      viewProjects: "View Projects",
      scrollToAbout: "Scroll to about section",
    },
    console: {
      codeTab: "developer.config.ts",
      terminalTab: "terminal",
      bashTitle: "bash — 80x24",
      hint: "Type help to view commands, or matrix for a surprise.",
      placeholder: "Type a command...",
      help: "Available: whoami, skills, matrix, clear",
      whoami: "Donovan Su — Full-Stack & Systems Developer",
      skills: "Next.js, TypeScript, Python, FastAPI, Docker, C/C++",
      matrix: "Entering the Matrix...",
      notFound: "command not found: ",
      exit: "Exit [ESC]",
    },
    about: {
      eyebrow: "01 — About",
      title: "Embedded engineer, systems thinker.",
      description:
        "A short story about how I got here and what drives the way I build.",
      stats: [
        { value: "2+", label: "Years of hands-on building" },
        { value: "10+", label: "Hardware & software prototypes" },
        { value: "4", label: "Tech domains, silicon to UI" },
        { value: "∞", label: "Curiosity for edge intelligence" },
      ],
    },
    experience: {
      eyebrow: "02 — Experience",
      title: "Where I've optimized and shipped.",
      description:
        "Hands-on work across database systems and hardware-software co-design.",
    },
    skills: {
      eyebrow: "03 — Skills",
      title: "A toolkit spanning silicon to UI.",
      description: "The languages, boards and toolchains I reach for daily.",
      exploringPrefix: "Always exploring — currently diving into",
      exploringTopics: ["TinyML quantization", "multimodal edge pipelines"],
      exploringAnd: "and",
      exploringSuffix: ".",
    },
    projects: {
      eyebrow: "04 — Projects",
      title: "Selected work, from breadboard to browser.",
      description:
        "A few things I've designed, engineered, and shipped — hover around, they react.",
      featured: "Featured",
      featuredHint: "Highlighted work I'm proud of",
      viewSource: "View source",
    },
    contact: {
      eyebrow: "05 — Contact",
      title: "Let's build something great.",
      description:
        "I'm currently open to internships and interesting project collaborations.",
      sayHello: "Say hello",
      downloadPdf: "Download PDF",
    },
    footer: {
      rights: "All rights reserved.",
      builtWith: "Built with Next.js, Tailwind CSS, shadcn/ui & Framer Motion",
    },
  },
  zh: {
    nav: {
      links: [
        { label: "关于", href: "#about" },
        { label: "经历", href: "#experience" },
        { label: "技能", href: "#skills" },
        { label: "项目", href: "#projects" },
        { label: "联系", href: "#contact" },
      ],
      resume: "简历",
      backToTop: "返回顶部",
      mainNav: "主导航",
      mobileNav: "移动端导航",
      toggleMenu: "切换菜单",
    },
    themeToggle: {
      switchToLight: "切换到浅色模式",
      switchToDark: "切换到深色模式",
      light: "浅色模式",
      dark: "深色模式",
    },
    languageToggle: { title: "切换语言 / Switch language" },
    hero: {
      greeting: "你好，我是",
      downloadPdf: "下载 PDF 简历",
      viewProjects: "查看项目",
      scrollToAbout: "滚动到关于部分",
    },
    console: {
      codeTab: "developer.config.ts",
      terminalTab: "终端",
      bashTitle: "bash — 80x24",
      hint: "输入 help 查看可用命令，或输入 matrix 有惊喜。",
      placeholder: "输入命令…",
      help: "可用命令：whoami、skills、matrix、clear",
      whoami: "苏栋 (Donovan Su) — 全栈与系统开发工程师",
      skills: "Next.js, TypeScript, Python, FastAPI, Docker, C/C++",
      matrix: "正在进入 Matrix…",
      notFound: "未找到命令：",
      exit: "退出 [ESC]",
    },
    about: {
      eyebrow: "01 — 关于",
      title: "嵌入式工程师，系统级思考者。",
      description: "我的成长轨迹，以及驱动我构建系统的内核。",
      stats: [
        { value: "2+", label: "年动手实践开发" },
        { value: "10+", label: "硬件与软件原型" },
        { value: "4", label: "大技术领域，从硅片到界面" },
        { value: "∞", label: "对边缘智能的好奇心" },
      ],
    },
    experience: {
      eyebrow: "02 — 经历",
      title: "我在哪里优化并交付过。",
      description: "数据库系统与软硬件协同设计的实战履历。",
    },
    skills: {
      eyebrow: "03 — 技能",
      title: "从硅片到界面的工具链。",
      description: "我日常使用的语言、开发板与工程工具链。",
      exploringPrefix: "持续探索 —— 当前深耕",
      exploringTopics: ["TinyML 量化", "多模态边缘推理管道"],
      exploringAnd: "与",
      exploringSuffix: "。",
    },
    projects: {
      eyebrow: "04 — 项目",
      title: "精选项目：",
      description: "一些我设计、实现并交付的作品 —— 移动鼠标试试，它们会回应你。",
      featured: "精选",
      featuredHint: "我引以为豪的代表作",
      viewSource: "查看源码",
    },
    contact: {
      eyebrow: "05 — 联系",
      title: "一起做点有意思的事。",
      description: "目前开放实习与有挑战的项目合作机会。",
      sayHello: "打个招呼",
      downloadPdf: "下载 PDF 简历",
    },
    footer: {
      rights: "保留所有权利。",
      builtWith: "使用 Next.js、Tailwind CSS、shadcn/ui 与 Framer Motion 构建",
    },
  },
};
