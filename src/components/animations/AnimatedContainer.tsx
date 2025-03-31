// src/components/animations/AnimatedContainer.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useScrollAnimation, fadeInUpVariants } from '../../hooks/useAnimation';

interface AnimatedContainerProps {
  children: React.ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  variants = fadeInUpVariants,
  delay = 0,
  className,
}) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
      custom={delay}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;