"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { questions, MomentType, momentOptions } from "../data/questions";
import { addFavorite, removeFavorite, isFavorite } from "../utils/favorites";
import RotatingCopy, { funMessages } from "./RotatingCopy";

interface QuestionsViewProps {
  moment: MomentType;
  onBack: () => void;
}

export default function QuestionsView({ moment, onBack }: QuestionsViewProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const favorites = localStorage.getItem("favorites");
      setFavoriteIds(favorites ? JSON.parse(favorites) : []);
    }
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      return q.moment.includes(moment);
    });
  }, [moment]);

  const [currentQuestion, setCurrentQuestion] = useState(
    filteredQuestions.length > 0 ? filteredQuestions[0] : null
  );
  const [nextQuestion, setNextQuestion] = useState(
    filteredQuestions.length > 1 ? filteredQuestions[1] : null
  );
  const previousMomentRef = useRef(moment);

  // Función para obtener la siguiente pregunta aleatoria
  const getNextRandomQuestion = () => {
    if (filteredQuestions.length === 0) return null;
    if (filteredQuestions.length === 1) return filteredQuestions[0];
    
    let nextIndex = Math.floor(Math.random() * filteredQuestions.length);
    if (currentQuestion) {
      const currentIndex = filteredQuestions.findIndex((q) => q.id === currentQuestion.id);
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * filteredQuestions.length);
      }
    }
    return filteredQuestions[nextIndex];
  };

  // Solo establecer pregunta inicial cuando cambia el momento (no automáticamente después)
  useEffect(() => {
    // Solo actualizar si el momento realmente cambió
    if (previousMomentRef.current !== moment) {
      previousMomentRef.current = moment;
      if (filteredQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        setCurrentQuestion(filteredQuestions[randomIndex]);
        // Establecer siguiente pregunta
        if (filteredQuestions.length > 1) {
          let nextIdx = Math.floor(Math.random() * filteredQuestions.length);
          while (nextIdx === randomIndex) {
            nextIdx = Math.floor(Math.random() * filteredQuestions.length);
          }
          setNextQuestion(filteredQuestions[nextIdx]);
        } else {
          setNextQuestion(null);
        }
        setQuestionIndex(1);
        x.set(0); // Resetear posición al cambiar momento
      } else {
        setCurrentQuestion(null);
        setNextQuestion(null);
      }
    }
    // Si el momento no cambió, mantener la pregunta actual - NO cambiar automáticamente
  }, [moment, filteredQuestions]);

  // Resetear posición cuando cambia la pregunta
  useEffect(() => {
    if (currentQuestion) {
      x.set(0);
    }
  }, [currentQuestion?.id]);


  const handleNext = () => {
    if (filteredQuestions.length === 0 || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Resetear posición inmediatamente para que la nueva pregunta aparezca centrada
    x.set(0);
    
    // Feedback sutil - cambio de sombra
    if (cardRef.current) {
      cardRef.current.style.transition = 'box-shadow 0.2s ease';
      cardRef.current.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.boxShadow = '';
        }
      }, 200);
    }
    
    setTimeout(() => {
      const nextQ = getNextRandomQuestion();
      if (nextQ) {
        setCurrentQuestion(nextQ);
        setQuestionIndex((prev) => prev + 1);
        
        // Establecer nueva siguiente pregunta
        if (filteredQuestions.length > 1) {
          let newNextIdx = Math.floor(Math.random() * filteredQuestions.length);
          const newCurrentIdx = filteredQuestions.findIndex((q) => q.id === nextQ.id);
          while (newNextIdx === newCurrentIdx) {
            newNextIdx = Math.floor(Math.random() * filteredQuestions.length);
          }
          setNextQuestion(filteredQuestions[newNextIdx]);
        } else {
          setNextQuestion(null);
        }
      }
      
      // Asegurar que x esté en 0 cuando aparece la nueva pregunta
      x.set(0);
      
      // Reset transition state después de la animación
      setTimeout(() => {
        setIsTransitioning(false);
      }, 650);
    }, 100);
  };

  const handleSwipe = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isTransitioning) return;
    
    // Swipe más sensible y natural
    const threshold = 80;
    const velocity = Math.abs(info.velocity.x);
    
    if (Math.abs(info.offset.x) > threshold || velocity > 500) {
      // Resetear posición antes de cambiar pregunta
      x.set(0);
      handleNext();
    } else {
      // Snap back suave si no se alcanza el threshold
      x.set(0);
    }
  };

  const handleLongPressStart = () => {
    if (!currentQuestion) return;
    const timer = setTimeout(() => {
      handleToggleFavorite();
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
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

  const progress = filteredQuestions.length > 0 
    ? Math.min((questionIndex / filteredQuestions.length) * 100, 100)
    : 0;

  // Transformaciones para el efecto de arrastre
  const opacity = useTransform(x, [-150, 0, 150], [0.3, 1, 0.3]);
  const scale = useTransform(x, [-150, 0, 150], [0.9, 1, 0.9]);
  const rotateY = useTransform(x, [-150, 0, 150], [-8, 0, 8]);
  
  // Transformaciones para la tarjeta de peek (siguiente pregunta)
  const peekOpacity = useTransform(x, [-150, 0], [0.4, 0.15]);
  const peekScale = useTransform(x, [-150, 0], [0.92, 0.88]);
  const peekY = useTransform(x, [-150, 0], [8, 12]);

  return (
    <div className="w-full max-w-md h-full flex flex-col relative">
      {/* Header minimalista con indicador de progreso */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={onBack}
            className="text-[#4A4A4A] text-base font-light hover:text-[#1C1C1C] transition-colors p-2 -ml-2 -mt-2 rounded-full hover:bg-[#E9F0F7]/50 active:bg-[#E9F0F7]"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9, x: -4 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.25, 0.1, 0.25, 1],
              scale: { type: "spring", stiffness: 400, damping: 17 }
            }}
          >
            ←
          </motion.button>
          {filteredQuestions.length > 0 && (
            <div className="text-xs text-[#4A4A4A] font-light">
              {momentOptions.find(opt => opt.value === moment)?.label || moment}
            </div>
          )}
        </div>
        
        {/* Indicador de progreso minimalista */}
        {filteredQuestions.length > 0 && (
          <div className="h-0.5 bg-[#E9F0F7] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#5AA9E6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        )}
      </div>

      {/* Contenido centrado */}
      <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-40">
        {filteredQuestions.length === 0 ? (
          <motion.div
            className="bg-white rounded-3xl px-8 py-12 text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-lg font-light text-[#4A4A4A] leading-relaxed">
              No questions match these filters
            </p>
          </motion.div>
        ) : (
          <div className="w-full relative" style={{ perspective: '1000px' }}>
            {/* Tarjeta de peek (siguiente pregunta) - detrás de la actual */}
            {nextQuestion && (
              <motion.div
                className="absolute inset-0 w-full pointer-events-none"
                style={{
                  opacity: peekOpacity,
                  scale: peekScale,
                  y: peekY,
                  zIndex: 0,
                }}
              >
                <div className="bg-white rounded-3xl px-8 py-12 text-center shadow-md relative min-h-[280px] flex items-center justify-center">
                  <p className="text-2xl font-light text-[#1C1C1C] leading-relaxed tracking-tight opacity-60">
                    {nextQuestion.text}
                  </p>
                </div>
              </motion.div>
            )}
            
            <motion.div
              key={currentQuestion?.id}
              ref={cardRef}
              className="w-full relative z-10"
              drag="x"
              dragConstraints={{ left: -150, right: 150 }}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
              onDragEnd={handleSwipe}
              animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
              style={{ 
                x, 
                opacity,
                scale,
                rotateY,
                transformStyle: 'preserve-3d'
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                x: { duration: 0.2 }
              }}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
            >
              <AnimatePresence mode="wait" initial={false}>
                {currentQuestion && (
                  <motion.div
                    key={currentQuestion.id}
                    className="bg-white rounded-3xl px-8 py-12 text-center shadow-lg relative min-h-[280px] flex items-center justify-center"
                    initial={{ 
                      opacity: 0, 
                      y: 20, 
                      scale: 0.96,
                      rotateX: -2
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      rotateX: 0,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: -20, 
                      scale: 0.96,
                      rotateX: 2,
                      transition: {
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1]
                      }
                    }}
                    transition={{ 
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1],
                      scale: { 
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1]
                      },
                      opacity: { duration: 0.5 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                  {/* Botón de favorito minimalista */}
                  <motion.button
                    onClick={handleToggleFavorite}
                    className={`absolute top-4 right-4 p-2 -mr-2 -mt-2 transition-colors ${
                      isFavorite(currentQuestion.id) 
                        ? "text-red-500 hover:text-red-600" 
                        : "text-[#E9F0F7] hover:text-[#5AA9E6]"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.svg 
                      className="w-5 h-5"
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
                    className="text-2xl font-light text-[#1C1C1C] leading-relaxed tracking-tight"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {currentQuestion.text}
                  </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer con botón y micro-copy */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8 pt-8 safe-area-bottom">
        <div className="flex flex-col items-center space-y-4">
          <motion.button
            onClick={handleNext}
            className="bg-[#5AA9E6] text-white rounded-full px-8 py-4 text-base font-light shadow-sm shadow-[#5AA9E6]/20 hover:bg-[#4A99D6] transition-colors duration-200 min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Next question
          </motion.button>
          
          <RotatingCopy 
            messages={moment === "random-fun" ? funMessages : undefined} 
            questionId={currentQuestion?.id}
          />
        </div>
      </div>
    </div>
  );
}

