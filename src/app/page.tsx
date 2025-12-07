"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import SplashScreen from "./components/SplashScreen";
import Onboarding from "./components/Onboarding";
import MomentSelector from "./components/MomentSelector";
import QuestionsView from "./components/QuestionsView";
import SillyView from "./components/SillyView";
import { MomentType } from "./data/questions";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showSilly, setShowSilly] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<MomentType>("chill-night");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const hasSeenOnboarding = typeof window !== "undefined" 
      ? localStorage.getItem("hasSeenOnboarding")
      : null;
    
    if (!hasSeenOnboarding) {
      // Mostrar onboarding después del splash
      const timer = setTimeout(() => {
        setShowSplash(false);
        setShowOnboarding(true);
      }, 2800); // Tiempo del splash + transición
      
      return () => clearTimeout(timer);
    } else {
      // Ir directo a home
      const timer = setTimeout(() => {
        setShowSplash(false);
        setShowHome(true);
      }, 2800);
      
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const handleOnboardingComplete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenOnboarding", "true");
    }
    setShowOnboarding(false);
    setShowHome(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => {}} />
        )}
        {showOnboarding && (
          <Onboarding key="onboarding" onComplete={handleOnboardingComplete} />
        )}
        {showHome && (
          <motion.main
            key="home"
            className="animated-gradient min-h-screen flex flex-col relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.9, 
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1
            }}
          >
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
              {showSilly ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <SillyView onBack={() => setShowSilly(false)} />
                </motion.div>
              ) : !showQuestions ? (
                <motion.div
                  className="w-full max-w-md space-y-12 py-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <motion.div
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <h2 className="font-serif text-3xl md:text-4xl font-medium text-stone-800 leading-tight tracking-tight">
                      The Question Spot
                    </h2>
                    <p className="text-stone-600 text-base leading-relaxed font-light max-w-sm mx-auto">
                      Where conversations begin
                    </p>
                  </motion.div>

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.5, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <p className="text-sm text-stone-500 text-center font-light">What's the moment?</p>
                    <MomentSelector value={selectedMoment} onChange={setSelectedMoment} />
                  </motion.div>

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.6, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <motion.button
                      onClick={() => setShowQuestions(true)}
                      className="w-full bg-stone-800 text-white rounded-full px-8 py-4 text-base font-light hover:bg-stone-700 transition-colors duration-300 shadow-sm"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      Start
                    </motion.button>

                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.7, 
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <motion.button
                        onClick={() => setShowSilly(true)}
                        className="w-full bg-gradient-to-r from-amber-200 to-yellow-200 text-stone-800 rounded-full px-8 py-4 text-base font-light hover:from-amber-300 hover:to-yellow-300 transition-all duration-300 shadow-sm border border-amber-300/50"
                        whileHover={{ scale: 1.02, y: -1, rotate: 0.5 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">🎲</span>
                          <span>Silly Mode</span>
                        </div>
                      </motion.button>
                    </motion.div>

                    <motion.button
                      onClick={() => router.push('/favorites')}
                      className="w-full bg-white/90 backdrop-blur-sm border border-stone-200 rounded-full px-8 py-4 text-base font-light text-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span>My favorites</span>
                      </div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <QuestionsView
                    moment={selectedMoment}
                    onBack={() => setShowQuestions(false)}
                  />
                </motion.div>
              )}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
