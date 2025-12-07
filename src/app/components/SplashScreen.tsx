"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center splash-gradient"
      style={{
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 20%, #FCD34D 40%, #FBBF24 60%, #F59E0B 80%, #D97706 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 15s ease infinite'
      }}
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
        scale: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
      }}
    >
      <motion.h1
        className="font-serif text-4xl md:text-5xl font-medium text-white leading-tight tracking-tight"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={isExiting ? { opacity: 0, scale: 0.95, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: isExiting ? 0.6 : 0.7,
          delay: isExiting ? 0 : 0.15,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        The Question Spot
      </motion.h1>
    </motion.div>
  );
}

