"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import RotatingCopy from "../../components/RotatingCopy";
import MomentSelector from "../../components/MomentSelector";
import { questions, MomentType, categoryNames } from "../../data/questions";
import { addFavorite, removeFavorite, isFavorite } from "../../utils/favorites";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug || "");
  const [selectedMoment, setSelectedMoment] = useState<MomentType>("chill-night");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cargar favoritos al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const favorites = localStorage.getItem("favorites");
      setFavoriteIds(favorites ? JSON.parse(favorites) : []);
    }
  }, []);

  // Filtrar preguntas según categoría y momento
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const categoryMatch = q.category === slug;
      const momentMatch = q.moment.includes(selectedMoment);
      return categoryMatch && momentMatch;
    });
  }, [slug, selectedMoment]);

  const [currentQuestion, setCurrentQuestion] = useState(
    filteredQuestions.length > 0 ? filteredQuestions[0] : null
  );

  // Actualizar pregunta cuando cambian los filtros
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      setCurrentQuestion(filteredQuestions[randomIndex]);
    } else {
      setCurrentQuestion(null);
    }
  }, [selectedMoment, slug, filteredQuestions]);

  const handleNext = () => {
    if (filteredQuestions.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * filteredQuestions.length);
      if (currentQuestion) {
        const currentIndex = filteredQuestions.findIndex((q) => q.id === currentQuestion.id);
        while (filteredQuestions.length > 1 && nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * filteredQuestions.length);
        }
      }
      setCurrentQuestion(filteredQuestions[nextIndex]);
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
    <main className="h-screen bg-gradient-to-b from-[#FAFAFA] via-[#F5F5F7] to-[#FEF7F0] flex flex-col overflow-hidden">
      <header className="px-6 pt-6 pb-2">
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-hidden">
        <div className="w-full max-w-md h-full flex flex-col justify-center space-y-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 leading-tight tracking-tight">
              {categoryNames[slug] || slug.replace("-", " ")}
            </h1>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-stone-500 text-center font-light">Momento</p>
              <MomentSelector value={selectedMoment} onChange={setSelectedMoment} />
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-3xl px-10 py-16 text-center shadow-sm">
              <p className="text-lg font-light text-stone-500 leading-relaxed">
                No hay preguntas con estos filtros
              </p>
            </div>
          ) : (
            <>
              <div className="relative flex-1 flex items-center">
                <AnimatePresence mode="wait">
                  {currentQuestion && (
                    <motion.div
                      key={currentQuestion.id}
                      className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-3xl px-10 py-16 text-center shadow-sm relative w-full min-h-[280px] flex items-center justify-center"
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <motion.button
                        onClick={handleToggleFavorite}
                        className={`absolute top-4 right-4 p-2 transition-colors ${
                          isFavorite(currentQuestion.id) 
                            ? "text-red-500 hover:text-red-600" 
                            : "text-stone-400 hover:text-stone-600"
                        }`}
                        whileHover={{ scale: 1.1 }}
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
                      <p className="text-xl font-light text-stone-700 leading-relaxed tracking-tight">
                        {currentQuestion.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-center space-y-4 pt-4 pb-6">
                <motion.button
                  onClick={handleNext}
                  className="bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full px-10 py-4 text-base font-light text-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300 ease-out min-h-[44px] flex items-center justify-center"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  Otra pregunta
                </motion.button>
                
                <RotatingCopy questionId={currentQuestion?.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
