import { useEffect, useState } from 'react';

/**
 * A hook that helps manage sequential animations across multiple elements
 * Useful for animating lists of items in a staggered sequence
 */
export const useSequentialAnimation = (
  itemCount: number,
  options = {
    baseDelay: 0.05,
    staggerDelay: 0.03,
    autoStart: true
  }
) => {
  const [visibleCount, setVisibleCount] = useState(options.autoStart ? itemCount : 0);
  const [isAnimating, setIsAnimating] = useState(options.autoStart);
  
  // Start the animation sequence
  const startAnimation = () => {
    setIsAnimating(true);
    setVisibleCount(0);
  };
  
  // Reset animation state
  const resetAnimation = () => {
    setIsAnimating(false);
    setVisibleCount(0);
  };
  
  // Complete the animation immediately
  const completeAnimation = () => {
    setVisibleCount(itemCount);
    setIsAnimating(false);
  };

  // Main animation effect
  useEffect(() => {
    if (!isAnimating) return;
    
    // If all items are visible, mark animation as complete
    if (visibleCount >= itemCount) {
      setIsAnimating(false);
      return;
    }
    
    // Stagger the appearance of items
    const nextItem = visibleCount + 1;
    const delay = options.baseDelay + nextItem * options.staggerDelay;
    
    const timer = setTimeout(() => {
      setVisibleCount(prev => prev + 1);
    }, delay * 1000); // Convert to milliseconds
    
    return () => clearTimeout(timer);
  }, [visibleCount, itemCount, isAnimating, options.baseDelay, options.staggerDelay]);

  // Helper to check if a specific item should be visible
  const isItemVisible = (index: number) => index < visibleCount;
  
  return {
    isItemVisible,
    visibleCount,
    isAnimating,
    startAnimation,
    resetAnimation,
    completeAnimation
  };
};

export default useSequentialAnimation; 