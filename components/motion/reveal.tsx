"use client";

import { motion, type Variants } from "framer-motion";

const directions = {
  up: { hidden: { y: 24 }, visible: { y: 0 } },
  down: { hidden: { y: -24 }, visible: { y: 0 } },
  left: { hidden: { x: 32 }, visible: { x: 0 } },
  right: { hidden: { x: -32 }, visible: { x: 0 } },
  none: { hidden: {}, visible: {} },
} as const;

type RevealProps = {
  children: React.ReactNode;
  direction?: keyof typeof directions;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, ...directions[direction].hidden },
    visible: {
      opacity: 1,
      ...directions[direction].visible,
      transition: { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-64px" }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
};

/** Parent container that staggers the entrance of its Reveal/motion children. */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child item to pair with Stagger. */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
