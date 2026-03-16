import React from 'react';
import { motion } from 'motion/react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotateY: 15, rotateX: -10 }}
      whileTap={{ scale: 0.9 }}
      className={`${className} relative group cursor-pointer flex items-center justify-center perspective-1000`}
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-electric-blue/40 via-violet-glow/40 to-coral-glow/40 rounded-full blur-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
      
      {/* 3D Container */}
      <div className="relative w-full h-full preserve-3d">
        {/* Layer 1: Outer Glass Frame */}
        <motion.div 
          animate={{ rotateZ: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm shadow-[0_0_20px_rgba(139,92,246,0.1)]"
        />
        
        {/* Layer 2: Middle Floating Ring */}
        <motion.div 
          animate={{ 
            rotateZ: -360,
            scale: [1, 1.05, 1],
            translateZ: [0, 10, 0]
          }}
          transition={{ 
            rotateZ: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            translateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-2 border border-violet-glow/30 rounded-xl bg-violet-glow/5"
        />

        {/* Layer 3: The 3D "R" Mark */}
        <div className="absolute inset-0 flex items-center justify-center transform translateZ(20px)">
          <svg viewBox="0 0 100 100" className="w-10 h-10 filter drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]">
            <defs>
              <linearGradient id="logo-grad-3d" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#FF6B6B" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Abstract 3D R Path */}
            <motion.path
              d="M30 20 H60 C75 20 75 45 60 45 H30 V80 M30 45 L70 80"
              fill="none"
              stroke="url(#logo-grad-3d)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              filter="url(#glow)"
            />
            
            {/* Neural Core Node */}
            <motion.circle
              cx="70" cy="80" r="8"
              fill="#FF6B6B"
              animate={{ 
                scale: [1, 1.8, 1], 
                opacity: [0.6, 1, 0.6],
                filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="shadow-[0_0_20px_#FF6B6B]"
            />
          </svg>
        </div>

        {/* Floating Data Particles */}
        <div className="absolute inset-0 pointer-events-none transform translateZ(30px)">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -15, 0],
                x: [0, i % 2 === 0 ? 8 : -8, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 3 + i, 
                repeat: Infinity, 
                delay: i * 0.7,
                ease: "easeInOut" 
              }}
              className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
              style={{ 
                top: `${15 + i * 25}%`, 
                left: `${15 + i * 20}%` 
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
