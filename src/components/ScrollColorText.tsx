import React, { useEffect, useRef, useState } from 'react';

interface ScrollColorTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  threshold?: number;
}

const ScrollColorText: React.FC<ScrollColorTextProps> = ({
  children,
  className = '',
  colors = ['text-gray-900', 'text-blue-600', 'text-purple-600', 'text-green-600'],
  threshold = 0.1
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const elementTop = rect.top;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;

            // Calculate how much of the element is visible
            const visibleTop = Math.max(0, -elementTop);
            const visibleBottom = Math.min(elementHeight, windowHeight - elementTop);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            // Calculate scroll progress (0 to 1)
            const progress = visibleHeight / elementHeight;
            setScrollProgress(progress);
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Check every 1% of visibility
        rootMargin: '-10% 0px -10% 0px' // Trigger slightly before/after entering viewport
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  // Calculate which color to use based on scroll progress
  const getCurrentColor = () => {
    const colorIndex = Math.floor(scrollProgress * (colors.length - 1));
    return colors[Math.min(colorIndex, colors.length - 1)];
  };

  return (
    <div
      ref={elementRef}
      className={`${className} transition-colors duration-300 ${getCurrentColor()}`}
    >
      {children}
    </div>
  );
};

export default ScrollColorText;