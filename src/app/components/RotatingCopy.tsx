"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Take your time.",
  "No rush.",
  "Breathe.",
  "Enjoy the moment.",
];

export default function RotatingCopy() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          className="text-stone-500 text-sm font-light"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {messages[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

