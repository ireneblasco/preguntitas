"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const defaultMessages = [
  "Take your time.",
  "No rush.",
  "Breathe.",
  "Enjoy the moment.",
];

const funMessages = [
  "Let's get silly!",
  "No pressure, just fun.",
  "Keep it light.",
  "Laugh it off.",
  "Enjoy the chaos.",
  "Embrace the weird.",
];

interface RotatingCopyProps {
  messages?: string[];
  questionId?: string; // Para cambiar mensaje cuando cambia la pregunta
}

export default function RotatingCopy({ messages = defaultMessages, questionId }: RotatingCopyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambiar mensaje cuando cambia la pregunta (no rotar continuamente)
  useEffect(() => {
    if (questionId) {
      // Seleccionar un mensaje aleatorio cuando cambia la pregunta
      const randomIndex = Math.floor(Math.random() * messages.length);
      setCurrentIndex(randomIndex);
    }
  }, [questionId, messages]);

  return (
    <div className="h-6 flex items-center justify-center">
      <motion.p
        key={questionId || currentIndex}
        className="text-[#4A4A4A] text-sm font-light"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {messages[currentIndex]}
      </motion.p>
    </div>
  );
}

export { funMessages };

