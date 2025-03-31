// src/components/animations/ParallaxSection.tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Box } from '@mui/material';

interface ParallaxSectionProps {
  children: React.ReactNode;
  offset?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  offset = 100,
  direction = 'up'
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  let x = 0;
  let y = 0;
  
  if (direction === 'up') y = offset;
  if (direction === 'down') y = -offset;
  if (direction === 'left') x = offset;
  if (direction === 'right') x = -offset;
  
  const transformX = useTransform(scrollYProgress, [0, 1], [0, x]);
  const transformY = useTransform(scrollYProgress, [0, 1], [0, y]);
  
  return (
    <Box ref={ref} sx={{ overflow: 'hidden' }}>
      <motion.div style={{ x: transformX, y: transformY }}>
        {children}
      </motion.div>
    </Box>
  );
};

export default ParallaxSection;