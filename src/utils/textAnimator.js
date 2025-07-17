/**
 * Character-by-character animation system using GSAP
 * Creates a Claude-like typing effect with natural timing
 */
import { gsap } from 'gsap';

// Store active animations for cleanup
let activeAnimations = [];

// Debug mode for logging
const DEBUG = false;

/**
 * Log debug information if debug mode is enabled
 */
const debug = (message) => {
  if (DEBUG) {
    console.log(`[TextAnimator] ${message}`);
  }
};

/**
 * Kill all running animations and reset everything
 */
const clearAllAnimations = () => {
  debug("Clearing all animations");
  
  // Kill all GSAP animations globally
  gsap.killTweensOf("*");
  
  // Kill all tracked timelines
  activeAnimations.forEach(timeline => {
    if (timeline && timeline.isActive && timeline.isActive()) {
      timeline.kill();
    }
  });
  
  // Reset the array
  activeAnimations = [];
  
  // Find and remove all animation wrappers
  document.querySelectorAll('.alien-animation-wrapper').forEach(wrapper => {
    try {
      if (wrapper.parentElement) {
        wrapper.parentElement.removeChild(wrapper);
      }
    } catch (e) {
      console.error("Error removing animation wrapper:", e);
    }
  });
  
  // Find and reset all animation classes
  document.querySelectorAll('.alien-animating').forEach(el => {
    try {
      el.classList.remove('alien-animating');
      el.style.visibility = '';
      el.style.opacity = '';
      el.style.position = ''; // Reset position which might have been modified
      
      // Clean up any animation-specific attributes
      ['data-char-index', 'data-char-delay'].forEach(attr => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
    } catch (e) {
      console.error("Error resetting element:", e);
    }
  });
  
  // Find and clean up any character spans that might have been left over
  document.querySelectorAll('.alien-char').forEach(charSpan => {
    try {
      if (charSpan.parentElement) {
        charSpan.parentElement.removeChild(charSpan);
      }
    } catch (e) {
      console.error("Error removing character span:", e);
    }
  });
  
  // Force a small repaint delay to ensure DOM is fully updated
  setTimeout(() => {
    debug("Cleanup complete");
  }, 10);
};

/**
 * Get random value between min and max
 */
const getRandomValue = (min, max) => {
  return min + Math.random() * (max - min);
};

/**
 * Generate Claude-like typing delays for a set of characters
 * This creates a natural typing feel with minimal variations
 */
const generateTypingDelays = (count) => {
  const delays = [];
  
  // Claude-like timing parameters
  const baseSpeed = 0.018; // Base typing speed (average time between characters)
  const variationFactor = 0.3; // How much variation to add (0-1)
  
  debug(`Generating typing delays for ${count} characters`);
  
  // Generate a baseline sequential delay sequence
  let currentTime = 0;
  for (let i = 0; i < count; i++) {
    // Small random variation to simulate natural typing
    const randomVariation = getRandomValue(-baseSpeed * variationFactor, baseSpeed * variationFactor);
    currentTime += baseSpeed + randomVariation;
    
    // Slight pause after punctuation (like a human would do)
    const char = i > 0 ? delays[i-1] : 0;
    if ('.?!,:;'.includes(char)) {
      currentTime += baseSpeed * 2; // Slight pause after punctuation
    }
    
    delays.push(currentTime);
  }
  
  debug(`Generated delays: min=${Math.min(...delays)}, max=${Math.max(...delays)}`);
  
  return delays;
};

/**
 * Animate characters with Claude-like typing effect
 */
const animateCharsSequentially = (charElements, timeline) => {
  if (!charElements.length) return 0;
  
  debug(`Animating ${charElements.length} characters sequentially`);
  
  // Generate typing-like timing for all characters
  const delays = generateTypingDelays(charElements.length);
  
  // Animate each character with its specific delay
  charElements.forEach((charEl, index) => {
    const delay = delays[index];
    
    // Simple Claude-like appearance animation - just opacity with no effects
    timeline.fromTo(
      charEl,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 0.01, // Very quick appear effect
        delay: delay,
        ease: "none" // Linear easing for clean appearance
      },
      0 // Start all at time 0, delays will handle timing
    );
  });
  
  // Return the maximum delay used - useful for timing subsequent elements
  const maxDelay = Math.max(...delays) + 0.02; // Small buffer
  debug(`Max delay for this text element: ${maxDelay}s`);
  return maxDelay;
};

