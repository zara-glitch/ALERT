import React, { useId } from 'react';

interface AlertNowLogoProps {
  className?: string;
  variant?: 'icon' | 'full';
}

export default function AlertNowLogo({ className = 'w-12 h-12', variant = 'icon' }: AlertNowLogoProps) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, '');

  const goldMetallicId = `gold-metallic-${safeId}`;
  const goldHaloId = `gold-halo-${safeId}`;
  const premiumShadowId = `premium-shadow-${safeId}`;
  const goldTextId = `gold-text-${safeId}`;

  // Solid fallback gold color in case gradient fails
  const solidGold = '#D4AF37';
  
  const renderIconSVG = (svgClass: string) => (
    <svg 
      viewBox="0 0 200 200" 
      width="100%"
      height="100%"
      className={`${svgClass} select-none`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Authentic metallic gold gradient with highlight spots */}
        <linearGradient id={goldMetallicId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2AC" />
          <stop offset="15%" stopColor="#DFB342" />
          <stop offset="30%" stopColor="#F9D976" />
          <stop offset="50%" stopColor="#B3891E" />
          <stop offset="70%" stopColor="#FCE58E" />
          <stop offset="85%" stopColor="#A47A15" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>

        {/* Glowing gold radial gradient for backing effect */}
        <radialGradient id={goldHaloId} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#F5D061" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#F5D061" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0D0D0D" stopOpacity="0" />
        </radialGradient>

        {/* Drop shadow filter to give a premium 3D embossed look */}
        <filter id={premiumShadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.9" />
        </filter>
      </defs>

      {/* Deep textured dark background shield */}
      <rect width="200" height="200" rx="36" fill="#0D0D0D" />
      
      {/* Subtle backing glow */}
      <circle cx="100" cy="90" r="75" fill={`url(#${goldHaloId})`} />

      {/* Custom background gold circuit board traces (matching the logo style) */}
      <g stroke={`url(#${goldMetallicId})`} strokeWidth="1" opacity="0.3" strokeLinecap="round">
        {/* Top-Right Circuit Trace */}
        <path d="M 155 15 L 175 15 L 185 25" />
        <path d="M 165 8 L 180 8 L 190 18" />
        <circle cx="185" cy="25" r="1.5" fill={`url(#${goldMetallicId})`} />
        <circle cx="190" cy="18" r="1.5" fill={`url(#${goldMetallicId})`} />

        {/* Bottom-Left Circuit Trace */}
        <path d="M 45 185 L 25 185 L 15 175" />
        <path d="M 35 192 L 20 192 L 10 182" />
        <circle cx="15" cy="175" r="1.5" fill={`url(#${goldMetallicId})`} />
        <circle cx="10" cy="182" r="1.5" fill={`url(#${goldMetallicId})`} />
      </g>

      {/* Main Emblem Group with premium drop-shadow */}
      <g filter={`url(#${premiumShadowId})`}>
        
        {/* Outer thick gold crescent ring */}
        <path 
          d="M 62 48 A 54 54 0 1 0 152 75" 
          stroke={`url(#${goldMetallicId})`} 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* Inner thin parallel gold ring */}
        <path 
          d="M 72 58 A 44 44 0 1 0 142 81" 
          stroke={`url(#${goldMetallicId})`} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          opacity="0.8"
        />

        {/* Arrow pointing up-right breaking out of the circle */}
        <path 
          d="M 104 90 L 146 44" 
          stroke={`url(#${goldMetallicId})`} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
        {/* Sleek golden arrowhead */}
        <path 
          d="M 132 41 L 148 42 L 145 58 Z" 
          fill={`url(#${goldMetallicId})`} 
          stroke={`url(#${goldMetallicId})`} 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />

        {/* Stylized Golden Human Silhouette (Rescue Beacon) */}
        {/* Head */}
        <circle cx="88" cy="54" r="6" fill={`url(#${goldMetallicId})`} />
        {/* Swooping Dynamic Torso & Arm Reaching Up-Right */}
        <path 
          d="M 58 102 C 68 85, 78 74, 98 68 C 104 62, 114 48, 116 43 Q 110 58, 97 70 C 93 78, 87 90, 83 99 Q 70 102, 58 102 Z" 
          fill={`url(#${goldMetallicId})`} 
        />

        {/* ECG Heartbeat pulse wave intersecting center */}
        <path 
          d="M 94 74 L 102 74 L 106 83 L 111 58 L 116 97 L 121 73 L 126 81 L 131 74 L 148 74" 
          stroke={`url(#${goldMetallicId})`} 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Clinical Medical Cross placed in the bottom middle */}
        <path 
          d="M 88 114 L 104 114 M 96 106 L 96 122" 
          stroke={`url(#${goldMetallicId})`} 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />

      </g>
    </svg>
  );

  if (variant === 'icon') {
    return renderIconSVG(className);
  }

  // Full branded badge with custom vector "ALERTNOW" text and slogan
  return (
    <div className={`flex flex-col items-center bg-[#050505] border border-[#D4AF37]/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden ${className}`}>
      
      {/* Background circuit grid accents to echo the luxury card feel */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Centered Emblem */}
      {renderIconSVG("w-28 h-28 relative z-10")}

      {/* Geometric Gold Typographical Logo representing "ALERTNOW" */}
      <div className="w-full max-w-[220px] mt-4 relative z-10">
        <svg viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <defs>
            <linearGradient id={goldTextId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFF2AC" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A47A15" />
            </linearGradient>
          </defs>
          
          {/* Vector drawn geometric ALERTNOW text (with customized 'A' ribbon slash) */}
          <g fill={`url(#${goldTextId})`}>
            {/* Custom geometric A */}
            <path d="M 12 36 L 22 10 H 28 L 38 36 H 31.5 L 29.5 29 H 20.5 L 22 24 H 28 L 25 15 L 19 31 H 16.5 L 18 26 H 13 Z" />
            {/* L */}
            <path d="M 44 10 H 50 V 30 H 62 V 36 H 44 V 10 Z" />
            {/* E */}
            <path d="M 68 10 H 84 V 15 H 74 V 20 H 82 V 25 H 74 V 30 H 84 V 36 H 68 V 10 Z" />
            {/* R */}
            <path d="M 90 10 H 104 C 110 10 113 13 113 17 C 113 21 110 24 104 24 L 113 36 H 106 L 98 25 H 96 V 36 H 90 V 10 Z M 96 15 V 20 H 103 C 105 20 107 19 107 17.5 C 107 16 105 15 103 15 H 96 Z" />
            {/* T */}
            <path d="M 118 10 H 136 V 15 H 130 V 36 H 124 V 15 H 118 V 10 Z" />
            {/* N */}
            <path d="M 142 10 H 148 L 158 28 V 10 H 164 V 36 H 158 L 148 18 V 36 H 142 V 10 Z" />
            {/* O */}
            <path d="M 170 23 C 170 15.5 175 10 182.5 10 C 190 10 195 15.5 195 23 C 195 30.5 190 36 182.5 36 C 175 36 170 30.5 170 23 Z M 176 23 C 176 27.5 178.5 31 182.5 31 C 186.5 31 189 27.5 189 23 C 189 18.5 186.5 15 182.5 15 C 178.5 15 176 18.5 176 23 Z" />
            {/* W */}
            <path d="M 200 10 H 206 L 211.5 27 L 217 10 H 223 L 228.5 27 L 234 10 H 240 L 233.5 36 H 227 L 221.5 19 L 216 36 H 209.5 Z" />
          </g>
        </svg>
      </div>

      {/* Decorative gold horizontal line with circles on ends */}
      <div className="flex items-center gap-2 w-full max-w-[210px] my-4 relative z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFF2AC] to-[#A47A15]" />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent flex-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFF2AC] to-[#A47A15]" />
      </div>

      {/* Professional slogan matching the exact luxury typographic layout */}
      <p className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase text-center font-sans relative z-10">
        Instant Connection. Ultimate Protection.
      </p>
    </div>
  );
}

