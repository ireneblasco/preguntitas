"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
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

  const favoriteQuestions = useMemo(() => {
    const questionsList = questions.filter((q) => favoriteIds.includes(q.id));
    // Mantener el orden de favoriteIds
    return favoriteIds
      .map(id => questionsList.find(q => q.id === id))
      .filter(Boolean) as typeof questionsList;
  }, [favoriteIds]);

  const handleRemoveFavorite = (questionId: string) => {
    removeFavorite(questionId);
    setFavoriteIds((prev) => prev.filter((id) => id !== questionId));
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F8F8] via-[#FAF5EF] to-[#E9F0F7] flex flex-col">
      <header className="px-6 pt-12 pb-4">
        <motion.button
          onClick={() => router.push('/')}
          className="text-[#4A4A4A] text-base font-light hover:text-[#1C1C1C] transition-colors p-2 -ml-2 rounded-full hover:bg-[#E9F0F7]/50 active:bg-[#E9F0F7]"
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
            <h1 className="text-4xl md:text-5xl font-light text-[#1C1C1C] leading-tight tracking-tight">
              Tus favoritas
            </h1>
            <p className="text-[#4A4A4A] text-sm font-light mt-2">
              {favoriteQuestions.length === 0 
                ? "Aún no tienes preguntas favoritas" 
                : `${favoriteQuestions.length} pregunta${favoriteQuestions.length !== 1 ? 's' : ''} guardada${favoriteQuestions.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {favoriteQuestions.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-[#E9F0F7] rounded-3xl px-10 py-16 text-center shadow-sm">
              <p className="text-lg font-light text-[#4A4A4A] leading-relaxed">
                Guarda preguntas que te inspiren tocando el corazón
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteQuestions.map((question, index) => (
                <SwipeableQuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  onRemove={() => handleRemoveFavorite(question.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function SwipeableQuestionCard({ 
  question, 
  index, 
  onRemove 
}: { 
  question: typeof questions[0]; 
  index: number; 
  onRemove: () => void;
}) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0], [1, 0]);
  const deleteButtonOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100 || info.velocity.x < -500) {
      // Swipe suficiente para eliminar
      onRemove();
    } else {
      // Volver a la posición original
      x.set(0);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Botón de eliminar de fondo */}
      <motion.div
        className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-end pr-6"
        style={{ opacity: deleteButtonOpacity }}
      >
        <motion.div
          className="text-white text-sm font-light"
          style={{ opacity: deleteButtonOpacity }}
        >
          Eliminar
        </motion.div>
      </motion.div>

      {/* Tarjeta deslizable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.05,
          ease: [0.25, 0.1, 0.25, 1],
          x: { type: "spring", stiffness: 300, damping: 30 }
        }}
        className="bg-white/80 backdrop-blur-sm border border-[#E9F0F7] rounded-3xl px-6 py-6 shadow-sm relative cursor-grab active:cursor-grabbing"
      >
        <p className="text-lg font-light text-[#1C1C1C] leading-relaxed tracking-tight">
          {question.text}
        </p>
        <p className="text-xs text-[#4A4A4A] font-light mt-3">
          {categoryNames[question.category]}
        </p>
      </motion.div>
    </div>
  );
}

