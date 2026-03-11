"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
        animate: { y: [0, -10, 0] },
        transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  return (
    <Wrapper className={className} {...animateProps}>
      <Image
        src="/ciguena-avatar.png"
        alt="Cigüeña de Ciguenapp"
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
        priority
      />
    </Wrapper>
  );
}
