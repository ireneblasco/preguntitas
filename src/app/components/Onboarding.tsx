"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface OnboardingProps {
  onComplete: () => void;
}

const screens = [
  {
    text: "Spark better conversations.",
  },
  {
    text: "No pressure. Just real moments.",
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50"
      initial={{ opacity: 0 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <button
        onClick={handleSkip}
        className="absolute top-8 right-6 text-stone-500 text-sm font-light hover:text-stone-700 transition-colors z-10"
      >
        Skip
      </button>

      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 leading-tight tracking-tight mb-8">
              {screens[currentScreen].text}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-12 px-6 w-full max-w-md">
        <div className="flex justify-center gap-2 mb-6">
          {screens.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? "bg-stone-800 w-8"
                  : "bg-stone-300 w-1"
              }`}
              initial={false}
              animate={{
                width: index === currentScreen ? 32 : 4,
                backgroundColor:
                  index === currentScreen ? "#292524" : "#d6d3d1",
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            />
          ))}
        </div>

        {currentScreen === screens.length - 1 ? (
          <motion.button
            onClick={handleNext}
            className="w-full bg-stone-800 text-white rounded-full px-8 py-4 text-base font-light hover:bg-stone-700 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Start
          </motion.button>
        ) : (
          <motion.button
            onClick={handleNext}
            className="w-full bg-white border border-stone-200 text-stone-700 rounded-full px-8 py-4 text-base font-light hover:bg-stone-50 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Next
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

