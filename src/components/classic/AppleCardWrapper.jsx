import React, { useRef, useState, useCallback } from 'react';
import { m, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

/**
 * AppleCardWrapper
 *
 * Reusable Apple Mac-inspired card container with:
 *  - Dynamic 3D perspective tilt (rotateX, rotateY) on cursor hover
 *  - Interactive radial light spotlight / metallic glare that tracks mouse position
 *  - Hardware-accelerated Apple spring physics cubic-bezier(0.16, 1, 0.3, 1)
 *  - Hairline translucent glass border & subtle shadow lift
 *  - Touch safety (disables tilt on touch devices to ensure clean page scrolling)
 *
 * Scroll cost: the tilt and spotlight are motion values, so moving the mouse never re-renders React,
 * and hover only starts when the mouse itself moves. A card scrolling in under a still cursor stays put,
 * otherwise every card the wheel passes would tilt and repaint its shadow mid-scroll.
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

  // Framer Motion Raw Values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${spotX}% ${spotY}%, rgba(255, 255, 255, ${glareOpacity}), transparent 40%)`;

  // Apple Spring Config (fast response, high damping for smooth stability)
  const springConfig = { stiffness: 260, damping: 20, mass: 0.5 };
  const rotateX = useSpring(rawX, springConfig);
  const rotateY = useSpring(rawY, springConfig);

  const handlePointerMove = useCallback(
    (e) => {
      if (e.pointerType !== 'mouse' || !cardRef.current) return;
      // Scrolling under a still cursor fires pointer events with no movement: ignore them
      if (!e.movementX && !e.movementY) return;
      if (!isHovered) setIsHovered(true);
      if (!enableTilt) return;
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      rawX.set(((mouseY - centerY) / centerY) * -maxTilt);
      rawY.set(((mouseX - centerX) / centerX) * maxTilt);

      // Spotlight percent offset for CSS radial gradient
      spotX.set((mouseX / rect.width) * 100);
      spotY.set((mouseY / rect.height) * 100);
    },
    [enableTilt, maxTilt, isHovered, rawX, rawY, spotX, spotY]
  );

  const handlePointerLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <m.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative group rounded-3xl transition-shadow duration-500 ease-out ${
        isHovered
          ? 'shadow-apple-hover dark:shadow-apple-dark-hover z-20'
          : 'shadow-apple dark:shadow-apple-dark z-10'
      } ${className}`}
      {...props}
    >

      {/* Interactive Cursor Spotlight Glare Overlay (Apple Metallic Light Reflectance) */}
      {isHovered && (
        <m.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-30"
          style={{ background: spotlight }}
        />
      )}

      {/* Card Content Wrapper */}
      <div className="relative z-10 h-full w-full rounded-3xl overflow-hidden">
        {children}
      </div>
    </m.div>
  );
};

export default AppleCardWrapper;
