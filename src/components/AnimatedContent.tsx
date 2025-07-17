import React, { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedContentProps {
  children: ReactNode;
  routeKey: string; // Used to trigger animations on route changes
  className?: string;
}

/**
 * A simplified AnimatedContent component that provides:
 * 1. Page transitions (fade in/out)
 * 2. Simple container for children (which may include AnimatedText components)
 */
const AnimatedContent: React.FC<AnimatedContentProps> = ({ 
  children, 
  routeKey,
  className = ''
}) => {
  const [showContent, setShowContent] = useState(true);
  
  // Handle page transitions
  useEffect(() => {
    // Hide content initially to transition in
    setShowContent(false);
    
    // Short delay before showing new content
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [routeKey]);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  };
  
  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          key={`animated-content-${routeKey}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className={`animated-content-wrapper ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedContent; 