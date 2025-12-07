"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SplashScreen from "./components/SplashScreen";
import Onboarding from "./components/Onboarding";

const categories = [
  { name: "Amigos", slug: "amigos" },
  { name: "Familiares", slug: "familiares" },
  { name: "Cumpleaños", slug: "cumpleanos" },
  { name: "Pareja", slug: "pareja" },
  { name: "Personales", slug: "personales" },
];

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [mounted, setMounted] = useState(false);

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
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
              <div className="w-full max-w-md space-y-16">
                <motion.div
                  className="text-center space-y-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <motion.h2 
                    className="font-serif text-3xl md:text-4xl font-medium text-stone-800 leading-tight tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    The Question Spot
                  </motion.h2>
                  <motion.p 
                    className="text-stone-600 text-base leading-relaxed font-light max-w-sm mx-auto"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.5, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    Where conversations begin
                  </motion.p>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  {categories.map((cat, index) => (
                    <motion.div
                      key={cat.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.7 + (index * 0.08), 
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <Link 
                        href={`/category/${cat.slug}`}
                        className="block group"
                      >
                        <div className="bg-white border border-stone-200 rounded-3xl px-8 py-6 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-stone-300">
                          <h3 className="text-lg font-light text-stone-700 text-center tracking-tight">
                            {cat.name}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
