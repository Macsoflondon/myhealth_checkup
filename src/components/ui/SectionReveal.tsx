import { useReducedMotion, motion } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Wraps a section in a framer-motion reveal animation.
 * - Fades + rises 24px into view when scrolled into viewport.
 * - Fires once, triggers when element is 10% inside the viewport.
 * - Short-circuits to a plain <div> when prefers-reduced-motion is set.
 */
const SectionReveal = ({ children, delay = 0, className }: SectionRevealProps) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
