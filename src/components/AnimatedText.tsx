import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  element?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | 'li' | 'a';
  className?: string;
  preserveWhitespace?: boolean;
  onComplete?: () => void;
  delay?: number; // Add delay before starting animation
  waitForParent?: boolean; // Whether to wait for parent animation
  canStart?: boolean; // Signal from parent that it's okay to start
}

/**
 * AnimatedText component that renders text character by character
 * Uses a simpler sequential approach for better reliability
 * With more organic, human-like timing
 * Supports coordination with parent container animations
 */
const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  element = 'span',
  className = '',
  preserveWhitespace = false,
  onComplete,
  delay = 0, // Default no delay
  waitForParent = false, // Default to not waiting
  canStart = true // Default to being able to start
}) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(delay === 0 && !waitForParent && canStart);
  
  // Handle initial delay before starting animation and parent coordination
  useEffect(() => {
    // Only start if we're allowed to start by parent (when applicable)
    if (waitForParent && !canStart) {
      setIsStarted(false);
      return;
    }
    
    if (delay > 0 && !isStarted) {
      const startTimer = setTimeout(() => {
        setIsStarted(true);
      }, delay);
      return () => clearTimeout(startTimer);
    } else if (!isStarted && (!waitForParent || canStart)) {
      // Small additional delay to ensure parent animation has completed
      const parentReadyDelay = 100; // Increased for better visibility
      const startTimer = setTimeout(() => {
        setIsStarted(true);
      }, parentReadyDelay);
      return () => clearTimeout(startTimer);
    }
  }, [delay, isStarted, waitForParent, canStart]);
  
  // Watch for changes to canStart prop to properly coordinate with parent animation
  useEffect(() => {
    if (waitForParent && canStart && !isStarted) {
      // Add a small delay to ensure parent animation has fully completed
      const triggerDelay = 120;
      const startTimer = setTimeout(() => {
        setIsStarted(true);
      }, triggerDelay);
      return () => clearTimeout(startTimer);
    }
  }, [canStart, waitForParent, isStarted]);
  
  // Reset and start animation when text changes or when ready to start
  useEffect(() => {
    if (!isStarted) return;
    
    setVisibleChars(0);
    setIsComplete(false);
    
    let timeout: NodeJS.Timeout;
    let charIndex = 0;
    
    const animateNextChar = () => {
      if (charIndex < text.length) {
        charIndex++;
        setVisibleChars(charIndex);
        
        // Progressive timing: typing slows down as the text gets longer
        // This mimics a human typist who might slow down while thinking
        const progressiveFactor = 1 + (charIndex * 0.005); // Subtle increase
        let baseDelay = 40 * progressiveFactor; // Base delay in ms - slightly higher
        
        // Slow down for punctuation
        const currentChar = text[charIndex - 1];
        if (['.', '!', '?'].includes(currentChar)) {
          baseDelay = 250; // Much longer pause after end of sentence
        } else if ([',', ';', ':'].includes(currentChar)) {
          baseDelay = 180; // Medium pause after mid-sentence punctuation
        } else if (currentChar === ' ') {
          baseDelay = 60; // Slight pause after words
        }
        
        // Occasional "thinking" pause (more common as text progresses)
        const randomThinkingFactor = Math.random();
        const thinkingThreshold = 0.98 - (charIndex * 0.001); // Gradually more likely to pause
        if (randomThinkingFactor > thinkingThreshold) {
          baseDelay += 100 + (Math.random() * 150); // Add a random "thinking" pause
        }
        
        // Add natural variation
        baseDelay += Math.random() * 30 - 10;
        
        timeout = setTimeout(animateNextChar, baseDelay);
      } else {
        setIsComplete(true);
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 150); // Slight delay before calling onComplete
        }
      }
    };
    
    // Small initial delay before starting
    timeout = setTimeout(animateNextChar, 80);
    
    return () => clearTimeout(timeout);
  }, [text, onComplete, isStarted]);
  
  // Create array of characters with animated wrappers
  const animatedChars = text.split('').map((char, index) => {
    const isVisible = index < visibleChars;
    
    return (
      <AnimatePresence key={index} mode="wait">
        {isVisible && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{ 
              display: 'inline-block',
              whiteSpace: preserveWhitespace ? 'pre' : 'normal'
            }}
          >
            {char}
          </motion.span>
        )}
      </AnimatePresence>
    );
  });
  
  // Component-specific styles
  const componentStyle = {
    display: 'block',
    width: '100%',
    whiteSpace: preserveWhitespace ? 'pre-wrap' as const : 'normal' as const,
    wordBreak: 'break-word' as const
  };
  
  // Render with specified element type
  const Component = element as any;
  
  return (
    <Component 
      className={`animated-text ${className} ${isComplete ? 'complete' : ''} ${!isStarted ? 'waiting' : ''}`}
      style={componentStyle}
    >
      {animatedChars}
    </Component>
  );
};

export default AnimatedText; 