/**
 * Split text into individual character spans for animation
 */
const splitTextIntoChars = (element) => {
  if (!element || !element.textContent.trim()) {
    debug("Skipping empty element");
    return null;
  }
  
  // Skip if already being animated
  if (element.classList.contains('alien-animating')) {
    debug("Element is already being animated, skipping");
    return null;
  }
  
  debug(`Splitting text into chars: "${element.textContent.substring(0, 20)}${element.textContent.length > 20 ? '...' : ''}"`);
  
  // Flag the element as being animated
  element.classList.add('alien-animating');
  
  // Create a container for our animated characters
  const animContainer = document.createElement('div');
  animContainer.classList.add('alien-animation-wrapper');
  animContainer.style.position = 'absolute';
  animContainer.style.top = '0';
  animContainer.style.left = '0';
  animContainer.style.width = '100%';
  animContainer.style.height = '100%';
  animContainer.style.zIndex = '10';
  animContainer.style.pointerEvents = 'none';
  animContainer.style.whiteSpace = 'pre-wrap'; // Preserve whitespace
  
  // Get the original text content
  const text = element.textContent;
  
  // Store original styles and visibility
  const originalVisibility = element.style.visibility;
  
  // Get computed style to clone appearance
  const computedStyle = window.getComputedStyle(element);
  
  // Make sure element is positioned for absolute positioning
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }
  
  // Temporarily hide the original content
  element.style.visibility = 'hidden';
  
  // Create character elements
  const charElements = [];
  
  // Create each character as a separate span
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
    span.style.opacity = '0'; // Start invisible
    
    // Copy key styles from the original element
    span.style.color = computedStyle.color;
    span.style.fontFamily = computedStyle.fontFamily;
    span.style.fontSize = computedStyle.fontSize;
    span.style.fontWeight = computedStyle.fontWeight;
    span.style.fontStyle = computedStyle.fontStyle;
    span.style.letterSpacing = computedStyle.letterSpacing;
    span.style.textDecoration = computedStyle.textDecoration;
    span.style.display = 'inline-block';
    
    // Add a marker class to easily identify it
    span.classList.add('alien-char');
    
    charElements.push(span);
    animContainer.appendChild(span);
  }
  
  // Add the container to the element
  element.appendChild(animContainer);
  
  debug(`Created ${charElements.length} character spans`);
  
  return {
    element,
    charElements,
    container: animContainer,
    originalVisibility
  };
};

/**
 * Animate element with Claude-like character-by-character animation
 * Returns the maximum animation delay used (useful for subsequent elements)
 */
const animateTextElement = (element) => {
  debug(`Animating text element: ${element.tagName}`);
  
  // Split the text into characters
  const split = splitTextIntoChars(element);
  if (!split) return 0;
  
  // Create a master timeline
  const timeline = gsap.timeline({
    onComplete: () => {
      // Clean up when animation completes
      debug(`Animation complete for text element`);
      if (split.element.contains(split.container)) {
        split.element.removeChild(split.container);
        split.element.style.visibility = split.originalVisibility || '';
      }
      split.element.classList.remove('alien-animating');
    }
  });
  
  // Animate characters with Claude-like timing
  const maxDelay = animateCharsSequentially(split.charElements, timeline);
  
  // Track this animation
  activeAnimations.push(timeline);
  
  return maxDelay;
};

/**
 * Animate a simple element (non-text or container)
 */
