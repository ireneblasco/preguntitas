"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface OnboardingProps {
  onComplete: () => void;
}

const screens = [
  {
    headline: "Questions that spark real conversations.",
    subtext: "Discover fun, deep, and thoughtful questions in one place.",
    visual: "cards",
  },
  {
    headline: "Tap or swipe to explore.",
    subtext: "Save favorites and enjoy conversations with whoever you want.",
    visual: "swipe",
    cta: "Let's Go",
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 600);
    }
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#F8F8F8] via-[#FAF5EF] to-[#E9F0F7]"
      initial={{ opacity: 0 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.button
        onClick={handleSkip}
        className="absolute top-8 right-6 text-[#4A4A4A] text-sm font-light hover:text-[#1C1C1C] transition-colors z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Skip
      </motion.button>

      <div className="flex-1 flex items-center justify-center px-6 w-full">
        <AnimatePresence mode="wait">
          {currentScreen === 0 ? (
            <motion.div
              key="screen1"
              className="text-center max-w-md w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Visual: Tarjetas de preguntas emergentes */}
              <div className="mb-12 relative h-48 flex items-center justify-center">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="absolute bg-white rounded-3xl shadow-lg px-6 py-4 w-64"
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      y: 40,
                      rotate: index === 0 ? 0 : index === 1 ? -3 : 3
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: index * 8,
                      rotate: index === 0 ? 0 : index === 1 ? -3 : 3,
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.15,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    style={{
                      zIndex: 3 - index,
                      transform: `translateY(${index * 8}px) rotate(${index === 0 ? 0 : index === 1 ? -3 : 3}deg)`,
                    }}
                  >
                    <div className="h-2 w-2 rounded-full bg-[#5AA9E6] mb-2" />
                    <div className="h-1.5 w-24 bg-[#E9F0F7] rounded mb-1" />
                    <div className="h-1.5 w-32 bg-[#E9F0F7] rounded" />
                  </motion.div>
                ))}
              </div>

              <motion.h1
                className="text-3xl md:text-4xl font-light text-[#1C1C1C] leading-tight tracking-tight mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {screens[0].headline}
              </motion.h1>
              <motion.p
                className="text-base text-[#4A4A4A] font-light leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {screens[0].subtext}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="screen2"
              className="text-center max-w-md w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Visual: Mini animación de swipe */}
              <div className="mb-12 relative h-48 flex items-center justify-center">
                <SwipeAnimation />
              </div>

              <motion.h1
                className="text-3xl md:text-4xl font-light text-[#1C1C1C] leading-tight tracking-tight mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {screens[1].headline}
              </motion.h1>
              <motion.p
                className="text-base text-[#4A4A4A] font-light leading-relaxed mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {screens[1].subtext}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-12 px-6 w-full max-w-md">
        <div className="flex justify-center gap-2 mb-6">
          {screens.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? "bg-[#5AA9E6] w-8"
                  : "bg-[#E9F0F7] w-1"
              }`}
              initial={false}
              animate={{
                width: index === currentScreen ? 32 : 4,
                backgroundColor:
                  index === currentScreen ? "#5AA9E6" : "#E9F0F7",
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ))}
        </div>

        {currentScreen === screens.length - 1 ? (
          <motion.button
            onClick={handleNext}
            className="w-full bg-[#5AA9E6] text-white rounded-full px-8 py-4 text-base font-light hover:bg-[#4A99D6] transition-colors duration-300 shadow-sm shadow-[#5AA9E6]/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            {screens[1].cta}
          </motion.button>
        ) : (
          <motion.button
            onClick={handleNext}
            className="w-full bg-white/90 backdrop-blur-sm border border-[#E9F0F7] text-[#1C1C1C] rounded-full px-8 py-4 text-base font-light hover:bg-white transition-colors duration-300 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            Next
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Componente para la animación de swipe
function SwipeAnimation() {
  const [swipeIndex, setSwipeIndex] = useState(0);
  const questions = [
    "What everyday object would you like to talk?",
    "What part of your personality do you appreciate most?",
    "What's your biggest 'fail' trying to flirt?",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSwipeIndex((prev) => (prev + 1) % questions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-72 h-48 flex items-center justify-center">
      {/* Tarjeta de fondo (desvaneciéndose) */}
      <AnimatePresence mode="wait">
        {questions.map((question, index) => {
          const isActive = index === swipeIndex;
          const isNext = index === (swipeIndex + 1) % questions.length;
          const isPrev = index === (swipeIndex - 1 + questions.length) % questions.length;

          if (!isActive && !isNext && !isPrev) return null;

          return (
            <motion.div
              key={index}
              className="absolute bg-white rounded-3xl shadow-lg px-6 py-8 w-full min-h-[180px] flex items-center justify-center"
              initial={isNext ? { x: 300, opacity: 0, scale: 0.9 } : { x: -300, opacity: 0, scale: 0.9 }}
              animate={isActive ? { x: 0, opacity: 1, scale: 1 } : { x: isNext ? 300 : -300, opacity: 0.3, scale: 0.9 }}
              exit={{ x: isNext ? -300 : 300, opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.25, 0.1, 0.25, 1]
              }}
              style={{ zIndex: isActive ? 3 : isNext ? 2 : 1 }}
            >
              <p className="text-lg font-light text-[#1C1C1C] text-center leading-relaxed">
                {question}
              </p>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Indicador de swipe */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#5AA9E6]"
          animate={{ 
            x: [0, 8, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#5AA9E6]"
          animate={{ 
            x: [0, 8, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: 0.2,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#5AA9E6]"
          animate={{ 
            x: [0, 8, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: 0.4,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}

