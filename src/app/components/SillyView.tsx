"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "../data/questions";
import { addFavorite, removeFavorite, isFavorite } from "../utils/favorites";
import RotatingCopy from "./RotatingCopy";

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
      setIsTransitioning(false);
    }, 400);
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
    <div className="w-full max-w-md space-y-8">
      <motion.button
        onClick={onBack}
        className="text-stone-600 text-base font-light hover:text-stone-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        ← Back
      </motion.button>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 leading-tight tracking-tight mb-2">
          Silly Mode 🎲
        </h1>
        <p className="text-stone-500 text-sm font-light">
          Random questions, zero pressure
        </p>
      </motion.div>

      {currentQuestion && (
        <>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-3xl px-10 py-16 text-center shadow-sm relative"
                initial={{ opacity: 0, y: 10, scale: 0.98, rotate: -1 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.98, rotate: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.button
                  onClick={handleToggleFavorite}
                  className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {isFavorite(currentQuestion.id) ? (
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  )}
                </motion.button>
                <p className="text-xl font-light text-stone-700 leading-relaxed tracking-tight">
                  {currentQuestion.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center -mt-4">
            <RotatingCopy />
          </div>

          <div className="flex justify-center">
            <motion.button
              onClick={handleNext}
              className="bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full px-10 py-4 text-base font-light text-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300 ease-out"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Roll again 🎲
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}

