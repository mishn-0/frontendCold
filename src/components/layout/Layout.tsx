// src/components/layout/Layout.tsx
import React from 'react';
import { Box, styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64, // Height of the navbar
  marginLeft: 240, // Width of the sidebar
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
  },
}));

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.6, 0.05, -0.01, 0.9],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <LayoutContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="exit"
          variants={pageVariants}
          style={{ width: '100%', height: '100%' }}
        >
          <MainContent>
            {children}
          </MainContent>
        </motion.div>
      </AnimatePresence>
    </LayoutContainer>
  );
};

export default Layout;