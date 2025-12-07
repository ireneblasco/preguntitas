"use client";

import { motion } from "framer-motion";
import { MomentType, momentOptions } from "../data/questions";

interface MomentSelectorProps {
  value: MomentType;
  onChange: (value: MomentType) => void;
}

export default function MomentSelector({ value, onChange }: MomentSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {momentOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value as MomentType)}
          className={`px-5 py-3 rounded-full text-sm font-light transition-all duration-200 ${
            value === option.value
              ? "bg-stone-800 text-white shadow-sm"
              : "bg-white/90 backdrop-blur-sm border border-stone-200 text-stone-700 hover:border-stone-300 hover:shadow-sm"
          }`}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

