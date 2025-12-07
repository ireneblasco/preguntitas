"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "../data/questions";
import { addFavorite, removeFavorite, isFavorite } from "../utils/favorites";
import RotatingCopy, { funMessages } from "./RotatingCopy";

interface SillyViewProps {
  onBack: () => void;
}

const sillyQuestions = questions.filter((q) => q.category === "silly");

export default function SillyView({ onBack }: SillyViewProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const favorites = localStorage.getItem("favorites");
      setFavoriteIds(favorites ? JSON.parse(favorites) : []);
    }
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(
    sillyQuestions.length > 0 
      ? sillyQuestions[Math.floor(Math.random() * sillyQuestions.length)]
      : null
  );

  const handleNext = () => {
    if (sillyQuestions.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * sillyQuestions.length);
      if (currentQuestion) {
        const currentIndex = sillyQuestions.findIndex((q) => q.id === currentQuestion.id);
        while (sillyQuestions.length > 1 && nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * sillyQuestions.length);
        }
      }
      setCurrentQuestion(sillyQuestions[nextIndex]);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 650);
    }, 100);
  };

  const handleToggleFavorite = () => {
    if (!currentQuestion) return;
    
    if (isFavorite(currentQuestion.id)) {
      removeFavorite(currentQuestion.id);
      setFavoriteIds((prev) => prev.filter((id) => id !== currentQuestion.id));
    } else {
      addFavorite(currentQuestion.id);
      setFavoriteIds((prev) => [...prev, currentQuestion.id]);
    }
  };

  return (
    <div className="w-full max-w-md h-full flex flex-col justify-center space-y-8">
      <motion.button
        onClick={onBack}
        className="text-[#4A4A4A] text-base font-light hover:text-[#1C1C1C] transition-colors self-start p-2 -ml-2 rounded-full hover:bg-[#E9F0F7]/50 active:bg-[#E9F0F7]"
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9, x: -4 }}
        transition={{ 
          duration: 0.2, 
          ease: [0.25, 0.1, 0.25, 1],
          scale: { type: "spring", stiffness: 400, damping: 17 }
        }}
      >
        ← Back
      </motion.button>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-4xl md:text-5xl font-light text-[#1C1C1C] leading-tight tracking-tight mb-2">
          Random ✨
        </h1>
        <p className="text-[#4A4A4A] text-sm font-light">
          Random questions, zero pressure
        </p>
      </motion.div>

      {currentQuestion && (
        <>
          <div className="relative flex-1 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                className="bg-white/80 backdrop-blur-sm border border-[#E9F0F7] rounded-3xl px-10 py-16 text-center shadow-sm relative w-full min-h-[280px] flex items-center justify-center"
                initial={{ opacity: 0, y: 20, scale: 0.96, rotate: -1 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.96, rotate: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button
                  onClick={handleToggleFavorite}
                  className={`absolute top-4 right-4 p-2 transition-colors ${
                    isFavorite(currentQuestion.id) 
                      ? "text-red-500 hover:text-red-600" 
                      : "text-[#E9F0F7] hover:text-[#5AA9E6]"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.svg 
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    initial={false}
                    animate={{
                      scale: isFavorite(currentQuestion.id) ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    {isFavorite(currentQuestion.id) ? (
                      <motion.path
                        fill="currentColor"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                      />
                    ) : (
                      <path 
                        stroke="currentColor" 
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                      />
                    )}
                  </motion.svg>
                </motion.button>
                <motion.p 
                  key={currentQuestion.id}
                  className="text-xl font-light text-[#1C1C1C] leading-relaxed tracking-tight"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {currentQuestion.text}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center space-y-4 pt-4">
            <motion.button
              onClick={handleNext}
              className="bg-[#F9E79F] text-[#1C1C1C] rounded-full px-10 py-4 text-base font-light shadow-sm shadow-[#F9E79F]/20 hover:bg-[#F5DF8F] transition-all duration-300 ease-out min-h-[44px] flex items-center justify-center"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Roll again 🎲
            </motion.button>
            
            <RotatingCopy 
              messages={funMessages} 
              questionId={currentQuestion?.id}
            />
          </div>
        </>
      )}
    </div>
  );
}

