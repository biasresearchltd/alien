import React, { ReactNode, useEffect, useRef, Children, isValidElement, useState, cloneElement, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  randomVariation?: number;
  onComplete?: () => void;
  component?: 'ul' | 'ol' | 'div';
}

// Define a type for the enhanced child props
interface EnhancedChildProps {
  itemActive?: boolean;
  children?: ReactNode;
  [key: string]: any; // Allow for additional props
}

// Define a type for AnimatedText props
interface AnimatedTextProps {
  waitForParent?: boolean;
  [key: string]: any; // Allow for additional props
}

/**
 * Animated List component that renders children with staggered animations
 * Uses a more direct approach to reduce potential for render loops
 * Implements progressive slowdown for more natural timing
 * Coordinates nested animations to ensure proper sequencing
 */
const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  staggerDelay = 0.05,
  randomVariation = 0.08,
  onComplete,
  component = 'ul'
}) => {
  // Use ref to track mounted status
  const isMountedRef = useRef(false);
  const [activeAnimations, setActiveAnimations] = useState<number[]>([]);
  
  const childArray = Children.toArray(children).filter(child => 
    child !== null && 
    (typeof child !== 'string' || child.trim() !== '')
  );
  
  // Reset animation when component mounts or children change
  useEffect(() => {
    isMountedRef.current = true;
    setActiveAnimations([]);
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Component cleanup
  useEffect(() => {
    return () => {
      if (onComplete && isMountedRef.current) {
        // Only call onComplete if still mounted
        setTimeout(() => {
          if (isMountedRef.current) {
            onComplete();
          }
        }, calculateTotalAnimationTime(childArray.length, staggerDelay));
      }
    };
  }, [childArray.length, onComplete, staggerDelay]);
  
  // Calculate progressive delays that slow down as the list goes on
  const getProgressiveDelay = (index: number) => {
    // Base delay increases slightly as we go further down the list
    const progressiveFactor = 1 + (index * randomVariation);
    return staggerDelay * progressiveFactor;
  };
  
  // Calculate total animation time for all children with progressive delay
  const calculateTotalAnimationTime = (itemCount: number, baseDelay: number) => {
    let totalTime = 0;
    for (let i = 0; i < itemCount; i++) {
      totalTime += getProgressiveDelay(i) * 1000;
    }
    return totalTime + 500; // Add buffer time
  };
  
  // Handle the animation completion of an individual item
  const handleItemAnimationComplete = (index: number) => {
    if (!activeAnimations.includes(index)) {
      setActiveAnimations(prev => [...prev, index]);
    }
  };
  
  // Type-safe check if an element is an AnimatedText component
  const isAnimatedText = (element: ReactNode): element is ReactElement => {
    return isValidElement(element) && 
           element.type != null && 
           typeof element.type !== 'string' && 
           (element.type as any).name === 'AnimatedText';
  };
  
  // Clone children to pass animation control props
  const enhanceChildren = (child: ReactNode, index: number): ReactNode => {
    if (!isValidElement(child) || typeof child.type === 'string') {
      return child;
    }
    
    // Cast to ReactElement to work with props
    const element = child as ReactElement;
    
    // Check if child contains AnimatedText components
    const childrenArray = React.Children.toArray(element.props.children);
    const hasAnimatedText = childrenArray.some(grandchild => isAnimatedText(grandchild));
    
    if (hasAnimatedText) {
      // Create enhanced props with type safety
      const enhancedProps: EnhancedChildProps = {
        ...element.props,
        itemActive: activeAnimations.includes(index)
      };
      
      // Process children with type safety
      const enhancedChildren = React.Children.map(element.props.children, (grandchild) => {
        if (isAnimatedText(grandchild)) {
          // Create props for AnimatedText with type safety
          const textProps: AnimatedTextProps = {
            ...grandchild.props,
            waitForParent: true, // Always set to true initially
            canStart: activeAnimations.includes(index) // Only start when parent is ready
          };
          
          return cloneElement(grandchild, textProps);
        }
        return grandchild;
      });
      
      enhancedProps.children = enhancedChildren;
      
      return cloneElement(element, enhancedProps);
    }
    
    return child;
  };
  
  // Animation variants
  const containerVariants = {
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: staggerDelay
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 3 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      } 
    }
  };
  
  // Create component with proper tag
  const Component = component as any;
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Component 
        className={className}
        style={{
          padding: 0,
          margin: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        {childArray.map((child, index) => (
          <motion.li
            key={index}
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              listStyle: 'none'
            }}
            variants={itemVariants}
            custom={index}
            transition={{
              delay: index > 0 ? getProgressiveDelay(index) : 0,
              duration: 0.2 + (index * 0.01), // Slightly increase duration for later items
              ease: "easeOut"
            }}
            onAnimationComplete={() => handleItemAnimationComplete(index)}
          >
            {enhanceChildren(child, index)}
          </motion.li>
        ))}
      </Component>
    </motion.div>
  );
};

export default AnimatedList; 