const animateSimpleElement = (element, options = {}) => {
  if (!element) return 0;
  
  debug(`Animating simple element: ${element.tagName}`);
  
  const defaults = {
    duration: 0.3,
    ease: "power1.out",
    delay: 0
  };
  
  const settings = { ...defaults, ...options };
  
  // Mark as animated
  element.classList.add('alien-animating');
  
  // Simple fade-in with no movement (Claude-like)
  const timeline = gsap.timeline();
  timeline.fromTo(
    element,
    { 
      opacity: 0
    },
    { 
      opacity: 1, 
      duration: settings.duration,
      ease: settings.ease,
      delay: settings.delay,
      onComplete: () => {
        element.classList.remove('alien-animating');
      }
    }
  );
  
  // Track this animation
  activeAnimations.push(timeline);
  
  // Return the total animation time (delay + duration)
  return settings.delay + settings.duration;
};

/**
 * Check if element should get character animation
 */
const shouldGetCharAnimation = (element) => {
  // Skip elements that shouldn't get animation
  if (!element || 
      element.classList.contains('no-animate') ||
      element.classList.contains('alien-animating') ||
      element.tagName === 'BUTTON' ||
      element.tagName === 'INPUT' ||
      element.tagName === 'IMG' ||
      element.closest('.no-animate') ||
      element.closest('.alien-animation-wrapper')) {
    return false;
  }
  
  // Only animate text-containing elements with substantial text
  const text = element.textContent?.trim() || '';
  return text.length > 1 && element.children.length < 3;
};

/**
 * Animate a row of elements with proper timing coordination
 * Each element waits for any preceding text animations to complete
 */
const animateRowWithCoordination = async (rowElements) => {
  if (!rowElements || !rowElements.length) return;
  
  debug(`Animating row with ${rowElements.length} elements`);
  
  // Track the maximum delay used so far in this row
  let rowMaxDelay = 0;
  
  // Loop through each element in the row (left to right)
  for (const element of rowElements) {
    // Double-check that the element is still valid and not already being animated
    if (!element || 
        !element.isConnected || 
        element.classList.contains('alien-animating') ||
        element.closest('.alien-animating')) {
      debug(`Skipping invalid or already animating element`);
      continue;
    }
    
    // Also check that no ancestor is being animated (to prevent duplication)
    let skipElement = false;
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains('alien-animating')) {
        skipElement = true;
        break;
      }
      parent = parent.parentElement;
    }
    
    if (skipElement) {
      debug(`Skipping element because an ancestor is already being animated`);
      continue;
    }
    
    const isTextElement = shouldGetCharAnimation(element);
    debug(`Element is ${isTextElement ? 'text' : 'non-text'} element`);
    
    // Element should wait for the maximum delay so far in this row
    const elementDelay = rowMaxDelay;
    
    let elementMaxDelay = 0;
    
    if (isTextElement) {
      // For text elements, do character animation with Claude-like timing
      const textDelay = animateTextElement(element);
      elementMaxDelay = textDelay;
      debug(`Text element max delay: ${textDelay}s`);
    } else {
      // For non-text elements, simple animation with existing row delay
      elementMaxDelay = animateSimpleElement(element, { delay: elementDelay });
      debug(`Non-text element max delay: ${elementMaxDelay}s`);
    }
    
    // Update the row's maximum delay
    rowMaxDelay = Math.max(rowMaxDelay, elementMaxDelay);
    
    // Very small pause between processing elements 
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  
  debug(`Row animation complete, max delay was ${rowMaxDelay}s`);
};

/**
 * Animate elements grouped by row, ensuring proper timing
 */
