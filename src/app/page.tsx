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

  const handleRestartOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hasSeenOnboarding");
    }
    setShowHome(false);
    setShowSplash(true);
    setShowOnboarding(false);
  };

  // Verificar si estamos en modo desarrollo
  const isDevelopment = typeof window !== "undefined" 
    ? (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost')
    : false;

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
            className="h-screen flex flex-col relative bg-gradient-to-b from-[#F8F8F8] via-[#FAF5EF] to-[#E9F0F7] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.9, 
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1
            }}
          >
            <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6 py-4 overflow-hidden">
              <AnimatePresence mode="wait">
                {showSilly ? (
                  <motion.div
                    key="silly"
                    initial={{ opacity: 0, x: 20, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.96 }}
                    transition={{ 
                      duration: 0.35, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <SillyView onBack={() => setShowSilly(false)} />
                  </motion.div>
                ) : !showQuestions ? (
                  <motion.div
                    key="home"
                    className="w-full max-w-md space-y-12"
                    initial={{ opacity: 0, x: -20, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.96 }}
                    transition={{ 
                      duration: 0.35, 
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
                    <motion.h2 
                      className="font-serif text-3xl md:text-4xl font-medium text-[#1C1C1C] leading-tight tracking-tight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      Question Spot
                    </motion.h2>
                    <motion.p 
                      className="text-[#4A4A4A] text-base leading-relaxed font-light max-w-sm mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      Where conversations begin
                    </motion.p>
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
                    <p className="text-sm text-[#4A4A4A] text-center font-light">What's the moment?</p>
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
                      className="w-full bg-[#5AA9E6] text-white rounded-full px-8 py-4 text-base font-light hover:bg-[#4A99D6] transition-colors duration-300 shadow-sm shadow-[#5AA9E6]/20"
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
                        className="w-full bg-[#F9E79F] text-[#1C1C1C] rounded-full px-8 py-4 text-base font-light hover:bg-[#F5DF8F] transition-all duration-300 shadow-sm shadow-[#F9E79F]/20"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        Random
                      </motion.button>
                    </motion.div>

                    <motion.button
                      onClick={() => router.push('/favorites')}
                      className="w-full bg-white/90 backdrop-blur-sm border border-[#E9F0F7] rounded-full px-8 py-4 text-base font-light text-[#1C1C1C] shadow-sm hover:shadow-md hover:border-[#5AA9E6]/30 transition-all duration-300"
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
                    key="questions"
                    initial={{ opacity: 0, x: 20, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.96 }}
                    transition={{ 
                      duration: 0.35, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <QuestionsView
                      moment={selectedMoment}
                      onBack={() => setShowQuestions(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botón de desarrollo - solo visible en modo desarrollo */}
            {isDevelopment && (
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <motion.button
                  onClick={handleRestartOnboarding}
                  className="bg-white/90 backdrop-blur-sm border border-[#E9F0F7] rounded-full px-4 py-2 text-xs font-light text-[#4A4A4A] shadow-sm hover:shadow-md hover:border-[#5AA9E6]/30 transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <span className="text-[10px] text-[#4A4A4A] mr-1.5">DEV</span>
                  Iniciar Onboarding
                </motion.button>
              </motion.div>
            )}
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
