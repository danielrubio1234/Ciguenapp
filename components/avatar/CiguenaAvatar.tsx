"use client";

import { motion } from "framer-motion";

interface CiguenaAvatarProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function CiguenaAvatar({
  size = 120,
  animate = true,
  className = "",
}: CiguenaAvatarProps) {
  const Wrapper = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        animate: { y: [0, -8, 0] },
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  return (
    <Wrapper className={className} {...animateProps}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="60" cy="68" rx="28" ry="32" fill="white" stroke="#1A1A2E" strokeWidth="2" />
        {/* Belly */}
        <ellipse cx="60" cy="75" rx="18" ry="20" fill="#FFF8F5" stroke="#E94560" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Head */}
        <circle cx="60" cy="30" r="18" fill="white" stroke="#1A1A2E" strokeWidth="2" />
        {/* Eye left */}
        <circle cx="54" cy="27" r="3" fill="#1A1A2E" />
        <circle cx="55" cy="26" r="1" fill="white" />
        {/* Eye right */}
        <circle cx="66" cy="27" r="3" fill="#1A1A2E" />
        <circle cx="67" cy="26" r="1" fill="white" />
        {/* Beak */}
        <path d="M56 33 L60 40 L64 33" fill="#F4A261" stroke="#E94560" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Blush left */}
        <ellipse cx="49" cy="33" rx="4" ry="2.5" fill="#E94560" opacity="0.25" />
        {/* Blush right */}
        <ellipse cx="71" cy="33" rx="4" ry="2.5" fill="#E94560" opacity="0.25" />
        {/* Hat / nurse cap */}
        <path d="M44 20 Q60 6 76 20" fill="#E94560" stroke="#1A1A2E" strokeWidth="1.5" />
        <rect x="55" y="10" width="10" height="8" rx="2" fill="white" stroke="#E94560" strokeWidth="1" />
        <line x1="60" y1="11" x2="60" y2="17" stroke="#E94560" strokeWidth="1.5" />
        <line x1="57" y1="14" x2="63" y2="14" stroke="#E94560" strokeWidth="1.5" />
        {/* Wing left */}
        <path d="M32 55 Q20 50 28 70 Q32 75 36 65" fill="white" stroke="#1A1A2E" strokeWidth="1.5" />
        {/* Wing right */}
        <path d="M88 55 Q100 50 92 70 Q88 75 84 65" fill="white" stroke="#1A1A2E" strokeWidth="1.5" />
        {/* Legs */}
        <line x1="52" y1="98" x2="48" y2="110" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1="98" x2="72" y2="110" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" />
        {/* Feet */}
        <path d="M42 110 L48 110 L50 108" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M78 110 L72 110 L70 108" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </Wrapper>
  );
}
