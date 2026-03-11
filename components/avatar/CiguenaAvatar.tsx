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
        animate: { y: [0, -10, 0] },
        transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
      }
    : {};

  const scale = size / 200;

  return (
    <Wrapper className={className} {...animateProps}>
      <svg
        width={size}
        height={size * 0.85}
        viewBox="0 0 240 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Tail feathers ── */}
        <path d="M52 108 Q35 100 28 118 Q40 112 38 125 Q48 112 52 124 Q55 112 60 122 Q60 108 52 108Z"
          fill="white" stroke="#3B1A6E" strokeWidth="2" strokeLinejoin="round"/>
        {/* black tips on tail */}
        <path d="M28 118 Q25 122 30 126 Q33 118 38 125" fill="#1E1B4B"/>
        <path d="M38 125 Q36 130 42 132 Q44 122 48 128" fill="#1E1B4B"/>

        {/* ── Body ── */}
        <ellipse cx="115" cy="108" rx="60" ry="27"
          fill="white" stroke="#3B1A6E" strokeWidth="2.5"
          transform="rotate(-8 115 108)"/>

        {/* ── Belly / chest (soft lavender) ── */}
        <ellipse cx="140" cy="110" rx="30" ry="18"
          fill="#F5F3FF" stroke="none"
          transform="rotate(-8 140 110)"/>

        {/* ── Neck ── */}
        <path d="M168 90 Q182 72 185 55"
          stroke="white" strokeWidth="16" strokeLinecap="round" fill="none"/>
        <path d="M168 90 Q182 72 185 55"
          stroke="#3B1A6E" strokeWidth="2" strokeLinecap="round" fill="none"/>

        {/* ── Head ── */}
        <circle cx="182" cy="46" r="22" fill="white" stroke="#3B1A6E" strokeWidth="2.5"/>

        {/* ── Eye ── */}
        <circle cx="191" cy="41" r="5" fill="#3B1A6E"/>
        <circle cx="192.5" cy="39.5" r="2" fill="white"/>
        <circle cx="192.5" cy="39.5" r="0.8" fill="#3B1A6E"/>

        {/* ── Blush ── */}
        <ellipse cx="185" cy="51" rx="6" ry="3.5" fill="#E05FA0" opacity="0.3"/>

        {/* ── Beak (long, orange-yellow) ── */}
        <path d="M196 46 L232 56 L196 52 Z"
          fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round"/>

        {/* ── Bundle string ── */}
        <path d="M232 56 Q235 70 228 88"
          stroke="#3B1A6E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

        {/* ── Bundle cloth ── */}
        <circle cx="224" cy="106" r="22"
          fill="white" stroke="#7C3AED" strokeWidth="2.5"/>

        {/* ── Bundle fabric folds ── */}
        <path d="M206 97 Q215 93 226 97" stroke="#EDE9FE" strokeWidth="1.5" fill="none"/>
        <path d="M203 106 Q215 102 228 106" stroke="#EDE9FE" strokeWidth="1.5" fill="none"/>

        {/* ── Bundle bow/knot ── */}
        {/* left loop */}
        <path d="M214 87 Q207 80 212 74 Q218 78 216 86Z" fill="#E05FA0" stroke="#C026D3" strokeWidth="1"/>
        {/* right loop */}
        <path d="M230 87 Q237 80 232 74 Q226 78 228 86Z" fill="#E05FA0" stroke="#C026D3" strokeWidth="1"/>
        {/* knot center */}
        <circle cx="222" cy="86" r="4" fill="#C026D3"/>

        {/* ── Baby face peeking from bundle ── */}
        <circle cx="222" cy="112" r="10" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1"/>
        {/* tiny eyes */}
        <circle cx="218" cy="110" r="1.8" fill="#3B1A6E"/>
        <circle cx="226" cy="110" r="1.8" fill="#3B1A6E"/>
        {/* tiny smile */}
        <path d="M218 114 Q222 117 226 114"
          stroke="#E05FA0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* baby blush */}
        <ellipse cx="216" cy="113" rx="2.5" ry="1.5" fill="#E05FA0" opacity="0.4"/>
        <ellipse cx="228" cy="113" rx="2.5" ry="1.5" fill="#E05FA0" opacity="0.4"/>

        {/* ── Upper wing (main, spread up) ── */}
        <path d="M138 84 Q118 55 90 42 Q108 62 104 76 Q122 60 128 76Z"
          fill="white" stroke="#3B1A6E" strokeWidth="2" strokeLinejoin="round"/>
        {/* black wingtip feathers */}
        <path d="M90 42 Q83 47 88 55 Q94 47 99 54 Q100 45 104 50"
          stroke="#1E1B4B" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M84 49 Q80 55 86 60" stroke="#1E1B4B" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* ── Lower wing hint (lavender, trailing behind) ── */}
        <path d="M128 126 Q112 148 88 152 Q104 140 105 130 Q118 146 124 132Z"
          fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* lower wing black tips */}
        <path d="M88 152 Q82 155 85 162 Q91 154 96 160"
          stroke="#1E1B4B" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* ── Legs trailing back ── */}
        <line x1="108" y1="130" x2="82" y2="160"
          stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
        <line x1="122" y1="132" x2="98" y2="164"
          stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>

        {/* ── Feet ── */}
        <path d="M82 160 L73 160 M82 160 L78 168 M82 160 L88 165"
          stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M98 164 L89 164 M98 164 L94 172 M98 164 L104 169"
          stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>

        {/* ── Subtle sparkles around (decorative) ── */}
        <path d="M55 55 L57 50 L59 55 L57 60Z" fill="#C026D3" opacity="0.6"/>
        <path d="M200 160 L202 155 L204 160 L202 165Z" fill="#E05FA0" opacity="0.5"/>
        <circle cx="70" cy="145" r="2.5" fill="#7C3AED" opacity="0.4"/>
        <circle cx="165" cy="30" r="2" fill="#E05FA0" opacity="0.5"/>
      </svg>
    </Wrapper>
  );
}
