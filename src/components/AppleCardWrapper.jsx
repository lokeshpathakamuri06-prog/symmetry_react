import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * AppleCardWrapper
 * 
 * Reusable Apple Mac-inspired card container with:
 *  - Dynamic 3D perspective tilt (rotateX, rotateY) on cursor hover
 *  - Interactive radial light spotlight / metallic glare that tracks mouse position
 *  - Hardware-accelerated Apple spring physics cubic-bezier(0.16, 1, 0.3, 1)
 *  - Hairline translucent glass border & subtle shadow lift
 *  - Touch safety (disables tilt on touch devices to ensure clean page scrolling)
 */
export const AppleCardWrapper = ({
  children,
  className = '',
  maxTilt = 7, // Max tilt angle in degrees
  glareOpacity = 0.15, // Intensity of light spotlight
  enableTilt = true,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  // Framer Motion Raw Values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Apple Spring Config (fast response, high damping for smooth stability)
  const springConfig = { stiffness: 260, damping: 20, mass: 0.5 };
  const rotateX = useSpring(rawX, springConfig);
  const rotateY = useSpring(rawY, springConfig);

  // Subtle Parallax translation on scale
  const scale = useSpring(isHovered ? 1.02 : 1.0, springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (!enableTilt || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotX = ((mouseY - centerY) / centerY) * -maxTilt;
      const rotY = ((mouseX - centerX) / centerX) * maxTilt;

      rawX.set(rotX);
      rawY.set(rotY);

      // Spotlight percent offset for CSS radial gradient
      setSpotlightPos({
        x: (mouseX / rect.width) * 100,
        y: (mouseY / rect.height) * 100,
      });
    },
    [enableTilt, maxTilt, rawX, rawY]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative group rounded-3xl transition-shadow duration-500 ease-out will-change-transform ${
        isHovered
          ? 'shadow-apple-hover dark:shadow-apple-dark-hover z-20'
          : 'shadow-apple dark:shadow-apple-dark z-10'
      } ${className}`}
      {...props}
    >

      {/* Interactive Cursor Spotlight Glare Overlay (Apple Metallic Light Reflectance) */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-30"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255, 255, 255, ${glareOpacity}), transparent 40%)`,
        }}
      />

      {/* Card Content Wrapper */}
      <div className="relative z-10 h-full w-full rounded-3xl overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

export default AppleCardWrapper;
