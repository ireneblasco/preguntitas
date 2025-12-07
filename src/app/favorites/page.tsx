"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { questions, categoryNames } from "../data/questions";
import { getFavorites, removeFavorite } from "../utils/favorites";

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavoriteIds(getFavorites());
  }, []);

  const favoriteQuestions = questions.filter((q) => favoriteIds.includes(q.id));

  const handleRemoveFavorite = (questionId: string) => {
    removeFavorite(questionId);
    setFavoriteIds((prev) => prev.filter((id) => id !== questionId));
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAFA] via-[#F5F5F7] to-[#FEF7F0] flex flex-col">
      <header className="px-6 pt-12 pb-4">
        <motion.button
          onClick={() => router.push('/')}
          className="text-stone-600 text-base font-light hover:text-stone-800 transition-colors p-2 -ml-2 rounded-full hover:bg-stone-100/50 active:bg-stone-200/50"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9, x: -4 }}
          transition={{ 
            duration: 0.2, 
            ease: [0.25, 0.1, 0.25, 1],
            scale: { type: "spring", stiffness: 400, damping: 17 }
          }}
        >
          ← Volver
        </motion.button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-4">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 leading-tight tracking-tight">
              Tus favoritas
            </h1>
            <p className="text-stone-500 text-sm font-light mt-2">
              {favoriteQuestions.length === 0 
                ? "Aún no tienes preguntas favoritas" 
                : `${favoriteQuestions.length} pregunta${favoriteQuestions.length !== 1 ? 's' : ''} guardada${favoriteQuestions.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {favoriteQuestions.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-3xl px-10 py-16 text-center shadow-sm">
              <p className="text-lg font-light text-stone-500 leading-relaxed">
                Guarda preguntas que te inspiren tocando el corazón
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-3xl px-6 py-6 shadow-sm relative group"
                >
                  <button
                    onClick={() => handleRemoveFavorite(question.id)}
                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                  <p className="text-lg font-light text-stone-700 leading-relaxed tracking-tight pr-8">
                    {question.text}
                  </p>
                  <p className="text-xs text-stone-400 font-light mt-3">
                    {categoryNames[question.category]}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

