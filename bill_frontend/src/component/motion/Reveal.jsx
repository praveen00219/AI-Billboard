import { motion } from "framer-motion";

/* Shared easing + variants so motion feels consistent app-wide */
export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

/**
 * Reveal — fades/slides children into view on scroll. Cheap, GPU-friendly,
 * and automatically neutralized by the global reduced-motion rules.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  once = true,
  as = "div",
}) {
  const MotionTag = motion[as] ?? motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
      }}
    >
      {children}
    </MotionTag>
  );
}