const animateElementsByRow = async (elements) => {
  if (!elements || !elements.length) {
    debug("No elements to animate");
    return;
  }
  
  debug(`Animating ${elements.length} elements by row`);
  
  // Group elements by row
  const rows = [];
  let currentRow = [];
  let currentTop = -1;
  
  // First sort everything by vertical position
  elements.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    
    // If on same row, sort left to right
    if (Math.abs(rectA.top - rectB.top) < 5) {
      return rectA.left - rectB.left;
    }
    
    // Otherwise sort top to bottom
    return rectA.top - rectB.top;
  });
  
  // Then group them by row
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    
    // If this element is on a new row
    if (currentTop === -1 || rect.top > currentTop + 5) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [element];
      currentTop = rect.top;
    } else {
      // Same row, add to current row (should already be in left-to-right order)
      currentRow.push(element);
    }
  });
  
  // Add the last row if it exists
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  
  debug(`Grouped elements into ${rows.length} rows`);
  
  // Animate each row with coordinated timing - minimal delay between rows for Claude-like flow
  for (let i = 0; i < rows.length; i++) {
    debug(`Animating row ${i+1} of ${rows.length}`);
    await animateRowWithCoordination(rows[i]);
    
    // Small delay between rows - shorter for Claude-like continuous flow
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  debug("All rows animated");
};

/**
 * Main function to animate content
 * Returns a promise that resolves when all animations are complete
 */
export const animateAllContent = async () => {
  debug("Starting animateAllContent");
  
  // First, clean up any existing animations
  clearAllAnimations();
  
  // Get the main content
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) {
    debug("No main content found");
    return Promise.resolve(); // Return resolved promise if no content
  }
  
  // Simple fade in for main container
  gsap.fromTo(
    mainContent, 
    { opacity: 0.95 }, 
    { opacity: 1, duration: 0.2, ease: "power1.out" }
  );
  
  // Track elements we've already processed to avoid duplicates
  const processedElements = new Set();
  
  // Get all text elements for animation, starting with the highest level elements first
  // Order by hierarchy to ensure we don't animate children of elements we're already animating
  const selectors = ['h1', 'h2', 'h3', 'p', '.category-item', 'li', 'a:not([href="#"])'];
  
  const allElements = [];
  
  // Process each selector in order (container elements first)
  for (const selector of selectors) {
    const elements = Array.from(mainContent.querySelectorAll(selector))
      .filter(el => {
        // Skip elements we've already processed or are ancestors of processed elements
        if (processedElements.has(el)) return false;
        
        // Skip elements with animation-related classes
        if (el.classList.contains('no-animate') || 
            el.classList.contains('alien-animating') ||
            el.closest('.alien-animating') || 
            el.closest('.no-animate')) return false;
        
        // Skip hidden elements
        if (window.getComputedStyle(el).display === 'none') return false;
        
        // Skip special elements that shouldn't be animated
        if (el.matches('.alien-title, button, input, .alien-animation-wrapper')) return false;
        
        // Skip elements that are children of elements we've already selected
        for (const processed of processedElements) {
          if (processed.contains(el)) return false;
        }
        
        // Add to processed set
        processedElements.add(el);
        return true;
      });
    
    allElements.push(...elements);
  }
  
  debug(`Found ${allElements.length} unique elements to animate`);
  
  // Animate elements by row with coordination
  await animateElementsByRow(allElements);
  
  debug("Animation sequence complete");
  
  // Return a promise that resolves after a short delay to ensure all GSAP animations are truly done
  return new Promise(resolve => {
    setTimeout(() => {
      debug("All animations fully complete");
      resolve();
    }, 100);
  });
};

/**
 * Animate text in a specific container
 */
export const animateTextInContainer = async (container) => {
  if (!container) return;
  
  debug(`Animating text in container: ${container.tagName}`);
  
  const elements = Array.from(
    container.querySelectorAll('h1, h2, h3, p, a, li, .category-item')
  ).filter(el => !el.classList.contains('no-animate') && !el.classList.contains('alien-animating'));
  
  debug(`Found ${elements.length} elements in container to animate`);
  
  await animateElementsByRow(elements);
};

/**
 * Animate a single element
 */
export const animateText = (element) => {
  if (!element || element.classList.contains('alien-animating')) return;
  
  debug(`Directly animating element: ${element.tagName}`);
  
  if (shouldGetCharAnimation(element)) {
    animateTextElement(element);
  } else {
    animateSimpleElement(element);
  }
};

export default {
  animateText,
  animateTextInContainer,
  animateAllContent,
  clearAllAnimations
}; 