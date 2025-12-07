"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MomentType, momentOptions } from "../data/questions";

interface MomentSelectorProps {
  value: MomentType;
  onChange: (value: MomentType) => void;
}

export default function MomentSelector({ value, onChange }: MomentSelectorProps) {
  const [justChanged, setJustChanged] = useState<string | null>(null);

  useEffect(() => {
    setJustChanged(value);
    const timer = setTimeout(() => setJustChanged(null), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {momentOptions.map((option) => {
        const isSelected = value === option.value;
        const shouldPulse = isSelected && justChanged === option.value;
        
        return (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value as MomentType)}
            className={`px-4 py-2 rounded-full text-sm font-light transition-colors duration-250 ${
              isSelected
                ? "bg-[#5AA9E6] text-white shadow-sm shadow-[#5AA9E6]/20"
                : "bg-white/90 backdrop-blur-sm border border-[#E9F0F7] text-[#1C1C1C] hover:border-[#5AA9E6]/30 hover:shadow-sm"
            }`}
            animate={{
              scale: shouldPulse ? [1, 1.06, 1] : 1,
              boxShadow: shouldPulse
                ? ['0 1px 2px rgba(90, 169, 230, 0.2)', '0 0 8px rgba(90, 169, 230, 0.25)', '0 1px 2px rgba(90, 169, 230, 0.2)']
                : isSelected ? '0 1px 2px rgba(90, 169, 230, 0.2)' : '0 0 0px rgba(0, 0, 0, 0)'
            }}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}

