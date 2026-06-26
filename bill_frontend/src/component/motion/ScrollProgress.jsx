import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — thin gradient bar pinned to the top edge that tracks
 * page scroll. Cheap (transform-only) and decorative.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand-500 via-accent-400 to-brand-500"
    />
  );
}
